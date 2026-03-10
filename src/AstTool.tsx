import React, { useState, useMemo } from 'react';

const AstTool = () => {
  const [inputs, setInputs] = useState({
    breadth: '230',
    overallDepth: '375',
    reqAst: '500',
    cover: '25',
    mainDia: '16'
  });

  const [manual1, setManual1] = useState({ dia: 16, nos: '2' });
  const [manual2, setManual2] = useState({ dia: 12, nos: '1' });

  const diameters = [10, 12, 16, 20, 25];

  const calc = useMemo(() => {
    const B = parseFloat(inputs.breadth) || 0;
    const D = parseFloat(inputs.overallDepth) || 0;
    const C = parseFloat(inputs.cover) || 0;
    const DIA = parseFloat(inputs.mainDia) || 0;
    const targetAst = parseFloat(inputs.reqAst) || 0;
    const effectiveD = D > 0 ? D - C - (DIA / 2) : 0;

    const getRowData = (dia, isManual = false, mNos = 0) => {
      const areaOne = (Math.PI * Math.pow(dia, 2)) / 4;
      const nos = isManual ? mNos : Math.ceil(targetAst / areaOne);
      const provAst = nos * areaOne;
      const pt = (B > 0 && effectiveD > 0) ? (provAst * 100) / (B * effectiveD) : 0;
      const space = nos > 1 ? (B - (2 * C) - (nos * dia)) / (nos - 1) : 0;
      const isOk = provAst >= targetAst && space >= 25 && targetAst > 0;
      return { nos, provAst, pt, space, isOk };
    };

    return { B, D, effectiveD, targetAst, C, getRowData };
  }, [inputs]);

  const m1 = calc.getRowData(manual1.dia, true, parseFloat(manual1.nos) || 0);
  const m2 = calc.getRowData(manual2.dia, true, parseFloat(manual2.nos) || 0);
  const totalProvAst = m1.provAst + m2.provAst;
  const totalNos = (parseFloat(manual1.nos) || 0) + (parseFloat(manual2.nos) || 0);
  const mixedSpace = totalNos > 1 
    ? (calc.B - (2 * calc.C) - ((parseFloat(manual1.nos) * manual1.dia) + (parseFloat(manual2.nos) * manual2.dia))) / (totalNos - 1)
    : 0;
  const designOk = totalProvAst >= calc.targetAst && (totalNos <= 1 || mixedSpace >= 25);

  const copyToClipboard = () => {
    const text = `*BEAM AST REPORT*\n------------------\nSize: ${inputs.breadth}x${inputs.overallDepth} mm\nAst Req: ${inputs.reqAst} mm²\n\n*Provided:* \n${manual1.nos}nos - ${manual1.dia}mm\n${manual2.nos}nos - ${manual2.dia}mm\nTotal Ast: ${totalProvAst.toFixed(2)} mm²\nSpacing: ${mixedSpace.toFixed(1)} mm\nStatus: ${designOk ? '✅ DESIGN OK' : '❌ DESIGN FAIL'}`;
    navigator.clipboard.writeText(text);
    alert("Report copied to clipboard!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black flex flex-col">
      <div className="bg-[#92d050] py-4 text-center">
        <h1 className="text-xl font-black uppercase tracking-tight">AST TOOL — BEAM</h1>
      </div>

      <div className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col gap-4">
        
        {/* Input Box */}
        <div className="bg-[#00b0f0] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#0070c0] text-white text-[10px] font-bold py-1 text-center uppercase">Editable Data</div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center bg-white/20 p-2 rounded-lg">
              <label className="text-xs font-bold text-[#003366]">Breadth (b) mm</label>
              <input name="breadth" type="number" value={inputs.breadth} onChange={handleChange} className="w-24 text-right font-black text-lg bg-white rounded border-none px-2 outline-none" />
            </div>
            <div className="flex justify-between items-center bg-white/20 p-2 rounded-lg">
              <label className="text-xs font-bold text-[#003366]">Overall Depth (D) mm</label>
              <input name="overallDepth" type="number" value={inputs.overallDepth} onChange={handleChange} className="w-24 text-right font-black text-lg bg-white rounded border-none px-2 outline-none" />
            </div>
            <div className="flex justify-between items-center bg-[#4472c4] p-3 rounded-lg">
              <label className="text-xs font-black text-white uppercase">Ast Required (mm²)</label>
              <input name="reqAst" type="number" value={inputs.reqAst} onChange={handleChange} className="w-28 text-right font-black text-xl bg-[#ffff00] rounded px-2 outline-none" />
            </div>
          </div>
        </div>

        {/* Eff Depth Row */}
        <div className="grid grid-cols-2 bg-[#ffff00] rounded-lg text-[11px] font-black border border-gray-200">
           <div className="p-2 border-r border-black/10 text-center">
              <span className="opacity-70 block">EFF. DEPTH (d)</span>
              <span className="text-base">{calc.effectiveD.toFixed(0)} mm</span>
           </div>
           <div className="p-2 text-center">
              <span className="opacity-70 block">MAIN BAR Ø</span>
              <select name="mainDia" value={inputs.mainDia} onChange={handleChange} className="bg-transparent text-base outline-none">
                {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
              </select>
           </div>
        </div>

        {/* Auto Solutions Table */}
        <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
          <div className="grid grid-cols-6 bg-gray-100 text-[10px] font-black text-center py-2 uppercase">
            <div>Dia</div><div>Nos</div><div>Ast</div><div>Pt%</div><div>Space</div><div>Status</div>
          </div>
          {diameters.map(dia => {
            const d = calc.getRowData(dia);
            return (
              <div key={dia} className={`grid grid-cols-6 text-center text-[12px] font-bold h-10 items-center border-b border-gray-50 last:border-0 ${d.isOk ? 'bg-white' : 'bg-red-50'}`}>
                <div className={`h-full flex items-center justify-center ${d.isOk ? 'text-black' : 'bg-red-600 text-white'}`}>{dia}</div>
                <div className={`h-full flex items-center justify-center ${d.isOk ? 'text-black' : 'bg-red-600 text-white'}`}>{d.nos}</div>
                <div className="bg-[#ffcc00]/20 h-full flex items-center justify-center">{d.provAst.toFixed(0)}</div>
                <div className="bg-[#ffcc00]/20 h-full flex items-center justify-center">{d.pt.toFixed(2)}</div>
                <div className="bg-[#ffcc00]/20 h-full flex items-center justify-center">{d.space.toFixed(0)}</div>
                <div className={`h-full flex items-center justify-center font-black ${d.isOk ? 'text-green-600' : 'bg-red-600 text-white'}`}>
                  {d.isOk ? 'OK' : 'FAIL'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mixed Bar Entry */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <div className="bg-[#0070c0] text-white text-[9px] font-black py-1 px-3 rounded-full w-fit mx-auto mb-3 uppercase text-center">Enter Provided Bars</div>
          <div className="space-y-2">
            {[ {v: manual1, s: setManual1}, {v: manual2, s: setManual2} ].map((row, i) => (
              <div key={i} className="flex gap-2">
                <select value={row.v.dia} onChange={(e) => row.s({...row.v, dia: Number(e.target.value)})} className="flex-1 bg-[#ffff00] font-bold p-2 rounded-lg outline-none">
                  {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
                </select>
                <input type="number" value={row.v.nos} onChange={(e) => row.s({...row.v, nos: e.target.value})} className="w-20 bg-white border border-gray-300 rounded-lg p-2 text-center font-bold" />
              </div>
            ))}
          </div>
        </div>

        {/* Final Status */}
        <div className={`mt-auto p-4 rounded-xl flex justify-between items-center shadow-lg ${designOk ? 'bg-[#92d050]' : 'bg-red-600 text-white'}`}>
          <div className="text-left">
            <span className="text-[9px] font-black uppercase opacity-70 block">Total Provided</span>
            <span className="text-xl font-black">{totalProvAst.toFixed(1)} <small className="text-[10px]">mm²</small></span>
          </div>
          <div className="text-center">
            <span className="text-[9px] font-black uppercase opacity-70 block">Spacing</span>
            <span className="text-xl font-black">{mixedSpace.toFixed(0)} <small className="text-[10px]">mm</small></span>
          </div>
          <div className="text-2xl font-black italic">{designOk ? '✓ OK' : '✕ FAIL'}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={copyToClipboard} className="bg-blue-600 text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-md active:scale-95 transition-all">
            Copy Result
          </button>
          <button onClick={() => window.print()} className="bg-[#333] text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-md active:scale-95 transition-all">
            Print / PDF
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default AstTool;
