import { create } from 'zustand';

import type {
  ValidationMessage,
  ValidationSeverity,
  NodeValidationStatus,
} from '../validators/diagram-validator';

type StatusMap = Map<string, Exclude<NodeValidationStatus, null>>;

interface ValidationState {
  messages: ValidationMessage[];
  nodeStatuses: StatusMap;
  edgeStatuses: StatusMap;
  setMessages: (messages: ValidationMessage[]) => void;
}

const escalate = (statuses: StatusMap, id: string, severity: ValidationSeverity) => {
  if (severity === 'info' || statuses.get(id) === 'error') return;
  statuses.set(id, severity);
};

const buildStatusMaps = (messages: ValidationMessage[]) => {
  const nodeStatuses: StatusMap = new Map();
  const edgeStatuses: StatusMap = new Map();

  for (const { severity, nodeId, edgeId } of messages) {
    if (nodeId) escalate(nodeStatuses, nodeId, severity);
    if (edgeId) escalate(edgeStatuses, edgeId, severity);
  }

  return { nodeStatuses, edgeStatuses };
};

export const useValidationStore = create<ValidationState>((set) => ({
  messages: [],
  nodeStatuses: new Map(),
  edgeStatuses: new Map(),
  setMessages: (messages) => set({ messages, ...buildStatusMaps(messages) }),
}));

export const useNodeValidation = (nodeId: string): NodeValidationStatus =>
  useValidationStore((s) => s.nodeStatuses.get(nodeId) ?? null);

export const useEdgeValidation = (edgeId: string): NodeValidationStatus =>
  useValidationStore((s) => s.edgeStatuses.get(edgeId) ?? null);
