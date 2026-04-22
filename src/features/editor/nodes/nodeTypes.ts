import type { NodeTypes } from '@xyflow/react';

import { TechNode } from './TechNode';
import { GroupNode } from './GroupNode';
import { TextNode } from './TextNode'

export const nodeTypes: NodeTypes = {
  tech: TechNode,
  group: GroupNode,
  text: TextNode
};
