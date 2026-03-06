# Ghost Engine

## The Book on Semantic-to-Deterministic AI Image Editing

### Nano Banana 2, Nano Banana Pro, Ghost Maps, Intent-Aware Microtools, and the Architecture Beyond Photoshop

---

## 0. Purpose

This document defines the canonical architecture for an AI-native image editor built around **two fundamentally different model roles**:

* **Nano Banana 2** as the fast, interactive, local editing worker
* **Nano Banana Pro** as the deeper semantic, compositional, and finishing worker

It also defines the deeper editing paradigm that makes these models useful in a serious creative application:

# **Semantic-to-Deterministic Bridging (S2DB)**

In this paradigm, AI is not trusted as the final pixel authority by default.
Instead, AI is used to infer hidden structure, hidden meaning, hidden geometry, hidden material, hidden selection logic, and hidden edit intent.
Then deterministic systems execute the visible edit with precision.

This is the foundation of **Ghost Engine**.

---

## 1. Executive Thesis

Most current AI image editors make the same architectural mistake:

They ask a generative model to both:

1. **understand the scene**, and
2. **perform the final pixel rewrite**

in one step.

That produces the usual pathologies:

* detail loss
* identity drift
* texture destruction
* overpainting
* unpredictable local changes
* weak masking
* poor boundary fidelity
* unnecessary compute cost for tiny edits

The correct architecture is different.

## The Correct Law

AI should primarily be used to:

* infer intent
* infer local structure
* infer geometry
* infer segmentation
* infer material regions
* infer deformation logic
* infer contextual edit plans

Deterministic systems should then:

* preserve original pixels when possible
* execute precise local edits
* blend results correctly
* preserve boundaries
* preserve texture continuity
* validate results
* expose hidden intermediate state for manual override

That is the difference between an **AI gimmick editor** and an **unassailable computational photography system**.

---

## 2. The Model Split

The first core principle is that **Nano Banana 2** and **Nano Banana Pro** should not be treated as interchangeable.

They belong to different roles.

---

## 3. Nano Banana 2 — The Interactive Local Worker

Nano Banana 2 should be treated as:

# **the ROI worker**

ROI = region of interest.

Nano Banana 2 is the engine for:

* fast local edits
* one-shot micro repairs
* high-volume interaction
* iterative patch workflows
* tool-driven editing where the user should not need to type a prompt
* low-latency preview generation
* repetitive corrective operations
* local utility passes in small windows

### Canonical Nano Banana 2 jobs

* fix eyelashes
* remove blemish
* clean lipstick edge
* restore iris detail
* remove flyaway hair
* patch a garment seam
* remove dust
* heal a texture scratch
* repair a small reflection artifact
* clean up a small background object
* perform localized inpainting
* generate preview utility maps in crops

### Mental model

Nano Banana 2 should feel like a **smart local patch daemon**.

Not a whole-scene director.
Not a giant cinematic composer.
A fast, sharp subordinate that can solve one local problem cleanly and cheaply.

### Operational traits

* crop-based
* context-padded
* fast
* retry-friendly
* undo-friendly
* suitable for implicit intent inference
* suitable for batch micro-edits
* suitable for live brush tools

---

## 4. Nano Banana Pro — The Semantic and Finishing Worker

Nano Banana Pro should be treated as:

# **the reasoning-rich composition and finishing engine**

Nano Banana Pro is the engine for:

* complex semantic interpretation
* harder selection logic
* multi-object understanding
* text-aware composition
* higher-stakes object insertion
* global style treatment
* full-image lighting reinterpretation
* harder material and geometry inference
* more expensive but more deliberate passes
* difficult utility maps when failure is costly

### Canonical Nano Banana Pro jobs

* global scene re-lighting concepts
* complex segmentation guidance
* multi-object tint-map generation
* full-image finishing pass
* style unification pass
* product mockups and text-heavy design
* difficult facial or hand refinement where instruction fidelity matters
* semantic scene-level planning
* grounded or reference-heavy composition

### Mental model

Nano Banana Pro should feel like a **semantic supervisor and finishing artist**.

It should be called when:

* the edit is broad
* the semantics are difficult
* the composition matters deeply
* the user wants fewer retries
* the hidden utility maps must be unusually reliable
* the final result needs strong whole-image coherence

---

## 5. Working Theory: The Likely Evolution Toward a Future “Pro 2”

This section is explicitly **forward-looking theory**, not canonized vendor fact.

A future successor to Nano Banana Pro would likely evolve in the following directions:

1. **higher instruction fidelity**
2. **better compositional memory across long multi-turn editing**
3. **stronger consistency across many references**
4. **better text/layout accuracy**
5. **better identity preservation and subject continuity**
6. **higher edit reliability under constrained structural prompts**
7. **better native utility-map style behavior even if not explicitly exposed as a product feature**
8. **faster preview-to-final convergence**

A future Pro successor may also become better at:

* generating hidden map-like outputs reliably
* honoring strict spatial locks
* maintaining object proportions during technical overlay passes
* preserving topology during semantic tint workflows

This document therefore designs an architecture that does **not depend on one specific future model**, but is ready to absorb a stronger Pro-class successor immediately.

---

## 6. The Ghost Engine Doctrine

Ghost Engine is the runtime embodiment of S2DB.

The core law is:

# **AI generates hidden machine-readable edit intelligence, not necessarily final pixels.**

These hidden outputs are called **Ghost Maps** or **Ghost Contracts**.

They are rendered or inferred silently, then used by deterministic systems to perform the actual edit.

### Examples

* AI identifies the face
* AI labels the jacket
* AI estimates the depth
* AI predicts the keypoints of a limb
* AI identifies where the lipstick edge should be
* AI infers what the user likely meant when using Smart Heal

Then deterministic systems:

* create the mask
* refine edges
* relight the image
* warp the mesh
* blur the background
* blend the patch
* preserve the original texture
* keep the edit localized

This is the architecture that goes beyond both normal Photoshop and naive prompt-first AI editors.

---

## 7. Ghost Maps and Ghost Contracts

A **Ghost Contract** is a typed request for hidden intermediate machine-readable outputs.

These contracts define what the model must produce so the rest of the system can execute deterministically.

### 7.1 Selection Contracts

Used for object or region isolation.

Outputs may include:

* semantic map
* instance map
* part map
* trimap
* alpha matte
* confidence map

### 7.2 Geometry Contracts

Used for relighting, blur, insertion, and optical effects.

Outputs may include:

* depth map
* normal map
* occlusion map
* planar-region hints
* geometry confidence map

### 7.3 Material / Intrinsic Contracts

Used for material injection and appearance editing.

Outputs may include:

* albedo
* shading
* specular estimate
* roughness estimate
* material class
* gloss / clearcoat hints

### 7.4 Kinematic Contracts

Used for structural morphing and puppet workflows.

Outputs may include:

* keypoints
* skeletal lines
* joint centers
* rigidity map
* silhouette
* occlusion order
* dense flow hints

### 7.5 Intent Contracts

Used for smart tools that infer likely user intent from action history and gestures.

Outputs may include:

* predicted action type
* target mask
* protect masks
* confidence score
* patch prompt
* negative prompt
* recommended worker model

---

## 8. The Big System Split: Direct Visible Editing vs Ghost-Assisted Editing

There are two fundamental execution families.

### A. Direct Visible Editing

The model returns visible edited pixels.

Used for:

* local inpainting
* patch repair
* content replacement in crops
* simple one-shot edits

This is especially useful for Nano Banana 2.

### B. Ghost-Assisted Editing

The model returns hidden intelligence first.
The visible result is then built deterministically.

Used for:

* segmentation
* relighting
* depth blur
* material injection
* semantic frequency separation
* structural morphing
* refined local targeting

This is especially important for higher-value or high-precision tools.

---

## 9. The Three Edit Classes

All tools should be classified into one of three edit classes.

### Class A — Deterministic-Preserving

Original pixels are preserved whenever possible.
AI only provides structure.

Examples:

* segmentation
* recolor
* blur
* local relight
* material reparameterization
* structural warp
* selective retouch with texture preservation

This should be the default ideal.

### Class B — Hybrid Reconstructive

AI contributes visible pixels locally, but deterministic structure still governs the edit.

Examples:

* shadow completion
* reflection enhancement
* local object repair
* texture reconstruction
* glass effects with local synthesis

### Class C — Fully Generative

AI performs major visible repainting or major scene reinterpretation.

Examples:

* radical wardrobe transformation
* large scene changes
* full-style conversion
* major pose invention
* whole-image aesthetic reinterpretation

This class must be clearly labeled in the UI, because it crosses from editing into synthesis.

---

## 10. Nano Banana 2 vs Pro — Routing Doctrine

This routing logic should become product law.

### Route to Nano Banana 2 when:

* ROI is small
* task is local
* user expects immediate iteration
* edit is micro-corrective
* cost sensitivity matters
* failure is easy to retry
* output is likely a one-shot crop fix
* preview speed matters more than deepest reasoning

### Route to Nano Banana Pro when:

* semantics are hard
* object boundaries are ambiguous
* multiple regions or objects matter together
* the whole image must remain coherent
* text rendering matters
* style or lighting consistency matters globally
* the model must reason more deeply about composition
* a failed pass would be expensive or disruptive

### Escalation doctrine

* first try Nano Banana 2 for cheap, local, recoverable work
* escalate to Pro when confidence is low, artifacts persist, or composition-level reasoning is required
* for the largest global edits, Pro should often lead

---

## 11. Segmentation as a Flagship Tool

Segmentation is one of the most important tools in the system.
It is also one of the easiest to oversimplify.

The naive fantasy is:

1. tint the object
2. select the tint
3. extract the mask
4. done

Reality is harsher.

If the model-generated tint image differs in position, scale, topology, or contour from the original image even slightly, then the mask will not fit correctly.

This means the segmentation tint workflow must be treated as a **high-stakes spatial-lock problem**.

---

## 12. The Tint-Map Segmentation Method

Your proposed segmentation technique is excellent and should be formalized.

### Goal

Use a model to create a hidden or semi-hidden tint pass that labels objects or parts of objects while preserving the image underneath.
Then use deterministic/manual selection tools to isolate those tints and apply the resulting mask to the untouched original.

### Desired behavior

* object remains spatially locked to the original
* tint does not shift proportions
* tint can be semi-transparent so the user can inspect alignment
* multiple objects can be labeled with distinct colors
* the user can refine manually if needed
* the final mask is applied to the untinted source image

### Why this is powerful

Because the model is not asked to create the final isolated object.
It is only asked to **reveal where the object is**.

That is a much more reliable job—if controlled properly.

---

## 13. Why Segmentation Tinting Is Harder Than It Looks

The segmentation tint method fails if any of the following occur:

* contour drift
* local scale drift
* edge softening in the wrong places
* missing regions
* incorrect transparency handling
* internal holes not preserved correctly
* ambiguous overlap ordering
* reflection or shadow being treated as object
* hair/fur/glass edges being mishandled
* global warping from the model

Therefore, this tool cannot simply be “prompt the AI and hope.”

It needs:

* dynamic prompting
* strong spatial lock language
* ROI-specific processing
* validation
* confidence estimation
* optional manual correction
* deterministic post-processing

---

## 14. The Segmentation Pipeline

### Step 1 — Intent

The user requests segmentation through:

* chat
* lasso
* click
* semantic command
* selection wand
* brush-driven region hint

### Step 2 — Contract Planning

The system determines whether this is:

* single-object segmentation
* multi-object segmentation
* part segmentation
* transparent-edge segmentation
* portrait-part segmentation
* semantic scene region segmentation

### Step 3 — Ghost Pass Generation

Use Pro-class or a chosen segmentation worker to generate:

* hard label map
* soft boundary map
* confidence map
* optional semi-transparent tint map for user inspection

### Step 4 — Validation

Check:

* edge adherence
* contour continuity
* object completeness
* leakage beyond ROI
* proportional lock to source
* uncertainty regions

### Step 5 — Deterministic Refinement

Refine with:

* graph cut
* matte refinement
* edge snap
* flood region cleanup
* hole preservation
* morphology operations
* user scribble correction

### Step 6 — User Reveal

If God Mode is enabled, show:

* tint map
* alpha matte
* trimap
* confidence

### Step 7 — Final Mask

Apply the final refined mask to the untouched original image.

---

## 15. Dynamic Prompting for Segmentation

The segmentation tool cannot rely on one static prompt.
It needs a dynamic prompt builder informed by visual analysis and context.

### Dynamic prompt inputs

* object class
* ROI type
* portrait vs product vs landscape
* transparency likelihood
* expected edge hardness
* recent user corrections
* prior failures on this image
* local complexity score
* overlap or occlusion likelihood

### Example segmentation prompt goals

* preserve exact object position
* preserve exact object proportions
* use only allowed tint colors
* avoid relighting or restyling
* no artistic interpretation
* maintain internal cutouts and holes
* respect fine boundary structure
* classify transparent or soft-edge zones separately

This tool should also have its own **AI Co-Pilot analysis phase** before running expensive passes.

---

## 16. The Visual Inspector / Prompt Calibrator

One of the strongest ideas in the system is a model that visually inspects the current image and adapts the prompt.

This should be formalized as:

# **The Visual Inspector**

The Visual Inspector is not the final editor.
It is a planning and calibration subsystem.

### Jobs of the Visual Inspector

* inspect ROI complexity
* identify likely object type
* assess whether Nano Banana 2 or Pro should be used
* propose a better utility prompt
* propose protected regions
* identify likely failure modes
* raise or lower model strength
* suggest extra context padding
* determine whether a segmentation pass needs a confidence companion map

### Example behavior

The user taps an eye area with Smart Heal active.
The Visual Inspector recognizes:

* this is a portrait
* ROI is upper eyelash region
* recent edit history suggests portrait cleanup
* likely intended action is eyelash repair
* nearby regions that must be protected: iris, sclera, eyebrow, eyelid contour

It then assembles the local patch prompt automatically.

---

## 17. Intent-Aware Microtools

A major system goal is to remove the need for the user to manually prompt tiny edits.

The user should often just:

* click
* tap
* circle
* brush
* lasso
* short stroke

and the system should infer the likely desired edit.

These are **Intent-Aware Microtools**.

### Examples

* Smart Heal
* Smart Eyelash Fix
* Smart Iris Restore
* Smart Blemish Tap
* Smart Lip Edge Cleanup
* Smart Flyaway Hair Heal
* Smart Dust Removal
* Smart Seam Repair
* Smart Reflection Cleanup

---

## 18. The Intent Scout / Patch Worker Split

Implicit editing should be separated into two internal roles.

### Intent Scout

Understands:

* image
* ROI
* gesture
* tool context
* recent history
* project mode
* likely user goal

Outputs:

* predicted action
* target region
* protect regions
* confidence
* patch prompt
* negative prompt
* escalation recommendation

### Patch Worker

Performs the actual local edit.
Usually:

* Nano Banana 2
* crop-based
* tightly bounded
* protected by masks and constraints

This split prevents the inference system from becoming a giant uncontrolled black box.

---

## 19. Smart Heal Protocol v1

This protocol defines how implicit local patch tools should work.

### 19.1 Input Packet

```ts
interface LocalEditContext {
  imageId: string;
  activeTool: 'smart_heal' | 'patch' | 'detail_fix' | 'reconstruct';
  roiMask: Mask;
  roiBounds: Rect;
  paddedCrop: ImageBitmap;
  fullImageProxy: ImageBitmap;
  gesture: {
    type: 'tap' | 'stroke' | 'lasso' | 'scribble';
    points: Vec2[];
    velocity: number;
    pressure?: number;
  };
  recentEdits: EditSummary[];
  sessionIntentDigest: SessionIntentDigest;
}
```

### 19.2 Intent Scout Output

```ts
interface IntentInference {
  predictedAction:
    | 'fix_eyelash'
    | 'remove_blemish'
    | 'clean_lip_edge'
    | 'restore_iris_detail'
    | 'remove_stray_hair'
    | 'heal_skin_patch'
    | 'repair_seam';
  targetRegion: Mask;
  protectedRegions: Mask[];
  prompt: string;
  negativePrompt: string;
  confidence: number;
  shouldAutoRun: boolean;
  recommendedModel: 'nano-banana-2' | 'nano-banana-pro';
}
```

### 19.3 Auto-Run Rules

Auto-run should only occur when:

* ROI is small
* operation is low-risk
* confidence is high
* protected region inference is strong
* the edit is reversible
* the model is unlikely to affect unrelated content

Otherwise, show suggestion chips instead of auto-running.

---

## 20. Session Intent Digest

The system should not dump the entire chat and project history into every micro-edit request.
That would be noisy, expensive, and dumb.

Instead, it should maintain a compact digest.

```ts
interface SessionIntentDigest {
  dominantMode: 'portrait_cleanup' | 'product_polish' | 'composite_repair' | 'beauty_retouch';
  recentTargets: string[];
  styleConstraints: string[];
  lastAcceptedActions: string[];
}
```

This is the memory payload that helps the Intent Scout behave intelligently without drowning in context.

---

## 21. The Local Patch Pipeline

For local corrective tools, the pipeline should be:

1. user acts with Smart Heal or related tool
2. system extracts ROI and padded crop
3. Intent Scout predicts likely action
4. target and protect masks are generated
5. Nano Banana 2 performs local patch edit
6. deterministic edge and seam compositor reinserts the result
7. user can undo instantly
8. the result updates the session history and intent digest

### Critical law

The local patch worker should not be free to silently rewrite surrounding regions beyond the allowed envelope.

---

## 22. Full-Image Finishing with Pro

A powerful composite workflow emerges from the model split.

### Example

* user performs many small local fixes with Nano Banana 2
* small segmentation and patch tools run repeatedly
* local geometry and detail are repaired incrementally
* then Nano Banana Pro performs a whole-image finishing pass

That finishing pass may:

* harmonize style
* rebalance lighting
* unify material appearance
* improve global composition
* elevate polish
* add brand-level aesthetic consistency

This means the workflow is not either/or.

It is:

# **many cheap local corrections + occasional deep global finishing**

That is a very strong product architecture.

---

## 23. Multi-Pass Canon

The editor should explicitly support multi-pass workflows.

### Draft → Good → Best

#### Draft

* fast preview
* Nano Banana 2
* lower resolution or tighter ROI
* high interactivity

#### Good

* stronger local pass
* more careful mask handling
* optional Pro escalation

#### Best

* full quality deterministic composite
* optional Pro finishing
* whole-image validation

This is especially important for keeping the interface responsive.

---

## 24. God Mode

Professionals need to see the machine’s hidden thinking products.

God Mode should reveal:

* tint maps
* trimaps
* alpha mattes
* confidence maps
* depth maps
* normal maps
* rigidity maps
* keypoints
* skeletons
* target masks
* protect masks
* model routing decisions
* edit provenance

Users should be able to paint directly on these hidden maps.

That is the difference between mysterious AI and controllable AI.

---

## 25. Validation Layer

Every important Ghost workflow needs a validator.

### Validator jobs

* edge adherence scoring
* contour continuity testing
* ROI leakage detection
* mask completeness checks
* topology sanity checks
* patch seam quality checks
* identity drift detection
* style inconsistency detection
* overlap conflict checks

No serious editing architecture should trust AI outputs blindly.

---

## 26. Deterministic Reinsertion Layer

When the worker returns a local patch, it must not simply be pasted back into the full image.

Reinsertion must handle:

* alpha masking
* seam blending
* gradient-domain blending
* texture continuity
* local color consistency
* edge preservation
* avoid haloing
* avoid patch-box visibility

This is one of the most important engineering layers in the whole system.

---

## 27. Why This Goes Beyond Photoshop

Photoshop has powerful deterministic tools but weak semantic understanding.
Naive AI editors have semantic understanding but poor deterministic discipline.

This system combines:

* semantic understanding
* structured utility outputs
* deterministic execution
* manual override
* chat-driven orchestration
* gesture-first invocation
* project memory
* local/global model routing

That combination is qualitatively different.

It creates a system that feels less like “prompting an image generator” and more like:

# **compiling editing intelligence into a precision graphics pipeline**

---

## 28. Integration with Existing Architecture

This Ghost Engine should not replace the existing PaT / AI Tools / Chat systems.
It should extend them.

### PaT becomes the invocation and execution grammar

* gesture invocation
* context invocation
* tool selection
* multi-pass graph execution
* memory-driven refinement

### AI Tools / ICE becomes the composition and visible control surface

* generate
* inpaint
* lighting
* instruct
* hidden Ghost contracts
* visual prompting and markups
* prompt analysis and quality checks

### AI Chat becomes the orchestration layer

* natural-language requests
* function sequencing
* explanations
* workflow automation
* suggestion generation
* project-state aware assistance

---

## 29. Architectural Upgrade Required: Execution Graphs

The existing prompt chaining idea is good, but Ghost Engine needs a stronger abstraction.

It needs **execution graphs**, not just prompt chains.

```ts
type PassKind =
  | 'INTENT_PARSE'
  | 'MAP_PLAN'
  | 'AI_UTILITY_PASS'
  | 'AI_PATCH_PASS'
  | 'MAP_REFINE'
  | 'DETERMINISTIC_RENDER'
  | 'VALIDATE'
  | 'USER_REVIEW'
  | 'COMPOSITE'
  | 'HISTORY_LOG';

type GhostMapKind =
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
  | 'KEYPOINTS'
  | 'SKELETON'
  | 'RIGIDITY'
  | 'FLOW'
  | 'OCCLUSION'
  | 'TEXT_PLANE';
```

This graph model is how the editor evolves from “tool plus prompt” into a full semantic runtime.

---

## 30. Initial Flagship Features

The first production-worthy Ghost Engine features should be:

### 1. Semantic Segment Wand

* tint-map / label-map based object extraction
* validation and manual refinement
* application to original image

### 2. Smart Heal

* implicit local patch editing
* Intent Scout + Nano Banana 2 worker
* protected-region patching

### 3. Phantom Relight

* depth/normal ghost maps
* deterministic lighting pass

### 4. Material Injector

* garment/object segmentation
* intrinsic decomposition hints
* deterministic material overlay

### 5. Structural Morph / Puppet Warp 2.0

* keypoint and rigidity ghost maps
* mesh or cage-based deterministic deformation

---

## 31. Testing Requirements

This architecture demands rigorous testing.

### Segmentation testing

* portrait subjects
* hair and fur
* glass and translucent objects
* overlapping objects
* shadows and reflections
* product edges
* text/logo regions
* low contrast regions
* motion blur cases

### Patch editing testing

* eyelashes
* blemishes
* seam repair
* dust removal
* lip edge cleanup
* iris restoration
* texture patching
* reflective surfaces

### Validation testing

* mask fit error
* edge leakage
* patch seam visibility
* global identity drift
* accidental neighbor modification
* repeated edit accumulation

This system should have a formal benchmark suite.

---

## 32. The User Experience Goal

The user should not feel like they are negotiating with a chatbot.

The user should feel like:

* tools understand context
* tiny edits happen without typing
* complex edits can still be deeply controlled
* hidden machine logic is inspectable
* AI is helping without stealing authorship
* the image is never casually destroyed

That experience is the real product victory.

---

## 33. Canonical Product Slogan for Internal Design

# **AI for understanding. Math for execution. Human for authority.**

That is the triangle.
That is the law.

---

## 34. Final Position

The future of serious AI image editing is not a giant prompt box.
It is not “generate and pray.”
It is not “let the model repaint everything because that seems easier.”

The future is:

* local and global model specialization
* hidden utility-map generation
* semantic-to-deterministic bridging
* intent-aware tools
* project memory
* validation
* deterministic reinsertion
* manual override through God Mode
* occasional Pro-level finishing passes

That system can plausibly move beyond both traditional editors and naive AI image tools.

That system is Ghost Engine.

---

## 35. Immediate Next Step

The next engineering move after this document is to formalize four production specs:

1. **Ghost Contract Schema**
2. **Smart Heal Protocol v1**
3. **Tint-Map Segmentation Protocol v1**
4. **Model Routing and Escalation Matrix**

Those four specs are defined below.

---

## 36. Ghost Contract Schema v1

The Ghost Contract is the core machine-readable planning object for Ghost Engine.
It declares what hidden intermediate intelligence must be produced before visible execution begins.

A Ghost Contract is not a prompt.
It is a structured editing requirement.

### 36.1 Goals of the Ghost Contract

A Ghost Contract exists to:

* define the hidden outputs required for a tool
* specify which model tier should be used
* constrain the scope of the inference
* guarantee spatial lock expectations
* specify whether deterministic preservation is required
* express validation requirements
* define whether the user must be allowed to inspect the results before commit

### 36.2 Core Schema

```ts
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

export type GhostModelTier =
  | 'NANO_BANANA_2'
  | 'NANO_BANANA_PRO'
  | 'AUTO';

export type GhostEditClass =
  | 'DETERMINISTIC_PRESERVING'
  | 'HYBRID_RECONSTRUCTIVE'
  | 'FULLY_GENERATIVE';

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
```

### 36.3 Validation Profile

```ts
export interface ValidationProfile {
  requireEdgeAdherence: boolean;
  requireTopologyCheck: boolean;
  requireLeakCheck: boolean;
  requireCompletenessCheck: boolean;
  requirePatchSeamCheck: boolean;
  requireIdentityDriftCheck: boolean;
  minimumConfidence?: number;
}
```

### 36.4 Routing Hints

```ts
export interface RoutingHints {
  expectedRoiScale?: 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE';
  complexity?: 'LOW' | 'MEDIUM' | 'HIGH';
  likelySubject?: 'PORTRAIT' | 'PRODUCT' | 'SCENE' | 'TEXT' | 'MIXED';
  likelyEdgeMode?: 'HARD' | 'SOFT' | 'TRANSLUCENT' | 'MIXED';
}
```

### 36.5 Canonical Ghost Contract Examples

#### Semantic Segment Wand

```ts
const segmentWandContract: GhostContract = {
  id: 'segment-wand-v1',
  tool: 'semantic_segment_wand',
  editClass: 'DETERMINISTIC_PRESERVING',
  requestedMaps: ['INSTANCE', 'TRIMAP', 'ALPHA', 'CONFIDENCE'],
  preferredModel: 'NANO_BANANA_PRO',
  allowEscalation: true,
  roiRequired: false,
  spatialLock: true,
  preserveSourcePixels: true,
  confidenceRequired: true,
  userReviewRequired: false,
  validationProfile: {
    requireEdgeAdherence: true,
    requireTopologyCheck: true,
    requireLeakCheck: true,
    requireCompletenessCheck: true,
    requirePatchSeamCheck: false,
    requireIdentityDriftCheck: false,
    minimumConfidence: 0.82,
  },
  routingHints: {
    expectedRoiScale: 'SMALL',
    complexity: 'HIGH',
    likelySubject: 'MIXED',
    likelyEdgeMode: 'MIXED',
  },
};
```

#### Smart Heal

```ts
const smartHealContract: GhostContract = {
  id: 'smart-heal-v1',
  tool: 'smart_heal',
  editClass: 'HYBRID_RECONSTRUCTIVE',
  requestedMaps: ['TARGET_MASK', 'PROTECT_MASK', 'CONFIDENCE'],
  preferredModel: 'NANO_BANANA_2',
  allowEscalation: true,
  roiRequired: true,
  spatialLock: true,
  preserveSourcePixels: false,
  confidenceRequired: true,
  userReviewRequired: false,
  validationProfile: {
    requireEdgeAdherence: false,
    requireTopologyCheck: false,
    requireLeakCheck: true,
    requireCompletenessCheck: false,
    requirePatchSeamCheck: true,
    requireIdentityDriftCheck: true,
    minimumConfidence: 0.86,
  },
  routingHints: {
    expectedRoiScale: 'MICRO',
    complexity: 'LOW',
    likelySubject: 'PORTRAIT',
    likelyEdgeMode: 'MIXED',
  },
};
```

### 36.6 Ghost Contract Law

Every Ghost Engine tool must compile to a Ghost Contract before invoking any model.

No production tool should call a model without first declaring:

* required hidden outputs
* preservation intent
* validation expectations
* routing preference

That law is what turns the system into an engineering platform instead of prompt chaos.

---

## 37. Tint-Map Segmentation Protocol v1

This protocol defines the production workflow for model-assisted tint-map segmentation.

### 37.1 Purpose

The purpose of this protocol is to use a model to produce spatially locked labeling guidance that can be converted into a precise segmentation mask for the original source image.

The goal is not to isolate the object directly with visible final pixels.
The goal is to produce a hidden or inspectable label field that deterministic tools can refine.

### 37.2 Core Rule

The tint-map output must remain topologically aligned with the original source.
If the generated tint image drifts in scale, contour, pose, perspective, or proportions, the segmentation pipeline is invalid.

### 37.3 Input Packet

```ts
export interface TintSegmentationRequest {
  imageId: string;
  sourceImage: ImageBitmap;
  roiMask?: Mask;
  userHint?: string; // e.g. 'segment jacket', 'grab face and hair'
  targetClasses?: string[];
  mode: 'SINGLE_OBJECT' | 'MULTI_OBJECT' | 'PART_SEGMENT';
  revealTintPreview: boolean;
  expectedEdgeMode?: 'HARD' | 'SOFT' | 'TRANSLUCENT' | 'MIXED';
}
```

### 37.4 Planning Phase

The planner should decide:

* which object or region classes are being targeted
* whether portrait-part segmentation is required
* whether transparency or fine edge structure is likely
* whether a full-image or ROI-bounded pass is safer
* whether Nano Banana Pro should lead immediately
* whether a second confidence pass is required

### 37.5 Ghost Outputs

A production segmentation run should produce at minimum:

* label map or tint map
* trimap
* confidence map

Optional outputs:

* alpha matte
* part map
* overlap map
* translucency hint map

### 37.6 Tint Policy

Tint maps should follow strict rules:

* only allowed class colors may be used
* image geometry must remain fixed
* the tint must not restyle or relight the image
* distinct objects must remain visually separable
* transparency handling must be explicit

### 37.7 Prompt Construction Rules

Dynamic prompt assembly should include:

* target class or semantic region
* allowed tint palette
* spatial lock requirement
* anti-restyling requirement
* hard/soft edge expectation
* ROI constraint if used
* fine detail emphasis when needed
* internal cutout preservation if relevant

### 37.8 Example Prompt Skeleton

```text
Create a technical tint-map utility pass for segmentation.
Preserve exact object positions, exact proportions, and exact contour alignment with the source image.
Do not relight, restyle, repaint, or reinterpret the scene.
Apply only the approved tint palette.
Render target object classes as semitransparent tint overlays while preserving 1:1 spatial alignment to the source.
Return separate uncertainty guidance for boundary regions.
```

### 37.9 Validation Phase

Segmentation tint outputs must be validated before conversion into a final mask.

Required tests:

* edge adherence score
* contour continuity check
* proportional lock test
* completeness test
* leakage test
* uncertainty clustering

### 37.10 Refinement Phase

After validation, refinement may include:

* graph cut refinement
* boundary snapping against original gradients
* matte cleanup
* morphology-based hole preservation
* scribble-based user correction
* uncertainty-targeted local reruns

### 37.11 God Mode Behavior

If God Mode is on, the user may inspect:

* tint map
* trimap
* confidence map
* refined alpha matte

The user may also:

* repaint class tint regions
* refine boundaries manually
* add or subtract uncertain regions
* force rerun inside a sub-ROI

### 37.12 Failure Handling

If validation fails, the system must not silently proceed.
It should choose one of the following:

* rerun with stronger prompt constraints
* rerun in tighter ROI mode
* escalate from Nano Banana 2 to Pro
* request manual hinting
* split multi-object segmentation into separate passes

### 37.13 Tint-Map Segmentation Law

The tint-map segmentation system exists to reveal object presence, not to fabricate object geometry.
If geometry is not preserved, the pass is invalid.

---

## 38. Smart Heal Protocol v1

This protocol defines the behavior of intent-aware, localized corrective editing tools.

### 38.1 Purpose

Smart Heal is designed to let the user perform small corrective edits without manually writing prompts.

The system should infer likely intent from:

* tool selection
* gesture shape
* ROI location
* local visual content
* recent accepted edits
* project/session intent digest

### 38.2 Core Internal Split

Smart Heal must always use two internal roles:

1. **Intent Scout**
2. **Patch Worker**

The Intent Scout decides what likely action the user means.
The Patch Worker performs the actual crop-based edit.

### 38.3 Input Packet

```ts
export interface LocalEditContext {
  imageId: string;
  activeTool: 'smart_heal' | 'patch' | 'detail_fix' | 'reconstruct';
  roiMask: Mask;
  roiBounds: Rect;
  paddedCrop: ImageBitmap;
  fullImageProxy: ImageBitmap;
  gesture: {
    type: 'tap' | 'stroke' | 'lasso' | 'scribble';
    points: Vec2[];
    velocity: number;
    pressure?: number;
  };
  recentEdits: EditSummary[];
  sessionIntentDigest: SessionIntentDigest;
}
```

### 38.4 Intent Scout Output

```ts
export interface IntentInference {
  predictedAction:
    | 'fix_eyelash'
    | 'remove_blemish'
    | 'clean_lip_edge'
    | 'restore_iris_detail'
    | 'remove_stray_hair'
    | 'heal_skin_patch'
    | 'repair_seam'
    | 'remove_dust'
    | 'repair_texture';
  targetRegion: Mask;
  protectedRegions: Mask[];
  prompt: string;
  negativePrompt: string;
  confidence: number;
  shouldAutoRun: boolean;
  recommendedModel: 'NANO_BANANA_2' | 'NANO_BANANA_PRO';
}
```

### 38.5 Session Intent Digest

```ts
export interface SessionIntentDigest {
  dominantMode:
    | 'PORTRAIT_CLEANUP'
    | 'PRODUCT_POLISH'
    | 'COMPOSITE_REPAIR'
    | 'BEAUTY_RETOUCH';
  recentTargets: string[];
  styleConstraints: string[];
  lastAcceptedActions: string[];
}
```

### 38.6 Auto-Run Policy

Smart Heal may auto-run only when all are true:

* ROI is micro or small
* predicted action is low-risk
* confidence passes threshold
* target region is clear
* protect masks are strong
* the operation is instantly undoable

Otherwise, the UI should show one-tap suggestion chips.

### 38.7 Canonical Smart Heal Actions

The first production action set should include:

* fix eyelash
* remove blemish
* clean lip edge
* restore iris detail
* remove flyaway hair
* repair seam
* remove dust
* repair local texture

### 38.8 Patch Worker Rules

The Patch Worker must be constrained by:

* target mask
* protect masks
* crop padding envelope
* edit strength limit
* preservation instructions
* local style continuity
* hard prohibition against unrelated surrounding changes

### 38.9 Deterministic Reinsertion

After patch generation, the result must go through reinsertion logic:

* edge blending
* seam analysis
* gradient-domain blending if needed
* local color continuity checks
* patch visibility checks

### 38.10 Escalation

Escalate from Nano Banana 2 to Pro when:

* confidence is low
* repeated patch retries fail
* identity drift is detected
* fine structures remain unstable
* the edit is semantically harder than expected

### 38.11 Smart Heal Law

Smart Heal should feel like a precise assistant tool, not a black-box beautification engine.
The system must not silently broaden a local correction into a larger aesthetic rewrite.

---

## 39. Model Routing and Escalation Matrix v1

This matrix defines how the system decides between Nano Banana 2, Nano Banana Pro, and hybrid workflows.

### 39.1 Routing Inputs

Routing decisions should consider:

* ROI size
* edit class
* semantic complexity
* required output type
* expected retry tolerance
* subject type
* edge difficulty
* history of recent failures
* whether global coherence matters

### 39.2 Routing Matrix

| Situation                             | Preferred Model            | Notes                                                      |
| ------------------------------------- | -------------------------- | ---------------------------------------------------------- |
| Tiny corrective patch                 | Nano Banana 2              | First choice for speed and low-cost iteration              |
| Small ROI structural cleanup          | Nano Banana 2              | Escalate if fine detail remains unstable                   |
| Portrait micro retouch                | Nano Banana 2              | Guard identity and protect eye/lip structures              |
| Complex segmentation                  | Nano Banana Pro            | Especially for ambiguous or multi-object scenes            |
| Part segmentation with fine edges     | Nano Banana Pro            | Hair, fur, lace, glass, translucent materials              |
| Global style or lighting finish       | Nano Banana Pro            | Whole-image coherence matters                              |
| Material reinterpretation             | Pro-led hybrid             | Pro for semantic decomposition, deterministic render after |
| Structural warp planning              | Pro-led hybrid             | Pro for keypoints/rigidity, deterministic warp executes    |
| Repeated failing local patch          | Escalate to Pro            | Trigger after configured retry count                       |
| Deterministic-only execution possible | No visible generative pass | Skip visible model output when Ghost maps suffice          |

### 39.3 Retry Logic

The routing system should support a disciplined retry ladder:

1. Nano Banana 2 local attempt
2. Nano Banana 2 tighter ROI or stronger protect masks
3. Nano Banana Pro localized attempt
4. Ghost-assisted deterministic alternative
5. User-guided correction or approval step

### 39.4 Whole-Image Finishing Pattern

A canonical high-end workflow is:

1. perform many local repairs with Nano Banana 2
2. run selective Ghost-assisted corrections
3. validate local consistency
4. run Nano Banana Pro whole-image finishing pass only when needed

This keeps cost and latency sane while preserving the option for premium final polish.

### 39.5 Confidence Threshold Guidance

Suggested initial thresholds:

* `0.90+` auto-run allowed for tiny low-risk Smart Heal actions
* `0.82+` segmentation acceptance if validator passes
* `0.75-0.82` show review UI or rerun locally
* `<0.75` escalate or request user guidance

These numbers are starting heuristics and must be tuned empirically.

### 39.6 Routing Law

Use the cheapest model that can do the job reliably, but never let cheap routing silently degrade structural correctness.

That means:

* Nano Banana 2 should dominate micro-edit workflows
* Nano Banana Pro should dominate hard semantics and whole-image polish
* deterministic systems should take over whenever visible AI output is unnecessary

---

## 40. Immediate Build Sequence

With the four production specs defined, the recommended implementation sequence is:

1. build Ghost Contract compiler
2. build Smart Heal Protocol v1
3. build tint-map segmentation pipeline
4. build validator subsystem
5. build deterministic reinsertion layer
6. build model routing and escalation controller
7. add God Mode inspection UI
8. add Pro finishing workflow

That is the first real engineering staircase for Ghost Engine.



# Ghost Engine Runtime and God Mode Specs v1

## Execution Graph Runtime Spec + God Mode / Inspector UI Spec

---

## 0. Purpose

This document defines the next engineering layer for Ghost Engine:

1. the **Execution Graph Runtime** that compiles editing intent into a deterministic, inspectable, multi-pass runtime
2. the **God Mode / Inspector UI** that exposes hidden Ghost buffers, routing decisions, validation states, and manual override tools

This document assumes the existence of:

* Ghost Contract Schema v1
* Smart Heal Protocol v1
* Tint-Map Segmentation Protocol v1
* Model Routing and Escalation Matrix v1

The purpose here is to define the runtime kernel and the visible control plane that turns Ghost Engine from architecture into a working editing system.

---

# PART A — EXECUTION GRAPH RUNTIME SPEC

---

## 1. Runtime Thesis

Ghost Engine should not execute tools as loose prompt calls.
It should execute them as **compiled graphs**.

A user action such as:

* “fix eyelashes”
* “segment the jacket”
* “blur the background”
* “make the shirt glossy red latex”
* “relight from upper left”

must be compiled into a graph of typed operations.

That graph is the canonical execution unit.

Each node in the graph should:

* declare its inputs
* declare its outputs
* declare whether its outputs are visible or hidden
* declare whether it is AI-driven or deterministic
* declare validation requirements
* declare rollback behavior
* emit provenance

The runtime exists to guarantee:

* reproducibility
* inspectability
* controllability
* routing discipline
* hidden buffer integrity
* safe retries
* incremental failure recovery

---

## 2. Execution Graph Law

Every Ghost Engine operation must be lowered into an **Execution Graph** before execution begins.

No production edit should run as an unstructured model call.

The graph is the runtime truth.

---

## 3. Core Concepts

### 3.1 Graph

A graph is a directed acyclic execution plan composed of typed nodes and typed buffers.

### 3.2 Node

A node is a single operation in the graph.

Examples:

* parse intent
* plan contract
* render tint map
* infer target mask
* validate edge adherence
* run graph cut
* run patch worker
* blend patch into source
* log provenance

### 3.3 Buffer

A buffer is any intermediate or final artifact consumed by other nodes.

Examples:

* ROI crop
* tint map
* trimap
* confidence map
* normal map
* keypoint set
* patch image
* validation report
* final composite

### 3.4 Scope

A graph may operate at:

* project scope
* image scope
* layer scope
* ROI scope
* sub-ROI scope

### 3.5 Session

A session contains:

* current image state
* user history
* session intent digest
* graph history
* model routing records
* review states

---

## 4. Node Taxonomy

All runtime nodes should belong to a formal node family.

```ts
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
```

### 4.1 Node Family Roles

#### INTENT_PARSE

Normalizes user instruction, gesture meaning, or tool intent.

#### CONTEXT_DIGEST

Builds or updates compact context used by later nodes.

#### CONTRACT_PLAN

Compiles request into Ghost Contract.

#### ROUTE_MODEL

Chooses Nano Banana 2, Pro, or deterministic-only pathway.

#### ROI_EXTRACT

Builds crop, mask, padding envelope, and proxy inputs.

#### AI_UTILITY_PASS

Produces hidden Ghost maps.

#### AI_PATCH_PASS

Produces visible local patch imagery.

#### DETERMINISTIC_REFINE

Improves masks, boundaries, or geometry.

#### DETERMINISTIC_RENDER

Applies math-based visible transform.

#### VALIDATE

Scores output quality or structural correctness.

#### REVIEW_GATE

Pauses graph for user approval or intervention.

#### COMPOSITE

Merges result into source image/layer state.

#### CACHE_WRITE

Stores reusable graph outputs.

#### HISTORY_LOG

Adds undo/redo history entries.

#### PROVENANCE_LOG

Writes model usage, prompts, buffers, graph IDs, routing, and validator results.

#### ESCALATE

Rewrites or re-routes graph after failure.

#### ABORT

Terminates graph cleanly.

---

## 5. Buffer Taxonomy

```ts
export type BufferKind =
  | 'SOURCE_IMAGE'
  | 'FULL_IMAGE_PROXY'
  | 'ROI_CROP'
  | 'ROI_MASK'
  | 'TARGET_MASK'
  | 'PROTECT_MASK'
  | 'TINT_MAP'
  | 'TRIMAP'
  | 'ALPHA_MATTE'
  | 'CONFIDENCE_MAP'
  | 'DEPTH_MAP'
  | 'NORMAL_MAP'
  | 'ALBEDO_MAP'
  | 'SHADING_MAP'
  | 'SPECULAR_MAP'
  | 'ROUGHNESS_MAP'
  | 'KEYPOINT_SET'
  | 'SKELETON_MAP'
  | 'RIGIDITY_MAP'
  | 'FLOW_MAP'
  | 'TEXT_PLANE_MAP'
  | 'PATCH_IMAGE'
  | 'PATCH_BLEND_MASK'
  | 'VALIDATION_REPORT'
  | 'ROUTING_DECISION'
  | 'PROVENANCE_RECORD'
  | 'FINAL_COMPOSITE';
```

### 5.1 Buffer Visibility

```ts
export type BufferVisibility =
  | 'USER_VISIBLE'
  | 'GHOST_HIDDEN'
  | 'GOD_MODE_VISIBLE'
  | 'INTERNAL_ONLY';
```

### 5.2 Buffer Lifetimes

```ts
export type BufferLifetime =
  | 'FRAME'
  | 'GRAPH'
  | 'SESSION'
  | 'PERSISTED';
```

### 5.3 Buffer Rules

Every buffer must declare:

* kind
* owner node
* visibility
* lifetime
* dimensionality
* coordinate space
* whether user paint/edit is allowed

---

## 6. Core Graph Types

### 6.1 Base Runtime Graph

```ts
export interface ExecutionGraph {
  id: string;
  graphType:
    | 'SMART_HEAL'
    | 'SEGMENTATION'
    | 'RELIGHT'
    | 'MATERIAL_INJECTION'
    | 'STRUCTURAL_MORPH'
    | 'GLOBAL_FINISH'
    | 'CUSTOM';
  imageId: string;
  rootIntent: string;
  nodes: RuntimeNode[];
  edges: RuntimeEdge[];
  status: GraphStatus;
  reviewState?: ReviewState;
  metrics: GraphMetrics;
}
```

### 6.2 Runtime Node

```ts
export interface RuntimeNode {
  id: string;
  kind: RuntimeNodeKind;
  label: string;
  inputs: string[];
  outputs: string[];
  config: Record<string, unknown>;
  retryPolicy?: RetryPolicy;
  validatorHooks?: string[];
  onFailure?: FailureAction;
}
```

### 6.3 Runtime Edge

```ts
export interface RuntimeEdge {
  fromNode: string;
  toNode: string;
  bufferId: string;
}
```

### 6.4 Graph Status

```ts
export type GraphStatus =
  | 'PLANNED'
  | 'RUNNING'
  | 'WAITING_REVIEW'
  | 'RETRYING'
  | 'ESCALATED'
  | 'COMPLETED'
  | 'FAILED'
  | 'ABORTED';
```

---

## 7. Coordinate Spaces

A major source of errors in image systems is mismatched coordinate spaces.

Ghost Engine must explicitly support:

* full-image coordinates
* ROI coordinates
* crop-local coordinates
* layer-local coordinates
* display viewport coordinates

Every mask, patch, and map must declare its coordinate space.

### Coordinate Law

No buffer may be composited or painted into another buffer without explicit coordinate resolution.

This matters especially for:

* tint-map segmentation
* local patch reinsertion
* God Mode painting
* keypoint overlays
* review annotations

---

## 8. Execution Stages

Every graph should run through the same high-level stages.

### Stage 1 — Parse

Interpret user action into a normalized intent.

### Stage 2 — Plan

Compile Ghost Contract and choose graph skeleton.

### Stage 3 — Route

Choose model tier and execution path.

### Stage 4 — Extract

Prepare ROI crops, masks, and context digests.

### Stage 5 — Infer

Run AI utility or patch nodes.

### Stage 6 — Refine

Run deterministic cleanup/refinement.

### Stage 7 — Validate

Check structural correctness and quality.

### Stage 8 — Review

Pause for user approval if required.

### Stage 9 — Composite

Apply result into image state.

### Stage 10 — Persist

Write history, cache, and provenance.

---

## 9. Retry Policy and Escalation

Every node that can fail must declare a retry policy.

```ts
export interface RetryPolicy {
  maxAttempts: number;
  strategy:
    | 'RETRY_SAME'
    | 'RETRY_TIGHTER_ROI'
    | 'RETRY_STRONGER_PROMPT'
    | 'ESCALATE_MODEL'
    | 'REQUIRE_REVIEW';
}
```

### 9.1 Retry Ladder Law

The runtime should prefer the cheapest valid retry first.

Example retry ladder for Smart Heal:

1. same model, stronger protect mask
2. same model, tighter crop and padding adjustment
3. rerun with stricter prompt/calibration
4. escalate from Nano Banana 2 to Pro
5. surface review UI

Example retry ladder for segmentation:

1. rerun utility pass in tighter ROI
2. request stronger edge-mode prompt
3. split multi-object request into separate graphs
4. escalate to Pro
5. require user scribble or review

---

## 10. Validation Framework

Validation is not an optional side module.
It is part of the graph.

### 10.1 Validation Report

```ts
export interface ValidationReport {
  graphId: string;
  nodeId: string;
  passed: boolean;
  confidenceScore?: number;
  tests: ValidationTestResult[];
  recommendedAction:
    | 'ACCEPT'
    | 'RETRY'
    | 'ESCALATE'
    | 'REVIEW'
    | 'ABORT';
}
```

### 10.2 Validation Test Result

```ts
export interface ValidationTestResult {
  name: string;
  passed: boolean;
  score?: number;
  details?: string;
}
```

### 10.3 Validator Families

Ghost Engine should initially support validators for:

* edge adherence
* ROI leakage
* completeness
* contour continuity
* patch seam visibility
* identity drift
* style drift
* mask topology sanity
* alignment to source
* confidence threshold acceptance

### 10.4 Validation Law

No graph may write a visible result into the image state without either:

* passing validators, or
* crossing a Review Gate with user approval

---

## 11. Review Gate

A Review Gate is a runtime checkpoint where the graph pauses and surfaces relevant evidence to the user.

### Review Gate uses

* low-confidence segmentation
* unstable micro patch
* visible seam risk
* large or irreversible global finish
* user-enabled confirm mode

### Review Gate payload

The gate should surface:

* the proposed result
* the relevant hidden maps
* the validation report
* the routing decision
* available retry options

### Review Gate actions

* accept
* reject
* rerun
* escalate
* refine with brush
* restrict ROI

---

## 12. Buffer Registry

The runtime needs a central registry for hidden and visible buffers.

### 12.1 Registry Goals

* unique IDs for buffers
* ownership tracking
* visibility control
* memory cleanup
* God Mode lookup
* coordinate mapping
* user-editable flag

### 12.2 Registry Schema

```ts
export interface BufferRecord {
  id: string;
  kind: BufferKind;
  ownerNodeId: string;
  visibility: BufferVisibility;
  lifetime: BufferLifetime;
  width?: number;
  height?: number;
  coordinateSpace: 'FULL' | 'ROI' | 'CROP' | 'LAYER' | 'VIEWPORT';
  userEditable: boolean;
  metadata?: Record<string, unknown>;
}
```

### 12.3 Registry Law

No UI system may inspect or mutate a Ghost buffer without going through the Buffer Registry.

This prevents hidden state from becoming inconsistent chaos.

---

## 13. Provenance Graph

Ghost Engine needs persistent traceability.

### 13.1 Provenance must capture

* graph ID
* image ID
* user intent summary
* contract ID
* model decisions
* utility prompts
* worker prompts
* routing changes
* retry history
* validator results
* review approvals
* final composite hashes

### 13.2 Provenance Schema

```ts
export interface ProvenanceRecord {
  graphId: string;
  imageId: string;
  contractId?: string;
  nodesRun: string[];
  modelCalls: ModelCallRecord[];
  retries: RetryEvent[];
  validationReports: string[];
  reviewEvents: ReviewEvent[];
  finalOutputs: string[];
}
```

This is essential for:

* undo/redo
* debugging
* auditing
* collaboration
* quality tuning
* benchmark generation

---

## 14. Cache Strategy

Ghost Engine should aggressively cache re-usable hidden outputs.

### Good cache candidates

* full-image proxy
* face region masks
* depth maps
* normal maps
* segmentation class maps
* session intent digests
* routing hints

### Cache invalidation triggers

* image content changed in relevant region
* layer visibility changed
* crop coordinates changed significantly
* user manually edited a dependent Ghost buffer
* model version changed

---

## 15. Example Runtime Graphs

### 15.1 Smart Heal Graph

```text
INTENT_PARSE
  -> CONTEXT_DIGEST
  -> CONTRACT_PLAN
  -> ROUTE_MODEL
  -> ROI_EXTRACT
  -> AI_UTILITY_PASS (target/protect)
  -> AI_PATCH_PASS
  -> VALIDATE (seam + drift)
  -> COMPOSITE
  -> HISTORY_LOG
  -> PROVENANCE_LOG
```

### 15.2 Segmentation Graph

```text
INTENT_PARSE
  -> CONTRACT_PLAN
  -> ROUTE_MODEL
  -> ROI_EXTRACT
  -> AI_UTILITY_PASS (tint/trimap/confidence)
  -> VALIDATE (alignment/leak/completeness)
  -> DETERMINISTIC_REFINE
  -> REVIEW_GATE? (optional)
  -> COMPOSITE (mask only)
  -> HISTORY_LOG
  -> PROVENANCE_LOG
```

### 15.3 Relight Graph

```text
INTENT_PARSE
  -> CONTRACT_PLAN
  -> ROUTE_MODEL
  -> ROI_EXTRACT or FULL_PROXY
  -> AI_UTILITY_PASS (depth/normals/material hints)
  -> VALIDATE
  -> DETERMINISTIC_RENDER
  -> REVIEW_GATE? (optional)
  -> COMPOSITE
  -> HISTORY_LOG
  -> PROVENANCE_LOG
```

---

## 16. Runtime API Surface

The runtime should expose a narrow orchestration API.

```ts
export interface GhostRuntime {
  compile(request: ToolInvocation): ExecutionGraph;
  run(graphId: string): Promise<GraphStatus>;
  inspect(graphId: string): GraphInspection;
  retry(graphId: string, strategy?: RetryOverride): Promise<GraphStatus>;
  review(graphId: string, decision: ReviewDecision): Promise<GraphStatus>;
  abort(graphId: string): Promise<void>;
}
```

This separation helps preserve architectural sanity.

---

## 17. Failure Philosophy

A failed graph should fail **safely and locally**.

It should not:

* silently broaden the edit
* silently switch to fully generative mode
* overwrite the source image state without review
* discard hidden buffers needed for debugging

The runtime should always preserve enough state for:

* rerun
* escalation
* manual recovery
* audit

---

## 18. Runtime Milestone A

The first implementation milestone for the runtime should support only:

* Smart Heal graph
* Segmentation graph
* validator framework
* review gate
* provenance logging
* buffer registry

That is enough to prove the architecture.

---

# PART B — GOD MODE / INSPECTOR UI SPEC

---

## 19. UI Thesis

Professionals should never be forced to trust invisible AI machinery blindly.

Ghost Engine therefore requires a visible control plane called:

# **God Mode**

God Mode is the system that lets users reveal, inspect, understand, correct, and override the hidden state of Ghost Engine.

It is not a debug toy.
It is a first-class professional interface.

---

## 20. God Mode Goals

God Mode exists to:

* reveal hidden Ghost buffers
* expose routing decisions
  n- expose validator results
* show graph stage progress
* enable manual correction of hidden maps
* let the user drive retries and escalation
* eliminate black-box discomfort
* turn AI editing into a controllable pipeline

---

## 21. Core UI Regions

The God Mode UI should consist of five major regions.

### 21.1 Main Canvas Overlay

Shows:

* active visible image
* overlayed Ghost buffers
* graph annotations
* validator highlights
* manual brush interactions on hidden maps

### 21.2 Inspector Panel

Shows selected buffer or node details:

* node kind
* model used
* prompt role
* validation status
* coordinate space
* confidence score
* retry options

### 21.3 Graph Timeline / Node Rail

Shows the live graph chain:

* parse
* plan
* route
* infer
* refine
* validate
* review
* composite
* persist

This lets the user see exactly where the operation is.

### 21.4 Buffer Stack Panel

Shows all graph buffers:

* source
* ROI crop
* tint map
* trimap
* confidence
* patch
* validation report
* final composite

### 21.5 Action Dock

Shows controls:

* accept
* reject
* rerun
* escalate
* reveal/hide buffer
* brush refine
* paint confidence
* lock region
* restrict ROI

---

## 22. God Mode Visibility States

God Mode should support three levels.

### Level 0 — Off

User sees only normal polished tool UX.

### Level 1 — Reveal

User can inspect hidden maps and routing decisions.

### Level 2 — Edit

User can paint on Ghost buffers and steer retries.

### Level 3 — Full Engineer

User can inspect node configs, validation internals, routing ladders, and provenance chains.

This tiering prevents overwhelming casual users while preserving absolute power for expert workflows.

---

## 23. Buffer Viewing Modes

Every viewable Ghost buffer should support multiple display modes.

### Modes

* overlay
* split view
* side-by-side
* difference view
* heatmap view
* contour-only view
* alpha-only view

### Example

A segmentation run could be inspected as:

* source image + semitransparent tint map overlay
* confidence heatmap side-by-side
* trimap in contour mode
* final alpha matte in split view

This is critical for fast diagnosis.

---

## 24. Manual Editing of Ghost Buffers

This is one of the most important capabilities in the whole system.

The user must be able to directly edit selected Ghost buffers.

### Editable buffers should include:

* tint maps
* trimaps
* alpha mattes
* target masks
* protect masks
* confidence maps
* rigidity maps
* depth maps (in advanced mode)

### Editing tools should include:

* add/subtract brush
* confidence brush
* soften/harden edge
* fill island
* erase leakage
* region lock
* force class color
* paint uncertainty

### Editing Law

Manual edits to Ghost buffers must be tracked as first-class provenance events.

---

## 25. Inspector Panel Detail Model

```ts
export interface InspectorSelection {
  selectedType: 'NODE' | 'BUFFER' | 'VALIDATION_REPORT' | 'PROVENANCE_RECORD';
  selectedId: string;
}
```

### If a node is selected, show:

* node ID
* node kind
* status
* model used
* config summary
* inputs
* outputs
* retry policy
* failure history

### If a buffer is selected, show:

* buffer kind
* owner node
* visibility
* lifetime
* coordinate space
* resolution
* editable status
* dependent nodes

### If a validation report is selected, show:

* all tests
* pass/fail state
* numeric scores
* recommended action

---

## 26. Review Gate UI

When the runtime enters a Review Gate, the UI should switch to a focused decision layout.

### Review Gate layout should show:

* original vs proposed result
* relevant hidden maps
* validation summary
* why the graph paused
* available actions

### Review actions

* accept
* reject
* rerun same
* rerun tighter ROI
* escalate model
* refine manually
* convert to explicit prompt flow

This turns uncertainty into a controlled editing moment.

---

## 27. Validation Visualization

Validator results should be visible, not buried in logs.

### Examples

* red glow where mask leaks outside ROI
* yellow outline where confidence is low
* seam heatmap on local patch boundaries
* contour mismatch overlay for segmentation drift
* identity drift warning if portrait patch alters structure

This is extremely useful both for professional trust and internal debugging.

---

## 28. Routing Visibility

Users in God Mode should be able to see why a given model was chosen.

### Routing panel should show:

* selected model tier
* reason for route
* whether escalation was available
* whether escalation occurred
* current retry ladder step
* cost/latency hint

This matters because the whole product rests on smart model specialization.

---

## 29. Provenance UI

God Mode should expose graph history and provenance chains.

### Provenance timeline should show:

* graph created
* route selected
* utility pass run
* validator failed or passed
* user edited trimap
* graph rerun
* final composite committed

This becomes the forensic memory of the image.

---

## 30. Suggested UI States by Tool

### 30.1 Smart Heal

Default God Mode UI should show:

* ROI crop
* target mask
* protect mask
* patch seam heatmap
* identity drift indicator

### 30.2 Segmentation

Default God Mode UI should show:

* tint map
* trimap
* confidence map
* final alpha
* contour mismatch overlay

### 30.3 Relight

Default God Mode UI should show:

* depth map
* normal map
* light vector overlay
* material-class mask
* relight preview layers

### 30.4 Structural Morph

Default God Mode UI should show:

* keypoints
* skeleton
* rigidity map
* occlusion ordering
* warp mesh overlay

---

## 31. Interaction Model

God Mode should feel direct and low-friction.

### Interaction principles

* single-click buffer reveal
* instant overlay toggle
* paint directly on hidden map
* keyboard shortcuts for buffer cycling
* hover reveals source-to-buffer relationships
* direct rerun from selected node
* direct escalate from selected node

This should feel more like a pro graphics debugger than a buried developer console.

---

## 32. Performance Strategy for UI

God Mode must not destroy interactivity.

### Performance laws

* render overlay proxies when possible
* lazily decode heavy buffers
* keep full-resolution versions available on demand
* stream node state incrementally
* only compute expensive visualizations when visible

This matters because Ghost Engine will already be running hidden work in the background.

---

## 33. Safety and Source Preservation UX

God Mode should make it impossible to forget whether the user is still in a source-preserving workflow or a generative rewrite workflow.

### Required visible indicators

* deterministic-preserving badge
* hybrid reconstructive badge
* fully generative badge
* source-lock icon
* review-required icon

These cues matter for trust.

---

## 34. Minimal Buildable God Mode v1

The first buildable version of God Mode should support:

* reveal tint map
* reveal trimap
* reveal confidence map
* reveal target/protect masks
* display validation summary
* rerun/escalate buttons
* paint add/subtract on masks
* provenance timeline basics

That is enough to make Ghost Engine feel inspectable and professional.

---

## 35. Full Build Sequence After Runtime Milestone A

After Runtime Milestone A, the recommended sequence is:

1. build Buffer Stack panel
2. build Node Rail / Graph Timeline
3. build Inspector panel
4. build mask editing tools
5. build Review Gate UI
6. build routing visibility panel
7. build provenance timeline
8. build advanced overlay modes

---

## 36. Final Law of God Mode

God Mode exists because serious users do not want magic.
They want **power with visibility**.

The hidden machinery of Ghost Engine should therefore be:

* invisible by default
* revealable on demand
* editable when needed
* preserved in provenance
* routed through explicit runtime structures

That is how the system becomes trustworthy.

---

## 37. Closing Position

Part A and Part B together define the real operating core of Ghost Engine.

* Part A gives Ghost Engine a runtime kernel
* Part B gives Ghost Engine an expert-facing control surface

Together they transform the system from an interesting theory into a plausible professional platform.

The next engineering document after this should be:

# **Ghost Engine Data Model and State Synchronization Spec**

That next spec should define:

* project state
* image state
* layer state
* graph state
* buffer state
* review state
* provenance state
* undo/redo coupling
* sync between normal UI and God Mode UI
