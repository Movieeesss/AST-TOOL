import React, { useState } from 'react';

const AstTool = () => {
  // Using strings for inputs to allow smooth typing without "0" interference
  const [breadth, setBreadth] = useState('230');
  const [effDepth, setEffDepth] = useState('392');
  const [reqAst, setReqAst] = useState('600');
  const [cover, setCover] = useState('25');

  const [manual1, setManual1] = useState({ dia: 16, nos: '2' });
  const [manual2, setManual2] = useState({ dia: 12, nos: '2' });

  const diameters = [10, 12, 16, 20, 25];

  // Safe number conversion
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
    
    // Spacing formula: (b - (2*cover) - (nos*dia)) / (nos - 1)
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
    : (num(breadth) - (2 * num(cover)) - (num(manual1.nos) * manual1.dia + num(manual2.nos) * manual2.dia));
    
  const manualStatus = totalManualAst >= num(reqAst) && manualSpacing >= 25 && num(reqAst) > 0;

  return (
    <div className="min-h-screen bg-white p-2 md:p-10 font-sans text-black">
      <div className="max-w-6xl mx-auto border-4 border-black p-1 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)]">
        
        {/* Header Section */}
        <div className="text-center border-b-4 border-black pb-4 mb-6">
          <h1 className="text-4xl font-black uppercase tracking-tighter">AST TOOL — BEAM REINFORCEMENT</h1>
          <p className="text-lg font-bold uppercase mt-1 tracking-widest text-gray-700">Structural Engineering Calculator</p>
        </div>

        {/* Input Section - Styled like Excel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mb-8 max-w-2xl">
          <div className="flex items-center">
            <label className="w-48 bg-blue-500 text-white font-black px-2 py-1 text-sm border border-black">BREADTH (B) MM</label>
            <input type="text" value={breadth} onChange={(e) => setBreadth(e.target.value)} className="flex-1 bg-yellow-300 border border-black px-2 py-1 font-black text-lg outline-none" />
          </div>
          <div className="flex items-center">
            <label className="w-48 bg-blue-500 text-white font-black px-2 py-1 text-sm border border-black">EFF. DEPTH (D) MM</label>
            <input type="text" value={effDepth} onChange={(e) => setEffDepth(e.target.value)} className="flex-1 bg-yellow-300 border border-black px-2 py-1 font-black text-lg outline-none" />
          </div>
          <div className="flex items-center">
            <label className="w-48 bg-blue-500 text-white font-black px-2 py-1 text-sm border border-black">REQUIRED AST MM²</label>
            <input type="text" value={reqAst} onChange={(e) => setReqAst(e.target.value)} className="flex-1 bg-yellow-300 border border-black px-2 py-1 font-black text-xl outline-none" />
          </div>
          <div className="flex items-center">
            <label className="w-48 bg-blue-500 text-white font-black px-2 py-1 text-sm border border-black">CLEAR COVER MM</label>
            <input type="text" value={cover} onChange={(e) => setCover(e.target.value)} className="flex-1 bg-yellow-300 border border-black px-2 py-1 font-black text-lg outline-none" />
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse border-2 border-black">
            <thead>
              <tr className="bg-orange-200 font-black text-sm uppercase">
                <th className="border-2 border-black p-2 text-left">Diameters</th>
                <th className="border-2 border-black p-2 text-center">NOS</th>
                <th className="border-2 border-black p-2 text-center">Ast Provided</th>
                <th className="border-2 border-black p-2 text-center">Pt (%)</th>
                <th className="border-2 border-black p-2 text-center">Spacing</th>
                <th className="border-2 border-black p-2 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="font-bold text-lg">
              {diameters.map((dia) => {
                const data = calculateRow(dia);
                return (
                  <tr key={dia}>
                    <td className="border-2 border-black p-2 bg-red-600 text-white text-center font-black">{dia}</td>
                    <td className={`border-2 border-black p-2 text-center ${data.isOk ? 'bg-green-500' : 'bg-red-600 text-white'}`}>{data.nos}</td>
                    <td className="border-2 border-black p-2 text-center bg-orange-400">{data.providedAst.toFixed(2)}</td>
                    <td className="border-2 border-black p-2 text-center bg-orange-400">{data.pt.toFixed(3)}</td>
                    <td className="border-2 border-black p-2 text-center bg-orange-400">{data.spacing.toFixed(1)}</td>
                    <td className={`border-2 border-black p-2 text-center font-black ${data.isOk ? 'bg-green-500' : 'bg-red-600 text-white'}`}>
                      {data.isOk ? 'OK' : 'NOT OK'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Manual Section */}
        <div className="border-t-4 border-black pt-6">
          <h2 className="bg-blue-600 text-white font-black px-4 py-2 inline-block text-xl uppercase mb-4 border-2 border-black">ENTER PROVIDE VALUE (MIXED BARS)</h2>
          <div className="space-y-2 mb-6 max-w-md">
            {[ {s: manual1, set: setManual1}, {s: manual2, set: setManual2} ].map((item, i) => (
              <div key={i} className="flex border-2 border-black">
                <select 
                  value={item.s.dia} 
                  onChange={(e) => item.set({...item.s, dia: Number(e.target.value)})}
                  className="bg-yellow-300 border-r-2 border-black p-2 font-black outline-none w-32"
                >
                  {diameters.map(d => <option key={d} value={d}>{d} mm</option>)}
                </select>
                <input 
                  type="text" 
                  value={item.s.nos} 
                  onChange={(e) => item.set({...item.s, nos: e.target.value})}
                  className="flex-1 bg-yellow-300 p-2 font-black text-center outline-none"
                />
              </div>
            ))}
          </div>

          {/* Result Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-4 border-black font-black text-xl">
            <div className="bg-orange-400 p-4 border-b-2 md:border-b-0 md:border-r-4 border-black">TOTAL AST: {totalManualAst.toFixed(2)}</div>
            <div className="bg-orange-400 p-4 border-b-2 md:border-b-0 md:border-r-4 border-black">SPACING: {manualSpacing.toFixed(1)}</div>
            <div className={`p-4 text-center ${manualStatus ? 'bg-green-500' : 'bg-red-600 text-white'}`}>
              {manualStatus ? '✓ DESIGN OK' : '✕ NOT OK'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
