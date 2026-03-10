import React, { useState, useMemo } from 'react';

const AstTool = () => {
  const defaultInputs = {
    breadth: '230',
    overallDepth: '375',
    reqAst: '500',
    cover: '25',
    mainDia: '16'
  };

  const [inputs, setInputs] = useState(defaultInputs);
  const [manual1, setManual1] = useState({ dia: 16, nos: '2' });
  const [manual2, setManual2] = useState({ dia: 12, nos: '1' });

  const diameters = [10, 12, 16, 20, 25];

  const handleReset = () => {
    setInputs(defaultInputs);
    setManual1({ dia: 16, nos: '2' });
    setManual2({ dia: 12, nos: '1' });
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
    alert("Copied!");
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <div className="bg-[#92d050] py-4 text-center relative">
        <h1 className="text-xl font-black uppercase tracking-tighter">AST TOOL — BEAM</h1>
        <button 
          onClick={handleReset}
          className="absolute right-2 top-3 bg-white/20 text-[10px] font-black px-2 py-1 rounded"
        >
          RESET
        </button>
      </div>

      <div className="flex-1 flex flex-col p-2 space-y-3">
        {/* Input Section */}
        <div className="space-y-1">
          <div className="grid grid-cols-2 gap-1 font-bold text-[10px] uppercase text-gray-700">
            <span>Breadth (b) mm</span>
            <span>Overall Depth (D) mm</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <input name="breadth" type="number" value={inputs.breadth} onChange={handleChange} className="bg-[#ffff00] border-none text-center text-xl font-black py-2 outline-none rounded-sm" />
            <input name="overallDepth" type="number" value={inputs.overallDepth} onChange={handleChange} className="bg-[#ffff00] border-none text-center text-xl font-black py-2 outline-none rounded-sm" />
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-2 gap-1 border border-black/10 text-center font-bold text-[11px]">
          <div className="py-2 border-r border-black/5">
            <span className="block opacity-60 uppercase">Eff. Depth (d)</span>
            <span className="text-lg font-black">{calc.effectiveD.toFixed(0)} mm</span>
          </div>
          <div className="py-2">
            <span className="block opacity-60 uppercase">Main Bar Ø</span>
            <select name="mainDia" value={inputs.mainDia} onChange={handleChange} className="text-lg font-black bg-transparent outline-none">
              {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
            </select>
          </div>
        </div>

        {/* AST Required Section */}
        <div className="bg-[#4472c4] p-3 text-center">
          <label className="text-white text-xs font-black uppercase block mb-1">Ast Required (mm²)</label>
          <input name="reqAst" type="number" value={inputs.reqAst} onChange={handleChange} className="w-full bg-[#ffff00] border-none text-center text-3xl font-black py-1 outline-none rounded-sm" />
        </div>

        {/* Results Table */}
        <div className="flex-1 overflow-auto border border-black/10 rounded-sm">
          <div className="grid grid-cols-6 bg-gray-100 text-[10px] font-black text-center py-2 uppercase border-b border-black/10">
            <div>Dia</div><div>Nos</div><div>Ast</div><div>Pt%</div><div>Space</div><div>Status</div>
          </div>
          {diameters.map(dia => {
            const d = calc.getRowData(dia);
            return (
              <div key={dia} className="grid grid-cols-6 text-center text-[12px] font-bold h-10 items-center border-b border-black/5 last:border-0">
                <div className={`h-full flex items-center justify-center ${d.isOk ? 'bg-white' : 'bg-[#ff0000] text-white'}`}>{dia}</div>
                <div className={`h-full flex items-center justify-center ${d.isOk ? 'bg-white' : 'bg-[#ff0000] text-white'}`}>{d.nos}</div>
                <div className="bg-[#ffcc00] h-full flex items-center justify-center border-x border-white/20">{d.provAst.toFixed(0)}</div>
                <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/20">{d.pt.toFixed(2)}</div>
                <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/20">{d.space.toFixed(0)}</div>
                <div className={`h-full flex items-center justify-center ${d.isOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>{d.isOk ? 'OK' : 'FAIL'}</div>
              </div>
            );
          })}
        </div>

        {/* Mixed Bar Entry */}
        <div className="border border-black/10 rounded-sm">
          <div className="bg-[#0070c0] text-white text-[10px] font-black py-1 text-center uppercase">Enter Provided Bars (Mixed)</div>
          <div className="p-2 space-y-2">
            {[ {v: manual1, s: setManual1}, {v: manual2, s: setManual2} ].map((row, i) => (
              <div key={i} className="flex gap-2">
                <select value={row.v.dia} onChange={(e) => row.s({...row.v, dia: Number(e.target.value)})} className="flex-1 bg-[#ffff00] font-black p-2 outline-none rounded-sm border border-black/5">
                  {diameters.map(d => <option key={d} value={d}>{d}mm Bar</option>)}
                </select>
                <input type="number" value={row.v.nos} onChange={(e) => row.s({...row.v, nos: e.target.value})} className="w-20 border border-black/10 text-center font-black rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Final Status */}
        <div className={`p-4 flex justify-between items-center rounded-sm shadow-md transition-colors ${designOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>
          <div className="leading-tight">
            <span className="text-[10px] font-black uppercase block opacity-70">Total Provided</span>
            <span className="text-2xl font-black">{totalProvAst.toFixed(1)} <small className="text-xs">mm²</small></span>
          </div>
          <div className="text-center leading-tight">
            <span className="text-[10px] font-black uppercase block opacity-70">Spacing</span>
            <span className="text-2xl font-black">{mixedSpace.toFixed(0)} <small className="text-xs">mm</small></span>
          </div>
          <div className="text-3xl font-black italic">{designOk ? '✓ OK' : '✕ FAIL'}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pb-2">
          <button onClick={copyToClipboard} className="bg-blue-600 text-white p-4 font-black uppercase text-xs rounded-sm active:scale-95 transition-transform">Copy Result</button>
          <button onClick={() => window.print()} className="bg-black text-white p-4 font-black uppercase text-xs rounded-sm active:scale-95 transition-transform">Print / PDF</button>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
