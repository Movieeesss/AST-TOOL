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
      <div className="bg-[#92d050] py-4 text-center relative">
        <h1 className="text-3xl font-black uppercase tracking-tighter">AST TOOL — BEAM</h1>
        <button onClick={clearAll} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black bg-white/40 px-2 py-1 rounded uppercase">Clear</button>
      </div>

      <div className="flex-1 flex flex-col p-2 space-y-3 max-w-md mx-auto w-full">
        {/* Dimensions - Yellow Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase text-gray-500 mb-1">Breadth (b) mm</label>
            <input name="breadth" type="number" value={inputs.breadth} onChange={handleChange} className="bg-[#ffff00] text-center text-2xl font-black py-2 rounded-sm outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase text-gray-500 mb-1">Overall Depth (D) mm</label>
            <input name="overallDepth" type="number" value={inputs.overallDepth} onChange={handleChange} className="bg-[#ffff00] text-center text-2xl font-black py-2 rounded-sm outline-none" />
          </div>
        </div>

        {/* Calculated Info Row */}
        <div className="grid grid-cols-2 bg-[#ffff00]/30 border border-gray-200 rounded-sm">
          <div className="py-2 text-center border-r border-gray-200">
            <span className="block text-[10px] font-bold opacity-60 uppercase tracking-widest">Eff. Depth (d)</span>
            <span className="text-xl font-black">{calc.effectiveD.toFixed(0)} mm</span>
          </div>
          <div className="py-2 text-center">
            <span className="block text-[10px] font-bold opacity-60 uppercase tracking-widest">Main Bar Ø</span>
            <select name="mainDia" value={inputs.mainDia} onChange={handleChange} className="text-xl font-black bg-transparent outline-none border-b-2 border-black/10">
              {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
            </select>
          </div>
        </div>

        {/* AST REQUIRED - High Visibility Blue/Yellow */}
        <div className="bg-[#4472c4] p-4 text-center rounded-sm shadow-inner">
          <label className="text-white text-[11px] font-black uppercase block mb-1">Ast Required (mm²)</label>
          <input name="reqAst" type="number" value={inputs.reqAst} onChange={handleChange} className="w-full bg-[#ffff00] text-center text-4xl font-black py-1 rounded-sm outline-none shadow-md" />
        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-auto rounded-sm border border-gray-100 shadow-sm">
          <div className="grid grid-cols-6 bg-gray-900 text-white text-[10px] font-black text-center py-2 uppercase sticky top-0">
            <div>Dia</div><div>Nos</div><div>Ast</div><div>Pt%</div><div>Space</div><div>Status</div>
          </div>
          {diameters.map(dia => {
            const d = calc.getRowData(dia);
            return (
              <div key={dia} className="grid grid-cols-6 text-center text-[12px] font-bold h-11 items-center border-b border-gray-50 last:border-0">
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

        {/* Manual Mixed Entry */}
        <div className="rounded-sm overflow-hidden border border-gray-200">
          <div className="bg-[#4472c4] text-white text-[10px] font-black py-1.5 text-center uppercase">Enter Provided Bars (Mixed)</div>
          <div className="p-2 space-y-2 bg-gray-50">
            {[ {v: manual1, s: setManual1}, {v: manual2, s: setManual2} ].map((row, i) => (
              <div key={i} className="flex gap-2">
                <select value={row.v.dia} onChange={(e) => row.s({...row.v, dia: Number(e.target.value)})} className="flex-1 bg-[#ffff00] font-black p-2.5 rounded-sm outline-none border border-black/5 text-lg">
                  {diameters.map(d => <option key={d} value={d}>{d}mm Bar</option>)}
                </select>
                <input type="number" value={row.v.nos} onChange={(e) => row.s({...row.v, nos: e.target.value})} className="w-24 bg-white border border-gray-300 text-center font-black text-xl rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Full-Width Bottom Status Bar */}
        <div className={`p-4 flex justify-between items-center rounded-sm shadow-xl transition-all duration-300 ${designOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>
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
          <button onClick={copyToClipboard} className="bg-blue-600 text-white py-4 font-black uppercase text-xs tracking-widest rounded-sm active:scale-95 transition-all shadow-md">Copy Result</button>
          <button onClick={() => window.print()} className="bg-black text-white py-4 font-black uppercase text-xs tracking-widest rounded-sm active:scale-95 transition-all shadow-md">Print / PDF</button>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
