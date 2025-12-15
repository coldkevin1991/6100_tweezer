import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Area, AreaChart, ComposedChart, Scatter } from 'recharts';
import { Info, GitCommit, Zap } from 'lucide-react';

// --- Helper: Generate Fit Data ---
const generateDecayData = (
    tau: number, 
    maxTime: number, 
    points: number, 
    noise: number = 0, 
    exponent: number = 1
) => {
  const data = [];
  for (let i = 0; i <= points; i++) {
    const t = (maxTime / points) * i;
    // Theoretical curve
    const fit = Math.exp(-Math.pow(t / tau, exponent));
    // Simulated measurement (add random noise)
    const measure = fit + (Math.random() - 0.5) * noise;
    data.push({
      time: parseFloat(t.toFixed(1)),
      fit: parseFloat(fit.toFixed(3)),
      measured: i % 5 === 0 ? parseFloat(measure.toFixed(3)) : null // Only measure at intervals
    });
  }
  return data;
};

// --- Helper: Generate RB Data ---
const generateRBData = (mode: 'standard' | 'irb') => {
    const lengths = [2, 10, 20, 40, 80, 150, 300, 500];
    const sequencesPerLength = 30; 
    
    // Standard RB Fidelity (Global gates) ~ 99.9%
    const p_standard = 0.9985; 
    // IRB Fidelity (Transport Interleaved) - slightly lower due to transport error
    // If Transport fidelity is 99.95%, the combined p is lower.
    const p_irb = 0.9985 * 0.9995; 

    const data: any[] = [];
    
    lengths.forEach(m => {
        // Standard Curve
        const avgProbStd = 0.5 + 0.5 * Math.pow(p_standard, m);
        // IRB Curve
        const avgProbIrb = 0.5 + 0.5 * Math.pow(p_irb, m);
        
        // Generate scattered points
        const variance = 0.05 * (1 - Math.exp(-m/100)); 

        if (mode === 'standard') {
            for(let i=0; i<sequencesPerLength; i++) {
                const val = Math.min(1, Math.max(0, avgProbStd + (Math.random() - 0.5) * variance * 2));
                data.push({ length: m, y: parseFloat(val.toFixed(4)), type: 'scatter', category: 'Standard' });
            }
        } else {
             // For IRB, we show both decay comparisons usually, but to keep chart clean we switch focus
             // Let's visualize the "Interleaved" data points
             for(let i=0; i<sequencesPerLength; i++) {
                const val = Math.min(1, Math.max(0, avgProbIrb + (Math.random() - 0.5) * variance * 2));
                data.push({ length: m, y: parseFloat(val.toFixed(4)), type: 'scatter', category: 'IRB' });
            }
        }
        
        data.push({
            length: m,
            standard_fit: parseFloat(avgProbStd.toFixed(4)),
            irb_fit: mode === 'irb' ? parseFloat(avgProbIrb.toFixed(4)) : null,
            type: 'line'
        });
    });
    
    return data.sort((a,b) => a.length - b.length);
};

// --- Recharts: Randomized Benchmarking (RB) & IRB ---
export const RBChart: React.FC = () => {
    const [mode, setMode] = useState<'standard' | 'irb'>('standard');
    const data = generateRBData(mode);
    
    return (
        <div className="h-[500px] w-full bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                        {mode === 'standard' ? 'Standard RB (Global Gates)' : 'Interleaved RB (IRB) - Transport'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xl">
                        {mode === 'standard' 
                            ? "Standard Randomized Benchmarking measures the average fidelity of Clifford gates." 
                            : "IRB interleaves a 'Transport' move between every Clifford gate. The difference in decay curves reveals the transport fidelity."}
                    </p>
                </div>
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 shrink-0">
                    <button 
                        onClick={() => setMode('standard')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'standard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Standard RB
                    </button>
                    <button 
                        onClick={() => setMode('irb')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'irb' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        IRB (Transport)
                    </button>
                </div>
            </div>

            {/* IRB Schematic Visual */}
            {mode === 'irb' && (
                <div className="mb-4 p-3 bg-slate-900/50 rounded border border-slate-700 flex items-center justify-center gap-2 overflow-x-auto">
                    <span className="text-xs text-slate-500 font-mono">Sequence:</span>
                    <div className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs rounded">C₁</span>
                        <GitCommit className="w-3 h-3 text-slate-600" />
                        <span className="px-2 py-1 bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs rounded font-bold">Transport</span>
                        <GitCommit className="w-3 h-3 text-slate-600" />
                         <span className="px-2 py-1 bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs rounded">C₂</span>
                         <GitCommit className="w-3 h-3 text-slate-600" />
                        <span className="px-2 py-1 bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs rounded font-bold">Transport</span>
                        <span className="text-slate-500 text-xs ml-1">...</span>
                    </div>
                </div>
            )}

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                        <XAxis 
                            dataKey="length" 
                            type="number"
                            domain={[0, 550]}
                            label={{ value: 'Number of Clifford Gates (N)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }} 
                            stroke="#94a3b8"
                            tick={{fill: '#94a3b8'}}
                            tickCount={8}
                        />
                        <YAxis 
                            dataKey="y" 
                            domain={[0.4, 1.05]} 
                            label={{ value: 'Return Probability', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                            stroke="#94a3b8"
                            tick={{fill: '#94a3b8'}}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                            itemStyle={{ fontSize: '12px' }}
                            labelFormatter={(label) => `Gates: ${label}`}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        
                        {/* Scatter Points */}
                        <Scatter 
                            name={mode === 'standard' ? "Ref. Strings" : "Interleaved Strings"}
                            dataKey="y" 
                            fill={mode === 'standard' ? "#818cf8" : "#f43f5e"} 
                            opacity={0.15}
                            shape="circle" 
                        />
                        
                        {/* Reference Line (Always Visible) */}
                        <Line 
                            name="Standard Reference"
                            type="monotone" 
                            dataKey="standard_fit" 
                            stroke="#4ade80" 
                            strokeWidth={mode === 'standard' ? 3 : 1} 
                            strokeDasharray={mode === 'irb' ? "5 5" : ""}
                            dot={false} 
                            connectNulls={true}
                        />

                        {/* IRB Line */}
                        {mode === 'irb' && (
                             <Line 
                                name="IRB Fit (w/ Transport)"
                                type="monotone" 
                                dataKey="irb_fit" 
                                stroke="#f43f5e" 
                                strokeWidth={3} 
                                dot={{ r: 4, fill: "#f43f5e", strokeWidth: 0 }} 
                                connectNulls={true}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            {mode === 'irb' && (
                <div className="mt-2 text-center text-xs text-rose-300">
                    Transport Fidelity extracted from decay difference: <strong>&gt;99.95%</strong>
                </div>
            )}
        </div>
    );
};

// --- Recharts: Coherence Time (T2) ---
export const CoherenceChart: React.FC = () => {
  const data = generateDecayData(12.6, 20, 100, 0.05, 1.5); 
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="h-96 w-full bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col relative">
      <div className="mb-4">
        <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-slate-200">Coherence Time (T2)</h3>
            <button 
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <Info className="w-5 h-5" />
            </button>
        </div>
        
        {/* XY Sequence Tooltip */}
        {showTooltip && (
            <div className="absolute top-12 right-6 w-64 bg-slate-900 border border-slate-600 p-4 rounded-lg shadow-xl z-20 text-xs">
                <h4 className="font-bold text-indigo-400 mb-2">Dynamical Decoupling</h4>
                <p className="text-slate-300 mb-2">
                    <strong className="text-white">XY4:</strong> A sequence X-Y-X-Y applied to the qubit. It reverses time-evolution errors from the environment.
                </p>
                <p className="text-slate-300">
                    <strong className="text-white">XY16:</strong> An extended version (repeating and phasing XY4) to cancel higher-order errors and pulse imperfections, extending T2 beyond standard Hahn Echo.
                </p>
            </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
             <span className="font-mono bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 px-2 py-1 rounded flex items-center gap-1">
                <Zap className="w-3 h-3"/> Sequence: XY16
             </span>
             <span>T₂ = 12.6(1) s</span>
             <span>α ≈ 1.5</span>
        </div>
      </div>
      
      {/* Sequence Visual */}
      <div className="flex items-center gap-1 mb-4 opacity-50 overflow-hidden whitespace-nowrap mask-gradient">
        {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
                <div className="w-6 h-4 bg-slate-700 rounded flex items-center justify-center text-[8px]">X</div>
                <div className="w-4 h-[1px] bg-slate-600"></div>
                <div className="w-6 h-4 bg-slate-700 rounded flex items-center justify-center text-[8px]">Y</div>
                <div className="w-4 h-[1px] bg-slate-600"></div>
            </React.Fragment>
        ))}
        <span className="text-[10px] text-slate-500">... (XY16 repeats)</span>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis 
                dataKey="time" 
                label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }} 
                stroke="#94a3b8"
                tick={{fill: '#94a3b8'}}
            />
            <YAxis 
                stroke="#94a3b8" 
                domain={[0, 1.1]} 
                label={{ value: 'Contrast', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                tick={{fill: '#94a3b8'}}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ fontSize: '12px' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line 
                name="XY16 Fit"
                type="monotone" 
                dataKey="fit" 
                stroke="#6366f1" 
                strokeWidth={2} 
                dot={false}
                strokeDasharray="5 5"
            />
            <Line 
                name="Measured Data"
                type="monotone" 
                dataKey="measured" 
                stroke="#38bdf8" 
                strokeWidth={0} 
                dot={{ r: 4, fill: "#38bdf8", strokeWidth: 0 }} 
                activeDot={{ r: 6 }}
                connectNulls={false}
            />
            <ReferenceLine x={12.6} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: '1/e point', fill: '#ef4444', fontSize: 12 }} />
            </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- Recharts: Lifetime (T1) ---
export const LifetimeChart: React.FC = () => {
    const data = generateDecayData(22.9, 40, 100, 0.08, 1.0); 
    return (
      <div className="h-96 w-full bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Vacuum Lifetime (T1) Fitting</h3>
          <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
               <span className="font-mono bg-slate-700 px-2 py-1 rounded">{'N(t) = N₀ · e^{-t/τ}'}</span>
               <span>τ = 22.9(1) min</span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
              <defs>
                <linearGradient id="colorFit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (min)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }} 
                  stroke="#94a3b8"
                  tick={{fill: '#94a3b8'}}
              />
              <YAxis 
                  stroke="#94a3b8" 
                  domain={[0, 1.1]} 
                  label={{ value: 'Survival Prob.', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  tick={{fill: '#94a3b8'}}
              />
              <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area 
                  name="Fit Model"
                  type="monotone" 
                  dataKey="fit" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorFit)" 
              />
              <Line 
                  name="Measured Data"
                  type="monotone" 
                  dataKey="measured" 
                  stroke="#fde047" 
                  strokeWidth={0} 
                  dot={{ r: 4, fill: "#fde047", strokeWidth: 0 }} 
                  connectNulls={false}
              />
              </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
};

// --- Imaging Analysis Visualization ---
export const ImagingAnalysis: React.FC = () => {
    // 7x7 Grid State
    const size = 7;
    const [rawGrid, setRawGrid] = useState<number[]>([]);
    
    // Generate Weight Matrix (Gaussian-like)
    const weightMatrix = React.useMemo(() => {
        const matrix = [];
        const center = Math.floor(size / 2);
        const sigma = 1.2;
        
        for(let y=0; y<size; y++) {
            for(let x=0; x<size; x++) {
                const distSq = Math.pow(x - center, 2) + Math.pow(y - center, 2);
                const val = Math.exp(-distSq / (2 * sigma * sigma));
                matrix.push(val);
            }
        }
        return matrix;
    }, []);

    // Helper: Generate Histogram Data
    // Simulates the distribution of photon counts for 0-atom (Background) and 1-atom (Signal)
    const generateHistogramData = (separation: number, width: number) => {
        const data = [];
        // X axis range e.g. 0 to 250 counts
        for(let i=0; i<=250; i+=2) {
            // Gaussian P(x) = exp(-(x-mu)^2 / 2sigma^2)
            const mu0 = 80;
            const mu1 = 80 + separation;
            
            // Peak 0 (Background)
            const p0 = Math.exp(-Math.pow(i - mu0, 2) / (2 * width * width));
            // Peak 1 (Atom)
            const p1 = Math.exp(-Math.pow(i - mu1, 2) / (2 * width * width));
            
            data.push({ x: i, Background: p0, Atom: p1 });
        }
        return data;
    };

    // Unweighted: Wide distribution (high noise), peaks overlap
    const unweightedHistData = React.useMemo(() => generateHistogramData(70, 25), []);
    
    // Weighted: Narrow distribution (low noise), clear separation
    const weightedHistData = React.useMemo(() => generateHistogramData(70, 10), []);

    // Animate noise for the grid
    useEffect(() => {
        const interval = setInterval(() => {
            const newGrid = [];
            const center = Math.floor(size / 2);
            for(let y=0; y<size; y++) {
                for(let x=0; x<size; x++) {
                    const isCenter = x === center && y === center;
                    const dist = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
                    const signal = dist < 1.5 ? Math.max(0, 1 - dist*0.5) : 0;
                    const noise = Math.random() * 0.4;
                    newGrid.push(signal + noise);
                }
            }
            setRawGrid(newGrid);
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const renderGrid = (data: number[], title: string, colorClass: string, isWeight: boolean = false) => (
        <div className="flex flex-col items-center gap-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase">{title}</h4>
            <div className="grid grid-cols-7 gap-0.5 p-1 bg-slate-900 border border-slate-700 rounded shadow-inner">
                {data.map((val, i) => (
                    <div 
                        key={i} 
                        className={`w-3 h-3 md:w-5 md:h-5 rounded-[1px] transition-colors duration-200 ${colorClass}`}
                        style={{ 
                            opacity: isWeight ? val * 0.9 + 0.1 : Math.min(1, val) 
                        }} 
                    />
                ))}
            </div>
        </div>
    );

    const renderHistogram = (data: any[], title: string, showThreshold: boolean) => (
        <div className="flex-1 h-32 md:h-40 min-w-[200px]">
             <div className="text-xs font-semibold text-slate-400 mb-2 text-center">{title}</div>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="grad0" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="Background" stroke="#ef4444" fill="url(#grad0)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Atom" stroke="#22c55e" fill="url(#grad1)" strokeWidth={2} />
                    {showThreshold && (
                        <ReferenceLine x={115} stroke="#cbd5e1" strokeDasharray="3 3" label={{ position: 'top', value: 'Threshold', fill: '#cbd5e1', fontSize: 10 }} />
                    )}
                </AreaChart>
             </ResponsiveContainer>
        </div>
    );

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col gap-8">
            <div className="mb-2">
                <h3 className="text-lg font-semibold text-slate-200">Imaging Fidelity Optimization</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Applying a weight function <span className="font-mono text-indigo-400">W(u,v)</span> to the 7×7 ROI reduces edge noise contribution.
                    This narrows the histogram peaks, minimizing overlap and enabling a clear detection threshold.
                </p>
            </div>
            
            {/* Visual Part 1: Grid Transformation */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
                {renderGrid(rawGrid, "Raw Signal (S)", "bg-blue-400")}
                <span className="text-slate-600 font-bold">×</span>
                {renderGrid(weightMatrix, "Weight (W)", "bg-emerald-400", true)}
                <span className="text-slate-600 font-bold">=</span>
                {renderGrid(
                    rawGrid.map((val, i) => val * weightMatrix[i]), 
                    "Weighted (S·W)", 
                    "bg-indigo-500"
                )}
            </div>

            {/* Visual Part 2: Histogram Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 relative">
                     {renderHistogram(unweightedHistData, "Unweighted Distribution", false)}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-amber-500 font-bold bg-slate-900/80 px-2 py-1 rounded border border-amber-500/30">
                        Ambiguous Overlap
                     </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 relative">
                     {renderHistogram(weightedHistData, "Weighted Distribution", true)}
                     <div className="absolute top-8 right-8 text-xs text-green-400 font-bold">
                        Zero Overlap
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- D3: Tweezer Array Simulation ---
export const ArraySimulation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    
    svg.selectAll("*").remove();

    // Simulation parameters (scaled down representation)
    const cols = 40;
    const rows = 25;
    const spacing = 12;
    const offsetX = (width - cols * spacing) / 2;
    const offsetY = (height - rows * spacing) / 2;

    const data = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const isLoaded = Math.random() > 0.48; 
        data.push({ x: i * spacing + offsetX, y: j * spacing + offsetY, loaded: isLoaded });
      }
    }

    setActiveCount(data.filter(d => d.loaded).length);

    svg.selectAll("circle.site")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "site")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 1.5)
      .attr("fill", "#334155")
      .attr("opacity", 0.5);

    svg.selectAll("circle.atom")
      .data(data.filter(d => d.loaded))
      .enter()
      .append("circle")
      .attr("class", "atom")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 2.5)
      .attr("fill", "#818cf8")
      .attr("filter", "url(#glow)")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 0.5)
      .style("opacity", 1);

    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  }, []);

  return (
    <div className="relative w-full h-96 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur-md p-3 rounded-lg border border-slate-600">
        <div className="text-xs text-slate-400 uppercase tracking-wider">Simulation View</div>
        <div className="text-2xl font-bold text-indigo-400">{activeCount * 6} <span className="text-sm text-slate-300">qubits (scaled)</span></div>
        <div className="text-xs text-green-400 mt-1">● Loading Efficiency ~51%</div>
      </div>
      <svg ref={svgRef} viewBox="0 0 600 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice" />
    </div>
  );
};

// --- D3: Detailed Coherent Transport Simulation ---

export const TransportSimulation: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGSVGElement>(null); // For the 2D path map
    const [phase, setPhase] = useState("Handover"); 
    
    // Animation Refs for cleanup
    const animationRef = useRef<number>(null);

    // --- 2D Path Visualizer (Top Down) ---
    useEffect(() => {
        if (!pathRef.current) return;
        const svg = d3.select(pathRef.current);
        const w = 150;
        const h = 150;
        svg.selectAll("*").remove();

        // Background grid
        svg.append("rect").attr("width", w).attr("height", h).attr("fill", "#0f172a");
        
        // Start and End
        svg.append("circle").attr("cx", 20).attr("cy", 130).attr("r", 4).attr("fill", "#fbbf24");
        svg.append("text").attr("x", 25).attr("y", 130).text("Start").attr("fill", "#94a3b8").attr("font-size", 10);
        
        svg.append("circle").attr("cx", 130).attr("cy", 20).attr("r", 4).attr("fill", "#fbbf24");
        svg.append("text").attr("x", 105).attr("y", 15).text("End").attr("fill", "#94a3b8").attr("font-size", 10);

        // Path 1: Straight / Manhattan (Pink)
        // Move X then Y
        const pathStraight = `M 20 130 L 130 130 L 130 20`;
        svg.append("path").attr("d", pathStraight).attr("stroke", "#f472b6").attr("stroke-width", 2).attr("fill", "none").attr("stroke-dasharray", "4 2");
        
        // Path 2: Diagonal (Blue)
        // Simultaneous
        const pathDiagonal = `M 20 130 L 130 20`;
        svg.append("path").attr("d", pathDiagonal).attr("stroke", "#3b82f6").attr("stroke-width", 2).attr("fill", "none");

    }, []);

    // --- Main 1D Animation ---
    useEffect(() => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        const width = 800;
        const height = 400; // Increased height to fit more info if needed

        svg.selectAll("*").remove();
        
        // --- Setup Definitions ---
        const defs = svg.append("defs");
        
        const gradSLM = defs.append("radialGradient")
            .attr("id", "gradSLM")
            .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
        gradSLM.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.1);
        gradSLM.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0);

        const gradAOD = defs.append("radialGradient")
            .attr("id", "gradAOD")
            .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
        gradAOD.append("stop").attr("offset", "0%").attr("stop-color", "#f43f5e").attr("stop-opacity", 0.2);
        gradAOD.append("stop").attr("offset", "100%").attr("stop-color", "#f43f5e").attr("stop-opacity", 0);

        // --- Scene Geometry ---
        const startX = 100;
        const endX = 700;
        const yPos = 120;
        const totalDuration = 8000;
        
        // Zones
        svg.append("rect").attr("x", 50).attr("y", 20).attr("width", 100).attr("height", 200).attr("fill", "#1e293b").attr("rx", 8);
        svg.append("text").attr("x", 100).attr("y", 40).attr("text-anchor", "middle").attr("fill", "#94a3b8").text("SLM Site 1");
        
        svg.append("rect").attr("x", 650).attr("y", 20).attr("width", 100).attr("height", 200).attr("fill", "#1e293b").attr("rx", 8);
        svg.append("text").attr("x", 700).attr("y", 40).attr("text-anchor", "middle").attr("fill", "#94a3b8").text("SLM Site 2");

        // Graphs Group (Bottom)
        const graphG = svg.append("g").attr("transform", "translate(50, 250)");
        graphG.append("line").attr("x1", 0).attr("y1", 100).attr("x2", 700).attr("y2", 100).attr("stroke", "#475569");
        graphG.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 100).attr("stroke", "#475569");
        graphG.append("text").attr("x", -10).attr("y", 10).attr("fill", "#94a3b8").attr("text-anchor", "end").attr("font-size", 10).text("Trap Depth");
        graphG.append("text").attr("x", 710).attr("y", 100).attr("fill", "#94a3b8").attr("font-size", 10).text("Time");
        
        const pathSLM = graphG.append("path").attr("fill", "none").attr("stroke", "#3b82f6").attr("stroke-width", 2);
        const pathAOD = graphG.append("path").attr("fill", "none").attr("stroke", "#f43f5e").attr("stroke-width", 2);
        
        const slmWell = svg.append("circle").attr("r", 40).attr("cy", yPos).attr("fill", "url(#gradSLM)").attr("stroke", "#3b82f6").attr("stroke-width", 1).attr("stroke-dasharray", "2 2");
        const aodWell = svg.append("circle").attr("r", 40).attr("cy", yPos).attr("fill", "url(#gradAOD)").attr("stroke", "#f43f5e").attr("stroke-width", 1);
        
        const atomGroup = svg.append("g");
        atomGroup.append("circle").attr("r", 6).attr("fill", "#fbbf24").attr("cy", 0).attr("cx", 0);
        const phaseRing = atomGroup.append("g");
        phaseRing.append("circle").attr("r", 12).attr("fill", "none").attr("stroke", "#fbbf24").attr("stroke-opacity", 0.5).attr("stroke-width", 1);
        phaseRing.append("circle").attr("r", 2).attr("fill", "#fbbf24").attr("cx", 12).attr("cy", 0);
        
        let startTime = 0;
        
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = (timestamp - startTime) % totalDuration;
            const t = elapsed / totalDuration; 

            let slmPower = 0;
            let aodPower = 0;
            let x = startX;
            let stage = "";

            if (t < 0.15) {
                stage = "Handover (SLM → AOD)";
                const subT = t / 0.15;
                slmPower = 1 - subT;
                aodPower = subT;
                x = startX;
            } else if (t < 0.75) {
                stage = "Diagonal Transport";
                const subT = (t - 0.15) / 0.6;
                const ease = d3.easeCubicInOut(subT);
                x = startX + (endX - startX) * ease;
                slmPower = 0;
                aodPower = 1;
            } else if (t < 0.9) {
                stage = "Handover (AOD → SLM)";
                const subT = (t - 0.75) / 0.15;
                aodPower = 1 - subT;
                slmPower = subT; 
                x = endX;
            } else {
                stage = "Resetting...";
                slmPower = 1; 
                aodPower = 0;
                x = startX;
            }
            
            setPhase(stage);

            const slmX = t > 0.5 ? endX : startX;
            
            slmWell.attr("cx", slmX).attr("opacity", slmPower).attr("r", 30 + 10 * slmPower);
            aodWell.attr("cx", x).attr("opacity", aodPower).attr("r", 30 + 10 * aodPower);
            atomGroup.attr("transform", `translate(${x}, ${yPos})`);
            phaseRing.attr("transform", `rotate(${(timestamp / 10) % 360})`);

            // Live Graph logic (simplified)
            const graphPoints = 100;
            const dataSLM = [];
            const dataAOD = [];
            for(let i=0; i<graphPoints; i++) {
                const gt = i / graphPoints; 
                let gpS = 0, gpA = 0;
                if (gt < 0.15) { gpS = 1 - gt/0.15; gpA = gt/0.15; }
                else if (gt < 0.75) { gpS = 0; gpA = 1; }
                else if (gt < 0.9) { gpS = (gt-0.75)/0.15; gpA = 1 - (gt-0.75)/0.15; }
                else { gpS = 0; gpA = 0; }
                
                dataSLM.push([gt * 700, 100 - gpS * 90]);
                dataAOD.push([gt * 700, 100 - gpA * 90]);
            }
            const lineGen = d3.line();
            pathSLM.attr("d", lineGen(dataSLM as [number, number][]));
            pathAOD.attr("d", lineGen(dataAOD as [number, number][]));
            
            const currentTimeX = (elapsed / totalDuration) * 700;
            if (!graphG.select(".time-marker").empty()) {
                graphG.select(".time-marker").attr("x1", currentTimeX).attr("x2", currentTimeX);
            } else {
                graphG.append("line").attr("class", "time-marker").attr("y1", 0).attr("y2", 100).attr("stroke", "#ffffff").attr("stroke-dasharray", "2 2");
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[400px]">
                {/* Main 1D Animation */}
                <div className="lg:col-span-3 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative">
                     <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                         <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded text-xs border border-indigo-700 font-mono">
                            Stage: {phase}
                         </span>
                         <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> SLM Trap
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span> AOD Trap
                         </div>
                    </div>
                    
                    <div className="absolute top-4 right-4 z-10 bg-slate-800/80 p-3 rounded border border-slate-600">
                        <div className="text-xs text-slate-300 font-bold mb-1">Atom State</div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-amber-400 relative flex items-center justify-center">
                                <div className="w-1 h-1 bg-amber-400 rounded-full absolute top-0.5"></div>
                            </div>
                            <span className="text-xs text-slate-400">Coherence > 99.95%</span>
                        </div>
                    </div>
    
                    <svg ref={svgRef} viewBox="0 0 800 400" className="w-full h-full" />
                </div>

                {/* 2D Path Explainer - NEW */}
                <div className="lg:col-span-1 bg-slate-800/50 rounded-xl border border-slate-700 p-4 flex flex-col items-center justify-center">
                    <h4 className="text-sm font-semibold text-slate-200 mb-2">Transport Path Logic</h4>
                    <div className="rounded-lg overflow-hidden border border-slate-600 mb-4 bg-slate-900">
                        <svg ref={pathRef} width="150" height="150" className="block" />
                    </div>
                    <div className="space-y-3 text-xs w-full">
                         <div className="flex items-start gap-2">
                            <div className="w-3 h-0.5 bg-blue-500 mt-1.5 shrink-0"></div>
                            <div>
                                <span className="font-bold text-blue-400 block">Diagonal (Blue)</span>
                                <span className="text-slate-400">Simultaneous X/Y ramp. Shortest distance, efficient but complex control.</span>
                            </div>
                         </div>
                         <div className="flex items-start gap-2">
                            <div className="w-3 h-0.5 bg-pink-400 mt-1.5 shrink-0 border-dashed border-b border-pink-400"></div>
                            <div>
                                <span className="font-bold text-pink-400 block">Straight (Pink)</span>
                                <span className="text-slate-400">Sequential X then Y. "Manhattan" path. Slower, simpler control.</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
            <p className="text-sm text-slate-500 italic text-center">
                Visual demonstration of adiabatic handoff. The 2D inset shows the difference between Diagonal (simultaneous axis chirp) and Straight (sequential axis chirp) movement strategies.
            </p>
        </div>
    );
};