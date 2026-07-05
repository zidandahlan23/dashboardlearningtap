import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { CertificationRecord } from '@/types';

interface DashboardChartsProps {
  regionData: { name: string; value: number }[];
  statusData: { name: string; value: number; fill: string }[];
  complianceRate: number;
  sudahCount: number;
  belumCount: number;
  records: CertificationRecord[];
}



export function DashboardCharts({
  regionData,
  statusData,
  complianceRate,
  sudahCount,
  belumCount,
  records,
}: DashboardChartsProps) {
  const topPtData = Object.entries(records.reduce((acc, record) => {
    const pt = record.pt || 'Tidak diketahui';
    acc[pt] = (acc[pt] || 0) + 1;
    return acc;
  }, {} as Record<string, number>))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
      {/* Regional Bar Chart */}
      <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl p-4 lg:p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
        <h3 className="text-[13px] font-semibold text-[#2C3531] mb-4">
          Sertifikasi per Region
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={regionData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E8E3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#8A938B' }}
              axisLine={{ stroke: '#E0E8E3' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#8A938B' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E0E8E3',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" fill="#3D6B56" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compliance Gauge */}
      <div className="md:col-span-2 lg:col-span-2 bg-white rounded-xl p-4 lg:p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
        <h3 className="text-[13px] font-semibold text-[#2C3531] mb-4">
          Overall Compliance
        </h3>
        <div className="flex flex-col items-center">
          {/* Donut Chart */}
          <div className="relative w-[180px] h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Sudah', value: sudahCount },
                    { name: 'Belum', value: belumCount },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#4A7C59" />
                  <Cell fill="#E0E8E3" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[28px] font-bold text-[#2C3531]">{complianceRate}%</span>
              <span className="text-[10px] font-semibold text-[#8A938B] uppercase tracking-wider">
                COMPLIANCE
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 w-full space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4A7C59]" />
                <span className="text-[12px] text-[#566A7F]">Sudah Sertifikasi</span>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-medium text-[#2C3531]">{sudahCount}</span>
                <span className="text-[11px] text-[#8A938B] ml-1">
                  {((sudahCount / (sudahCount + belumCount || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8A938B]" />
                <span className="text-[12px] text-[#566A7F]">Belum Sertifikasi</span>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-medium text-[#2C3531]">{belumCount}</span>
                <span className="text-[11px] text-[#8A938B] ml-1">
                  {((belumCount / (sudahCount + belumCount || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl p-4 lg:p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
        <h3 className="text-[13px] font-semibold text-[#2C3531] mb-4">
          Distribusi Status Sertifikasi
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statusData} barSize={60}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E8E3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#8A938B' }}
              axisLine={{ stroke: '#E0E8E3' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#8A938B' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E0E8E3',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top PT Chart */}
      <div className="md:col-span-2 lg:col-span-2 bg-white rounded-xl p-4 lg:p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
        <h3 className="text-[13px] font-semibold text-[#2C3531] mb-4">
          Top PT - Jumlah Sertifikasi
        </h3>
        <div className="space-y-3">
          {topPtData
            .map((item, idx) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-[11px] text-[#8A938B] w-4">{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-[#2C3531] truncate">{item.name}</span>
                    <span className="text-[12px] font-medium text-[#2C3531]">{item.value}</span>
                  </div>
                  <div className="h-2 bg-[#F0F4F1] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3D6B56] rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.value / (topPtData[0]?.value || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
