import React, { useState } from 'react';

const AstTool = () => {
  const [breadth, setBreadth] = useState(230);
  const [effDepth, setEffDepth] = useState(392);
  const [reqAst, setReqAst] = useState(700);
  const [cover, setCover] = useState(25);

  const [manual1, setManual1] = useState({ dia: 25, nos: 2 });
  const [manual2, setManual2] = useState({ dia: 20, nos: 0 });

  const diameters = [10, 12, 16, 20, 25];

  const calculateRow = (dia: number, isManual = false, manualNos = 0) => {
    const areaOneBar = (Math.PI * Math.pow(dia, 2)) / 4;
    const nos = isManual ? manualNos : Math.ceil(reqAst / areaOneBar);
    const providedAst = nos * areaOneBar;
    const pt = (providedAst * 100) / (breadth * effDepth);
    const spacing = nos > 1 ? (breadth - (2 * cover) - (nos * dia)) / (nos - 1) : breadth - (2 * cover) - dia;
    const isOk = providedAst >= reqAst && spacing >= 25;

    return { nos, providedAst, pt, spacing, isOk };
  };

  const m1 = calculateRow(manual1.dia, true, manual1.nos);
  const m2 = calculateRow(manual2.dia, true, manual2.nos);
  const totalManualAst = m1.providedAst + m2.providedAst;
  const totalManualNos = manual1.nos + manual2.nos;
  const manualSpacing = totalManualNos > 1 
    ? (breadth - (2 * cover) - (manual1.nos * manual1.dia + manual2.nos * manual2.dia)) / (totalManualNos - 1) 
    : 0;
  const manualStatus = totalManualAst >= reqAst && manualSpacing >= 25;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 text-white text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">AST TOOL — BEAM REINFORCEMENT</h1>
          <p className="text-slate-400 text-sm mt-1">Professional Structural Design Calculator</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-slate-500 mb-1">Breadth (b) mm</label>
              <input type="number" value={breadth} onChange={(e) => setBreadth(Number(e.target.value))} className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded font-bold focus:border-yellow-400 outline-none transition-all" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-slate-500 mb-1">Eff. Depth (d) mm</label>
              <input type="number" value={effDepth} onChange={(e) => setEffDepth(Number(e.target.value))} className="p-3 bg-yellow-50 border-2 border-yellow-200 rounded font-bold focus:border-yellow-400 outline-none transition-all" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-slate-500 mb-1">Required Ast mm²</label>
              <input type="number" value={reqAst} onChange={(e) => setReqAst(Number(e.target.value))} className="p-3 bg-blue-50 border-2 border-blue-200 rounded font-extrabold text-blue-800 focus:border-blue-400 outline-none transition-all" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase text-slate-500 mb-1">Clear Cover mm</label>
              <input type="number" value={cover} onChange={(e) => setCover(Number(e.target.value))} className="p-3 bg-gray-50 border-2 border-gray-200 rounded font-bold focus:border-slate-400 outline-none transition-all" />
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600 uppercase text-xs font-black">
                  <th className="p-4 border-b">Dia (mm)</th>
                  <th className="p-4 border-b">NOS</th>
                  <th className="p-4 border-b">Ast Provided</th>
                  <th className="p-4 border-b">Pt (%)</th>
                  <th className="p-4 border-b">Spacing</th>
                  <th className="p-4 border-b text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {diameters.map((dia) => {
                  const data = calculateRow(dia);
                  return (
                    <tr key={dia} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 bg-slate-50/50">{dia}</td>
                      <td className="p-4 text-indigo-600 font-bold">{data.nos}</td>
                      <td className="p-4 font-mono">{data.providedAst.toFixed(2)}</td>
                      <td className="p-4">{data.pt.toFixed(3)}</td>
                      <td className={`p-4 ${data.spacing < 25 ? 'text-red-500 font-bold' : ''}`}>{data.spacing.toFixed(1)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${data.isOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {data.isOk ? '✓ OK' : '✕ NOT OK'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Manual Section */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h2 className="text-sm font-black uppercase text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Enter Provide Value (Mixed Sizes)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[manual1, manual2].map((m, i) => (
                <div key={i} className="flex gap-2">
                  <select 
                    value={m.dia} 
                    onChange={(e) => i === 0 ? setManual1({...manual1, dia: Number(e.target.value)}) : setManual2({...manual2, dia: Number(e.target.value)})}
                    className="flex-1 p-3 bg-white border-2 border-slate-200 rounded font-bold outline-none"
                  >
                    {diameters.map(d => <option key={d} value={d}>{d} mm</option>)}
                  </select>
                  <input 
                    type="number" 
                    value={m.nos} 
                    onChange={(e) => i === 0 ? setManual1({...manual1, nos: Number(e.target.value)}) : setManual2({...manual2, nos: Number(e.target.value)})}
                    placeholder="Nos"
                    className="w-24 p-3 bg-white border-2 border-slate-200 rounded font-bold text-center outline-none"
                  />
                </div>
              ))}
            </div>
            
            {/* Manual Summary Bar */}
            <div className={`flex flex-wrap items-center justify-between p-5 rounded-lg border-2 transition-all ${manualStatus ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Total Ast</p>
                  <p className={`text-xl font-black ${manualStatus ? 'text-green-700' : 'text-red-700'}`}>{totalManualAst.toFixed(2)} mm²</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Spacing</p>
                  <p className={`text-xl font-black ${manualStatus ? 'text-green-700' : 'text-red-700'}`}>{manualSpacing.toFixed(1)} mm</p>
                </div>
              </div>
              <div className={`mt-4 md:mt-0 px-8 py-3 rounded font-black text-lg uppercase tracking-widest shadow-sm ${manualStatus ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {manualStatus ? 'Design OK' : 'Design Failed'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
