import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import type { Option } from '../../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

interface BarChartResultProps {
  options: Option[];
  responses: { selectedOptions?: string[] }[];
}

const BarChartResult: React.FC<BarChartResultProps> = ({ options, responses }) => {
  const data = options.map((opt) => ({
    name: opt.text,
    value: responses.filter(res => res.selectedOptions?.includes(opt.id)).length
  }));
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#0088FE">
          {options.map((_, index) => (
            <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartResult;
