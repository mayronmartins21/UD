import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Building, Users, Star, Info } from 'lucide-react';
import type { InsightData } from '../../types/dashboard';

interface InsightsPanelProps {
  insights: InsightData[];
  loading?: boolean;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights, loading }) => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      'building': Building,
      'trending-up': TrendingUp,
      'trending-down': TrendingDown,
      'users': Users,
      'star': Star,
      'info': Info
    };
    return icons[iconName] || Info;
  };

  const getColorClasses = (type: 'info' | 'success' | 'warning') => {
    const colors = {
      info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
      success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' },
      warning: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-600' }
    };
    return colors[type];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-4 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Insights Automáticos</h3>
      </div>

      <div className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Nenhum insight disponível no momento.
            </p>
          </div>
        ) : (
          insights.map((insight, index) => {
            const Icon = getIcon(insight.icon);
            const colors = getColorClasses(insight.type);

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
              >
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 ${colors.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className={`text-sm ${colors.text} leading-relaxed`}>
                    {insight.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {insights.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Insights atualizados automaticamente com base nos dados filtrados
          </p>
        </div>
      )}
    </div>
  );
};
