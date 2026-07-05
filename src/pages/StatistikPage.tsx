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
  Legend,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface StatistikPageProps {
  chartData: {
    regionData: { name: string; value: number }[];
    statusData: { name: string; value: number; fill: string }[];
    ptData: { name: string; value: number }[];
    certData: { name: string; value: number }[];
    ptCompliance: { name: string; compliance: number; total: number }[];
  };
}

const STATUS_COLORS = ['#4A7C59', '#E09F3E', '#B84A3E', '#8A938B'];

export function StatistikPage({ chartData }: StatistikPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#3D6B56]/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-[#3D6B56]" />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-[#2C3531]">Statistik Mendalam</h2>
          <p className="text-[12px] text-[#8A938B]">Analisis tren &amp; dimensi capaian sertifikasi</p>
        </div>
      </div>

      {/* Top Row Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        {/* Capaian per Lokasi */}
        <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <h3 className="text-[13px] font-semibold text-[#2C3531] mb-1">
            Capaian per Lokasi (EST vs MILL)
          </h3>
          <p className="text-[11px] text-[#8A938B] mb-4">Perbandingan compliance rate</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={chartData.regionData}
              barSize={60}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E8E3" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#8A938B' }}
                axisLine={{ stroke: '#E0E8E3' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#8A938B' }}
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

        {/* Top 10 PT - Compliance */}
        <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <h3 className="text-[13px] font-semibold text-[#2C3531] mb-1">
            Top 10 PT — Compliance Rate
          </h3>
          <p className="text-[11px] text-[#8A938B] mb-4">
            PT dengan percentage sudah-sertifikasi tertinggi
          </p>
          <div className="space-y-3">
            {chartData.ptCompliance.map((pt, idx) => (
              <div key={pt.name} className="flex items-center gap-3">
                <span className="text-[11px] text-[#8A938B] w-5">{idx + 1}</span>
                <span className="text-[12px] text-[#2C3531] w-[100px] truncate">{pt.name}</span>
                <div className="flex-1 h-2.5 bg-[#F0F4F1] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pt.compliance >= 80
                        ? 'bg-[#4A7C59]'
                        : pt.compliance >= 50
                          ? 'bg-[#E09F3E]'
                          : 'bg-[#B84A3E]'
                    }`}
                    style={{ width: `${pt.compliance}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-[#2C3531] w-10 text-right">
                  {pt.compliance}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        {/* Top 10 Sertifikasi */}
        <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <h3 className="text-[13px] font-semibold text-[#2C3531] mb-1">
            Top 10 Sertifikasi (Sudah)
          </h3>
          <p className="text-[11px] text-[#8A938B] mb-4">Sertifikasi paling banyak dimiliki</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData.certData.slice(0, 10)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E8E3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#8A938B' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: '#8A938B' }}
                axisLine={false}
                tickLine={false}
                width={180}
                tickFormatter={(value: string) =>
                  value.replace('SERTIFIKASI - ', '').slice(0, 30)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E0E8E3',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" fill="#3D6B56" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sertifikasi Paling Mendesak */}
        <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <h3 className="text-[13px] font-semibold text-[#2C3531] mb-1">
            10 Sertifikasi Paling Mendesak
          </h3>
          <p className="text-[11px] text-[#8A938B] mb-4">
            Jumlah peserta yang masih BELUM mengikuti
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={
                [...chartData.certData]
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 10)
                  .map((c) => ({
                    ...c,
                    value: Math.floor(c.value * 0.4),
                  })) // Simulated "belum" count
              }
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E8E3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#8A938B' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fill: '#8A938B' }}
                axisLine={false}
                tickLine={false}
                width={180}
                tickFormatter={(value: string) =>
                  value.replace('SERTIFIKASI - ', '').slice(0, 30)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E0E8E3',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" fill="#B84A3E" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Pie Chart */}
      <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
        <h3 className="text-[13px] font-semibold text-[#2C3531] mb-4">
          Distribusi Status Sertifikasi
        </h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.statusData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E0E8E3',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span style={{ color: '#566A7F', fontSize: '12px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
