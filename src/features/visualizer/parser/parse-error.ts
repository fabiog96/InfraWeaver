import type { ParseError } from './types';

const NO_REASON_GIVEN = 'The HCL parser rejected this file without reporting a reason.';
const SYNTAX_SUGGESTION = 'Check for unclosed brackets, missing quotes, or unsupported HCL syntax.';

/** Matches the line reference in a Terraform-style diagnostic: `on main.tf line 42, in resource`. */
const TERRAFORM_LINE_REGEX = /on\s+.*?line\s+(\d+)/i;

/** Matches the line reference in a compiler-style diagnostic: `main.tf:42:11: unexpected token`. */
const COMPILER_LINE_REGEX = /[A-Za-z]:(\d+)[:,]/;

/** Number of lines kept on each side of the offending line in a snippet. */
const SNIPPET_RADIUS = 1;

/** Serialises an error object, or nothing when it carries no information or cannot be serialised. */
const serialise = (error: object): string | undefined => {
  try {
    const serialised = JSON.stringify(error);
    return serialised && serialised !== '{}' && serialised !== '[]' ? serialised : undefined;
  } catch {
    return undefined;
  }
};

/** Renders whatever a parser failure carried as a non-empty, human-readable string. */
const toMessage = (error: unknown): string => {
  if (typeof error === 'string') return error.trim() || NO_REASON_GIVEN;
  if (error instanceof Error) return error.message.trim() || NO_REASON_GIVEN;
  if (error === null || typeof error !== 'object') return NO_REASON_GIVEN;

  return serialise(error) ?? NO_REASON_GIVEN;
};

/** Reads the 1-based line number a parser message points at, if it carries one. */
const extractLine = (message: string): number | undefined => {
  const match = TERRAFORM_LINE_REGEX.exec(message) ?? COMPILER_LINE_REGEX.exec(message);
  return match ? parseInt(match[1], 10) : undefined;
};

/** Renders one snippet row, marking the offending line with `>`. */
const toSnippetRow = (text: string, lineNumber: number, offendingLine: number): string =>
  `${lineNumber === offendingLine ? '>' : ' '} ${lineNumber} | ${text}`;

/**
 * Quotes the offending line with its neighbours, or nothing when the line is out of range.
 *
 * @example
 * getSnippet(content, 3)
 * // → '  2 |   bucket = "my-bucket"\n> 3 |   tags = {\n  4 |     terraform = true'
 */
const getSnippet = (content: string, offendingLine: number): string | undefined => {
  const lines = content.split('\n');
  if (offendingLine < 1 || offendingLine > lines.length) return undefined;

  const firstLine = Math.max(1, offendingLine - SNIPPET_RADIUS);
  const lastLine = Math.min(lines.length, offendingLine + SNIPPET_RADIUS);

  return lines
    .slice(firstLine - 1, lastLine)
    .map((text, index) => toSnippetRow(text, firstLine + index, offendingLine))
    .join('\n');
};

/** Points at the offending line, or nowhere at all when it cannot be quoted from the file. */
const locate = (message: string, content: string): Pick<ParseError, 'line' | 'snippet'> => {
  const line = extractLine(message);
  const snippet = line ? getSnippet(content, line) : undefined;

  return snippet ? { line, snippet } : {};
};

/**
 * Builds a ParseError out of whatever a parser failure produced — a string, an Error,
 * an object, or nothing at all. The message is always a string, so it is always safe to
 * render; a line reference inside it drives `line` and `snippet`.
 *
 * @example
 * toParseError('on broken.tf line 3, in resource block', 'broken.tf', content)
 * // → { level: 'parse_error', filePath: 'broken.tf', message: 'on broken.tf line 3, …', line: 3, snippet: '…' }
 *
 * // hcl2-parser rejects a file with a bare `{}`, carrying no reason of its own:
 * toParseError({}, 'broken.tf', content)
 * // → { level: 'parse_error', filePath: 'broken.tf', message: 'The HCL parser rejected this file …' }
 */
export const toParseError = (
  error: unknown,
  filePath: string,
  content: string,
  suggestion = SYNTAX_SUGGESTION,
): ParseError => {
  const message = toMessage(error);

  return { level: 'parse_error', filePath, message, ...locate(message, content), suggestion };
};
