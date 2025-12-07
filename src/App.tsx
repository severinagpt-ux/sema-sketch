import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VideoEditor from "./pages/VideoEditor";
import AudioEditor from "./pages/AudioEditor";
import Storyboard from "./pages/Storyboard";
import Characters from "./pages/Characters";
import CharacterPackViewer from "./pages/CharacterPackViewer";
import Props from "./pages/Props";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster /> Temporarily disabled due to React context issue */}
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/video-editor" element={<VideoEditor />} />
          <Route path="/audio-editor" element={<AudioEditor />} />
          <Route path="/storyboard" element={<Storyboard />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/:characterId/pack" element={<CharacterPackViewer />} />
          <Route path="/props" element={<Props />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
