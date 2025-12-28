
import React, { useState } from 'react';
import { Sprout, Beaker, Coins, Calendar, ChevronRight, Info } from 'lucide-react';

const CropAdvisor: React.FC = () => {
  const recommendations = [
    {
      crop: "Winter Wheat",
      match: 94,
      yield: "3.5 tons/acre",
      profit: "$12,400",
      fertilizer: "High Nitrogen (N-P-K 20-10-10)",
      season: "Nov - May",
      description: "Ideal for current soil moisture and pH levels (6.5). High market demand forecasted."
    },
    {
      crop: "Canola",
      match: 88,
      yield: "2.1 tons/acre",
      profit: "$9,800",
      fertilizer: "Sulfur-enriched Compound",
      season: "Sept - Jan",
      description: "Resilient to predicted dry spell in early Q1. Excellent rotation crop for soil health."
    },
    {
      crop: "Oats",
      match: 76,
      yield: "4.0 tons/acre",
      profit: "$7,200",
      fertilizer: "Standard Organic Mix",
      season: "Oct - Apr",
      description: "Low cost of entry, but lower market price compared to Wheat. Best for low-maintenance sectors."
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Best Fits for Sector A-1</h2>
          <p className="text-emerald-100 text-lg mb-6 opacity-90">Based on our latest satellite spectral analysis and historical weather patterns, these crops offer the highest probability of successful harvest.</p>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-sm font-medium">
              Moisture: 68%
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-sm font-medium">
              Org. Matter: 4.2%
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Sprout size={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Recommended Crops</h3>
          {recommendations.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-emerald-600">
                    <Sprout size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-bold text-slate-900">{item.crop}</h4>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded">High ROI</span>
                    </div>
                    <p className="text-slate-500 text-sm max-w-md">{item.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 text-right">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Match Score</p>
                    <p className="text-2xl font-bold text-emerald-600">{item.match}%</p>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                    View Strategy <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Season</p>
                    <p className="text-sm font-bold text-slate-700">{item.season}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Coins size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Profit Est.</p>
                    <p className="text-sm font-bold text-slate-700">{item.profit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Sprout size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Yield</p>
                    <p className="text-sm font-bold text-slate-700">{item.yield}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Beaker size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Fertilizer</p>
                    <p className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{item.fertilizer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Fertilizer Guide</h3>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Beaker size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Dosage Calculator</h4>
                <p className="text-xs text-slate-500">Based on 100-acre standard</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Nitrogen (N)</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[60%]" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">120kg/ha</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Phosphorus (P)</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[40%]" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">80kg/ha</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Potassium (K)</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[25%]" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">50kg/ha</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2 text-slate-600">
                <Info size={16} />
                <span className="text-xs font-bold uppercase tracking-tight">AI Insights</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Applying Nitrogen in two splits (planting & mid-season) is recommended to reduce leaching due to the sandy-loam soil texture in your plot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropAdvisor;
