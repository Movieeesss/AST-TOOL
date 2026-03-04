import React, { useState } from 'react';

const AstTool = () => {
  // Input states as strings for smooth mobile typing
  const [breadth, setBreadth] = useState('230');
  const [effDepth, setEffDepth] = useState('392');
  const [reqAst, setReqAst] = useState('600');
  const [cover, setCover] = useState('25');

  const [manual1, setManual1] = useState({ dia: 16, nos: '2' });
  const [manual2, setManual2] = useState({ dia: 12, nos: '2' });

  const diameters = [10, 12, 16, 20, 25];
  const num = (val: string) => (val === '' ? 0 : parseFloat(val));

  const calculateRow = (dia: number, isManual = false, manualNos = 0) => {
    const b = num(breadth);
    const d = num(effDepth);
    const targetAst = num(reqAst);
    const c = num(cover);

    const areaOneBar = (Math.PI * Math.pow(dia, 2)) / 4;
    const nos = isManual ? manualNos : Math.ceil(targetAst / areaOneBar);
    const providedAst = nos * areaOneBar;
    const pt = b > 0 && d > 0 ? (providedAst * 100) / (b * d) : 0;
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
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-10">
      {/* Header - Fixed for Mobile */}
      <div className="bg-slate-900 text-white p-4 text-center sticky top-0 z-10 shadow-md">
        <h1 className="text-xl md:text-2xl font-black uppercase leading-tight">AST Tool — Beam</h1>
        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Structural Calculator</p>
      </div>

      <div className="p-3 md:p-6 max-w-4xl mx-auto space-y-4">
        
        {/* Input Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Breadth (mm)', val: breadth, set: setBreadth, bg: 'bg-yellow-100 border-yellow-400' },
            { label: 'Eff. Depth (mm)', val: effDepth, set: setEffDepth, bg: 'bg-yellow-100 border-yellow-400' },
            { label: 'Req. Ast (mm²)', val: reqAst, set: setReqAst, bg: 'bg-blue-100 border-blue-500' },
            { label: 'Cover (mm)', val: cover, set: setCover, bg: 'bg-white border-slate-300' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1 mb-1">{item.label}</label>
              <input 
                type="text" 
                inputMode="decimal"
                value={item.val} 
                onChange={(e) => item.set(e.target.value)}
                className={`p-3 border-2 rounded-lg font-black text-lg outline-none transition-all ${item.bg}`}
              />
            </div>
          ))}
        </div>

        {/* Data Display - Becomes Cards on Mobile, Table on Desktop */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-slate-300 bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-white text-[10px] uppercase">
              <tr>
                <th className="p-3 border-r border-slate-700">Dia</th>
                <th className="p-3 border-r border-slate-700">NOS</th>
                <th className="p-3 border-r border-slate-700">Provided Ast</th>
                <th className="p-3 border-r border-slate-700">Pt (%)</th>
                <th className="p-3 border-r border-slate-700">Spacing</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {diameters.map(dia => {
                const data = calculateRow(dia);
                return (
                  <tr key={dia} className="font-bold text-sm">
                    <td className="p-3 bg-slate-50 border-r border-slate-200 text-red-600">{dia}</td>
                    <td className={`p-3 border-r border-slate-200 ${data.isOk ? 'text-green-600' : 'text-red-600'}`}>{data.nos}</td>
                    <td className="p-3 border-r border-slate-200">{data.providedAst.toFixed(2)}</td>
                    <td className="p-3 border-r border-slate-200">{data.pt.toFixed(3)}</td>
                    <td className="p-3 border-r border-slate-200">{data.spacing.toFixed(1)}</td>
                    <td className={`p-3 text-center text-white text-xs ${data.isOk ? 'bg-green-600' : 'bg-red-600'}`}>{data.isOk ? 'OK' : 'NOT OK'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards (Hidden on Desktop) */}
        <div className="md:hidden space-y-2">
          {diameters.map(dia => {
            const data = calculateRow(dia);
            return (
              <div key={dia} className={`flex items-center justify-between p-3 rounded-lg border-l-8 bg-white shadow-sm border ${data.isOk ? 'border-l-green-600' : 'border-l-red-600'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-xs font-bold">{dia}mm</span>
                    <span className="font-black text-slate-900">NOS: {data.nos}</span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase">
                    Ast: {data.providedAst.toFixed(1)} | Spacing: {data.spacing.toFixed(1)}
                  </div>
                </div>
                <div className={`font-black text-[10px] px-2 py-1 rounded ${data.isOk ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                  {data.isOk ? 'SAFE' : 'UNSAFE'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Mix Section */}
        <div className="bg-slate-900 rounded-xl p-4 shadow-xl">
          <h2 className="text-blue-400 text-[10px] font-black uppercase mb-3 tracking-widest text-center">Enter Provided Value (Mixed)</h2>
          <div className="flex gap-2 mb-4">
            {[ {s: manual1, set: setManual1}, {s: manual2, set: setManual2} ].map((item, i) => (
              <div key={i} className="flex-1 flex gap-1">
                <select 
                  value={item.s.dia} 
                  onChange={(e) => item.set({...item.s, dia: Number(e.target.value)})}
                  className="bg-yellow-400 p-2 rounded-lg font-black text-sm w-full outline-none"
                >
                  {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
                </select>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={item.s.nos} 
                  onChange={(e) => item.set({...item.s, nos: e.target.value})}
                  className="w-12 bg-white p-2 rounded-lg font-black text-center text-sm outline-none"
                />
              </div>
            ))}
          </div>
          
          <div className={`p-4 rounded-lg flex items-center justify-between ${manualStatus ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase opacity-75 leading-none">Total Ast</div>
              <div className="text-xl font-black">{totalManualAst.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-black uppercase opacity-75 leading-none">Spacing</div>
              <div className="text-xl font-black">{manualSpacing.toFixed(1)}</div>
            </div>
            <div className="text-right font-black text-sm leading-tight">
              {manualStatus ? 'DESIGN\nSAFE' : 'DESIGN\nFAILED'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AstTool;
