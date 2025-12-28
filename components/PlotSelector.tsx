
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Activity, ShieldCheck, AlertTriangle, Camera, Trash2, Loader2, ExternalLink, Video, RefreshCw } from 'lucide-react';
import { analyzeLandImage } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";

const PlotSelector: React.FC = () => {
  const [plotSize, setPlotSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video generation states
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeSimCrop, setActiveSimCrop] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);

  const reassuringMessages = [
    "Establishing neural growth patterns...",
    "Simulating seasonal precipitation cycle...",
    "Calculating vegetative emergence...",
    "Rendering biological time-lapse...",
    "Almost there! Finalizing crop visualization...",
    "Synthesizing your future harvest..."
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setInsights(null);
        setVideoUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async () => {
    if (!imagePreview) return;
    setIsLoading(true);
    setVideoUrl(null);
    try {
      const result = await analyzeLandImage(imagePreview, plotSize);
      setInsights(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      alert("Analysis failed. Please try a different image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = async (crop: any) => {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setShowKeyPrompt(true);
      return;
    }
    startVideoGeneration(crop);
  };

  const startVideoGeneration = async (crop: any) => {
    if (!imagePreview) return;
    setShowKeyPrompt(false);
    setIsVideoGenerating(true);
    setActiveSimCrop(crop.crop);
    setVideoUrl(null);

    let messageIndex = 0;
    setLoadingMessage(reassuringMessages[0]);
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % reassuringMessages.length;
      setLoadingMessage(reassuringMessages[messageIndex]);
    }, 5000);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = imagePreview.split(',')[1];
      
      // We pass the uploaded image as the 'image' property which acts as the first frame
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: crop.simPrompt || `A photorealistic high-definition cinematic time-lapse of ${crop.crop} crops growing healthily and flourishing from the soil shown in the image until they are ready for harvest. Golden hour lighting, high agricultural quality.`,
        image: {
          imageBytes: base64Data,
          mimeType: 'image/jpeg',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
      }
    } catch (err) {
      console.error("Video failed:", err);
      alert("Simulation failed. This feature requires a paid API key and credits.");
    } finally {
      clearInterval(messageInterval);
      setIsVideoGenerating(false);
    }
  };

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    if (activeSimCrop && insights) {
      const cropData = insights.recommendations.find((r: any) => r.crop === activeSimCrop);
      if (cropData) startVideoGeneration(cropData);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setInsights(null);
    setVideoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="space-y-6">
      {showKeyPrompt && (
        <div className="p-6 bg-slate-900 text-white rounded-3xl animate-in fade-in zoom-in duration-300 shadow-2xl">
          <h4 className="text-xl font-bold mb-2">Paid API Key Required for Video</h4>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            Generating custom photorealistic simulations requires a paid billing account. 
            Enable credits at <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-emerald-400 underline font-bold inline-flex items-center gap-1">ai.google.dev/billing <ExternalLink size={12} /></a>.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleSelectKey}
              className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              Select API Key
            </button>
            <button 
              onClick={() => setShowKeyPrompt(false)}
              className="px-8 py-3 rounded-2xl font-bold border border-slate-700 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Setup & Controls */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Camera size={20} className="text-emerald-600" />
            Land Scan
          </h2>
          <div className="space-y-6">
            <div 
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-6 transition-all cursor-pointer group flex flex-col items-center justify-center text-center
                ${imagePreview ? 'border-emerald-500/50 bg-emerald-50/10' : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30'}`}
            >
              {imagePreview ? (
                <div className="w-full space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-inner">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button onClick={clearImage} className="w-full py-2 px-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-all">
                    <Trash2 size={14} /> Clear Scan
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-100 transition-all">
                    <Upload size={28} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Upload Land Photo</p>
                  <p className="text-xs text-slate-500 mt-1">High-res samples provide better AI inference</p>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Plot Area</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={plotSize}
                  onChange={(e) => setPlotSize(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Acres</span>
              </div>
            </div>

            <button 
              onClick={handleAnalysis}
              disabled={isLoading || !imagePreview}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} />}
              {isLoading ? 'Scanning Assets...' : 'Analyze Visuals'}
            </button>
          </div>
        </div>

        {/* Right: Visualization & Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative bg-white rounded-3xl aspect-video overflow-hidden border border-slate-100 shadow-sm flex items-center justify-center group">
            {videoUrl ? (
              <div className="w-full h-full relative group">
                <video src={videoUrl} controls autoPlay className="w-full h-full object-cover" />
                <button 
                  onClick={() => setVideoUrl(null)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40"
                  title="Return to Scan"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            ) : isVideoGenerating ? (
              <div className="text-center p-12 z-10">
                <div className="relative inline-block mb-6">
                  <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                  <Video className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{loadingMessage}</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Creating a custom time-lapse growth simulation for <b>{activeSimCrop}</b> on your land.</p>
              </div>
            ) : imagePreview ? (
              <div className="relative w-full h-full">
                <img src={imagePreview} alt="Land View" className="w-full h-full object-cover" />
                {isLoading && (
                  <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm flex items-center justify-center flex-col text-white">
                    <div className="w-full max-w-md px-10">
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-emerald-400 animate-pulse w-full" />
                      </div>
                      <p className="text-center font-bold tracking-widest uppercase text-xs">Multi-Spectral Vision Processing...</p>
                    </div>
                  </div>
                )}
                {isLoading && (
                   <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="h-[2px] w-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
                   </div>
                )}
              </div>
            ) : (
              <div className="text-center p-10 max-w-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 border-2 border-dashed border-slate-200">
                  <ImageIcon size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Simulate Your Success</h3>
                <p className="text-slate-500">Upload a photo of your plot to begin. Our AI will analyze the terrain and visualize your future harvest.</p>
              </div>
            )}
            <style>{`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}</style>
          </div>

          {insights && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center gap-6 ${getHealthColor(insights.soilAnalysis.healthScore)}`}>
                <div className="p-4 bg-white rounded-2xl shadow-sm text-emerald-600">
                  <ShieldCheck size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-1">Visual Soil Health: {insights.soilAnalysis.healthScore}/100</h3>
                  <p className="text-sm font-medium opacity-90 italic">"{insights.soilAnalysis.visualObservations}"</p>
                </div>
                <div className="w-full md:w-64 h-3 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-current transition-all duration-1000" style={{ width: `${insights.soilAnalysis.healthScore}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-emerald-500" />
                    Inferred Attributes
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Soil Class</span>
                      <span className="text-slate-900 font-bold">{insights.soilAnalysis.type}</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Inferred pH</span>
                      <span className="text-slate-900 font-bold">{insights.soilAnalysis.ph}</span>
                    </div>
                    {Object.entries(insights.soilAnalysis.nutrients).map(([key, value]: any) => (
                      <div key={key} className="p-4 bg-slate-50 rounded-2xl">
                        <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">{key}</span>
                        <span className="text-slate-900 font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Video size={20} className="text-emerald-500" />
                    Virtual Simulations
                  </h3>
                  <div className="space-y-3">
                    {insights.recommendations.map((rec: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-lg">
                          {rec.crop[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{rec.crop}</p>
                          <p className="text-xs text-slate-500">{rec.growingSeason}</p>
                        </div>
                        <button 
                          onClick={() => handleGenerateVideo(rec)}
                          disabled={isVideoGenerating}
                          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
                        >
                          <Video size={14} /> Simulate
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlotSelector;
