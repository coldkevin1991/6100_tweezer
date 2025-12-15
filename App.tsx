import React, { useState } from 'react';
import { KEY_METRICS } from './constants';
import { Section } from './types';
import { ArraySimulation, CoherenceChart, LifetimeChart, TransportSimulation, RBChart, ImagingAnalysis } from './components/Visualizations';
import { PulseControl } from './components/PulseControl';
import { GeminiChat } from './components/GeminiChat';
import { 
  Atom, 
  Cpu, 
  Activity, 
  Move, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  Target,
  Settings2
} from 'lucide-react';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.HERO);

  const renderContent = () => {
    switch (activeSection) {
      case Section.HERO:
        return (
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* Hero Text */}
            <div className="text-center space-y-6 max-w-3xl mx-auto pt-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Published in Nature (2025)
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
                6,100 Highly Coherent <br/> <span className="text-indigo-400">Atomic Qubits</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                Exploring the breakthrough in scalable neutral atom quantum computing. 
                A tweezer array surpassing state-of-the-art metrics for coherence, lifetime, and imaging fidelity.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={() => setActiveSection(Section.DATA)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  Explore Data <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                   onClick={() => setActiveSection(Section.CHAT)}
                   className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  Ask AI Assistant <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {KEY_METRICS.map((metric, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:bg-slate-800 transition-colors group">
                  <p className="text-slate-400 text-sm font-medium mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{metric.value}</p>
                  <p className="text-xs text-slate-500 mt-2">{metric.subtext}</p>
                </div>
              ))}
            </div>

            {/* Array Sim Preview */}
            <div className="w-full">
               <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                 <Target className="w-5 h-5 text-indigo-400"/> Array Visualization
               </h3>
               <ArraySimulation />
            </div>
          </div>
        );

      case Section.DATA:
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-100">Performance Metrics</h2>
                <p className="text-slate-400 mt-2">Key experimental characterizations including Randomized Benchmarking, Coherence, and Lifetime.</p>
              </div>
            </div>
            
            {/* Randomized Benchmarking Section */}
            <RBChart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CoherenceChart />
              <LifetimeChart />
            </div>

            {/* Imaging Analysis Section - NEW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ImagingAnalysis />
                </div>
                <div className="h-full bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4">Imaging Survival</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-indigo-400">99.98%</span>
                        <span className="text-slate-400">survival probability</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                    The system achieves a steady-state imaging survival probability of 99.98952(1)%, 
                    mostly limited by the 22.9(1)-min vacuum lifetime.
                    </p>
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-6 overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[99.98%]"></div>
                    </div>
                </div>
            </div>
          </div>
        );
      
      case Section.TRANSPORT:
         return (
             <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                 <div>
                    <h2 className="text-3xl font-bold text-slate-100">Coherent Atom Transport</h2>
                    <p className="text-slate-400 mt-2 max-w-3xl leading-relaxed">
                        To enable Quantum Error Correction (QEC) in a zone-based architecture, atoms must be moved between storage and interaction zones.
                        This is achieved using mobile **Acousto-Optic Deflectors (AODs)** that pick up atoms from static **SLM traps**.
                    </p>
                 </div>
                 
                 <TransportSimulation />
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="p-5 border border-slate-700 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                             <Move className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h4 className="text-indigo-400 font-semibold mb-2">Long Distance</h4>
                        <p className="text-2xl text-slate-100 font-bold">610 μm</p>
                        <p className="text-xs text-slate-400 mt-2 leading-snug">
                            Diagonal transport range demonstrated, covering significant array distance.
                        </p>
                    </div>
                    <div className="p-5 border border-slate-700 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                             <Activity className="w-5 h-5 text-green-400" />
                        </div>
                        <h4 className="text-green-400 font-semibold mb-2">High Fidelity</h4>
                        <p className="text-2xl text-slate-100 font-bold">&gt;99.95%</p>
                        <p className="text-xs text-slate-400 mt-2 leading-snug">
                            Atoms retain their quantum state (phase & population) during movement.
                        </p>
                    </div>
                    <div className="p-5 border border-slate-700 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                             <Settings2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <h4 className="text-blue-400 font-semibold mb-2">Adiabatic Handoff</h4>
                        <p className="text-2xl text-slate-100 font-bold">Negligible Heating</p>
                        <p className="text-xs text-slate-400 mt-2 leading-snug">
                            Intensity ramping (shown in graph) ensures smooth transfer between SLM and AOD.
                        </p>
                    </div>
                 </div>
             </div>
         );

      case Section.CONTROL:
        return (
          <PulseControl />
        );

      case Section.CHAT:
        return (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500 h-full">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-100">Ask the Paper</h2>
                    <p className="text-slate-400 mt-2">Powered by Gemini 2.5 Flash</p>
                </div>
                <GeminiChat />
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex">
      {/* Sidebar Navigation */}
      <nav className="w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 sticky top-0 h-screen z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg hidden lg:block tracking-tight">Qubit Explorer</span>
        </div>

        <div className="flex-1 px-3 space-y-2 mt-4">
          <NavItem 
            active={activeSection === Section.HERO} 
            onClick={() => setActiveSection(Section.HERO)}
            icon={<Cpu className="w-5 h-5"/>} 
            label="Overview" 
          />
          <NavItem 
            active={activeSection === Section.DATA} 
            onClick={() => setActiveSection(Section.DATA)}
            icon={<Activity className="w-5 h-5"/>} 
            label="Data & Metrics" 
          />
          <NavItem 
            active={activeSection === Section.TRANSPORT} 
            onClick={() => setActiveSection(Section.TRANSPORT)}
            icon={<Move className="w-5 h-5"/>} 
            label="Transport" 
          />
          <NavItem 
            active={activeSection === Section.CONTROL} 
            onClick={() => setActiveSection(Section.CONTROL)}
            icon={<Settings2 className="w-5 h-5"/>} 
            label="Pulse Control" 
          />
           <div className="my-4 border-t border-slate-800 mx-2"></div>
           <NavItem 
            active={activeSection === Section.CHAT} 
            onClick={() => setActiveSection(Section.CHAT)}
            icon={<MessageSquare className="w-5 h-5"/>} 
            label="AI Assistant" 
            special
          />
        </div>

        <div className="p-4 hidden lg:block">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Source</h4>
            <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group">
              Nature 647, Nov 2025
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"/>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-6 lg:p-12">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ 
    active: boolean; 
    onClick: () => void; 
    icon: React.ReactNode; 
    label: string;
    special?: boolean;
}> = ({ active, onClick, icon, label, special }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? special ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-indigo-400 border border-slate-700'
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
    }`}
  >
    <span className={`${active ? 'text-current' : 'text-slate-500 group-hover:text-slate-300'}`}>
        {icon}
    </span>
    <span className="hidden lg:block font-medium">{label}</span>
  </button>
);

export default App;