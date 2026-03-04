import React, { useState } from 'react';

const AstTool = () => {
  // Strings for smooth typing
  const [breadth, setBreadth] = useState('230');
  const [effDepth, setEffDepth] = useState('392');
  const [reqAst, setReqAst] = useState('600');
  const [cover, setCover] = useState('25');

  const [manual1, setManual1] = useState({ dia: 16, nos: '2' });
  const [manual2, setManual2] = useState({ dia: 12, nos: '2' });

  const diameters = [10, 12, 16, 20, 25];

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
    : 0;
  const manualStatus = totalManualAst >= num(reqAst) && manualSpacing >= 25 && num(reqAst) > 0;

  return (
    <div className="min-h-screen bg-white p-4 font-sans text-black">
      <div className="max-w-5xl mx-auto border border-gray-300 p-4">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-tight border-b border-black pb-2">AST TOOL — BEAM REINFORCEMENT</h1>
        </div>

        {/* Top Inputs - Excel Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 max-w-xl">
          <div className="flex border border-gray-400">
            <span className="w-48 bg-blue-600 text-white px-2 py-1 font-bold text-xs uppercase">Breadth (b) mm</span>
            <input type="text" value={breadth} onChange={(e) => setBreadth(e.target.value)} className="flex-1 bg-yellow-300 px-2 py-1 font-bold outline-none border-l border-gray-400" />
          </div>
          <div className="flex border border-gray-400">
            <span className="w-48 bg-blue-600 text-white px-2 py-1 font-bold text-xs uppercase">Eff. depth (d) mm</span>
            <input type="text" value={effDepth} onChange={(e) => setEffDepth(e.target.value)} className="flex-1 bg-yellow-300 px-2 py-1 font-bold outline-none border-l border-gray-400" />
          </div>
          <div className="flex border border-gray-400">
            <span className="w-48 bg-blue-600 text-white px-2 py-1 font-bold text-xs uppercase">Required Ast mm²</span>
            <input type="text" value={reqAst} onChange={(e) => setReqAst(e.target.value)} className="flex-1 bg-yellow-300 px-2 py-1 font-bold outline-none border-l border-gray-400" />
          </div>
          <div className="flex border border-gray-400">
            <span className="w-48 bg-gray-200 px-2 py-1 font-bold text-xs uppercase">Clear Cover mm</span>
            <input type="text" value={cover} onChange={(e) => setCover(e.target.value)} className="flex-1 bg-white px-2 py-1 font-bold outline-none border-l border-gray-400" />
          </div>
        </div>

        {/* Main Table */}
        <table className="w-full border-collapse border border-gray-400 mb-8">
          <thead className="bg-orange-200 text-xs font-bold uppercase">
            <tr>
              <th className="border border-gray-400 p-2 text-left">Diameters</th>
              <th className="border border-gray-400 p-2 text-center">NOS</th>
              <th className="border border-gray-400 p-2 text-center">Ast</th>
              <th className="border border-gray-400 p-2 text-center">Pt</th>
              <th className="border border-gray-400 p-2 text-center">Spacing</th>
              <th className="border border-gray-400 p-2 text-center">OK/NOT OK</th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {diameters.map((dia) => {
              const data = calculateRow(dia);
              return (
                <tr key={dia}>
                  <td className="border border-gray-400 p-2 bg-red-600 text-white text-center">{dia}</td>
                  <td className={`border border-gray-400 p-2 text-center ${data.isOk ? 'bg-green-400' : 'bg-red-500 text-white'}`}>{data.nos}</td>
                  <td className="border border-gray-400 p-2 text-center bg-orange-300">{data.providedAst.toFixed(2)}</td>
                  <td className="border border-gray-400 p-2 text-center bg-orange-300">{data.pt.toFixed(4)}</td>
                  <td className="border border-gray-400 p-2 text-center bg-orange-300">{data.spacing.toFixed(1)}</td>
                  <td className={`border border-gray-400 p-2 text-center ${data.isOk ? 'bg-green-400' : 'bg-red-500 text-white'}`}>
                    {data.isOk ? 'OK' : 'NOT OK'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Manual Input Section */}
        <div className="mt-6 border-t border-black pt-4">
          <h2 className="bg-blue-600 text-white font-bold px-2 py-1 text-xs uppercase mb-2 inline-block">Enter Provide Value</h2>
          <div className="space-y-1 mb-4">
            {[ {s: manual1, set: setManual1}, {s: manual2, set: setManual2} ].map((item, i) => (
              <div key={i} className="flex border border-gray-400 w-64">
                <select 
                  value={item.s.dia} 
                  onChange={(e) => item.set({...item.s, dia: Number(e.target.value)})}
                  className="bg-yellow-300 px-2 py-1 font-bold outline-none border-r border-gray-400 w-24"
                >
                  {diameters.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input 
                  type="text" 
                  value={item.s.nos} 
                  onChange={(e) => item.set({...item.s, nos: e.target.value})}
                  className="bg-yellow-300 px-2 py-1 font-bold outline-none text-center flex-1"
                />
              </div>
            ))}
          </div>
          
          {/* Result Bar */}
          <div className="flex border border-gray-400 font-bold bg-orange-300">
            <div className="p-2 border-r border-gray-400 flex-1">Total Ast: {totalManualAst.toFixed(2)}</div>
            <div className="p-2 border-r border-gray-400 flex-1 text-center">Spacing: {manualSpacing.toFixed(1)}</div>
            <div className={`p-2 w-32 text-center ${manualStatus ? 'bg-green-400' : 'bg-red-500 text-white'}`}>
              {manualStatus ? 'OK' : 'NOT OK'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstTool;
