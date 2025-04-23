// File: components/EmailStatistics.tsx
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from './ui/card';

interface EmailStats {
  labelId: string;
  name: string;
  total: number;
  unread: number;
  color: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function EmailStatistics({ labels, stats }: { labels: any[], stats: EmailStats[] }) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const labelData = labels.map((label, idx) => ({
    name: label.name,
    value: stats.find(s => s.labelId === label.id)?.total || 0,
    color: COLORS[idx % COLORS.length]
  }));

  const getDetailData = (labelId: string) => {
    const labelStats = stats.find(s => s.labelId === labelId);
    if (!labelStats) return [];
    return [
      { name: 'Total', value: labelStats.total, color: '#0088FE' },
      { name: 'Unread', value: labelStats.unread, color: '#00C49F' }
    ];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 overflow-hidden max-w-full">
        <h3 className="text-lg font-semibold mb-4">Email Labels Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={labelData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                labelLine={false}
                label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                onClick={(data) => {
                  const label = labels.find(l => l.name === data.name);
                  setSelectedLabel(label?.id || null);
                }}
              >
                {labelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 overflow-hidden max-w-full">
        <h3 className="text-lg font-semibold mb-4">
          {selectedLabel 
            ? `${labels.find(l => l.id === selectedLabel)?.name} Statistics`
            : 'Select a label to view details'}
        </h3>
        <div className="h-[300px]">
          {selectedLabel ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getDetailData(selectedLabel)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                >
                  {getDetailData(selectedLabel).map((entry, index) => (
                    <Cell key={`cell-detail-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Click on a label in the left chart to view details
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
