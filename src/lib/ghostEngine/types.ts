// Ghost Engine Core Types — Semantic-to-Deterministic Bridging (S2DB)

// ─── Ghost Map Kinds ─────────────────────────────────────────────
export type GhostMapKind =
  | 'SEMANTIC'
  | 'INSTANCE'
  | 'PARTS'
  | 'TRIMAP'
  | 'ALPHA'
  | 'CONFIDENCE'
  | 'DEPTH'
  | 'NORMAL'
  | 'ALBEDO'
  | 'SHADING'
  | 'SPECULAR'
  | 'ROUGHNESS'
  | 'MATERIAL_CLASS'
  | 'KEYPOINTS'
  | 'SKELETON'
  | 'RIGIDITY'
  | 'FLOW'
  | 'OCCLUSION'
  | 'TEXT_PLANE'
  | 'TARGET_MASK'
  | 'PROTECT_MASK';

// ─── Model Tiers ─────────────────────────────────────────────────
export type GhostModelTier =
  | 'NANO_BANANA_2'      // google/gemini-2.5-flash-image — fast local worker
  | 'NANO_BANANA_PRO'    // google/gemini-3-pro-image-preview — semantic finishing
  | 'AUTO';

// ─── Edit Classes ────────────────────────────────────────────────
export type GhostEditClass =
  | 'DETERMINISTIC_PRESERVING'   // Class A — original pixels preserved
  | 'HYBRID_RECONSTRUCTIVE'      // Class B — AI + deterministic
  | 'FULLY_GENERATIVE';          // Class C — major AI rewrite

// ─── Validation ──────────────────────────────────────────────────
export interface ValidationProfile {
  requireEdgeAdherence: boolean;
  requireTopologyCheck: boolean;
  requireLeakCheck: boolean;
  requireCompletenessCheck: boolean;
  requirePatchSeamCheck: boolean;
  requireIdentityDriftCheck: boolean;
  minimumConfidence?: number;
}

export interface ValidationTestResult {
  name: string;
  passed: boolean;
  score?: number;
  details?: string;
}

export interface ValidationReport {
  graphId: string;
  nodeId: string;
  passed: boolean;
  confidenceScore?: number;
  tests: ValidationTestResult[];
  recommendedAction: 'ACCEPT' | 'RETRY' | 'ESCALATE' | 'REVIEW' | 'ABORT';
}

// ─── Routing ─────────────────────────────────────────────────────
export interface RoutingHints {
  expectedRoiScale?: 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';
  complexity?: 'LOW' | 'MEDIUM' | 'HIGH';
  likelySubject?: 'PORTRAIT' | 'PRODUCT' | 'SCENE' | 'TEXT' | 'MIXED';
  likelyEdgeMode?: 'HARD' | 'SOFT' | 'TRANSLUCENT' | 'MIXED';
}

export interface RoutingDecision {
  selectedModel: GhostModelTier;
  reason: string;
  escalationAvailable: boolean;
  retryLadderStep: number;
  costHint: 'LOW' | 'MEDIUM' | 'HIGH';
}

// ─── Ghost Contract ──────────────────────────────────────────────
export interface GhostContract {
  id: string;
  tool: string;
  editClass: GhostEditClass;
  requestedMaps: GhostMapKind[];
  preferredModel: GhostModelTier;
  allowEscalation: boolean;
  roiRequired: boolean;
  spatialLock: boolean;
  preserveSourcePixels: boolean;
  confidenceRequired: boolean;
  userReviewRequired: boolean;
  validationProfile: ValidationProfile;
  routingHints?: RoutingHints;
}

// ─── Intent System ───────────────────────────────────────────────
export type SmartHealAction =
  | 'fix_eyelash'
  | 'remove_blemish'
  | 'clean_lip_edge'
  | 'restore_iris_detail'
  | 'remove_stray_hair'
  | 'heal_skin_patch'
  | 'repair_seam'
  | 'remove_dust'
  | 'repair_texture'
  | 'remove_object'
  | 'clean_reflection';

export interface IntentInference {
  predictedAction: SmartHealAction;
  targetDescription: string;
  protectedRegions: string[];
  prompt: string;
  negativePrompt: string;
  confidence: number;
  shouldAutoRun: boolean;
  recommendedModel: GhostModelTier;
}

export interface SessionIntentDigest {
  dominantMode: 'PORTRAIT_CLEANUP' | 'PRODUCT_POLISH' | 'COMPOSITE_REPAIR' | 'BEAUTY_RETOUCH';
  recentTargets: string[];
  styleConstraints: string[];
  lastAcceptedActions: string[];
}

// ─── Visual Inspector ────────────────────────────────────────────
export interface VisualAnalysis {
  imageType: 'PORTRAIT' | 'PRODUCT' | 'LANDSCAPE' | 'COMPOSITE' | 'TEXT' | 'MIXED';
  subjects: AnalyzedSubject[];
  composition: CompositionAnalysis;
  technicalQuality: TechnicalQuality;
  suggestedTools: SuggestedTool[];
  complexityScore: number;
  routingRecommendation: GhostModelTier;
}

export interface AnalyzedSubject {
  id: string;
  label: string;
  type: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  confidence: number;
  suggestedActions: string[];
}

export interface CompositionAnalysis {
  ruleOfThirds: number;
  leadingLines: boolean;
  symmetry: number;
  depthLayers: number;
  dominantColors: string[];
  lightingDirection: string;
  lightingQuality: string;
}

export interface TechnicalQuality {
  sharpness: number;
  noise: number;
  exposure: number;
  contrast: number;
  colorBalance: number;
  dynamicRange: number;
}

export interface SuggestedTool {
  tool: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  editClass: GhostEditClass;
  estimatedModel: GhostModelTier;
}

// ─── Execution Graph Runtime ─────────────────────────────────────
export type RuntimeNodeKind =
  | 'INTENT_PARSE'
  | 'CONTEXT_DIGEST'
  | 'CONTRACT_PLAN'
  | 'ROUTE_MODEL'
  | 'ROI_EXTRACT'
  | 'AI_UTILITY_PASS'
  | 'AI_PATCH_PASS'
  | 'DETERMINISTIC_REFINE'
  | 'DETERMINISTIC_RENDER'
  | 'VALIDATE'
  | 'REVIEW_GATE'
  | 'COMPOSITE'
  | 'CACHE_WRITE'
  | 'HISTORY_LOG'
  | 'PROVENANCE_LOG'
  | 'ESCALATE'
  | 'ABORT';

export type GraphStatus =
  | 'PLANNED'
  | 'RUNNING'
  | 'WAITING_REVIEW'
  | 'RETRYING'
  | 'ESCALATED'
  | 'COMPLETED'
  | 'FAILED'
  | 'ABORTED';

export interface RuntimeNode {
  id: string;
  kind: RuntimeNodeKind;
  label: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  inputs: string[];
  outputs: string[];
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export interface ExecutionGraph {
  id: string;
  graphType: 'SMART_HEAL' | 'SEGMENTATION' | 'RELIGHT' | 'MATERIAL_INJECTION' | 'STRUCTURAL_MORPH' | 'GLOBAL_FINISH' | 'VISUAL_ANALYSIS' | 'CUSTOM';
  rootIntent: string;
  nodes: RuntimeNode[];
  status: GraphStatus;
  routingDecision?: RoutingDecision;
  validationReport?: ValidationReport;
  createdAt: number;
  completedAt?: number;
}

// ─── Buffer System ───────────────────────────────────────────────
export type BufferKind =
  | 'SOURCE_IMAGE'
  | 'ROI_CROP'
  | 'TARGET_MASK'
  | 'PROTECT_MASK'
  | 'TINT_MAP'
  | 'TRIMAP'
  | 'ALPHA_MATTE'
  | 'CONFIDENCE_MAP'
  | 'DEPTH_MAP'
  | 'NORMAL_MAP'
  | 'PATCH_IMAGE'
  | 'VALIDATION_REPORT'
  | 'FINAL_COMPOSITE';

export type BufferVisibility = 'USER_VISIBLE' | 'GHOST_HIDDEN' | 'GOD_MODE_VISIBLE' | 'INTERNAL_ONLY';

export interface GhostBuffer {
  id: string;
  kind: BufferKind;
  visibility: BufferVisibility;
  imageData?: string; // base64 or URL
  metadata?: Record<string, unknown>;
  ownerNodeId: string;
  userEditable: boolean;
}

// ─── God Mode ────────────────────────────────────────────────────
export type GodModeLevel = 0 | 1 | 2 | 3;
// 0 = Off, 1 = Reveal, 2 = Edit, 3 = Full Engineer

export type BufferViewMode = 'overlay' | 'split' | 'side-by-side' | 'difference' | 'heatmap' | 'contour' | 'alpha-only';

// ─── Retry Policy ────────────────────────────────────────────────
export interface RetryPolicy {
  maxAttempts: number;
  strategy: 'RETRY_SAME' | 'RETRY_TIGHTER_ROI' | 'RETRY_STRONGER_PROMPT' | 'ESCALATE_MODEL' | 'REQUIRE_REVIEW';
}
