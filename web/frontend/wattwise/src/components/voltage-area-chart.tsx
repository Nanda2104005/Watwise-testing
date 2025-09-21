'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { useState, useEffect } from 'react';
import { IconAlertTriangle, IconShield } from '@tabler/icons-react';

// Generate voltage trend data for the last 7 days
const generateVoltageTrendData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return days.map((day, index) => ({
    day,
    minVoltage: 210 + Math.random() * 10,
    avgVoltage: 220 + Math.random() * 10,
    maxVoltage: 230 + Math.random() * 15,
    alerts: Math.floor(Math.random() * 3)
  })).map(item => ({
    ...item,
    minVoltage: Math.round(item.minVoltage * 10) / 10,
    avgVoltage: Math.round(item.avgVoltage * 10) / 10,
    maxVoltage: Math.round(item.maxVoltage * 10) / 10
  }));
};

export function VoltageAreaChart() {
  const [data, setData] = useState(generateVoltageTrendData());
  const [selectedMetric, setSelectedMetric] = useState('avgVoltage');

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateVoltageTrendData());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium mb-2">{`${label}`}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-red-500">Max:</span>
              <span>{data.maxVoltage}V</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-blue-500">Avg:</span>
              <span>{data.avgVoltage}V</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-green-500">Min:</span>
              <span>{data.minVoltage}V</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-orange-500">Alerts:</span>
              <span>{data.alerts}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (voltage: number) => {
    if (voltage < 200 || voltage > 240) return 'text-red-500';
    if (voltage < 210 || voltage > 230) return 'text-orange-500';
    return 'text-green-500';
  };

  const currentAvgVoltage = data[data.length - 1]?.avgVoltage || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Voltage Trend - Last 7 Days</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            {currentAvgVoltage >= 200 && currentAvgVoltage <= 240 ? (
              <>
                <IconShield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">System Normal</span>
              </>
            ) : (
              <>
                <IconAlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600">Attention Required</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getStatusColor(currentAvgVoltage)}`}>
            {currentAvgVoltage}V
          </div>
          <div className="text-sm text-muted-foreground">Current Avg</div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="maxVoltage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="avgVoltage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="minVoltage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[190, 250]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}V`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference lines for safe voltage range */}
              <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="2 2" opacity={0.6} />
              <ReferenceLine y={240} stroke="#ef4444" strokeDasharray="2 2" opacity={0.6} />
              
              <Area
                type="monotone"
                dataKey="maxVoltage"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#maxVoltage)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="avgVoltage"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#avgVoltage)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="minVoltage"
                stroke="hsl(var(--chart-3))"
                fillOpacity={1}
                fill="url(#minVoltage)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center mt-4 space-x-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
            <span>Max Voltage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
            <span>Avg Voltage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
            <span>Min Voltage</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Safe Range:</span>
            <span className="text-sm font-medium">200V - 240V</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Alerts:</span>
            <span className="text-sm font-medium text-orange-600">
              {data.reduce((sum, item) => sum + item.alerts, 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}