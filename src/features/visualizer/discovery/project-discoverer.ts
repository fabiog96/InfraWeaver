import type { ParsedFile, ParsedResource } from '../parser/types';
import type {
  ProjectCatalog,
  ProjectInfo,
  SubprojectInfo,
  ModuleDefinitionInfo,
  ResourceProjectMapping,
} from './types';

const LOCAL_REF_REGEX = /local\.([a-zA-Z_][a-zA-Z0-9_-]*)/;
const SUBPROJECT_REGEX = /subproject\s*=\s*"([^"]+)"/;
const MODULE_PATH_REGEX = /(?:utils\/modules|modules)\/([^/]+)/;

/**
 * Discovers projects and modules from parsed Terraform files using a 5-pass algorithm.
 *
 * Pass 1: Extract tag definitions from locals blocks (local name → project name)
 * Pass 2: Map each resource/module/data to a project via tag references
 * Pass 3: Build project catalog with subproject grouping
 * Pass 4: Scan reusable module definitions (utils/modules/*)
 * Pass 5: Map module usage (which projects use which modules)
 */
export const discoverProjects = (
  parsedFiles: ParsedFile[],
): ProjectCatalog => {
  const allResources = parsedFiles.flatMap((f) => f.resources);

  // Pass 1 — locals → project tag map
  const tagLocalsMap = extractTagLocals(allResources);

  // Pass 2 — resource → project mapping
  const mappings = mapResourcesToProjects(allResources, tagLocalsMap);

  // Pass 3 — build project catalog
  const { projects, untaggedResourceIds, totalTagged, totalUntagged } =
    buildProjectCatalog(mappings, allResources);

  // Pass 4 — scan module definitions
  const modules = scanModuleDefinitions(allResources);

  // Pass 5 — map module usage
  enrichModuleUsage(modules, allResources, mappings);

  return { projects, modules, untaggedResourceIds, totalTagged, totalUntagged };
};

/**
 * Pass 1: Finds locals blocks that define tag objects with a `project` key.
 * Returns a map of local variable name → project name.
 *
 * Example: { "adklab_common_tags" → "adklab", "hangar_common_tags" → "hangar" }
 */
const extractTagLocals = (
  resources: ParsedResource[],
): Map<string, string> => {
  const tagLocals = new Map<string, string>();

  const localsBlocks = resources.filter((r) => r.type === 'locals');
  for (const block of localsBlocks) {
    for (const [key, value] of Object.entries(block.attributes)) {
      if (isTagObject(value)) {
        const project = (value as Record<string, unknown>).project as string;
        tagLocals.set(key, project);
      }
    }
  }

  return tagLocals;
};

/**
 * Pass 2: Maps each resource/module/data to its project via tag references.
 *
 * Detection strategies:
 * 1. String "${local.xxx_common_tags}" → lookup in tagLocalsMap
 * 2. String "${merge(local.xxx, { subproject = "yyy" })}" → extract local + subproject
 * 3. Inline object { project: "shared" } → direct read
 * 4. No tags → untagged
 */
const mapResourcesToProjects = (
  resources: ParsedResource[],
  tagLocalsMap: Map<string, string>,
): ResourceProjectMapping[] => {
  const mappings: ResourceProjectMapping[] = [];

  for (const res of resources) {
    // Skip non-graphable types
    if (res.type === 'locals' || res.type === 'variable' || res.type === 'output') continue;

    const resourceId = buildResourceId(res);
    const tags = res.attributes.tags;

    if (typeof tags === 'string') {
      // "${local.xxx}" or "${merge(local.xxx, { subproject = "yyy" })}"
      const localMatch = LOCAL_REF_REGEX.exec(tags);
      if (localMatch) {
        const localName = localMatch[1];
        const project = tagLocalsMap.get(localName);
        const subprojectMatch = SUBPROJECT_REGEX.exec(tags);
        mappings.push({
          resourceId,
          project,
          subproject: subprojectMatch?.[1],
        });
        continue;
      }
    }

    if (Array.isArray(tags) && tags.length > 0 && isTagObject(tags[0])) {
      // Inline tag object wrapped in array (rare but possible from hcl2-parser)
      const tagObj = tags[0] as Record<string, unknown>;
      mappings.push({
        resourceId,
        project: typeof tagObj.project === 'string' ? tagObj.project : undefined,
        subproject: typeof tagObj.subproject === 'string' ? tagObj.subproject : undefined,
      });
      continue;
    }

    if (isTagObject(tags)) {
      // Inline tag object (direct)
      const tagObj = tags as Record<string, unknown>;
      mappings.push({
        resourceId,
        project: typeof tagObj.project === 'string' ? tagObj.project : undefined,
        subproject: typeof tagObj.subproject === 'string' ? tagObj.subproject : undefined,
      });
      continue;
    }

    // No tags or unrecognized format
    mappings.push({ resourceId, project: undefined, subproject: undefined });
  }

  return mappings;
};

/**
 * Pass 3: Groups resource mappings by project, building SubprojectInfo for each.
 */
const buildProjectCatalog = (
  mappings: ResourceProjectMapping[],
  allResources: ParsedResource[],
): {
  projects: Map<string, ProjectInfo>;
  untaggedResourceIds: string[];
  totalTagged: number;
  totalUntagged: number;
} => {
  const projectMap = new Map<string, {
    resourceIds: string[];
    subprojectMap: Map<string, string[]>;
    layers: Set<string>;
  }>();
  const untaggedResourceIds: string[] = [];

  // Build resource lookup for layer info
  const resourceById = new Map<string, ParsedResource>();
  for (const res of allResources) {
    if (res.type === 'locals' || res.type === 'variable' || res.type === 'output') continue;
    resourceById.set(buildResourceId(res), res);
  }

  for (const mapping of mappings) {
    if (!mapping.project) {
      untaggedResourceIds.push(mapping.resourceId);
      continue;
    }

    let entry = projectMap.get(mapping.project);
    if (!entry) {
      entry = { resourceIds: [], subprojectMap: new Map(), layers: new Set() };
      projectMap.set(mapping.project, entry);
    }

    entry.resourceIds.push(mapping.resourceId);

    if (mapping.subproject) {
      const subIds = entry.subprojectMap.get(mapping.subproject) ?? [];
      subIds.push(mapping.resourceId);
      entry.subprojectMap.set(mapping.subproject, subIds);
    }

    // Infer layer from file path
    const res = resourceById.get(mapping.resourceId);
    if (res) {
      const layer = inferLayer(res.filePath);
      if (layer) entry.layers.add(layer);
    }
  }

  // Convert to ProjectInfo
  const projects = new Map<string, ProjectInfo>();
  for (const [name, entry] of projectMap.entries()) {
    const subprojects: SubprojectInfo[] = [];
    for (const [subName, subIds] of entry.subprojectMap.entries()) {
      subprojects.push({
        name: subName,
        resourceIds: subIds,
        resourceCount: subIds.length,
      });
    }
    subprojects.sort((a, b) => a.name.localeCompare(b.name));

    projects.set(name, {
      name,
      resourceCount: entry.resourceIds.length,
      resourceIds: entry.resourceIds,
      subprojects,
      layers: [...entry.layers].sort(),
    });
  }

  return {
    projects,
    untaggedResourceIds,
    totalTagged: mappings.filter((m) => m.project).length,
    totalUntagged: untaggedResourceIds.length,
  };
};

/**
 * Pass 4: Scans for reusable module definitions in utils/modules/ directories.
 * Groups resources by module directory and collects internal resource types.
 */
const scanModuleDefinitions = (
  resources: ParsedResource[],
): Map<string, ModuleDefinitionInfo> => {
  const modules = new Map<string, ModuleDefinitionInfo>();

  for (const res of resources) {
    if (res.type === 'locals' || res.type === 'variable' || res.type === 'output') continue;

    const moduleMatch = MODULE_PATH_REGEX.exec(res.filePath);
    if (!moduleMatch) continue;

    const moduleName = moduleMatch[1];
    let info = modules.get(moduleName);
    if (!info) {
      // Extract source path up to and including the module folder
      const pathMatch = res.filePath.match(/(.*(?:utils\/modules|modules)\/[^/]+)/);
      info = {
        name: moduleName,
        sourcePath: pathMatch ? pathMatch[1] : `modules/${moduleName}`,
        internalResourceIds: [],
        internalResourceTypes: [],
        usedByProjects: [],
        usedByCount: 0,
      };
      modules.set(moduleName, info);
    }

    const resourceId = buildResourceId(res);
    info.internalResourceIds.push(resourceId);

    if (res.type === 'resource' && !info.internalResourceTypes.includes(res.resourceType)) {
      info.internalResourceTypes.push(res.resourceType);
    }
  }

  return modules;
};

/**
 * Pass 5: Maps module usage — which projects use which modules.
 * Matches module source paths to module definitions in the catalog.
 */
const enrichModuleUsage = (
  modules: Map<string, ModuleDefinitionInfo>,
  resources: ParsedResource[],
  mappings: ResourceProjectMapping[],
): void => {
  // Build resourceId → project lookup from mappings
  const resourceProject = new Map<string, string>();
  for (const m of mappings) {
    if (m.project) resourceProject.set(m.resourceId, m.project);
  }

  const moduleResources = resources.filter((r) => r.type === 'module' && r.source);
  for (const res of moduleResources) {
    const source = res.source!;
    // Normalize: "./../../../../../../utils/modules/lambda-api" → "lambda-api"
    const match = MODULE_PATH_REGEX.exec(source);
    if (!match) continue;

    const moduleName = match[1];
    const info = modules.get(moduleName);
    if (!info) continue;

    info.usedByCount++;

    const resourceId = buildResourceId(res);
    const project = resourceProject.get(resourceId);
    if (project && !info.usedByProjects.includes(project)) {
      info.usedByProjects.push(project);
    }
  }
};

/** Builds a GraphNode-compatible ID from a ParsedResource. */
const buildResourceId = (res: ParsedResource): string => {
  if (res.type === 'module') return `module.${res.name}`;
  if (res.type === 'data') return `data.${res.resourceType}.${res.name}`;
  return `resource.${res.resourceType}.${res.name}`;
};

/** Checks if a value looks like a Terraform tag object (has a `project` string key). */
const isTagObject = (value: unknown): boolean => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as Record<string, unknown>).project === 'string'
  );
};

/** Infers the layer from a file path (e.g. "070-microservices", "shared"). */
const inferLayer = (filePath: string): string | undefined => {
  const match = /(?:resources|infra)\/(?:[\w-]+\/)?(\d{3}-[\w-]+|main|shared)/.exec(filePath);
  return match?.[1];
};
