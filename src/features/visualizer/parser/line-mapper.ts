/** Represents the source location of a top-level HCL block within a file. */
interface BlockLocation {
  type: string;
  resourceType?: string;
  name: string;
  lineStart: number;
  lineEnd: number;
}

/** Matches the opening line of a top-level HCL block (resource, module, data, variable, output, locals). */
const BLOCK_REGEX = /^(resource|module|data|variable|output|locals)\s+(?:"([^"]+)"\s+)?(?:"([^"]+)"\s+)?\{/;

/**
 * Scans raw HCL file content and maps every top-level block to its start/end line numbers.
 * Uses brace-depth counting to determine where each block ends.
 * Line numbers are 1-based to match editor conventions.
 *
 * @example
 * // Given the HCL content:
 * // 1: resource "aws_s3_bucket" "my_bucket" {
 * // 2:   bucket = "my-bucket"
 * // 3: }
 * // 4:
 * // 5: module "api" {
 * // 6:   source = "./modules/api"
 * // 7: }
 *
 * mapBlockLocations(content)
 * // → [
 * //   { type: 'resource', resourceType: 'aws_s3_bucket', name: 'my_bucket', lineStart: 1, lineEnd: 3 },
 * //   { type: 'module', name: 'api', lineStart: 5, lineEnd: 7 },
 * // ]
 */
export const mapBlockLocations = (content: string): BlockLocation[] => {
  const lines = content.split('\n');
  const locations: BlockLocation[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    const match = BLOCK_REGEX.exec(line);

    if (match) {
      const blockType = match[1];
      const lineStart = i + 1;
      let depth = 0;
      let lineEnd = lineStart;

      for (let j = i; j < lines.length; j++) {
        const chars = lines[j];
        for (const ch of chars) {
          if (ch === '{') depth++;
          if (ch === '}') depth--;
        }
        if (depth === 0 && j >= i) {
          lineEnd = j + 1;
          break;
        }
      }

      if (blockType === 'locals') {
        locations.push({
          type: 'locals',
          name: 'locals',
          lineStart,
          lineEnd,
        });
      } else if (blockType === 'resource' || blockType === 'data') {
        locations.push({
          type: blockType,
          resourceType: match[2],
          name: match[3] ?? match[2],
          lineStart,
          lineEnd,
        });
      } else if (blockType === 'module') {
        locations.push({
          type: 'module',
          name: match[2] ?? '',
          lineStart,
          lineEnd,
        });
      } else {
        locations.push({
          type: blockType,
          name: match[2] ?? '',
          lineStart,
          lineEnd,
        });
      }

      i = lineEnd;
    } else {
      i++;
    }
  }

  return locations;
};

/**
 * Finds a specific block location by type, optional resource type, and optional name.
 * Returns undefined if no matching block is found.
 */
export const findBlockLocation = (
  locations: BlockLocation[],
  type: string,
  resourceType?: string,
  name?: string,
): BlockLocation | undefined => {
  return locations.find((loc) => {
    if (loc.type !== type) return false;
    if (resourceType && loc.resourceType !== resourceType) return false;
    if (name && loc.name !== name) return false;
    return true;
  });
};
