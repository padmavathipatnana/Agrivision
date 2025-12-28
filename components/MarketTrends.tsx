
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Minus, ShoppingCart, Globe } from 'lucide-react';

const marketData = [
  { date: 'Jul', wheat: 240, corn: 180, soy: 420 },
  { date: 'Aug', wheat: 245, corn: 185, soy: 410 },
  { date: 'Sep', wheat: 235, corn: 195, soy: 430 },
  { date: 'Oct', wheat: 260, corn: 210, soy: 450 },
  { date: 'Nov', wheat: 280, corn: 205, soy: 480 },
  { date: 'Dec', wheat: 295, corn: 215, soy: 510 },
];

const MarketTrends: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Highlights */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Globe size={24} />
            </div>
            <h3 className="font-bold text-slate-900">Global Snapshot</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Wheat (SRW)</p>
                <p className="text-xl font-bold text-slate-900">$295.40 <span className="text-xs font-normal text-slate-500">/ ton</span></p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-sm font-bold">
                <ArrowUpRight size={16} /> 12.4%
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Corn (Yellow)</p>
                <p className="text-xl font-bold text-slate-900">$215.20 <span className="text-xs font-normal text-slate-500">/ ton</span></p>
              </div>
              <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-lg text-sm font-bold">
                <ArrowDownRight size={16} /> 2.1%
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Soybeans</p>
                <p className="text-xl font-bold text-slate-900">$510.80 <span className="text-xs font-normal text-slate-500">/ ton</span></p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-sm font-bold">
                <ArrowUpRight size={16} /> 8.5%
              </div>
            </div>
          </div>
        </div>

        {/* Price History Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Historical Price Trends</h3>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-3 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>Last 1 Year</option>
              <option>5-Year Average</option>
            </select>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="wheat" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="corn" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
                <Line type="monotone" dataKey="soy" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Regional Market Prediction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { region: 'North America', outlook: 'Bullish', reason: 'Supply shortage in midwest', color: 'emerald' },
            { region: 'South America', outlook: 'Neutral', reason: 'Normal harvest cycle expected', color: 'slate' },
            { region: 'European Union', outlook: 'Bearish', reason: 'Export restrictions eased', color: 'rose' },
            { region: 'Asia Pacific', outlook: 'Bullish', reason: 'Rising domestic demand', color: 'emerald' },
          ].map((m, i) => (
            <div key={i} className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.region}</p>
              <div className={`flex items-center gap-2 font-bold text-${m.color}-600`}>
                <div className={`w-2 h-2 rounded-full bg-${m.color}-500`} />
                {m.outlook}
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{m.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;
