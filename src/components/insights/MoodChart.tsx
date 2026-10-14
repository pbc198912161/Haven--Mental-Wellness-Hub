import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { CheckIn } from '@/types';
import { MOODS, MOOD_MAP } from '@/lib/moods';
import { getPastDates, formatDateDisplay } from '@/lib/dates';

interface MoodChartProps {
  checkins: CheckIn[];
}

export const MoodChart: React.FC<MoodChartProps> = ({ checkins }) => {
  const [range, setRange] = useState<7 | 30>(7);

  const dates = getPastDates(range);
  const checkinByDate = new Map<string, CheckIn>();
  checkins.forEach((c) => checkinByDate.set(c.date, c));

  const chartData = dates.map((dateStr) => {
    const entry = checkinByDate.get(dateStr);
    const mood = entry ? MOOD_MAP[entry.mood] : null;
    return {
      date: dateStr,
      displayDate: formatDateDisplay(dateStr, { short: true }),
      score: mood ? mood.score : null, // Gaps, not zeros
      moodLabel: mood?.label,
      emoji: mood?.emoji,
      color: mood?.color,
      note: entry?.note,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0].value !== null) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-2xl shadow-lg border border-border text-xs space-y-1">
          <p className="font-semibold text-tide dark:text-gray-100">{data.displayDate}</p>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-base">{data.emoji}</span>
            <span className="text-tide dark:text-gray-200">{data.moodLabel}</span>
            <span className="text-tide-muted text-[11px]">(Score: {data.score}/5)</span>
          </div>
          {data.note && (
            <p className="text-[11px] text-tide-muted dark:text-gray-400 italic max-w-xs truncate">
              "{data.note}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-tide-muted dark:text-gray-400">
          Mood Trend
        </span>
        {/* 7 vs 30 days toggle */}
        <div className="flex p-0.5 rounded-full bg-mist-alt dark:bg-deep-tide border border-border">
          <button
            type="button"
            onClick={() => setRange(7)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              range === 7
                ? 'bg-tide text-white dark:bg-white dark:text-tide shadow-xs'
                : 'text-tide-muted dark:text-gray-300 hover:text-tide'
            }`}
          >
            Last 7 days
          </button>
          <button
            type="button"
            onClick={() => setRange(30)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              range === 30
                ? 'bg-tide text-white dark:bg-white dark:text-tide shadow-xs'
                : 'text-tide-muted dark:text-gray-300 hover:text-tide'
            }`}
          >
            Last 30 days
          </button>
        </div>
      </div>

      <div className="h-56 sm:h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7FCDBB" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#7FCDBB" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#4A636E' }}
              interval={range === 30 ? 5 : 0}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                const item = MOODS.find((m) => m.score === v);
                return item ? item.emoji : String(v);
              }}
              tick={{ fontSize: 14 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#2F7E6D"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#moodGradient)"
              connectNulls={false}
              dot={{
                r: 4,
                fill: '#2F7E6D',
                strokeWidth: 2,
                stroke: '#FFFFFF',
              }}
              activeDot={{
                r: 6,
                fill: '#14323F',
                stroke: '#7FCDBB',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
