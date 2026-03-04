import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface RepassesChartsProps {
  data: {
    conveniosProdutos: Array<{
      convenio: string;
      produto: string;
      enviado: number;
      descontado: number;
    }>;
    inadimplenciaTempo: Array<{
      mes: string;
      inadimplencia: number;
    }>;
  };
}

export const RepassesCharts: React.FC<RepassesChartsProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Gráfico de Barras - Convênio x Produto - Largura Total */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enviado vs. Descontado
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.conveniosProdutos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="convenio" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="enviado" fill="#94A3B8" name="Enviado" />
            <Bar dataKey="descontado" fill="#10B981" name="Descontado" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Linha - Inadimplência ao longo do tempo */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Evolução da Inadimplência (Últimos 6 meses)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.inadimplenciaTempo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis 
              tick={{ fontSize: 12 }} 
              domain={[0, 15]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip formatter={(value: number) => [`${value}%`, 'Inadimplência']} />
            <Line 
              type="monotone" 
              dataKey="inadimplencia" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};