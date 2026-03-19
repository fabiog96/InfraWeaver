import type { TerraformModule, ResourceBlock, NestedBlock } from '../types';
import { formatHclValue } from './hcl-utils';

const renderAttributes = (
  attributes: { attribute: string; fromInput: string }[],
  inputValues: Record<string, unknown>,
  inputTypes: Record<string, string>,
  indent: string,
): string[] => {
  const lines: string[] = [];
  const maxLen = Math.max(...attributes.map((a) => a.attribute.length));

  for (const attr of attributes) {
    const value = inputValues[attr.fromInput];
    if (value === undefined || value === null || value === '') continue;
    const type = inputTypes[attr.fromInput] || 'string';
    const padding = ' '.repeat(maxLen - attr.attribute.length);
    lines.push(`${indent}${attr.attribute}${padding} = ${formatHclValue(value, type)}`);
  }

  return lines;
};

const renderNestedBlock = (
  block: NestedBlock,
  inputValues: Record<string, unknown>,
  inputTypes: Record<string, string>,
  indent: string,
): string[] => {
  const attrLines = renderAttributes(block.attributes, inputValues, inputTypes, indent + '  ');
  if (attrLines.length === 0) return [];

  return [
    `${indent}${block.blockType} {`,
    ...attrLines,
    `${indent}}`,
  ];
};

const renderResourceBlock = (
  resource: ResourceBlock,
  inputValues: Record<string, unknown>,
  inputTypes: Record<string, string>,
): string[] => {
  const lines: string[] = [];
  lines.push(`resource "${resource.resourceType}" "${resource.resourceName}" {`);

  const attrLines = renderAttributes(resource.attributes, inputValues, inputTypes, '  ');
  lines.push(...attrLines);

  if (resource.nestedBlocks) {
    for (const nested of resource.nestedBlocks) {
      const nestedLines = renderNestedBlock(nested, inputValues, inputTypes, '  ');
      if (nestedLines.length > 0) {
        if (attrLines.length > 0) lines.push('');
        lines.push(...nestedLines);
      }
    }
  }

  lines.push('}');
  return lines;
};

export const renderMainTf = (
  module: TerraformModule,
  inputValues: Record<string, unknown>,
): string => {
  const inputTypes: Record<string, string> = {};
  for (const input of module.inputs) {
    inputTypes[input.name] = input.type;
  }

  const mergedValues: Record<string, unknown> = {};
  for (const input of module.inputs) {
    const userValue = inputValues[input.name];
    if (userValue !== undefined && userValue !== null && userValue !== '') {
      mergedValues[input.name] = userValue;
    } else if (input.default !== undefined) {
      mergedValues[input.name] = input.default;
    }
  }

  const blocks: string[] = [];
  for (const resource of module.resourceBlocks) {
    blocks.push(renderResourceBlock(resource, mergedValues, inputTypes).join('\n'));
  }

  return blocks.join('\n\n') + '\n';
};
