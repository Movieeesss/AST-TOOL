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
    const text = `*AST TOOL (BEAM) REPORT*\nSize: ${inputs.breadth}x${inputs.overallDepth}\nReq Ast: ${inputs.reqAst}\nProv: ${totalProvAst.toFixed(2)}mm²\nStatus: ${designOk ? 'OK' : 'FAIL'}`;
    navigator.clipboard.writeText(text);
    alert("Report copied!");
  };

  return (
    /* flex items-center justify-center centers the tool in the middle of the screen */
    <div className="min-h-screen bg-white font-sans flex items-center justify-center p-2 selection:bg-blue-100">
      <style>{`
        @media print {
          @page { size: portrait; margin: 5mm; }
          body { -webkit-print-color-adjust: exact; background: white; }
          .no-print { display: none !important; }
          .printable-content { height: auto; width: 100%; position: static; margin: 0; padding: 0; }
          input, select { border: none !important; -webkit-appearance: none; appearance: none; }
        }
      `}</style>

      <div className="printable-content flex flex-col space-y-2 max-w-md w-full border border-gray-100 shadow-xl rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#92d050] py-4 text-center border-b border-black/5">
          <h1 className="text-3xl font-black uppercase tracking-tighter">AST TOOL (BEAM)</h1>
        </div>

        <div className="p-3 space-y-3">
          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-1 text-[10px] font-black uppercase text-gray-600">
             <span>Breadth (b) mm</span>
             <span>Overall Depth (D) mm</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input name="breadth" type="number" value={inputs.breadth} onChange={handleChange} className="bg-[#ffff00] text-center text-2xl font-black py-2 rounded-sm outline-none border border-black/5" />
            <input name="overallDepth" type="number" value={inputs.overallDepth} onChange={handleChange} className="bg-[#ffff00] text-center text-2xl font-black py-2 rounded-sm outline-none border border-black/5" />
          </div>

          {/* Info & Clear Row */}
          <div className="grid grid-cols-3 bg-[#ffff00]/30 border border-black/10 rounded-sm overflow-hidden h-14">
            <div className="flex flex-col items-center justify-center border-r border-black/10">
              <span className="text-[9px] font-black opacity-60 uppercase tracking-tighter">Eff. Depth (d)</span>
              <span className="text-lg font-black">{calc.effectiveD.toFixed(0)} mm</span>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-black/10">
              <span className="text-[9px] font-black opacity-60 uppercase tracking-tighter">Main Bar Ø</span>
              <select name="mainDia" value={inputs.mainDia} onChange={handleChange} className="text-lg font-black bg-transparent outline-none">
                {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
              </select>
            </div>
            <button onClick={clearAll} className="no-print bg-gray-200 text-black font-black uppercase text-[10px] h-full flex items-center justify-center active:bg-gray-300">
              CLEAR ALL
            </button>
          </div>

          {/* Ast Required Section */}
          <div className="bg-[#4472c4] p-3 text-center rounded-sm">
            <label className="text-white text-[11px] font-black uppercase block mb-1">Ast Required (mm²)</label>
            <input name="reqAst" type="number" value={inputs.reqAst} onChange={handleChange} className="w-full bg-[#ffff00] text-center text-3xl font-black py-1 rounded-sm outline-none" />
          </div>

          {/* Results Table */}
          <div className="rounded-sm border border-black/10 overflow-hidden">
            <div className="grid grid-cols-6 bg-gray-900 text-white text-[9px] font-black text-center py-2 uppercase">
              <div>Dia</div><div>Nos</div><div>Ast</div><div>Pt%</div><div>Space</div><div>Status</div>
            </div>
            {diameters.map(dia => {
              const d = calc.getRowData(dia);
              return (
                <div key={dia} className="grid grid-cols-6 text-center text-[11px] font-bold h-10 items-center border-b border-gray-100 last:border-0">
                  <div className={`h-full flex items-center justify-center border-r border-gray-50 ${d.isOk ? 'bg-white' : 'bg-[#ff0000] text-white'}`}>{dia}</div>
                  <div className={`h-full flex items-center justify-center border-r border-gray-50 ${d.isOk ? 'bg-white' : 'bg-[#ff0000] text-white'}`}>{d.nos}</div>
                  <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/40">{d.provAst.toFixed(0)}</div>
                  <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/40">{d.pt.toFixed(2)}</div>
                  <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/40">{d.space.toFixed(0)}</div>
                  <div className={`h-full flex items-center justify-center font-black ${d.isOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>{d.isOk ? 'OK' : 'FAIL'}</div>
                </div>
              );
            })}
          </div>

          {/* Mixed Bar Entry */}
          <div className="rounded-sm overflow-hidden border-2 border-[#4472c4]">
            <div className="bg-[#4472c4] text-white text-[10px] font-black py-2 text-center uppercase tracking-widest">Enter Provided Bars (Mixed)</div>
            <div className="p-2 space-y-2 bg-gray-50">
              {[ {v: manual1, s: setManual1}, {v: manual2, s: setManual2} ].map((row, i) => (
                <div key={i} className="flex gap-2">
                  <select value={row.v.dia} onChange={(e) => row.s({...row.v, dia: Number(e.target.value)})} className="flex-1 bg-[#ffff00] font-black p-2 rounded-sm outline-none border border-black/10 text-lg">
                    {diameters.map(d => <option key={d} value={d}>{d}mm Bar</option>)}
                  </select>
                  <input type="number" value={row.v.nos} onChange={(e) => row.s({...row.v, nos: e.target.value})} className="w-24 bg-white border border-gray-300 text-center font-black text-2xl rounded-sm shadow-inner" placeholder="Nos" />
                </div>
              ))}
            </div>
          </div>

          {/* Status Bar */}
          <div className={`p-4 flex justify-between items-center rounded-sm transition-all duration-300 ${designOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>
            <div className="leading-tight">
              <span className="text-[10px] font-black uppercase block opacity-80">Prov. Ast</span>
              <span className="text-2xl font-black">{totalProvAst.toFixed(1)} <small className="text-xs">mm²</small></span>
            </div>
            <div className="text-center leading-tight">
              <span className="text-[10px] font-black uppercase block opacity-80">Spacing</span>
              <span className="text-2xl font-black">{mixedSpace.toFixed(0)} <small className="text-xs">mm</small></span>
            </div>
            <div className="text-3xl font-black italic tracking-tighter">{designOk ? '✓ OK' : '✕ FAIL'}</div>
          </div>

          {/* Action Buttons */}
          <div className="no-print grid grid-cols-2 gap-2 pb-2">
            <button onClick={copyToClipboard} className="bg-[#efefef] text-black py-3 font-black uppercase text-xs tracking-widest rounded-sm border border-gray-300 active:bg-gray-200">Copy Result</button>
            <button onClick={() => window.print()} className="bg-[#efefef] text-black py-3 font-black uppercase text-xs tracking-widest rounded-sm border border-gray-300 active:bg-gray-200">Print / PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
