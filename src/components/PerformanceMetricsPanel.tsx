
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2, TrendingUp } from 'lucide-react';

const PerformanceMetricsPanel: React.FC = () => {
  // Mock data for performance metrics
  const performanceData = [
    { date: 'Jan', score: 65 },
    { date: 'Feb', score: 72 },
    { date: 'Mar', score: 68 },
    { date: 'Apr', score: 85 },
  ];

  const statistics = [
    { label: 'Problems Solved', value: 47 },
    { label: 'Avg. Completion Time', value: '32 min' },
    { label: 'Success Rate', value: '76%' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Performance</h2>
        <button className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center">
          Full Report
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-brand-600" />
          <h3 className="font-medium text-sm">Your Performance Trend</h3>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} hide={true} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#8884d8" 
                strokeWidth={3}
                dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
                activeDot={{ stroke: '#8884d8', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 className="h-4 w-4 text-brand-600" />
          <h3 className="font-medium text-sm">Key Statistics</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {statistics.map((stat) => (
            <div key={stat.label} className="bg-gray-50 p-3 rounded-lg">
              <div className="text-lg font-medium">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetricsPanel;
