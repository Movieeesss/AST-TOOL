import React, { useState } from 'react';

const AstTool = () => {
  // Input states
  const [breadth, setBreadth] = useState('230');
  const [effDepth, setEffDepth] = useState('392');
  const [reqAst, setReqAst] = useState('695.32');
  const [cover, setCover] = useState('25');

  const [manual1, setManual1] = useState({ dia: 16, nos: '3' });
  const [manual2, setManual2] = useState({ dia: 12, nos: '1' });

  const diameters = [10, 12, 16, 20, 25];
  const num = (val) => (val === '' ? 0 : parseFloat(val));

  const calculateRow = (dia, isManual = false, manualNos = 0) => {
    const b = num(breadth);
    const d = num(effDepth);
    const targetAst = num(reqAst);
    const c = num(cover);

    const areaOneBar = (Math.PI * Math.pow(dia, 2)) / 4;
    const nos = isManual ? manualNos : Math.ceil(targetAst / areaOneBar);
    const providedAst = nos * areaOneBar;
    const pt = b > 0 && d > 0 ? (providedAst * 100) / (b * d) : 0;
    const spacing = nos > 1 ? (b - (2 * c) - (nos * dia)) / (nos - 1) : b - (2 * c) - dia;
    
    // Logic for OK/NOT OK based on your reference
    const isOk = providedAst >= targetAst && spacing >= 25 && targetAst > 0;

    return { nos, providedAst, pt, spacing, isOk };
  };

  // Manual Calculation Logic
  const m1 = calculateRow(manual1.dia, true, num(manual1.nos));
  const m2 = calculateRow(manual2.dia, true, num(manual2.nos));
  const totalManualAst = m1.providedAst + m2.providedAst;
  const totalManualNos = num(manual1.nos) + num(manual2.nos);
  const manualSpacing = totalManualNos > 1 
    ? (num(breadth) - (2 * num(cover)) - (num(manual1.nos) * manual1.dia + num(manual2.nos) * manual2.dia)) / (totalManualNos - 1) 
    : 0;
  const manualStatus = totalManualAst >= num(reqAst) && manualSpacing >= 25;

  return (
    <div className="min-h-screen bg-white font-sans text-black pb-10">
      {/* Header - Matching Doubly Reinforced Style */}
      <div className="bg-[#92d050] p-4 text-center border-b-2 border-[#76b041] shadow-sm">
        <h1 className="text-lg font-black uppercase tracking-tight">AST TOOL — BEAM</h1>
      </div>

      <div className="p-3 max-w-lg mx-auto space-y-4">
        
        {/* Input Section - Color Coded per Reference */}
        <div className="grid grid-cols-2 gap-3 bg-white p-3 border border-gray-300 rounded shadow-sm">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-600 mb-1">Breadth (b) mm</label>
            <input 
              type="text" inputMode="decimal" value={breadth} 
              onChange={(e) => setBreadth(e.target.value)}
              className="p-2 border border-black font-bold text-center bg-[#ffff00]" // Yellow Input
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-600 mb-1">Eff. depth (d) mm</label>
            <input 
              type="text" inputMode="decimal" value={effDepth} 
              onChange={(e) => setEffDepth(e.target.value)}
              className="p-2 border border-black font-bold text-center bg-[#ffff00]" // Yellow Input
            />
          </div>
          <div className="flex flex-col col-span-2">
            <label className="text-[10px] font-bold text-gray-600 mb-1 uppercase">Ast Required (mm²)</label>
            <input 
              type="text" inputMode="decimal" value={reqAst} 
              onChange={(e) => setReqAst(e.target.value)}
              className="p-3 border border-black font-black text-center text-xl bg-[#4472c4] text-white" // Blue Req Ast
            />
          </div>
        </div>

        {/* Auto Solutions with Reference Colors */}
        <div className="space-y-1">
           {/* Table Header */}
           <div className="grid grid-cols-6 gap-0 text-[9px] font-black text-center uppercase bg-gray-100 border border-gray-300">
              <div className="p-1 border-r">Dia</div>
              <div className="p-1 border-r">Nos</div>
              <div className="p-1 border-r">Ast</div>
              <div className="p-1 border-r">Pt%</div>
              <div className="p-1 border-r">Space</div>
              <div className="p-1">Status</div>
           </div>

          {diameters.map(dia => {
            const data = calculateRow(dia);
            return (
              <div key={dia} className="grid grid-cols-6 border-x border-b border-gray-300 font-bold text-[11px] items-center text-center">
                <div className={`${data.isOk ? 'bg-[#92d050]' : 'bg-red-600 text-white'} p-2 border-r border-gray-300`}>{dia}</div>
                <div className={`${data.isOk ? 'bg-[#92d050]' : 'bg-red-600 text-white'} p-2 border-r border-gray-300`}>{data.nos}</div>
                <div className="bg-[#ffcc00] p-2 border-r border-gray-300">{data.providedAst.toFixed(1)}</div>
                <div className="bg-[#ffcc00] p-2 border-r border-gray-300">{data.pt.toFixed(2)}</div>
                <div className="bg-[#ffcc00] p-2 border-r border-gray-300">{data.spacing.toFixed(0)}</div>
                <div className={`${data.isOk ? 'bg-[#92d050]' : 'bg-red-600 text-white'} p-2 uppercase`}>
                  {data.isOk ? 'OK' : 'FAIL'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Selection Section - Mixed Bars */}
        <div className="border-2 border-black rounded overflow-hidden">
          <div className="bg-[#4472c4] text-white p-2 text-[10px] font-black uppercase text-center">
            Enter Provided Value (Mixed Bars)
          </div>
          <div className="p-2 bg-white space-y-2">
            {[ {s: manual1, set: setManual1}, {s: manual2, set: setManual2} ].map((item, i) => (
              <div key={i} className="flex gap-2">
                <select 
                  value={item.s.dia} 
                  onChange={(e) => item.set({...item.s, dia: Number(e.target.value)})}
                  className="flex-1 bg-[#ffff00] p-2 border border-black font-bold text-sm"
                >
                  {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
                </select>
                <input 
                  type="text" inputMode="numeric" value={item.s.nos} 
                  onChange={(e) => item.set({...item.s, nos: e.target.value})}
                  className="w-20 bg-white p-2 border border-black font-bold text-center"
                  placeholder="Nos"
                />
              </div>
            ))}
          </div>
          
          {/* Final Design Status - Color Matching Excel Bottom Row */}
          <div className={`p-3 flex justify-between items-center ${manualStatus ? 'bg-[#92d050]' : 'bg-red-600 text-white'}`}>
            <div className="text-left">
              <div className="text-[10px] font-black uppercase opacity-80">Total Provided</div>
              <div className="text-lg font-black">{totalManualAst.toFixed(2)} <small className="text-[10px]">mm²</small></div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase opacity-80">Spacing</div>
              <div className="text-lg font-black">{manualSpacing.toFixed(1)} <small className="text-[10px]">mm</small></div>
            </div>
            <div className="font-black text-xl ml-4">
              {manualStatus ? '✓ OK' : '✕ FAIL'}
            </div>
          </div>
        </div>

        <button 
          className="w-full p-4 bg-black text-white font-bold rounded shadow-lg uppercase text-xs tracking-widest active:scale-95 transition-transform"
          onClick={() => window.print()}
        >
          Print Design Report
        </button>

      </div>
    </div>
  );
};

export default AstTool;
