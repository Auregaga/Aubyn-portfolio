'use client';

import { useEffect, useRef, useState } from 'react';

interface RadarDimension {
  key: string;
  label: string;
  value: number; // 0-100
}

interface RadarChartProps {
  dimensions: RadarDimension[];
  size?: number;
  levels?: number;
  className?: string;
}

export default function RadarChart({
  dimensions,
  size = 320,
  levels = 4,
  className = '',
}: RadarChartProps) {
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    dimensions.map(() => 0)
  );
  const rafRef = useRef<number | null>(null);
  const prevValuesRef = useRef<number[]>(dimensions.map(() => 0));

  const center = size / 2;
  const radius = size * 0.38;
  const count = dimensions.length;

  // 计算多边形顶点坐标
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // 生成多边形路径
  const getPolygonPoints = (values: number[]) => {
    return values
      .map((v, i) => {
        const p = getPoint(i, v);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  };

  // 生成网格顶点
  const getLevelPoints = (level: number) => {
    const value = ((level + 1) / levels) * 100;
    return dimensions
      .map((_, i) => {
        const p = getPoint(i, value);
        return `${p.x},${p.y}`;
      })
      .join(' ');
  };

  // 动画
  useEffect(() => {
    const targetValues = dimensions.map((d) => d.value);
    const startValues = [...prevValuesRef.current];
    const duration = 600;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      const currentValues = startValues.map((start, i) => {
        return start + (targetValues[i] - start) * eased;
      });

      setAnimatedValues(currentValues);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevValuesRef.current = targetValues;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [dimensions]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* 网格层 */}
        {Array.from({ length: levels }).map((_, level) => (
          <polygon
            key={level}
            points={getLevelPoints(level)}
            fill="none"
            stroke="#e5e5e5"
            strokeWidth="1"
          />
        ))}

        {/* 轴线 */}
        {dimensions.map((_, i) => {
          const p = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="#e5e5e5"
              strokeWidth="1"
            />
          );
        })}

        {/* 数据多边形填充 */}
        <polygon
          points={getPolygonPoints(animatedValues)}
          fill="rgba(0, 0, 0, 0.08)"
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {animatedValues.map((v, i) => {
          const p = getPoint(i, v);
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="2"
            />
          );
        })}

        {/* 维度标签 */}
        {dimensions.map((d, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const labelRadius = radius + 24;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);

          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          let dx = 0;
          if (Math.cos(angle) > 0.3) {
            textAnchor = 'start';
          } else if (Math.cos(angle) < -0.3) {
            textAnchor = 'end';
          }

          return (
            <text
              key={d.key}
              x={x + dx}
              y={y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="fill-black"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                fontFamily:
                  'Noto Sans CJK SC, WenQuanYi Micro Hei, system-ui, sans-serif',
              }}
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
