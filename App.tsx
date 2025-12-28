
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Sprout, 
  TrendingUp, 
  BarChart3, 
  Settings,
  ChevronRight,
  Droplets,
  ThermometerSun,
  Scale,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PlotSelector from './components/PlotSelector';
import CropAdvisor from './components/CropAdvisor';
import MarketTrends from './components/MarketTrends';
import Simulator from './components/Simulator';
import ChatBot from './components/ChatBot';
import './types';

const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
        isActive 
          ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400 transition-colors'} />
      <span className="font-semibold tracking-tight">{label}</span>
      {isActive && <ChevronRight size={16} className="ml-auto opacity-60" />}
    </Link>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* Professional Slate Sidebar */}
        <aside className="w-72 bg-slate-950 p-8 flex flex-col fixed h-full z-30 shadow-2xl">
          <div className="flex items-center gap-4 mb-12 px-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30">
              <Sprout size={28} />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tighter block leading-none">AgriVision</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1 opacity-80">AI Command Center</span>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-4 opacity-50">Operations</div>
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/plot" icon={MapIcon} label="Plot Selection" />
            <SidebarItem to="/advisor" icon={Scale} label="Crop Advisor" />
            <div className="pt-6 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 opacity-50">Intelligence</div>
            <SidebarItem to="/market" icon={TrendingUp} label="Market Insights" />
            <SidebarItem to="/simulator" icon={BarChart3} label="Virtual Simulation" />
          </nav>

          <div className="mt-auto">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-3 text-emerald-400">
                <ThermometerSun size={20} />
                <span className="text-sm font-bold tracking-tight">Weather Service</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Optimal harvest conditions detected for Sector B. 24°C with 45% humidity.</p>
            </div>
          </div>
        </aside>

        {/* Main Interface Content */}
        <main className="flex-1 ml-72">
          <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-20 px-12 py-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search farm data..." 
                  className="pl-12 pr-6 py-3 bg-slate-100/50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500/30 outline-none transition-all w-80 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
              </button>
              
              <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none">Johnathan Doe</p>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 opacity-70">Administrator</p>
                </div>
                <div className="relative group cursor-pointer">
                  <img 
                    src="https://picsum.photos/seed/farmer/80/80" 
                    alt="Profile" 
                    className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white p-1 rounded-full text-white">
                    <ChevronDown size={8} />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-12 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/plot" element={<PlotSelector />} />
              <Route path="/advisor" element={<CropAdvisor />} />
              <Route path="/market" element={<MarketTrends />} />
              <Route path="/simulator" element={<Simulator />} />
            </Routes>
          </div>
        </main>

        {/* Floating AI Assistant */}
        <ChatBot />
      </div>
    </Router>
  );
};

export default App;
