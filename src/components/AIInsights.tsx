import { Lightbulb, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Insight {
  type: 'warning' | 'info' | 'success';
  message: string;
}

interface AIInsightsProps {
  insights: Insight[];
}

const iconMap = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const colorMap = {
  warning: {
    bg: 'bg-[#E09F3E]/10',
    border: 'border-[#E09F3E]/20',
    icon: 'text-[#E09F3E]',
  },
  info: {
    bg: 'bg-[#5B8BA0]/10',
    border: 'border-[#5B8BA0]/20',
    icon: 'text-[#5B8BA0]',
  },
  success: {
    bg: 'bg-[#4A7C59]/10',
    border: 'border-[#4A7C59]/20',
    icon: 'text-[#4A7C59]',
  },
};

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-[#D9A443]" />
        <h3 className="text-[13px] font-semibold text-[#2C3531]">AI Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = iconMap[insight.type];
          const colors = colorMap[insight.type];
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-lg ${colors.bg} border ${colors.border}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.icon}`} />
              <p className="text-[12px] text-[#2C3531] leading-relaxed">{insight.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
