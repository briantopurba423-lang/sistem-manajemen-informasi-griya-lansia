import React, { useEffect, useRef, useState } from 'react';

const stats = [
    { value: 120, suffix: '+', label: 'Penghuni Aktif', icon: '👴' },
    { value: 45, suffix: '', label: 'Tenaga Perawat', icon: '👨‍⚕️' },
    { value: 15, suffix: ' Thn', label: 'Pengalaman', icon: '🏅' },
    { value: 98, suffix: '%', label: 'Kepuasan Keluarga', icon: '❤️' },
];

function Counter({ target, suffix }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    let start = 0;
                    const step = Math.ceil(target / 60);
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(start);
                        }
                    }, 20);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref} className="text-4xl font-bold text-emerald-700">
            {count}{suffix}
        </span>
    );
}

export default function Stats() {
    return (
        <section className="bg-white py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-4xl mb-3">{stat.icon}</div>
                            <Counter target={stat.value} suffix={stat.suffix} />
                            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
