import React, { useState } from 'react';

const AstTool = () => {
  // Using strings for inputs to allow smooth typing without "0" interference
  const [breadth, setBreadth] = useState('230');
  const [effDepth, setEffDepth] = useState('392');
  const [reqAst, setReqAst] = useState('700');
  const [cover, setCover] = useState('25');

  const [manual1, setManual1] = useState({ dia: 25, nos: '2' });
  const [manual2, setManual2] = useState({ dia: 20, nos: '0' });

  const diameters = [10, 12, 16, 20, 25];

  // Helper to convert string to number safely
  const num = (val: string) => parseFloat(val) || 0;

  const calculateRow = (dia: number, isManual = false, manualNos = 0) => {
    const b = num(breadth);
    const d = num(effDepth);
    const targetAst = num(reqAst);
    const c = num(cover);

    const areaOneBar = (Math.PI * Math.pow(dia, 2)) / 4;
    const nos = isManual ? manualNos : Math.ceil(targetAst / areaOneBar);
    const providedAst = nos * areaOneBar;
    const pt = b > 0 && d > 0 ? (providedAst * 100) / (b * d) : 0;
    
    // Spacing formula
    const spacing = nos > 1 ? (b - (2 * c) - (nos * dia)) / (nos - 1) : b - (2 * c) - dia;
    const isOk = providedAst >= targetAst && spacing >= 25 && targetAst > 0;

    return { nos, providedAst, pt, spacing, isOk };
  };

  const m1 = calculateRow(manual1.dia, true, num(manual1.nos));
  const m2 = calculateRow(manual2.dia, true, num(manual2.nos));
  const totalManualAst = m1.providedAst + m2.providedAst;
  const totalManualNos = num(manual1.nos) + num(manual2.nos);
  
  const manualSpacing = totalManualNos > 1 
    ? (num(breadth) - (2 * num(cover)) - (num(manual1.nos) * manual1.dia + num(manual2.nos) * manual2.dia)) / (totalManualNos - 1) 
    : 0;
  const manualStatus = totalManualAst >= num(reqAst) && manualSpacing >= 25 && num(reqAst) > 0;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden border border-slate-300">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center border-b-4 border-blue-600">
          <h1 className="text-3xl font-black tracking-tight">AST TOOL — BEAM REINFORCEMENT</h1>
          <p className="text-blue-400 font-bold text-sm uppercase mt-1">Structural Engineering Calculator</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-200">
            {[
              { label: 'Breadth (b) mm', val: breadth, set: setBreadth, color: 'border-yellow-400 bg-yellow-50' },
              { label: 'Eff. Depth (d) mm', val: effDepth, set: setEffDepth, color: 'border-yellow-400 bg-yellow-50' },
              { label: 'Required Ast mm²', val: reqAst, set: setReqAst, color: 'border-blue-500 bg-blue-50' },
              { label: 'Clear Cover mm', val: cover, set: setCover, color: 'border-slate-400 bg-white' },
            ].map((input, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="text-xs font-black text-slate-600 uppercase mb-2">{input.label}</label>
                <input 
                  type="text" 
                  value={input.val} 
                  onChange={(e) => input.set(e.target.value)}
                  className={`p-3 border-2 rounded text-lg font-black outline-none transition-all ${input.color} focus:ring-2 focus:ring-blue-300`}
                />
              </div>
            ))}
          </div>

          {/* Table Section */}
          <div className="overflow-hidden rounded-lg border-2 border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white text-sm font-black uppercase">
                  <th className="p-4 border-r border-slate-700">Diameters</th>
                  <th className="p-4 border-r border-slate-700">NOS</th>
                  <th className="p-4 border-r border-slate-700">Ast Provided</th>
                  <th className="p-4 border-r border-slate-700">Pt (%)</th>
                  <th className="p-4 border-r border-slate-700">Spacing</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 font-bold text-slate-900">
                {diameters.map((dia) => {
                  const data = calculateRow(dia);
                  return (
                    <tr key={dia} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 bg-slate-100 border-r-2 border-slate-200 text-red-600 text-lg">{dia}</td>
                      <td className="p-4 border-r-2 border-slate-200 text-blue-700">{data.nos}</td>
                      <td className="p-4 border-r-2 border-slate-200 font-mono">{data.providedAst.toFixed(2)}</td>
                      <td className="p-4 border-r-2 border-slate-200">{data.pt.toFixed(3)}</td>
                      <td className="p-4 border-r-2 border-slate-200">{data.spacing.toFixed(1)}</td>
                      <td className={`p-4 text-center font-black ${data.isOk ? 'bg-green-500 text-white' : 'bg-red-600 text-white'}`}>
                        {data.isOk ? 'OK' : 'NOT OK'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Manual Mix Section */}
          <div className="bg-slate-900 p-6 rounded-lg shadow-inner">
            <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">Enter Provide Value (Mixed Bars)</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {[ {state: manual1, set: setManual1}, {state: manual2, set: setManual2} ].map((item, i) => (
                <div key={i} className="flex-1 flex gap-2">
                  <select 
                    value={item.state.dia} 
                    onChange={(e) => item.set({...item.state, dia: Number(e.target.value)})}
                    className="flex-1 p-3 bg-yellow-400 border-none rounded font-black text-slate-900 outline-none"
                  >
                    {diameters.map(d => <option key={d} value={d}>{d} mm</option>)}
                  </select>
                  <input 
                    type="text" 
                    value={item.state.nos} 
                    onChange={(e) => item.set({...item.state, nos: e.target.value})}
                    className="w-24 p-3 bg-yellow-100 border-none rounded font-black text-center outline-none"
                    placeholder="Nos"
                  />
                </div>
              ))}
            </div>
            
            {/* Manual Status Bar */}
            <div className={`flex flex-col md:flex-row items-center justify-between p-6 rounded border-l-8 transition-all ${manualStatus ? 'bg-green-100 border-green-600' : 'bg-red-100 border-red-600'}`}>
              <div className="flex gap-10 text-slate-900">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Manual Ast</p>
                  <p className="text-2xl font-black">{totalManualAst.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Spacing</p>
                  <p className="text-2xl font-black">{manualSpacing.toFixed(1)}</p>
                </div>
              </div>
              <div className={`mt-4 md:mt-0 px-10 py-4 rounded font-black text-xl uppercase tracking-tighter ${manualStatus ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {manualStatus ? '✓ DESIGN OK' : '✕ DESIGN FAILED'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
