
import React, { useState, useEffect } from 'react';
import { 
  Play, RotateCcw, Save, TrendingUp, DollarSign, Scale, Zap, 
  AlertCircle, Video, Loader2, ExternalLink, History, 
  CheckCircle2, Sprout, Info, BarChart3, Map as MapIcon,
  Maximize, Monitor, Smartphone, Sparkles, Wand2, 
  Film, PlayCircle, Layers, ChevronRight, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { runSimulation, fetchSimulationRecords, saveSimulationRecord } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";

const Simulator: React.FC = () => {
  const [crop, setCrop] = useState('Wheat');
  const [strategy, setStrategy] = useState('Organic');
  const [acres, setAcres] = useState(50);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [savedSimulations, setSavedSimulations] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Video generation states
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [customPrompt, setCustomPrompt] = useState("");
  const [activeStyle, setActiveStyle] = useState('Default');

  const reassuringMessages = [
    "Synthesizing climate variables...",
    "Modeling plant-soil interactions...",
    "Rendering biological time-lapse textures...",
    "Calculating vegetative emergence frames...",
    "Optimizing cinematic lighting...",
    "Simulating photosynthesis cycles...",
    "Finalizing your virtual harvest..."
  ];

  const defaultSimulationData = [
    { month: 'Month 1', cost: 1200, yield: 0 },
    { month: 'Month 2', cost: 800, yield: 0 },
    { month: 'Month 3', cost: 600, yield: 0 },
    { month: 'Month 4', cost: 900, yield: 4500 },
    { month: 'Month 5', cost: 400, yield: 8200 },
    { month: 'Month 6', cost: 1500, yield: 12000 },
  ];

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const records = await fetchSimulationRecords();
      setSavedSimulations(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleRun = async () => {
    setIsSimulating(true);
    setError(null);
    setVideoUrl(null);
    setSaveSuccess(false);
    try {
      const result = await runSimulation(crop, strategy, acres);
      setSimulationResult(result);
      setCustomPrompt(`Cinematic high-definition growth time-lapse of a healthy ${crop} farm field using ${strategy} farming methods. Landscape turning from lush green to golden harvest ready, shot on 35mm film, golden hour lighting, hyper-realistic agricultural details.`);
    } catch (err) {
      console.error("Simulation failed:", err);
      setError("Failed to generate simulation. Please check your API key.");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSave = async () => {
    if (!simulationResult) return;
    setIsSaving(true);
    setError(null);
    try {
      const record = {
        farm_id: `FARM-${Math.floor(Math.random() * 1000)}`,
        crop: simulationResult.crop,
        season: "Current Season",
        fertilizer_plan: simulationResult.strategy,
        estimated_yield: simulationResult.estimatedTotalYield,
        estimated_profit: simulationResult.totalProfit,
        investment: simulationResult.yieldData.reduce((acc: number, curr: any) => acc + curr.cost, 0),
        acres: acres
      };
      await saveSimulationRecord(record);
      setSaveSuccess(true);
      loadHistory();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save simulation record to database.");
    } finally {
      setIsSaving(false);
    }
  };

  const applyStyle = (style: string) => {
    setActiveStyle(style);
    let promptSuffix = "";
    switch(style) {
      case 'Drone': 
        promptSuffix = "Spectacular cinematic aerial drone shot sweeping over vast agricultural fields, high altitude, sweeping motion, professional cinematography.";
        break;
      case 'Macro':
        promptSuffix = "Extreme macro close-up time-lapse of ${crop} seeds sprouting and leaves expanding, shallow depth of field, detailed biological textures, soft natural lighting.";
        break;
      case 'National Geographic':
        promptSuffix = "Documentary style, vivid colors, deep contrast, highly detailed soil and plant textures, wide angle lens, professional photography.";
        break;
      default:
        promptSuffix = `Cinematic high-definition growth time-lapse of a healthy ${crop} farm field. Landscape turning from lush green to golden harvest, golden hour lighting.`;
    }
    setCustomPrompt(promptSuffix.replace("${crop}", crop));
  };

  const handleGenerateVideo = async () => {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setShowKeyPrompt(true);
      return;
    }
    startVideoGeneration();
  };

  const startVideoGeneration = async () => {
    setShowKeyPrompt(false);
    setIsVideoGenerating(true);
    setError(null);
    let messageIndex = 0;
    setLoadingMessage(reassuringMessages[0]);

    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % reassuringMessages.length;
      setLoadingMessage(reassuringMessages[messageIndex]);
    }, 5000);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: customPrompt || `Cinematic time-lapse of a healthy ${crop} farm field growing, ${strategy} strategy, realistic agricultural growth.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setVideoUrl(`${downloadLink}&key=${process.env.API_KEY}`);
      } else {
        throw new Error("Video URI not found in response");
      }
    } catch (err: any) {
      console.error("Video generation failed:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API key error or insufficient credits. Please re-select a paid API key.");
        setShowKeyPrompt(true);
      } else {
        setError("AI Video rendering failed. Ensure you have a valid paid API key and sufficient credits.");
      }
    } finally {
      clearInterval(messageInterval);
      setIsVideoGenerating(false);
    }
  };

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    startVideoGeneration();
  };

  const displayData = simulationResult ? simulationResult.yieldData : defaultSimulationData;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Virtual Simulation Lab</h2>
          <p className="text-slate-500 font-medium text-lg mt-2 italic">Precision modeling for predictive agricultural success.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-sm">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-black text-slate-600 uppercase tracking-widest">System Active</span>
           </div>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 animate-in slide-in-from-top-4 duration-300 shadow-lg shadow-rose-500/5">
          <AlertCircle size={24} />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {saveSuccess && (
        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4 text-emerald-600 animate-in slide-in-from-top-4 duration-300 shadow-lg shadow-emerald-500/5">
          <CheckCircle2 size={24} />
          <p className="font-bold">Scenario committed to archive successfully.</p>
        </div>
      )}

      {showKeyPrompt && (
        <div className="p-10 bg-slate-900 text-white rounded-[3rem] shadow-2xl animate-in zoom-in duration-500 ring-1 ring-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -z-10" />
          <div className="flex items-start gap-8 mb-10 relative z-10">
            <div className="p-6 bg-emerald-500 rounded-[2rem] shadow-2xl shadow-emerald-500/40">
              <Sparkles size={36} className="text-white" />
            </div>
            <div>
              <h4 className="text-3xl font-black tracking-tight mb-3">Enterprise AI Rendering Required</h4>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                High-fidelity photorealistic simulations consume GPU-accelerated neural nodes. 
                Please select a paid Google Cloud project key to continue.
              </p>
              <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold">
                 <Info size={18} />
                 <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-emerald-300 transition-colors">Documentation: Billing & Quotas</a>
              </div>
            </div>
          </div>
          <div className="flex gap-4 relative z-10">
            <button onClick={handleSelectKey} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-6 rounded-2xl font-black transition-all shadow-2xl shadow-emerald-500/20 active:scale-[0.98] text-xl">
              Select Commercial Key
            </button>
            <button onClick={() => setShowKeyPrompt(false)} className="px-10 py-6 rounded-2xl font-bold border border-slate-700 hover:bg-slate-800 transition-all text-slate-300 text-lg">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-10">
        {/* Advanced Parameter Console */}
        <div className="w-full xl:w-[400px] bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 h-fit">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl">
              <Layers size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Command Unit</h3>
          </div>
          
          <div className="space-y-12">
            <div className="group">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-5 block tracking-[0.3em] group-hover:text-emerald-500 transition-colors">Specimen Selection</label>
              <div className="grid grid-cols-2 gap-4">
                {['Wheat', 'Corn', 'Soybeans', 'Canola'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setCrop(c)}
                    className={`py-5 px-2 rounded-2xl text-xs font-black border transition-all duration-300 ${crop === c ? 'bg-slate-900 border-slate-900 text-white shadow-2xl -translate-y-1' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-300 hover:text-slate-600'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase mb-5 block tracking-[0.3em]">Execution Strategy</label>
              <div className="space-y-4">
                {['Organic', 'Intensive', 'Conservative'].map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setStrategy(s)} 
                    className={`w-full px-8 py-5 rounded-2xl text-sm font-black transition-all border text-left flex items-center justify-between group ${strategy === s ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xl' : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {s}
                    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${strategy === s ? 'bg-white scale-110' : 'bg-slate-200 scale-100 group-hover:bg-emerald-400'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Land Area</label>
                <div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                   <span className="text-sm font-black text-emerald-600">{acres} ACRES</span>
                </div>
              </div>
              <input 
                type="range" 
                min="10" max="500" 
                value={acres} 
                onChange={(e) => setAcres(Number(e.target.value))} 
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600 focus:accent-emerald-400 transition-all" 
              />
            </div>

            <div className="pt-12 border-t border-slate-100 space-y-4">
              <button 
                onClick={handleRun} 
                disabled={isSimulating} 
                className="w-full bg-emerald-600 text-white py-6 rounded-3xl font-black flex items-center justify-center gap-4 disabled:opacity-50 hover:bg-emerald-700 transition-all shadow-[0_25px_40px_-10px_rgba(16,185,129,0.3)] group active:scale-[0.98] text-xl"
              >
                {isSimulating ? <Loader2 className="animate-spin" size={24} /> : <PlayCircle size={28} fill="white" className="group-hover:scale-110 transition-transform" />}
                {isSimulating ? 'Processing...' : 'Run Analysis'}
              </button>
              <button 
                onClick={() => { setSimulationResult(null); setVideoUrl(null); }} 
                className="w-full bg-white border border-slate-200 text-slate-400 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <RotateCcw size={20} /> Reset Laboratory
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Visualization Results */}
        <div className="flex-1 space-y-10">
          {/* Key Metric Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Projected Output', value: simulationResult?.estimatedTotalYield || '---', icon: TrendingUp, color: 'emerald' },
              { label: 'Net Profitability', value: simulationResult ? `$${simulationResult.totalProfit.toLocaleString()}` : '---', icon: DollarSign, color: 'blue' },
              { label: 'Capital Efficiency', value: simulationResult ? `${simulationResult.roi.toFixed(1)} : 1` : '---', icon: Scale, color: 'purple' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 group relative overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-2xl">
                <div className={`p-5 bg-${stat.color}-50 text-${stat.color}-600 rounded-[1.5rem] w-fit mb-10 group-hover:scale-110 group-hover:bg-${stat.color}-600 group-hover:text-white transition-all duration-500`}>
                  <stat.icon size={32} />
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</h3>
                <p className="text-3xl font-black text-slate-900 tracking-tight leading-none">{stat.value}</p>
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-${stat.color}-50 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-700`} />
              </div>
            ))}
          </div>

          {/* Cinematic Growth Observatory */}
          <div className="bg-slate-950 rounded-[4rem] border border-slate-800 shadow-2xl overflow-hidden relative">
            <div className="p-12 md:p-16 border-b border-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-emerald-500 rounded-lg text-slate-950">
                    <Film size={24} />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter">Observatory V3</h3>
                </div>
                <p className="text-slate-400 font-medium text-lg max-w-md">Neural time-lapse engine generating photorealistic biological progress.</p>
              </div>
              
              <div className="flex bg-white/5 p-2 rounded-[2rem] border border-white/10 self-start">
                <button 
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all ${aspectRatio === '16:9' ? 'bg-white shadow-2xl text-slate-950' : 'text-slate-500 hover:text-white'}`}
                >
                  <Monitor size={20} /> 16:9 Landscape
                </button>
                <button 
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all ${aspectRatio === '9:16' ? 'bg-white shadow-2xl text-slate-950' : 'text-slate-500 hover:text-white'}`}
                >
                  <Smartphone size={20} /> 9:16 Portrait
                </button>
              </div>
            </div>

            <div className="p-12 md:p-16 space-y-12 bg-gradient-to-b from-slate-950 to-slate-900">
              {/* Media Viewport */}
              <div className={`relative bg-black rounded-[3rem] overflow-hidden group shadow-inner border border-white/5 ${aspectRatio === '9:16' ? 'max-w-md mx-auto aspect-[9/16]' : 'aspect-video'}`}>
                {isVideoGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center bg-slate-950/80 backdrop-blur-3xl z-30">
                    <div className="relative mb-16 scale-125">
                      <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full animate-pulse" />
                      <Loader2 className="w-40 h-40 text-emerald-500/20 animate-[spin_8s_linear_infinite] relative" strokeWidth={0.5} />
                      <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 animate-pulse" size={48} />
                    </div>
                    <h4 className="text-4xl font-black text-white mb-6 tracking-tighter animate-in slide-in-from-bottom-2 duration-700">{loadingMessage}</h4>
                    <p className="text-slate-500 text-xl max-w-sm font-medium opacity-80 italic">Accessing Veo 3.1 Fast Preview nodes...</p>
                  </div>
                ) : videoUrl ? (
                  <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover animate-in fade-in duration-1000 z-10" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-16 text-center relative z-10">
                    <div className="w-32 h-32 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-all duration-700 group-hover:border-emerald-500/30">
                      <Sparkles size={56} className="text-slate-800 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <h4 className="text-3xl font-black text-white mb-4 tracking-tighter">Viewport Idle</h4>
                    <p className="text-slate-500 text-xl max-w-md font-medium">Please initiate a simulation strategy to unlock the cinematic rendering pipeline.</p>
                  </div>
                )}
                {/* Visual scanlines overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] z-20" />
              </div>

              {/* Advanced Creative Overlay */}
              {simulationResult && !videoUrl && !isVideoGenerating && (
                <div className="space-y-12 animate-in slide-in-from-bottom-12 duration-1000">
                  <div className="flex flex-wrap gap-4">
                    {['Default', 'Drone', 'Macro', 'National Geographic'].map(style => (
                      <button 
                        key={style}
                        onClick={() => applyStyle(style)}
                        className={`px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-300 ${activeStyle === style ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xl' : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400'}`}
                      >
                        {style} Presets
                      </button>
                    ))}
                  </div>

                  <div className="relative group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-5 block group-hover:text-emerald-500 transition-colors">Neural Prompt Engineering</label>
                    <div className="relative overflow-hidden rounded-[2.5rem]">
                      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] -z-10" />
                      <textarea 
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Define the cinematic scope..."
                        className="w-full h-48 px-10 py-8 bg-transparent border-none focus:ring-0 outline-none transition-all font-semibold text-white text-xl leading-relaxed resize-none placeholder:text-slate-700"
                      />
                      <div className="absolute right-10 bottom-8">
                        <Wand2 size={28} className="text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleGenerateVideo}
                    className="w-full bg-white text-slate-950 py-8 rounded-[2.5rem] font-black flex items-center justify-center gap-5 hover:bg-emerald-500 hover:text-white transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] active:scale-[0.98] group text-2xl tracking-tighter"
                  >
                    <Film size={32} className="group-hover:rotate-12 transition-transform" />
                    Initialize Neural Rendering
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Strategic Output Timeline */}
          <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
            <h3 className="text-3xl font-black text-slate-900 mb-16 flex items-center gap-5 tracking-tighter">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                 <BarChart3 size={32} />
              </div>
              Strategic Evolution Timeline
            </h3>
            <div className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 800}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 800}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '2rem', border: 'none', boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.2)', padding: '24px', background: 'rgba(15, 23, 42, 0.95)', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontWeight: '800' }}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="yield" fill="#10b981" radius={[12, 12, 0, 0]} barSize={56} name="Yield Output" />
                  <Bar dataKey="cost" fill="#f43f5e" radius={[12, 12, 0, 0]} barSize={56} name="Input Costs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-slate-950 p-16 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px]" />
            <div className="flex items-center gap-10 text-center md:text-left relative z-10">
              <div className="p-8 bg-emerald-500 rounded-[2.5rem] shadow-2xl shadow-emerald-500/30 group hover:scale-105 transition-transform duration-500">
                <Maximize size={48} />
              </div>
              <div>
                <h4 className="text-4xl font-black tracking-tighter">Commit Strategy</h4>
                <p className="text-slate-400 text-xl font-medium mt-2">Archive simulation data to global farm records.</p>
              </div>
            </div>
            <button 
              onClick={handleSave} 
              disabled={!simulationResult || isSaving}
              className="w-full md:w-auto bg-white text-slate-950 px-16 py-8 rounded-3xl font-black text-2xl flex items-center justify-center gap-5 hover:bg-emerald-500 hover:text-white transition-all active:scale-[0.98] shadow-2xl relative z-10 disabled:opacity-30"
            >
              {isSaving ? <Loader2 className="animate-spin" size={32} /> : <Save size={32} />}
              Archive Data
            </button>
          </div>
        </div>
      </div>

      {/* Intelligence Records Archival */}
      <div className="mt-32">
        <div className="flex items-center justify-between mb-16 px-4">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-900 shadow-inner">
               <History size={40} />
            </div>
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Historical Archives</h3>
          </div>
          <button onClick={loadHistory} className="flex items-center gap-3 bg-white border border-slate-200 px-8 py-4 rounded-2xl text-slate-900 font-black text-lg hover:bg-slate-50 transition-all shadow-sm">
            <RotateCcw size={22} className="text-emerald-600" /> Refresh Library
          </button>
        </div>

        {isLoadingHistory ? (
          <div className="py-56 flex flex-col items-center justify-center bg-white rounded-[5rem] border border-slate-100 shadow-inner">
            <div className="relative mb-12">
               <Loader2 className="w-24 h-24 text-emerald-600 animate-spin" />
               <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400" size={32} />
            </div>
            <p className="text-slate-500 font-black text-2xl tracking-tighter uppercase opacity-40">Decrypting Storage Layers...</p>
          </div>
        ) : savedSimulations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {savedSimulations.slice().reverse().map((sim: any, idx: number) => (
              <div key={sim.id || idx} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:translate-y-[-12px] transition-all duration-700 group relative">
                <div className="flex justify-between items-start mb-12">
                  <div className="p-6 bg-emerald-50 text-emerald-600 rounded-[2rem] group-hover:bg-emerald-600 group-hover:text-white transition-all duration-700 shadow-lg shadow-emerald-500/5">
                    <Sprout size={40} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-5 py-2.5 rounded-full tracking-[0.2em] border border-slate-100 shadow-inner">REF: {sim.farm_id?.split('-')[1] || idx}</span>
                    <p className="text-[10px] font-black text-emerald-500 uppercase mt-3 tracking-widest opacity-60">Success Verified</p>
                  </div>
                </div>
                
                <h4 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">{sim.crop}</h4>
                <div className="flex items-center gap-3 mb-10">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <p className="text-lg text-slate-400 font-black tracking-tight">{sim.fertilizer_plan} Strategy</p>
                </div>
                
                <div className="space-y-8 border-t border-slate-50 pt-12">
                  {[
                    { label: 'Plot Geometry', value: `${sim.acres || 'N/A'} ACRES`, icon: MapIcon },
                    { label: 'Cumulative Yield', value: sim.estimated_yield, icon: TrendingUp },
                    { label: 'Net Profitability', value: `$${Number(sim.estimated_profit).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' }
                  ].map((row, rIdx) => (
                    <div key={rIdx} className="flex justify-between items-center group/row">
                      <div className="flex items-center gap-5 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] group-hover/row:text-emerald-500 transition-colors">
                        <row.icon size={20} />
                        {row.label}
                      </div>
                      <span className={`text-xl font-black tracking-tight ${row.color || 'text-slate-900'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex justify-end">
                  <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-56 text-center bg-white rounded-[5rem] border border-slate-100 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-slate-50 rounded-full blur-3xl -z-10 opacity-50" />
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-10 text-slate-200">
              <History size={64} />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">Repository Empty</p>
            <p className="text-slate-400 text-xl mt-4 font-medium max-w-md mx-auto leading-relaxed">System awaiting first successful simulation commit to begin historical analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;
