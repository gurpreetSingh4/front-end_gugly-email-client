// File: components/EmailStatistics.tsx
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "./ui/card";

interface EmailStats {
  labelId: string;
  name: string;
  total: number;
  unread: number;
  color: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function EmailStatistics({
  labels,
  stats,
}: {
  labels: any[];
  stats: EmailStats[];
}) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const labelData = labels.map((label, idx) => ({
    name: label.name,
    id: label.id,
    value: stats.find((s) => s.labelId === label.id)?.total || 0,
    color: COLORS[idx % COLORS.length],
  }));

  const getDetailData = (labelId: string) => {
    const labelStats = stats.find((s) => s.labelId === labelId);
    if (!labelStats) return [];
    return [
      { name: "Total", value: labelStats.total, color: "#0088FE" },
      { name: "Unread", value: labelStats.unread, color: "#00C49F" },
    ];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 overflow-hidden max-w-full">
        <h3 className="text-lg font-semibold mb-4">
          Email Labels Distribution
        </h3>
        <div className="h-[300px] rounded-md bg-white dark:bg-gray-900 transition-colors duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={labelData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                dataKey="value"
                labelLine={false}
                label={({ percent }) =>
                  percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                }
                onClick={(data) => {
                  setSelectedLabel(data.id || null);
                }}
              >
                {labelData.map((entry, index) => {
                  const isSelected = entry.id === selectedLabel;
                  return (
                    // <Cell
                    //   key={`cell-${index}`}
                    //   fill={entry.color}
                    //   stroke={isSelected ? `${entry.color}88` : 'transparent'}
                    //   strokeWidth={isSelected ? 3 : 1}
                    //   cursor="pointer"
                    //   opacity={isSelected ? 1 : 0.7}
                    //   style={{
                    //     filter: isSelected
                    //       ? `drop-shadow(0 0 6px ${entry.color}55)`
                    //       : 'none',
                    //     transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                    //     transformOrigin: 'center center',
                    //     transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                    //   }}
                    // />
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={isSelected ? `${entry.color}44` : "transparent"} // softer stroke (26% opacity)
                      strokeWidth={isSelected ? 2 : 0.5}
                      cursor="pointer"
                      opacity={isSelected ? 1 : 0.8}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = `brightness(1.08)`; // slight brighten on hover
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = isSelected
                          ? `drop-shadow(0 0 4px ${entry.color}33)`
                          : "none";
                      }}
                      style={{
                        filter: isSelected
                          ? `drop-shadow(0 0 4px ${entry.color}33)` // very soft glow
                          : "none",
                        transform: isSelected ? "scale(1.03)" : "scale(1)",
                        transformOrigin: "center center",
                        transition: "all 250ms ease-in-out",
                      }}
                    />
                  );
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 overflow-hidden max-w-full">
        <h3 className="text-lg font-semibold mb-4">
          {selectedLabel
            ? `${labels.find((l) => l.id === selectedLabel)?.name} Statistics`
            : "Select a label to view details"}
        </h3>
        <div className="h-[300px] rounded-md bg-white dark:bg-gray-900 transition-colors duration-300">
          {selectedLabel ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getDetailData(selectedLabel)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  dataKey="value"
                  labelLine={false}
                  label={({ percent }) =>
                    percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  {getDetailData(selectedLabel).map((entry, index) => (
                    <Cell
                      key={`cell-detail-${index}`}
                      fill={entry.color}
                      cursor="pointer"
                      style={{
                        transition: "all 300ms ease-in-out",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative w-32 h-32">
                <div className="absolute animate-bounce">
                  <svg viewBox="0 0 200 200" className="w-32 h-32">
                    <rect
                      x="60"
                      y="60"
                      width="80"
                      height="80"
                      rx="10"
                      fill="#4F46E5"
                      className="animate-pulse"
                    />
                    <circle cx="85" cy="90" r="8" fill="#fff" />
                    <circle cx="115" cy="90" r="8" fill="#fff" />
                    <line
                      x1="100"
                      y1="50"
                      x2="100"
                      y2="30"
                      stroke="#4F46E5"
                      strokeWidth="4"
                    />
                    <circle
                      cx="100"
                      cy="25"
                      r="5"
                      fill="#4F46E5"
                      className="animate-ping"
                    />
                    <circle
                      cx="140"
                      cy="50"
                      r="5"
                      fill="#4F46E5"
                      className="animate-pulse"
                    />
                    <circle
                      cx="155"
                      cy="40"
                      r="4"
                      fill="#4F46E5"
                      className="animate-pulse"
                    />
                    <circle
                      cx="165"
                      cy="25"
                      r="3"
                      fill="#4F46E5"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-500 text-sm animate-pulse">
                Processing email analytics...
              </p>
              <p className="text-gray-400 text-xs">
                Select a label to view detailed statistics
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
