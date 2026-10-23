import React from 'react';

export default function BarChart({ data }) {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.count), 1);
    const ySteps = 5;
    const stepValue = Math.ceil(maxValue / ySteps / 10) * 10;
    const yMax = stepValue * ySteps;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            {/* Title */}
            <div className="flex items-center gap-2 mb-5">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-base font-semibold text-gray-700">Jumlah Lansia per Bulan</h2>
            </div>

            {/* Chart Area */}
            <div className="flex gap-3 h-52">
                {/* Y Axis labels */}
                <div className="flex flex-col justify-between items-end pb-6 text-xs text-gray-400 w-7 flex-shrink-0">
                    {Array.from({ length: ySteps + 1 }, (_, i) => (
                        <span key={i}>{yMax - i * stepValue}</span>
                    ))}
                </div>

                {/* Bars + X labels */}
                <div className="flex-1 flex flex-col">
                    {/* Bars */}
                    <div className="flex-1 flex items-end gap-1 border-b border-gray-200 pb-1">
                        {data.map((d, i) => {
                            const heightPct = yMax > 0 ? (d.count / yMax) * 100 : 0;
                            return (
                                <div key={i} className="flex-1 flex items-end justify-center group relative">
                                    <div
                                        className="w-full rounded-t-sm transition-all duration-300 cursor-pointer"
                                        style={{
                                            height: `${heightPct}%`,
                                            backgroundColor: '#7a9db8',
                                            minHeight: d.count > 0 ? '4px' : '0',
                                        }}
                                        title={`${d.month}: ${d.count}`}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                            {d.count}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* X labels */}
                    <div className="flex gap-1 pt-1">
                        {data.map((d, i) => (
                            <div key={i} className="flex-1 text-center text-xs text-gray-400">
                                {d.month}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
