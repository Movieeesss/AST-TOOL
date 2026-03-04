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
    <div className="min-h-screen bg-white font-sans text-black pb-10">
      {/* Header */}
      <div className="bg-black text-white p-4 text-center sticky top-0 z-20 shadow-lg border-b-2 border-blue-600">
        <h1 className="text-xl font-black uppercase tracking-tighter">AST TOOL — BEAM</h1>
        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Reinforcement Calculator</p>
      </div>

      <div className="p-3 max-w-lg mx-auto space-y-4">
        
        {/* Input Section */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 border border-gray-300 rounded shadow-sm">
          {[
            { label: 'Breadth (mm)', val: breadth, set: setBreadth, bg: 'bg-yellow-300' },
            { label: 'Depth (mm)', val: effDepth, set: setEffDepth, bg: 'bg-yellow-300' },
            { label: 'Req. Ast (mm²)', val: reqAst, set: setReqAst, bg: 'bg-blue-600 text-white' },
            { label: 'Cover (mm)', val: cover, set: setCover, bg: 'bg-white' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <label className="text-[9px] font-black text-gray-600 uppercase mb-1 ml-1">{item.label}</label>
              <input 
                type="text" 
                inputMode="decimal"
                value={item.val} 
                onChange={(e) => item.set(e.target.value)}
                className={`p-3 border border-black font-black text-lg rounded outline-none shadow-inner ${item.bg}`}
              />
            </div>
          ))}
        </div>

        {/* Auto Options Header */}
        <h2 className="text-xs font-black uppercase border-l-4 border-red-600 pl-2 ml-1 text-gray-700">Auto Solutions</h2>

        {/* Mobile-Friendly Data Cards */}
        <div className="space-y-2">
          {diameters.map(dia => {
            const data = calculateRow(dia);
            return (
              <div key={dia} className="flex flex-col border border-gray-400 rounded overflow-hidden shadow-sm">
                <div className="flex items-center">
                  <div className="bg-red-600 text-white p-3 font-black text-lg w-16 text-center border-r border-gray-400">
                    {dia}
                  </div>
                  <div className={`flex-1 p-2 font-black text-sm text-center border-r border-gray-400 ${data.isOk ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    NOS: {data.nos}
                  </div>
                  <div className={`w-24 p-2 font-black text-xs text-center ${data.isOk ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {data.isOk ? 'OK' : 'NOT OK'}
                  </div>
                </div>
                <div className="flex bg-orange-100 text-[10px] font-bold p-2 divide-x divide-gray-300">
                  <div className="flex-1 text-center">Ast: {data.providedAst.toFixed(1)}</div>
                  <div className="flex-1 text-center">Pt: {data.pt.toFixed(3)}%</div>
                  <div className="flex-1 text-center">Space: {data.spacing.toFixed(1)}mm</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Mix Section */}
        <div className="bg-black rounded p-3 shadow-xl">
          <h2 className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-1 mb-3 inline-block">Enter Provided Bars (Mixed)</h2>
          <div className="space-y-2 mb-4">
            {[ {s: manual1, set: setManual1}, {s: manual2, set: setManual2} ].map((item, i) => (
              <div key={i} className="flex gap-1">
                <select 
                  value={item.s.dia} 
                  onChange={(e) => item.set({...item.s, dia: Number(e.target.value)})}
                  className="flex-1 bg-yellow-300 p-3 rounded font-black text-base border border-gray-400 outline-none"
                >
                  {diameters.map(d => <option key={d} value={d}>{d}mm Bar</option>)}
                </select>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={item.s.nos} 
                  onChange={(e) => item.set({...item.s, nos: e.target.value})}
                  className="w-20 bg-white p-3 rounded font-black text-center text-lg border border-gray-400 outline-none"
                  placeholder="Nos"
                />
              </div>
            ))}
          </div>
          
          {/* Final Design Status Card */}
          <div className={`p-4 rounded border-2 flex flex-col items-center justify-center transition-all ${manualStatus ? 'bg-green-500 border-white' : 'bg-red-600 border-white'}`}>
            <div className="flex justify-around w-full text-white mb-2">
              <div className="text-center">
                <div className="text-[9px] font-black uppercase opacity-80">Total Ast</div>
                <div className="text-xl font-black">{totalManualAst.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] font-black uppercase opacity-80">Spacing</div>
                <div className="text-xl font-black">{manualSpacing.toFixed(1)}</div>
              </div>
            </div>
            <div className="text-white font-black text-lg tracking-widest border-t border-white/30 pt-2 w-full text-center uppercase">
              {manualStatus ? '✓ Design OK' : '✕ Design Failed'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AstTool;
