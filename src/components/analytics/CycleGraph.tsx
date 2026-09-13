import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getPhaseForCycleDay } from '../../utils/cycleEngine';

export const CycleGraph: React.FC = () => {
  const { logs, userProfile } = useApp();
  const [hoveredPoint, setHoveredPoint] = useState<{
    day: number;
    avgEnergy: number;
    avgPerformance: number;
    count: number;
    phaseName: string;
  } | null>(null);

  const cycleLength = userProfile.avgCycleLength || 29;
  const periodDuration = userProfile.avgPeriodDuration || 5;

  // Aggregate logged data by cycle day (1..cycleLength)
  const dayStats: Record<
    number,
    { totalEnergy: number; energyCount: number; totalPerf: number; perfCount: number }
  > = {};

  for (let d = 1; d <= cycleLength; d++) {
    dayStats[d] = { totalEnergy: 0, energyCount: 0, totalPerf: 0, perfCount: 0 };
  }

  logs.forEach((log) => {
    const cd = log.cycleDay;
    if (cd >= 1 && cd <= cycleLength && dayStats[cd]) {
      if (log.energy) {
        dayStats[cd].totalEnergy += log.energy;
        dayStats[cd].energyCount += 1;
      }
      if (log.gymPerformance) {
        dayStats[cd].totalPerf += log.gymPerformance;
        dayStats[cd].perfCount += 1;
      }
    }
  });

  // Graph dimensions
  const width = 340;
  const height = 170;
  const paddingLeft = 26;
  const paddingRight = 14;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (day: number) =>
    paddingLeft + ((day - 1) / (cycleLength - 1)) * chartWidth;
  const getY = (val: number) =>
    paddingTop + chartHeight - ((val - 1) / 4) * chartHeight;

  // Phase background bands
  const ovulationDay = Math.max(12, cycleLength - 14);
  const bandMenstrualWidth = ((periodDuration - 1) / (cycleLength - 1)) * chartWidth;
  const bandFollicularX = getX(periodDuration);
  const bandFollicularWidth = ((ovulationDay - 2 - periodDuration) / (cycleLength - 1)) * chartWidth;
  const bandOvulationX = getX(ovulationDay - 1);
  const bandOvulationWidth = (2 / (cycleLength - 1)) * chartWidth;
  const bandLutealX = getX(ovulationDay + 2);
  const bandLutealWidth = ((cycleLength - (ovulationDay + 2)) / (cycleLength - 1)) * chartWidth;

  // Build SVG path strings
  let energyPath = '';
  let perfPath = '';

  const pointsData: {
    day: number;
    x: number;
    yEnergy: number;
    yPerf: number;
    avgEnergy: number;
    avgPerformance: number;
    count: number;
    phaseName: string;
  }[] = [];

  for (let d = 1; d <= cycleLength; d++) {
    const stat = dayStats[d];
    const avgEnergy = stat.energyCount > 0 ? stat.totalEnergy / stat.energyCount : 3;
    const avgPerf = stat.perfCount > 0 ? stat.totalPerf / stat.perfCount : 3;

    const x = getX(d);
    const yEnergy = getY(avgEnergy);
    const yPerf = getY(avgPerf);

    const { phase } = getPhaseForCycleDay(d, cycleLength, periodDuration);
    const phaseName =
      phase === 'menstrual'
        ? 'Menstrual'
        : phase === 'follicular'
        ? 'Follicular'
        : phase === 'ovulation'
        ? 'Ovulation'
        : 'Luteal';

    pointsData.push({
      day: d,
      x,
      yEnergy,
      yPerf,
      avgEnergy,
      avgPerformance: avgPerf,
      count: stat.energyCount,
      phaseName,
    });

    if (d === 1) {
      energyPath += `M ${x} ${yEnergy}`;
      perfPath += `M ${x} ${yPerf}`;
    } else {
      energyPath += ` L ${x} ${yEnergy}`;
      perfPath += ` L ${x} ${yPerf}`;
    }
  }

  return (
    <div className="relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        {/* Phase Background Shading */}
        {/* Menstrual */}
        <rect
          x={paddingLeft}
          y={paddingTop}
          width={Math.max(0, bandMenstrualWidth)}
          height={chartHeight}
          fill="#FFE4E6"
          opacity={0.4}
        />
        {/* Follicular */}
        <rect
          x={bandFollicularX}
          y={paddingTop}
          width={Math.max(0, bandFollicularWidth)}
          height={chartHeight}
          fill="#D1FAE5"
          opacity={0.35}
        />
        {/* Ovulation */}
        <rect
          x={bandOvulationX}
          y={paddingTop}
          width={Math.max(0, bandOvulationWidth)}
          height={chartHeight}
          fill="#FEF3C7"
          opacity={0.5}
        />
        {/* Luteal */}
        <rect
          x={bandLutealX}
          y={paddingTop}
          width={Math.max(0, bandLutealWidth)}
          height={chartHeight}
          fill="#EDE9FE"
          opacity={0.4}
        />

        {/* Y Axis Grid Lines */}
        {[1, 2, 3, 4, 5].map((lvl) => {
          const y = getY(lvl);
          return (
            <g key={lvl}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#E2E8F0"
                strokeDasharray="2 2"
              />
              <text
                x={paddingLeft - 6}
                y={y + 3}
                textAnchor="end"
                fontSize="8"
                fill="#94A3B8"
                fontWeight="600"
              >
                {lvl === 5 ? 'High' : lvl === 1 ? 'Low' : lvl === 3 ? 'Mid' : lvl}
              </text>
            </g>
          );
        })}

        {/* Energy Curve (Amber / Coral line) */}
        <path
          d={energyPath}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Gym Performance Curve (Violet line) */}
        <path
          d={perfPath}
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Dots for touch / hover */}
        {pointsData.map((pt) => (
          <g
            key={pt.day}
            className="cursor-pointer"
            onMouseEnter={() =>
              setHoveredPoint({
                day: pt.day,
                avgEnergy: pt.avgEnergy,
                avgPerformance: pt.avgPerformance,
                count: pt.count,
                phaseName: pt.phaseName,
              })
            }
            onClick={() =>
              setHoveredPoint({
                day: pt.day,
                avgEnergy: pt.avgEnergy,
                avgPerformance: pt.avgPerformance,
                count: pt.count,
                phaseName: pt.phaseName,
              })
            }
          >
            {/* Invisible expanded tap target */}
            <circle cx={pt.x} cy={pt.yEnergy} r={7} fill="transparent" />
            <circle
              cx={pt.x}
              cy={pt.yEnergy}
              r={2.5}
              fill="#F59E0B"
              stroke="#FFF"
              strokeWidth="1"
            />
            <circle
              cx={pt.x}
              cy={pt.yPerf}
              r={2.5}
              fill="#7C3AED"
              stroke="#FFF"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* X Axis Day Labels */}
        {[1, 7, 14, 21, cycleLength].map((day) => (
          <text
            key={day}
            x={getX(day)}
            y={height - 8}
            textAnchor="middle"
            fontSize="9"
            fill="#64748B"
            fontWeight="bold"
          >
            D{day}
          </text>
        ))}
      </svg>

      {/* Legend & Hover Tooltip */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px] font-semibold">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Daily Energy</span>
          </div>
          <div className="flex items-center gap-1 text-violet-700">
            <span className="w-2 h-2 rounded-full bg-violet-600" />
            <span>Gym Performance</span>
          </div>
        </div>

        {hoveredPoint ? (
          <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
            Day {hoveredPoint.day} ({hoveredPoint.phaseName}): Energy {hoveredPoint.avgEnergy.toFixed(1)} • Perf {hoveredPoint.avgPerformance.toFixed(1)}
          </span>
        ) : (
          <span className="text-slate-400 font-normal">Tap any day on the graph</span>
        )}
      </div>
    </div>
  );
};
