import type { ParseError } from '../parser/types';

const LAYOUT_SOURCE = 'auto-layout';
const NO_REASON_GIVEN = 'The layout engine failed without reporting a reason.';
const SUGGESTION = 'Re-sync the repository, or select a single project to lay out fewer resources.';

/** Reads whatever was thrown as a non-empty, human-readable reason. */
const toMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim()) return error.message.trim();
  if (typeof error === 'string' && error.trim()) return error.trim();

  return NO_REASON_GIVEN;
};

/**
 * Builds the ParseError the bottom panel renders when the canvas could not be laid out.
 * The message is always a non-empty string, whatever the layout engine threw.
 *
 * @example
 * toLayoutError(new Error('dagre ran out of ranks')).message
 * // → 'The diagram could not be laid out. dagre ran out of ranks'
 */
export const toLayoutError = (error: unknown): ParseError => ({
  level: 'layout_error',
  filePath: LAYOUT_SOURCE,
  message: `The diagram could not be laid out. ${toMessage(error)}`,
  suggestion: SUGGESTION,
});
