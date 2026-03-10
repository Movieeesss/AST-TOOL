import React, { useState, useMemo } from 'react';

const AstTool = () => {
  // Input states as strings to prevent cursor jumping and typing lag
  const [inputs, setInputs] = useState({
    breadth: '230',
    overallDepth: '425',
    reqAst: '695.32',
    cover: '25',
    mainDia: '16'
  });

  const [manual1, setManual1] = useState({ dia: 16, nos: '3' });
  const [manual2, setManual2] = useState({ dia: 12, nos: '1' });

  const diameters = [10, 12, 16, 20, 25];

  // Optimized Calculation Logic
  const calc = useMemo(() => {
    const B = parseFloat(inputs.breadth) || 0;
    const D = parseFloat(inputs.overallDepth) || 0;
    const C = parseFloat(inputs.cover) || 0;
    const DIA = parseFloat(inputs.mainDia) || 0;
    const targetAst = parseFloat(inputs.reqAst) || 0;

    // d = D - Cover - (Main Bar Dia / 2)
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

  // Manual Summary Calculation
  const m1 = calc.getRowData(manual1.dia, true, parseFloat(manual1.nos) || 0);
  const m2 = calc.getRowData(manual2.dia, true, parseFloat(manual2.nos) || 0);
  const totalProvAst = m1.provAst + m2.provAst;
  const totalNos = (parseFloat(manual1.nos) || 0) + (parseFloat(manual2.nos) || 0);
  const mixedSpace = totalNos > 1 
    ? (calc.B - (2 * calc.C) - ( (parseFloat(manual1.nos)*manual1.dia) + (parseFloat(manual2.nos)*manual2.dia) )) / (totalNos - 1)
    : 0;
  const designOk = totalProvAst >= calc.targetAst && mixedSpace >= 25;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-black selection:bg-blue-200">
      {/* Header */}
      <div className="bg-[#92d050] p-5 text-center border-b-4 border-[#76b041] sticky top-0 z-50">
        <h1 className="text-2xl font-black tracking-tighter text-gray-900">AST TOOL — BEAM</h1>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        
        {/* Input Grid */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="grid grid-cols-2 border-b-2 border-black">
            <div className="p-3 border-r-2 border-black">
              <label className="text-[10px] font-black uppercase">Breadth (b) mm</label>
              <input name="breadth" type="number" value={inputs.breadth} onChange={handleChange} className="w-full text-xl font-bold bg-[#ffff00] border border-gray-400 p-1 text-center outline-none" />
            </div>
            <div className="p-3">
              <label className="text-[10px] font-black uppercase text-blue-700">Overall Depth (D) mm</label>
              <input name="overallDepth" type="number" value={inputs.overallDepth} onChange={handleChange} className="w-full text-xl font-bold bg-[#ffff00] border border-gray-400 p-1 text-center outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 bg-gray-50 border-b-2 border-black">
             <div className="p-2 border-r-2 border-black text-center">
                <span className="text-[9px] font-bold block">EFFECTIVE DEPTH (d)</span>
                <span className="text-lg font-black">{calc.effectiveD.toFixed(0)} mm</span>
             </div>
             <div className="p-2 text-center">
                <span className="text-[9px] font-bold block">MAIN BAR Ø</span>
                <select name="mainDia" value={inputs.mainDia} onChange={handleChange} className="font-bold bg-white border border-black px-2">
                  {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
                </select>
             </div>
          </div>

          <div className="p-4 bg-[#4472c4]">
            <label className="text-white text-[10px] font-black block text-center mb-1">AST REQUIRED (MM²)</label>
            <input name="reqAst" type="text" value={inputs.reqAst} onChange={handleChange} className="w-full text-3xl font-black text-center bg-[#4472c4] text-white outline-none" />
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden text-[11px]">
          <div className="grid grid-cols-6 bg-gray-800 text-white font-bold text-center py-2 uppercase tracking-tighter">
            <div>Dia</div><div>Nos</div><div>Ast</div><div>Pt%</div><div>Space</div><div>Status</div>
          </div>
          {diameters.map(dia => {
            const d = calc.getRowData(dia);
            return (
              <div key={dia} className="grid grid-cols-6 text-center border-t border-gray-300 font-bold h-10 items-center">
                <div className={`h-full flex items-center justify-center border-r ${d.isOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>{dia}</div>
                <div className={`h-full flex items-center justify-center border-r ${d.isOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>{d.nos}</div>
                <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r">{d.provAst.toFixed(1)}</div>
                <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r">{d.pt.toFixed(2)}</div>
                <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r">{d.space.toFixed(0)}</div>
                <div className={`h-full flex items-center justify-center ${d.isOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>{d.isOk ? 'OK' : 'FAIL'}</div>
              </div>
            );
          })}
        </div>

        {/* Mixed Bar Entry */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-[#4472c4] text-white text-[10px] font-black p-2 text-center uppercase">Enter Provided Value (Mixed Bars)</div>
          <div className="p-3 space-y-2">
            {[ {v: manual1, s: setManual1}, {v: manual2, s: setManual2} ].map((row, i) => (
              <div key={i} className="flex gap-2">
                <select value={row.v.dia} onChange={(e) => row.s({...row.v, dia: Number(e.target.value)})} className="flex-1 bg-[#ffff00] border-2 border-black font-bold p-2">
                  {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
                </select>
                <input type="number" value={row.v.nos} onChange={(e) => row.s({...row.v, nos: e.target.value})} className="w-24 border-2 border-black p-2 text-center font-bold" placeholder="Nos" />
              </div>
            ))}
          </div>

          <div className={`p-4 flex justify-between items-center border-t-2 border-black transition-colors duration-300 ${designOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>
            <div className="leading-tight">
              <span className="text-[9px] font-black uppercase block">Total Provided</span>
              <span className="text-xl font-black">{totalProvAst.toFixed(2)} <small className="text-xs">mm²</small></span>
            </div>
            <div className="text-center leading-tight">
              <span className="text-[9px] font-black uppercase block">Spacing</span>
              <span className="text-xl font-black">{mixedSpace.toFixed(1)} <small className="text-xs">mm</small></span>
            </div>
            <div className="text-2xl font-black italic">{designOk ? '✓ OK' : '✕ FAIL'}</div>
          </div>
        </div>

        <button onClick={() => window.print()} className="w-full bg-white border-2 border-black p-4 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
          Print Design Report
        </button>
        
      </div>
    </div>
  );
};

export default AstTool;
