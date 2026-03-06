// Ghost Engine Model Routing — decides between Nano Banana 2 and Pro
import type { GhostModelTier, RoutingDecision, RoutingHints, GhostEditClass } from './types';

interface RoutingInput {
  editClass: GhostEditClass;
  hints?: RoutingHints;
  retryCount: number;
  previousFailures: number;
}

// Model mapping to actual Lovable AI models
export const MODEL_MAP: Record<Exclude<GhostModelTier, 'AUTO'>, string> = {
  NANO_BANANA_2: 'google/gemini-2.5-flash-image',
  NANO_BANANA_PRO: 'google/gemini-3-pro-image-preview',
};

export const ANALYSIS_MODEL = 'google/gemini-3-flash-preview'; // For visual inspection (non-image)

export function routeModel(input: RoutingInput): RoutingDecision {
  const { editClass, hints, retryCount, previousFailures } = input;

  // Escalation after failures
  if (previousFailures >= 2 || retryCount >= 2) {
    return {
      selectedModel: 'NANO_BANANA_PRO',
      reason: `Escalated after ${previousFailures} failures`,
      escalationAvailable: false,
      retryLadderStep: retryCount,
      costHint: 'HIGH',
    };
  }

  // Fully generative always uses Pro
  if (editClass === 'FULLY_GENERATIVE') {
    return {
      selectedModel: 'NANO_BANANA_PRO',
      reason: 'Fully generative edits require Pro-level reasoning',
      escalationAvailable: false,
      retryLadderStep: 0,
      costHint: 'HIGH',
    };
  }

  // Route based on complexity and ROI scale
  const complexity = hints?.complexity ?? 'MEDIUM';
  const roiScale = hints?.expectedRoiScale ?? 'MEDIUM';

  if (complexity === 'HIGH' || roiScale === 'LARGE') {
    return {
      selectedModel: 'NANO_BANANA_PRO',
      reason: `High complexity (${complexity}) or large ROI (${roiScale})`,
      escalationAvailable: false,
      retryLadderStep: 0,
      costHint: 'HIGH',
    };
  }

  if (roiScale === 'MICRO' || roiScale === 'SMALL') {
    return {
      selectedModel: 'NANO_BANANA_2',
      reason: `Small ROI (${roiScale}), fast local worker preferred`,
      escalationAvailable: true,
      retryLadderStep: 0,
      costHint: 'LOW',
    };
  }

  // Default to Nano Banana 2 for deterministic-preserving
  if (editClass === 'DETERMINISTIC_PRESERVING') {
    return {
      selectedModel: 'NANO_BANANA_2',
      reason: 'Deterministic-preserving edit, fast worker sufficient',
      escalationAvailable: true,
      retryLadderStep: 0,
      costHint: 'LOW',
    };
  }

  return {
    selectedModel: 'NANO_BANANA_2',
    reason: 'Default routing to fast worker',
    escalationAvailable: true,
    retryLadderStep: 0,
    costHint: 'MEDIUM',
  };
}
