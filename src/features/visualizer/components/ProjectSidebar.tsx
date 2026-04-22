import { useState, useCallback } from 'react';
import {
  TbChevronRight, TbFolder, TbFolderOpen,
  TbPackage, TbBoxMultiple, TbCircleDot,
} from 'react-icons/tb';

import { cn } from '@/shared/lib/utils';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import { useVisualizerStore } from '../stores/visualizerStore';

/**
 * Left sidebar with two sections: PROJECTS (expandable with subprojects) and MODULES.
 * Click project → shows all project resources on canvas.
 * Click subproject → filters further.
 * Click module → highlights all instances in canvas.
 */
export const ProjectSidebar = () => {
  const projectCatalog = useVisualizerStore((s) => s.projectCatalog);
  const selectedProject = useVisualizerStore((s) => s.selectedProject);
  const selectedSubproject = useVisualizerStore((s) => s.selectedSubproject);
  const selectedModule = useVisualizerStore((s) => s.selectedModule);
  const setSelectedProject = useVisualizerStore((s) => s.setSelectedProject);
  const setSelectedSubproject = useVisualizerStore((s) => s.setSelectedSubproject);
  const setSelectedModule = useVisualizerStore((s) => s.setSelectedModule);

  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((name: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  if (!projectCatalog) return null;

  const projects = [...projectCatalog.projects.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const modules = [...projectCatalog.modules.values()]
    .filter((m) => m.usedByCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {/* All Resources */}
        <button
          onClick={() => { setSelectedProject(null); setSelectedModule(null); }}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors',
            !selectedProject && !selectedModule
              ? 'bg-primary/10 text-primary border-l-2 border-primary'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
          )}
        >
          <TbBoxMultiple className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[11px] font-medium">All Resources</span>
          <span className="ml-auto text-[9px] tabular-nums opacity-60">
            {projectCatalog.totalTagged + projectCatalog.totalUntagged}
          </span>
        </button>

        <Separator className="my-2" />

        {/* Projects section */}
        <div className="px-2 py-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Projects
          </span>
        </div>

        {projects.map((project) => {
          const isSelected = selectedProject === project.name;
          const isExpanded = expandedProjects.has(project.name);
          const hasSubprojects = project.subprojects.length > 0;

          return (
            <div key={project.name}>
              <div
                className={cn(
                  'flex w-full items-center gap-1 rounded-md px-1.5 py-1 transition-colors',
                  isSelected
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-foreground hover:bg-secondary/50',
                )}
              >
                {hasSubprojects ? (
                  <button
                    onClick={() => toggleExpand(project.name)}
                    className="shrink-0 p-0.5 rounded-sm hover:bg-secondary"
                  >
                    <TbChevronRight
                      className={cn(
                        'h-3 w-3 transition-transform duration-150',
                        isExpanded && 'rotate-90',
                      )}
                    />
                  </button>
                ) : (
                  <div className="w-4" />
                )}

                <button
                  onClick={() => setSelectedProject(isSelected ? null : project.name)}
                  className="flex flex-1 items-center gap-1.5 min-w-0"
                >
                  {isExpanded ? (
                    <TbFolderOpen className="h-3.5 w-3.5 shrink-0 text-amber-500/80" />
                  ) : (
                    <TbFolder className="h-3.5 w-3.5 shrink-0 text-amber-500/80" />
                  )}
                  <span className="truncate text-[11px] font-medium">{project.name}</span>
                  <span className="ml-auto shrink-0 text-[9px] tabular-nums opacity-60">
                    {project.resourceCount}
                  </span>
                </button>
              </div>

              {/* Subprojects */}
              {isExpanded && hasSubprojects && (
                <div className="ml-4 space-y-0.5 mt-0.5">
                  {project.subprojects.map((sub) => {
                    const isSubSelected = isSelected && selectedSubproject === sub.name;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => {
                          if (!isSelected) setSelectedProject(project.name);
                          setSelectedSubproject(isSubSelected ? null : sub.name);
                        }}
                        className={cn(
                          'flex w-full items-center gap-1.5 rounded-sm px-2 py-0.5 text-left transition-colors',
                          isSubSelected
                            ? 'bg-primary/5 text-primary'
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                        )}
                      >
                        <TbCircleDot className="h-2.5 w-2.5 shrink-0" />
                        <span className="truncate text-[10px]">{sub.name}</span>
                        <span className="ml-auto shrink-0 text-[9px] tabular-nums opacity-60">
                          {sub.resourceCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Modules section */}
        {modules.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="px-2 py-1">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Modules
              </span>
            </div>

            {modules.map((mod) => {
              const isModSelected = selectedModule === mod.name;
              return (
                <button
                  key={mod.name}
                  onClick={() => setSelectedModule(isModSelected ? null : mod.name)}
                  className={cn(
                    'flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left transition-colors',
                    isModSelected
                      ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-400'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                  )}
                >
                  <TbPackage className="h-3.5 w-3.5 shrink-0 text-blue-400/70" />
                  <span className="truncate text-[10px]">{mod.name}</span>
                  <span className="ml-auto shrink-0 text-[9px] tabular-nums opacity-50">
                    {mod.internalResourceIds.length}
                  </span>
                </button>
              );
            })}
          </>
        )}

        {/* Untagged */}
        {projectCatalog.untaggedResourceIds.length > 0 && (
          <>
            <Separator className="my-2" />
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-muted-foreground/60">
              <TbCircleDot className="h-3 w-3 shrink-0" />
              <span className="text-[10px]">untagged</span>
              <span className="ml-auto text-[9px] tabular-nums opacity-50">
                {projectCatalog.untaggedResourceIds.length}
              </span>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
};
