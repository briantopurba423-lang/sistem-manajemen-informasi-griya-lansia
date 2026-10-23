import React from 'react';

export default function DonutChart({ data, total }) {
    const size = 180;
    const strokeWidth = 32;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const cx = size / 2;
    const cy = size / 2;

    // Build segments
    const sum = data.reduce((acc, d) => acc + d.value, 0) || 1;
    let offset = 0;

    const segments = data.map((d) => {
        const pct = d.value / sum;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const rotate = (offset / sum) * 360 - 90;
        offset += d.value;
        return { ...d, dash, gap, rotate };
    });

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Status Kesehatan Lansia</h2>

            <div className="flex items-center gap-6">
                {/* SVG Donut */}
                <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                        {segments.map((seg, i) => (
                            <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r={radius}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${seg.dash} ${seg.gap}`}
                                strokeDashoffset={0}
                                transform={`rotate(${seg.rotate} ${cx} ${cy})`}
                                className="transition-all duration-500"
                            />
                        ))}
                    </svg>
                    {/* Center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold text-gray-800">{total}</span>
                        <span className="text-xs text-gray-500">Lansia</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                    {data.map((d, i) => {
                        const pct = sum > 0 ? Math.round((d.value / sum) * 100) : 0;
                        return (
                            <div key={i} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }}></span>
                                    <span className="text-xs text-gray-600 leading-tight">{d.label}</span>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-xs font-semibold text-gray-700">{d.value}</span>
                                    <span className="text-xs text-gray-400">({pct}%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
