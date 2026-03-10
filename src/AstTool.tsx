import React, { useState, useMemo } from 'react';

const AstTool = () => {
  const initialInputs = {
    breadth: '230',
    overallDepth: '375',
    reqAst: '500',
    cover: '25',
    mainDia: '16'
  };

  const [inputs, setInputs] = useState(initialInputs);
  const [manual1, setManual1] = useState({ dia: 16, nos: '2' });
  const [manual2, setManual2] = useState({ dia: 12, nos: '1' });

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

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = () => {
    const text = `*AST TOOL (BEAM) REPORT*\nSize: ${inputs.breadth}x${inputs.overallDepth}mm\nReq Ast: ${inputs.reqAst}mm²\nProv: ${totalProvAst.toFixed(1)}mm²\nStatus: ${designOk ? 'OK' : 'FAIL'}`;
    navigator.clipboard.writeText(text);
    alert("Report Copied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 font-sans">
      <style>{`
        @media print {
          @page { size: portrait; margin: 0.5cm; }
          body { background: white !important; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-area { 
            width: 100% !important; 
            max-width: 100% !important; 
            border: none !important; 
            box-shadow: none !important;
            transform: scale(0.95);
            transform-origin: top center;
          }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          input, select { border: none !important; background: transparent !important; appearance: none; -webkit-appearance: none; }
        }
      `}</style>

      <div className="print-area flex flex-col bg-white max-w-md w-full shadow-2xl rounded-xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-[#92d050] py-5 text-center border-b-2 border-black/10">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black">AST TOOL (BEAM)</h1>
        </div>

        <div className="p-4 space-y-4">
          {/* Dimensions Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase text-gray-400 mb-1">Breadth (b) mm</label>
              <input 
                type="number" value={inputs.breadth} 
                onChange={(e) => setInputs({...inputs, breadth: e.target.value})} 
                className="bg-[#ffff00] text-center text-2xl font-black py-2 rounded-md outline-none border-b-2 border-black/10" 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase text-gray-400 mb-1">Overall Depth (D) mm</label>
              <input 
                type="number" value={inputs.overallDepth} 
                onChange={(e) => setInputs({...inputs, overallDepth: e.target.value})} 
                className="bg-[#ffff00] text-center text-2xl font-black py-2 rounded-md outline-none border-b-2 border-black/10" 
              />
            </div>
          </div>

          {/* Info & Clear Row */}
          <div className="grid grid-cols-3 bg-[#ffff00]/20 rounded-md overflow-hidden border border-gray-200">
            <div className="py-2 text-center border-r border-gray-200">
              <span className="block text-[9px] font-black opacity-50 uppercase">Eff. Depth (d)</span>
              <span className="text-lg font-black">{calc.effectiveD.toFixed(0)} mm</span>
            </div>
            <div className="py-2 text-center border-r border-gray-200">
              <span className="block text-[9px] font-black opacity-50 uppercase">Main Bar Ø</span>
              <select 
                value={inputs.mainDia} 
                onChange={(e) => setInputs({...inputs, mainDia: e.target.value})} 
                className="text-lg font-black bg-transparent outline-none cursor-pointer"
              >
                {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
              </select>
            </div>
            <button onClick={clearAll} className="no-print bg-red-600 text-white font-black text-[10px] uppercase active:bg-red-700">
              Clear All
            </button>
          </div>

          {/* Ast Required Display */}
          <div className="bg-[#4472c4] p-4 rounded-md shadow-lg text-center">
            <label className="text-white text-[11px] font-black uppercase block mb-1 tracking-widest">Ast Required (mm²)</label>
            <input 
              type="number" value={inputs.reqAst} 
              onChange={(e) => setInputs({...inputs, reqAst: e.target.value})} 
              className="w-full bg-[#ffff00] text-center text-4xl font-black py-1 rounded-sm outline-none border-none" 
            />
          </div>

          {/* Automatic Table */}
          <div className="rounded-md border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-6 bg-gray-900 text-white text-[9px] font-black py-2 text-center uppercase">
              <div>Dia</div><div>Nos</div><div>Ast</div><div>Pt%</div><div>Space</div><div>Status</div>
            </div>
            {diameters.map(dia => {
              const d = calc.getRowData(dia);
              return (
                <div key={dia} className="grid grid-cols-6 text-center text-[11px] font-bold h-10 items-center border-b border-gray-100 last:border-0">
                  <div className={`h-full flex items-center justify-center border-r border-gray-100 ${d.isOk ? 'bg-white' : 'bg-red-600 text-white'}`}>{dia}</div>
                  <div className={`h-full flex items-center justify-center border-r border-gray-100 ${d.isOk ? 'bg-white' : 'bg-red-600 text-white'}`}>{d.nos}</div>
                  <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/50">{d.provAst.toFixed(0)}</div>
                  <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/50">{d.pt.toFixed(2)}</div>
                  <div className="bg-[#ffcc00] h-full flex items-center justify-center border-r border-white/50">{d.space.toFixed(0)}</div>
                  <div className={`h-full flex items-center justify-center font-black ${d.isOk ? 'bg-[#92d050]' : 'bg-red-600 text-white'}`}>{d.isOk ? 'OK' : 'FAIL'}</div>
                </div>
              );
            })}
          </div>

          {/* Manual Entry Section */}
          <div className="rounded-md border-2 border-[#4472c4] overflow-hidden">
            <div className="bg-[#4472c4] text-white text-[10px] font-black py-2 text-center uppercase">Enter Provided Bars (Mixed)</div>
            <div className="p-2 space-y-2 bg-white">
              <div className="flex gap-2">
                <select 
                  value={manual1.dia} 
                  onChange={(e) => setManual1({...manual1, dia: Number(e.target.value)})} 
                  className="flex-1 bg-[#ffff00] font-black p-3 rounded-md border border-black/10 text-lg"
                >
                  {diameters.map(d => <option key={d} value={d}>{d}mm Bar</option>)}
                </select>
                <input 
                  type="number" value={manual1.nos} 
                  onChange={(e) => setManual1({...manual1, nos: e.target.value})} 
                  className="w-24 border border-gray-300 text-center font-black text-2xl rounded-md" 
                  placeholder="Nos" 
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={manual2.dia} 
                  onChange={(e) => setManual2({...manual2, dia: Number(e.target.value)})} 
                  className="flex-1 bg-[#ffff00] font-black p-3 rounded-md border border-black/10 text-lg"
                >
                  {diameters.map(d => <option key={d} value={d}>{d}mm Bar</option>)}
                </select>
                <input 
                  type="number" value={manual2.nos} 
                  onChange={(e) => setManual2({...manual2, nos: e.target.value})} 
                  className="w-24 border border-gray-300 text-center font-black text-2xl rounded-md" 
                  placeholder="Nos" 
                />
              </div>
            </div>
          </div>

          {/* Result Status Bar */}
          <div className={`p-4 flex justify-between items-center rounded-md shadow-inner transition-colors ${designOk ? 'bg-[#92d050]' : 'bg-red-600 text-white'}`}>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase block opacity-70">Provided Ast</span>
              <span className="text-2xl font-black">{totalProvAst.toFixed(1)} <small className="text-xs">mm²</small></span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black uppercase block opacity-70">Spacing</span>
              <span className="text-2xl font-black">{mixedSpace.toFixed(0)} <small className="text-xs">mm</small></span>
            </div>
            <div className="text-4xl font-black italic tracking-tighter">{designOk ? '✓ OK' : '✕ FAIL'}</div>
          </div>

          {/* Action Buttons */}
          <div className="no-print grid grid-cols-2 gap-3 pb-2">
            <button onClick={copyToClipboard} className="bg-blue-600 text-white py-4 font-black uppercase text-xs rounded-md shadow-md active:scale-95 transition-all">Copy Result</button>
            <button onClick={handlePrint} className="bg-black text-white py-4 font-black uppercase text-xs rounded-md shadow-md active:scale-95 transition-all">Print / PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
