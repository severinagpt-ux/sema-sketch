import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type {
  VisualAnalysis,
  IntentInference,
  ExecutionGraph,
  RuntimeNode,
  GhostBuffer,
  GodModeLevel,
  RoutingDecision,
  SessionIntentDigest,
  SmartHealAction,
} from '@/lib/ghostEngine/types';
import { routeModel } from '@/lib/ghostEngine/routing';
import { SMART_HEAL_CONTRACT, ALL_CONTRACTS } from '@/lib/ghostEngine/contracts';

export function useGhostEngine() {
  const [analysis, setAnalysis] = useState<VisualAnalysis | null>(null);
  const [intent, setIntent] = useState<IntentInference | null>(null);
  const [currentGraph, setCurrentGraph] = useState<ExecutionGraph | null>(null);
  const [buffers, setBuffers] = useState<GhostBuffer[]>([]);
  const [godMode, setGodMode] = useState<GodModeLevel>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [healedImage, setHealedImage] = useState<string | null>(null);
  const [finishedImage, setFinishedImage] = useState<string | null>(null);

  const [sessionDigest, setSessionDigest] = useState<SessionIntentDigest>({
    dominantMode: 'PORTRAIT_CLEANUP',
    recentTargets: [],
    styleConstraints: [],
    lastAcceptedActions: [],
  });

  // ─── Visual Inspector ──────────────────────────────────────────
  const analyzeImage = useCallback(async (imageUrl: string, tool?: string, roi?: string) => {
    setIsAnalyzing(true);
    const graphId = `graph-${Date.now()}`;
    
    const graph: ExecutionGraph = {
      id: graphId,
      graphType: 'VISUAL_ANALYSIS',
      rootIntent: 'Analyze image for editing intelligence',
      nodes: [
        { id: 'n1', kind: 'INTENT_PARSE', label: 'Parse Request', status: 'COMPLETED', inputs: [], outputs: ['intent'] },
        { id: 'n2', kind: 'AI_UTILITY_PASS', label: 'Visual Analysis', status: 'RUNNING', inputs: ['intent'], outputs: ['analysis'] },
        { id: 'n3', kind: 'ROUTE_MODEL', label: 'Route Decision', status: 'PENDING', inputs: ['analysis'], outputs: ['routing'] },
      ],
      status: 'RUNNING',
      createdAt: Date.now(),
    };
    setCurrentGraph(graph);

    try {
      const { data, error } = await supabase.functions.invoke('ghost-visual-inspector', {
        body: { imageUrl, tool, roiDescription: roi, sessionDigest },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAnalysis(data as VisualAnalysis);

      // Update graph
      graph.nodes[1].status = 'COMPLETED';
      graph.nodes[2].status = 'COMPLETED';
      graph.status = 'COMPLETED';
      graph.completedAt = Date.now();
      graph.routingDecision = {
        selectedModel: data.routingRecommendation || 'NANO_BANANA_2',
        reason: `Analysis complexity: ${data.complexityScore}`,
        escalationAvailable: true,
        retryLadderStep: 0,
        costHint: data.complexityScore > 70 ? 'HIGH' : 'LOW',
      };
      setCurrentGraph({ ...graph });

      toast.success('Visual analysis complete');
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Analysis failed');
      graph.status = 'FAILED';
      setCurrentGraph({ ...graph });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [sessionDigest]);

  // ─── Intent Scout ──────────────────────────────────────────────
  const inferIntent = useCallback(async (imageUrl: string, roi?: string, hint?: string) => {
    setIsHealing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ghost-smart-heal', {
        body: { imageUrl, roiDescription: roi, prompt: hint, editMode: 'intent_scout' },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const intentData = data as IntentInference & { phase: string };
      setIntent(intentData);
      toast.info(`Intent: ${intentData.predictedAction} (${Math.round(intentData.confidence * 100)}%)`);
      return intentData;
    } catch (err: any) {
      toast.error(err.message || 'Intent inference failed');
      return null;
    } finally {
      setIsHealing(false);
    }
  }, []);

  // ─── Smart Heal (Patch Worker) ─────────────────────────────────
  const smartHeal = useCallback(async (
    imageUrl: string,
    action: SmartHealAction,
    options?: { roi?: string; prompt?: string; modelTier?: string }
  ) => {
    setIsHealing(true);
    const contract = SMART_HEAL_CONTRACT;
    const routing = routeModel({
      editClass: contract.editClass,
      hints: contract.routingHints,
      retryCount: 0,
      previousFailures: 0,
    });

    const graph: ExecutionGraph = {
      id: `heal-${Date.now()}`,
      graphType: 'SMART_HEAL',
      rootIntent: `Smart Heal: ${action}`,
      nodes: [
        { id: 'h1', kind: 'INTENT_PARSE', label: 'Parse Intent', status: 'COMPLETED', inputs: [], outputs: ['intent'] },
        { id: 'h2', kind: 'CONTRACT_PLAN', label: 'Plan Contract', status: 'COMPLETED', inputs: ['intent'], outputs: ['contract'] },
        { id: 'h3', kind: 'ROUTE_MODEL', label: 'Route Model', status: 'COMPLETED', inputs: ['contract'], outputs: ['routing'] },
        { id: 'h4', kind: 'AI_PATCH_PASS', label: 'Patch Worker', status: 'RUNNING', inputs: ['routing'], outputs: ['patch'] },
        { id: 'h5', kind: 'VALIDATE', label: 'Validate', status: 'PENDING', inputs: ['patch'], outputs: ['report'] },
        { id: 'h6', kind: 'COMPOSITE', label: 'Composite', status: 'PENDING', inputs: ['report'], outputs: ['final'] },
      ],
      status: 'RUNNING',
      routingDecision: routing,
      createdAt: Date.now(),
    };
    setCurrentGraph(graph);

    try {
      const { data, error } = await supabase.functions.invoke('ghost-smart-heal', {
        body: {
          imageUrl,
          action,
          roiDescription: options?.roi,
          prompt: options?.prompt,
          modelTier: options?.modelTier || routing.selectedModel,
          editMode: 'patch',
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data.imageUrl) {
        setHealedImage(data.imageUrl);
        setBuffers(prev => [...prev, {
          id: `buf-patch-${Date.now()}`,
          kind: 'PATCH_IMAGE',
          visibility: 'USER_VISIBLE',
          imageData: data.imageUrl,
          ownerNodeId: 'h4',
          userEditable: false,
        }]);
      }

      // Update graph
      graph.nodes[3].status = 'COMPLETED';
      graph.nodes[4].status = 'COMPLETED';
      graph.nodes[5].status = 'COMPLETED';
      graph.status = 'COMPLETED';
      graph.completedAt = Date.now();
      setCurrentGraph({ ...graph });

      // Update session digest
      setSessionDigest(prev => ({
        ...prev,
        lastAcceptedActions: [action, ...prev.lastAcceptedActions].slice(0, 5),
        recentTargets: [options?.roi || action, ...prev.recentTargets].slice(0, 5),
      }));

      toast.success(`Smart Heal complete: ${action}`);
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Smart Heal failed');
      graph.status = 'FAILED';
      setCurrentGraph({ ...graph });
      return null;
    } finally {
      setIsHealing(false);
    }
  }, []);

  // ─── Global Finish (Pro) ───────────────────────────────────────
  const globalFinish = useCallback(async (
    imageUrl: string,
    finishType: string,
    options?: { style?: string; intensity?: string; prompt?: string }
  ) => {
    setIsFinishing(true);
    const graph: ExecutionGraph = {
      id: `finish-${Date.now()}`,
      graphType: 'GLOBAL_FINISH',
      rootIntent: `Global Finish: ${finishType}`,
      nodes: [
        { id: 'f1', kind: 'INTENT_PARSE', label: 'Parse', status: 'COMPLETED', inputs: [], outputs: ['intent'] },
        { id: 'f2', kind: 'AI_UTILITY_PASS', label: 'Pro Finishing', status: 'RUNNING', inputs: ['intent'], outputs: ['result'] },
        { id: 'f3', kind: 'REVIEW_GATE', label: 'Review', status: 'PENDING', inputs: ['result'], outputs: ['approved'] },
      ],
      status: 'RUNNING',
      routingDecision: { selectedModel: 'NANO_BANANA_PRO', reason: 'Global finish requires Pro', escalationAvailable: false, retryLadderStep: 0, costHint: 'HIGH' },
      createdAt: Date.now(),
    };
    setCurrentGraph(graph);

    try {
      const { data, error } = await supabase.functions.invoke('ghost-global-finish', {
        body: { imageUrl, finishType, ...options },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data.imageUrl) {
        setFinishedImage(data.imageUrl);
      }

      graph.nodes[1].status = 'COMPLETED';
      graph.nodes[2].status = 'COMPLETED';
      graph.status = 'COMPLETED';
      graph.completedAt = Date.now();
      setCurrentGraph({ ...graph });

      toast.success(`Global finish complete: ${finishType}`);
      return data;
    } catch (err: any) {
      toast.error(err.message || 'Global finish failed');
      graph.status = 'FAILED';
      setCurrentGraph({ ...graph });
      return null;
    } finally {
      setIsFinishing(false);
    }
  }, []);

  return {
    // State
    analysis,
    intent,
    currentGraph,
    buffers,
    godMode,
    sessionDigest,
    healedImage,
    finishedImage,
    isAnalyzing,
    isHealing,
    isFinishing,
    
    // Actions
    analyzeImage,
    inferIntent,
    smartHeal,
    globalFinish,
    setGodMode,
    setSessionDigest,
    setHealedImage,
    setFinishedImage,
  };
}
