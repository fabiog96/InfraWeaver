import type { Node, Edge } from '@xyflow/react';

import type { ParseError } from '../parser/types';
import { computeLayout, groupNodesByFile } from './auto-layout';
import { loadPositions } from './position-persistence';
import { toLayoutError } from './layout-error';
import { filterForView, type ViewSelection } from './view-filter';

export interface FlowSyncInput extends ViewSelection {
  positionKey: string;
  branch: string;
}

export interface FlowSyncPublish {
  setFlowElements: (nodes: Node[], edges: Edge[]) => void;
  setLayoutError: (error: ParseError | null) => void;
}

/**
 * Lays the current selection out and publishes it, or publishes why it could not be laid out.
 * Returns whether the canvas was updated, so the caller only refits the viewport on success.
 */
export const syncFlowElements = (input: FlowSyncInput, publish: FlowSyncPublish): boolean => {
  try {
    const { visibleNodes, visibleEdges, ghostNodeIds } = filterForView(input);
    const savedPositions = loadPositions(input.positionKey, input.branch);
    const { nodes, edges } = computeLayout(visibleNodes, visibleEdges, savedPositions);

    publish.setFlowElements(groupNodesByFile(nodes, ghostNodeIds), edges);
    publish.setLayoutError(null);
    return true;
  } catch (error) {
    publish.setLayoutError(toLayoutError(error));
    return false;
  }
};
