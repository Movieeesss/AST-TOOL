import React, { useState } from 'react';

const AstTool = () => {
  // Top Section Inputs
  const [breadth, setBreadth] = useState(230);
  const [effDepth, setEffDepth] = useState(392);
  const [reqAst, setReqAst] = useState(579.17);
  const [cover, setCover] = useState(25);

  // Bottom Section Manual Entry
  const [manual1, setManual1] = useState({ dia: 25, nos: 12 });
  const [manual2, setManual2] = useState({ dia: 20, nos: 0 });

  const diameters = [10, 12, 16, 20, 25];

  const calculateRow = (dia, isManual = false, manualNos = 0) => {
    const areaOneBar = (Math.PI * Math.pow(dia, 2)) / 4;
    const nos = isManual ? manualNos : Math.ceil(reqAst / areaOneBar);
    const providedAst = nos * areaOneBar;
    const pt = (providedAst * 100) / (breadth * effDepth);
    // Spacing formula from your Excel: (b - (2*cover) - (nos*dia)) / (nos - 1)
    const spacing = nos > 1 ? (breadth - 2 * cover - nos * dia) / (nos - 1) : breadth - 2 * cover - dia;
    
    const isOk = providedAst >= reqAst && spacing >= 25;

    return { nos, providedAst, pt, spacing, isOk };
  };

  // Manual Combined Logic
  const m1 = calculateRow(manual1.dia, true, manual1.nos);
  const m2 = calculateRow(manual2.dia, true, manual2.nos);
  const totalManualAst = m1.providedAst + m2.providedAst;
  const totalManualNos = manual1.nos + manual2.nos;
  // Combined Spacing: uses total bars and average diameter for estimation
  const avgDia = totalManualNos > 0 ? (manual1.nos * manual1.dia + manual2.nos * manual2.dia) / totalManualNos : 0;
  const manualSpacing = totalManualNos > 1 
    ? (breadth - 2 * cover - (manual1.nos * manual1.dia + manual2.nos * manual2.dia)) / (totalManualNos - 1) 
    : 0;
  const manualStatus = totalManualAst >= reqAst && manualSpacing >= 25;

  return (
    <div className="p-4 font-serif bg-white max-w-4xl mx-auto border border-gray-300 shadow-lg">
      <h1 className="text-xl font-bold border-b-2 border-black mb-4">AST TOOL - BEAM REINFORCEMENT</h1>
      
      {/* Top Section */}
      <div className="grid grid-cols-2 gap-2 mb-6 max-w-md">
        <label className="font-bold">Breadth (b)</label>
        <input type="number" value={breadth} onChange={(e) => setBreadth(Number(e.target.value))} className="bg-yellow-200 border border-black px-2 text-right" />
        <label className="font-bold">Eff. depth (d)</label>
        <input type="number" value={effDepth} onChange={(e) => setEffDepth(Number(e.target.value))} className="bg-yellow-200 border border-black px-2 text-right" />
        <label className="font-bold bg-blue-500 text-white px-1">Required Ast</label>
        <input type="number" value={reqAst} onChange={(e) => setReqAst(Number(e.target.value))} className="bg-yellow-200 border border-black px-2 text-right font-bold" />
      </div>

      {/* Auto-Calculation Table */}
      <table className="w-full border-collapse border border-black text-sm mb-8">
        <thead>
          <tr className="bg-orange-200">
            <th className="border border-black p-1">Diameters</th>
            <th className="border border-black p-1">NOS</th>
            <th className="border border-black p-1">Ast Provided</th>
            <th className="border border-black p-1">Pt (%)</th>
            <th className="border border-black p-1">Spacing</th>
            <th className="border border-black p-1">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {diameters.map((dia) => {
            const data = calculateRow(dia);
            return (
              <tr key={dia}>
                <td className="border border-black p-1 text-center bg-red-600 text-white">{dia}</td>
                <td className="border border-black p-1 text-center bg-green-500 font-bold">{data.nos}</td>
                <td className="border border-black p-1 text-right bg-orange-300 font-mono">{data.providedAst.toFixed(2)}</td>
                <td className="border border-black p-1 text-right bg-orange-300">{data.pt.toFixed(3)}</td>
                <td className="border border-black p-1 text-right bg-orange-300">{data.spacing.toFixed(1)}</td>
                <td className={`border border-black p-1 text-center font-bold ${data.isOk ? 'bg-green-500' : 'bg-red-600 text-white'}`}>
                  {data.isOk ? 'OK' : 'NOT OK'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Manual Provide Section */}
      <div className="border-t-2 border-black pt-4">
        <h2 className="bg-blue-600 text-white font-bold px-2 py-1 mb-2 inline-block">ENTER PROVIDE VALUE</h2>
        <div className="space-y-1">
          {[manual1, manual2].map((m, i) => (
            <div key={i} className="flex gap-2">
              <select 
                value={m.dia} 
                onChange={(e) => i === 0 ? setManual1({...manual1, dia: Number(e.target.value)}) : setManual2({...manual2, dia: Number(e.target.value)})}
                className="bg-yellow-200 border border-black w-24 text-center"
              >
                {diameters.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input 
                type="number" 
                value={m.nos} 
                onChange={(e) => i === 0 ? setManual1({...manual1, nos: Number(e.target.value)}) : setManual2({...manual2, nos: Number(e.target.value)})}
                className="bg-yellow-200 border border-black w-24 text-center font-bold"
              />
            </div>
          ))}
        </div>
        
        {/* Manual Result Row */}
        <div className="flex mt-4 font-bold border border-black bg-orange-300">
          <div className="p-2 flex-1 border-r border-black">Total Ast: {totalManualAst.toFixed(2)}</div>
          <div className="p-2 flex-1 border-r border-black">Spacing: {manualSpacing.toFixed(1)}</div>
          <div className={`p-2 w-32 text-center ${manualStatus ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {manualStatus ? 'OK' : 'NOT OK'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstTool;