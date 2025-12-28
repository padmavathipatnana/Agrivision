
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Landmark, 
  Droplets, 
  Leaf, 
  CloudRain, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: 'Jan', yield: 4000, cost: 2400 },
  { name: 'Feb', yield: 3000, cost: 1398 },
  { name: 'Mar', yield: 2000, cost: 9800 },
  { name: 'Apr', yield: 2780, cost: 3908 },
  { name: 'May', yield: 1890, cost: 4800 },
  { name: 'Jun', yield: 2390, cost: 3800 },
  { name: 'Jul', yield: 3490, cost: 4300 },
];

const cropData = [
  { name: 'Wheat', value: 45, color: '#10b981' },
  { name: 'Corn', value: 25, color: '#f59e0b' },
  { name: 'Soybeans', value: 30, color: '#3b82f6' },
];

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        {trendValue}%
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Landmark} 
          label="Total Yield Value" 
          value="$124,500" 
          trend="up" 
          trendValue="12.5" 
          color="emerald" 
        />
        <StatCard 
          icon={Leaf} 
          label="Active Plot Area" 
          value="450 Acres" 
          trend="stable" 
          trendValue="0.0" 
          color="amber" 
        />
        <StatCard 
          icon={Droplets} 
          label="Water Consumption" 
          value="1.2M Gallons" 
          trend="down" 
          trendValue="4.2" 
          color="blue" 
        />
        <StatCard 
          icon={Zap} 
          label="Energy Efficiency" 
          value="94%" 
          trend="up" 
          trendValue="2.1" 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">Revenue & Cost Forecast</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" /> Yield Revenue
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <div className="w-3 h-3 bg-slate-300 rounded-full" /> Operational Cost
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="yield" stroke="#10b981" fillOpacity={1} fill="url(#colorYield)" strokeWidth={3} />
                <Area type="monotone" dataKey="cost" stroke="#94a3b8" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel: Recommendations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Top Crop Performance</h2>
          <div className="space-y-6">
            {cropData.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                  <span className="text-sm text-slate-500">{item.value}% market share</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-emerald-50 rounded-xl">
            <h4 className="text-emerald-800 font-bold text-sm mb-2 flex items-center gap-2">
              <CloudRain size={16} /> Weather Alert
            </h4>
            <p className="text-emerald-700 text-xs leading-relaxed">
              Potential heavy rainfall expected in 48 hours. Consider early harvesting for Wheat Sector B to minimize moisture damage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
