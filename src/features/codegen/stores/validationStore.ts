import { create } from 'zustand';

import type { ValidationMessage, NodeValidationStatus } from '../validators/diagram-validator';

interface ValidationState {
  messages: ValidationMessage[];
  setMessages: (messages: ValidationMessage[]) => void;
}

export const useValidationStore = create<ValidationState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export const useNodeValidation = (nodeId: string): NodeValidationStatus => {
  return useValidationStore((s) => {
    const nodeMessages = s.messages.filter((m) => m.nodeId === nodeId);
    if (nodeMessages.some((m) => m.severity === 'error')) return 'error';
    if (nodeMessages.some((m) => m.severity === 'warning')) return 'warning';
    return null;
  });
};

export const useEdgeValidation = (edgeId: string): NodeValidationStatus => {
  return useValidationStore((s) => {
    const edgeMessages = s.messages.filter((m) => m.edgeId === edgeId);
    if (edgeMessages.some((m) => m.severity === 'error')) return 'error';
    if (edgeMessages.some((m) => m.severity === 'warning')) return 'warning';
    return null;
  });
};
