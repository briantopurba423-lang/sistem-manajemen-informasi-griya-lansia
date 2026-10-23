import React from 'react';

export default function StatsCard({ icon, label, value, diff }) {
    const isPositive = diff >= 0;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#f0f4f8' }}>
                {icon}
            </div>

            {/* Content */}
            <div className="min-w-0">
                <p className="text-sm text-gray-500 mb-0.5">{label}</p>
                <p className="text-3xl font-bold text-gray-800 leading-none mb-1">{value}</p>
                <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d={isPositive ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                    </svg>
                    <span>{isPositive ? '+' : ''}{diff} dari bulan lalu</span>
                </div>
            </div>
        </div>
    );
}
