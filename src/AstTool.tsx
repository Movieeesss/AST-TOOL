import React, { useState, useMemo } from 'react';

const AstTool = () => {
  const initialInputs = {
    breadth: '230',
    overallDepth: '375',
    reqAst: '500',
    cover: '25',
    mainDia: '16'
  };

  const initialManual = {
    m1: { dia: 16, nos: '2' },
    m2: { dia: 12, nos: '1' }
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [manual1, setManual1] = useState(initialManual.m1);
  const [manual2, setManual2] = useState(initialManual.m2);

  const diameters = [10, 12, 16, 20, 25];

  const clearAll = () => {
    setInputs({ breadth: '', overallDepth: '', reqAst: '', cover: '25', mainDia: '16' });
    setManual1({ dia: 16, nos: '' });
    setManual2({ dia: 12, nos: '' });
  };

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
      const isOk = provAst >= targetAst && (nos <= 1 || space >= 25) && targetAst > 0;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = () => {
    const text = `*AST REPORT*\nSize: ${inputs.breadth}x${inputs.overallDepth}\nReq Ast: ${inputs.reqAst}\nProv: ${totalProvAst.toFixed(2)}mm²\nStatus: ${designOk ? 'OK' : 'FAIL'}`;
    navigator.clipboard.writeText(text);
    alert("Report copied!");
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col selection:bg-blue-100">
      {/* Header */}
      <div className="bg-[#92d050] py-4 text-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">AST TOOL — BEAM</h1>
      </div>

      <div className="flex-1 flex flex-col p-2 space-y-3 max-w-md mx-auto w-full">
        {/* Dimensions - Yellow Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase text-gray-500 mb-1">Breadth (b) mm</label>
            <input name="breadth" type="number" value={inputs.breadth} onChange={handleChange} className="bg-[#ffff00] text-center text-2xl font-black py-2 rounded-sm outline-none border border-black/5" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase text-gray-500 mb-1">Overall Depth (D) mm</label>
            <input name="overallDepth" type="number" value={inputs.overallDepth} onChange={handleChange} className="bg-[#ffff00] text-center text-2xl font-black py-2 rounded-sm outline-none border border-black/5" />
          </div>
        </div>

        {/* Calculated Info Row + NEW CLEAR BUTTON LOCATION */}
        <div className="grid grid-cols-3 bg-[#ffff00]/30 border border-gray-200 rounded-sm overflow-hidden">
          <div className="py-2 text-center border-r border-gray-200">
            <span className="block text-[9px] font-bold opacity-60 uppercase tracking-tighter">Eff. Depth (d)</span>
            <span className="text-lg font-black">{calc.effectiveD.toFixed(0)} mm</span>
          </div>
          <div className="py-2 text-center border-r border-gray-200">
            <span className="block text-[9px] font-bold opacity-60 uppercase tracking-tighter">Main Bar Ø</span>
            <select name="mainDia" value={inputs.mainDia} onChange={handleChange} className="text-lg font-black bg-transparent outline-none">
              {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
            </select>
          </div>
          <button onClick={clearAll} className="bg-red-500 text-white font-black uppercase text-[10px] flex items-center justify-center">
            Clear All
          </button>
        </div>

        {/* AST REQUIRED */}
        <div className="bg-[#4472c4] p-3 text-center rounded-sm">
          <label className="text-white text-[11px] font-black uppercase block mb-1">Ast Required (mm²)</label>
          <input name="reqAst" type="number" value={inputs.reqAst} onChange={handleChange} className="w-full bg-[#ffff00] text-center text-3xl font-black py-1 rounded-sm outline-none border border-black/10" />
        </div>

        {/* Results Table */}
        <div className="rounded-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-900 text-white text-[9px] font-black text-center py-2 uppercase">
            <div>Dia</div><div>Nos</div><div>Ast</div><div>Pt%</div><div>Space</div><div>Status</div>
          </div>
          {diameters.map(dia => {
            const d = calc.getRowData(dia);
            return (
              <div key={dia} className="grid grid-cols-6 text-center text-[11px] font-bold h-10 items-center border-b border-gray-50 last:border-0">
                <div className={`h-full flex items-center justify-center ${d.isOk ? 'bg-white' : 'bg-[#ff0000] text-white'}`}>{dia}</div>
                <div className={`h-full flex items-center justify-center border-r border-gray-50 ${d.isOk ? 'bg-white' : 'bg-[#ff0000] text-white'}`}>{d.nos}</div>
                <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/50">{d.provAst.toFixed(0)}</div>
                <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/50">{d.pt.toFixed(2)}</div>
                <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/50">{d.space.toFixed(0)}</div>
                <div className={`h-full flex items-center justify-center font-black ${d.isOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>{d.isOk ? 'OK' : 'FAIL'}</div>
              </div>
            );
          })}
        </div>

        {/* MOVED: Enter Provided Bars (Middle of Screen) */}
        <div className="rounded-sm overflow-hidden border-2 border-[#4472c4] shadow-md">
          <div className="bg-[#4472c4] text-white text-[10px] font-black py-1.5 text-center uppercase">Enter Provided Bars (Mixed)</div>
          <div className="p-2 space-y-2 bg-white">
            {[ {v: manual1, s: setManual1}, {v: manual2, s: setManual2} ].map((row, i) => (
              <div key={i} className="flex gap-2">
                <select value={row.v.dia} onChange={(e) => row.s({...row.v, dia: Number(e.target.value)})} className="flex-1 bg-[#ffff00] font-black p-2 rounded-sm outline-none border border-black/10 text-base">
                  {diameters.map(d => <option key={d} value={d}>{d}mm Bar</option>)}
                </select>
                <input type="number" value={row.v.nos} onChange={(e) => row.s({...row.v, nos: e.target.value})} className="w-24 bg-white border border-gray-400 text-center font-black text-xl rounded-sm" placeholder="Nos" />
              </div>
            ))}
          </div>
        </div>

        {/* Final Status (Now stays above action buttons) */}
        <div className={`p-4 flex justify-between items-center rounded-sm shadow-xl transition-all duration-300 mt-auto ${designOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>
          <div className="leading-tight">
            <span className="text-[10px] font-black uppercase block opacity-70">Provided Ast</span>
            <span className="text-2xl font-black">{totalProvAst.toFixed(1)} <small className="text-xs">mm²</small></span>
          </div>
          <div className="text-center leading-tight">
            <span className="text-[10px] font-black uppercase block opacity-70">Spacing</span>
            <span className="text-2xl font-black">{mixedSpace.toFixed(0)} <small className="text-xs">mm</small></span>
          </div>
          <div className="text-4xl font-black italic tracking-tighter">{designOk ? '✓ OK' : '✕ FAIL'}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pb-2">
          <button onClick={copyToClipboard} className="bg-blue-600 text-white py-4 font-black uppercase text-xs tracking-widest rounded-sm active:scale-95 shadow-md">Copy Result</button>
          <button onClick={() => window.print()} className="bg-black text-white py-4 font-black uppercase text-xs tracking-widest rounded-sm active:scale-95 shadow-md">Print / PDF</button>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
