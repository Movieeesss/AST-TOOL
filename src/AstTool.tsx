import React, { useState, useMemo } from 'react';

const AstTool = () => {
  const initialInputs = {
    breadth: '230',
    overallDepth: '300',
    reqAst: '550',
    cover: '25',
    mainDia: '16'
  };

  const initialManual = {
    m1: { dia: 16, nos: '3' },
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

  const getReportText = () => {
    return `*AST TOOL (BEAM) REPORT*%0A---------------------------%0A*Size:* ${inputs.breadth} x ${inputs.overallDepth} mm%0A*Req. Ast:* ${inputs.reqAst} mm²%0A%0A*Provided:*%0A- ${manual1.nos}nos ${manual1.dia}mm%0A- ${manual2.nos}nos ${manual2.dia}mm%0A%0A*Prov. Ast:* ${totalProvAst.toFixed(2)} mm²%0A*Spacing:* ${mixedSpace.toFixed(0)} mm%0A*Status:* ${designOk ? '✅ DESIGN OK' : '❌ DESIGN FAIL'}`;
  };

  const sendWhatsApp = () => {
    window.open(`https://wa.me/?text=${getReportText()}`, '_blank');
  };

  const copyToClipboard = () => {
    const text = getReportText().replace(/%0A/g, '\n').replace(/\*/g, '');
    navigator.clipboard.writeText(text);
    alert("Report copied!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white font-sans flex items-center justify-center p-2 selection:bg-blue-100">
      <div className="flex flex-col space-y-2 max-w-md w-full border border-gray-100 shadow-xl rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#92d050] py-4 text-center border-b border-black/5">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black">AST TOOL (BEAM)</h1>
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

          <div className="grid grid-cols-2 bg-[#ffff00]/30 border border-black/10 rounded-sm overflow-hidden h-14">
            <div className="flex flex-col items-center justify-center border-r border-black/10">
              <span className="text-[9px] font-black opacity-60 uppercase tracking-tighter">Eff. Depth (d)</span>
              <span className="text-lg font-black">{calc.effectiveD.toFixed(0)} mm</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-[9px] font-black opacity-60 uppercase tracking-tighter">Main Bar Ø</span>
              <select name="mainDia" value={inputs.mainDia} onChange={handleChange} className="text-lg font-black bg-transparent outline-none">
                {diameters.map(d => <option key={d} value={d}>{d}mm</option>)}
              </select>
            </div>
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
              <div className="flex gap-2">
                <select value={manual1.dia} onChange={(e) => setManual1({...manual1, dia: Number(e.target.value)})} className="flex-1 bg-[#ffff00] font-black p-2 rounded-sm outline-none border border-black/10 text-lg">
                  {diameters.map(d => <option key={d} value={d}>{d}mm Bar</option>)}
                </select>
                <input type="number" value={manual1.nos} onChange={(e) => setManual1({...manual1, nos: e.target.value})} className="w-24 bg-white border border-gray-300 text-center font-black text-2xl rounded-sm shadow-inner" placeholder="Nos" />
              </div>
              <div className="flex gap-2">
                <select value={manual2.dia} onChange={(e) => setManual2({...manual2, dia: Number(e.target.value)})} className="flex-1 bg-[#ffff00] font-black p-2 rounded-sm outline-none border border-black/10 text-lg">
                  {diameters.map(d => <option key={d} value={d}>{d}mm Bar</option>)}
                </select>
                <input type="number" value={manual2.nos} onChange={(e) => setManual2({...manual2, nos: e.target.value})} className="w-24 bg-white border border-gray-300 text-center font-black text-2xl rounded-sm shadow-inner" placeholder="Nos" />
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className={`p-4 flex justify-between items-center rounded-sm transition-all duration-300 ${designOk ? 'bg-[#92d050]' : 'bg-[#ff0000] text-white'}`}>
            <div className="leading-tight text-left">
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
          <div className="space-y-2 pb-2">
            <button onClick={copyToClipboard} className="w-full bg-[#efefef] text-black py-4 font-black uppercase text-xs tracking-widest rounded-sm border border-gray-300 active:bg-gray-200 shadow-md">
              Copy Result
            </button>
            <button onClick={sendWhatsApp} className="w-full bg-[#25D366] text-white py-4 font-black uppercase text-xs tracking-widest rounded-sm active:bg-[#128C7E] shadow-md flex items-center justify-center gap-2">
              Share to WhatsApp
            </button>
            <button onClick={clearAll} className="w-full bg-red-600 text-white py-4 font-black uppercase text-xs tracking-widest rounded-sm active:bg-red-700 shadow-md">
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
