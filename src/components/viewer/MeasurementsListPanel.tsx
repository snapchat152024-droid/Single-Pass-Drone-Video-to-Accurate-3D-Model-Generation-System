import React from 'react';
import { Ruler, Trash2, Download, CheckCircle2 } from 'lucide-react';
import { MeasurementRecord } from '../../types';

interface MeasurementsListPanelProps {
  measurements: MeasurementRecord[];
  onDeleteMeasurement: (id: string) => void;
  onClearAll: () => void;
}

export const MeasurementsListPanel: React.FC<MeasurementsListPanelProps> = ({
  measurements,
  onDeleteMeasurement,
  onClearAll,
}) => {
  const handleExportCSV = () => {
    const csvContent =
      'ID,Label,Type,Value,Unit,Timestamp\n' +
      measurements
        .map((m) => `${m.id},"${m.label}",${m.type},${m.value.toFixed(2)},${m.unit},"${m.timestamp}"`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Aero3D_Measurements_Log.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0f172a]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl w-72 select-none text-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Ruler className="w-3.5 h-3.5 text-cyan-400" />
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
            Measurement Log
          </h4>
        </div>
        <span className="text-[10px] text-cyan-400 font-mono">
          {measurements.length} Records
        </span>
      </div>

      {measurements.length === 0 ? (
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 text-center space-y-1">
          <p>No active measurements yet.</p>
          <p className="text-[10px] text-slate-400">
            Use the Distance, Height, or Area tools on the toolbar and click points in the 3D scene.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {measurements.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: m.color }}
                  />
                  <div>
                    <div className="font-medium text-white text-[11px]">{m.label}</div>
                    <div className="text-[10px] text-slate-400">
                      {m.type.toUpperCase()} · {m.timestamp}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-300 text-xs">
                    {m.value.toFixed(1)} {m.unit}
                  </span>
                  <button
                    onClick={() => onDeleteMeasurement(m.id)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                    title="Delete measurement"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-2 border-t border-white/10">
            <button
              onClick={handleExportCSV}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClearAll}
              className="py-1.5 px-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-[11px] transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
};
