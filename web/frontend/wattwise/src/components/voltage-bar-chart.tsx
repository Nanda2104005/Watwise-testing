'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';

// Static initial data untuk menghindari hydration mismatch
const getInitialData = () => {
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = (new Date().getHours() - (11 - i) + 24) % 24;
    return hour;
  });

  return hours.map((hour) => ({
    time: `${hour.toString().padStart(2, '0')}:00`,
    voltage: 220.0, // Static values
    current: 15.0,
    power: 3.3
  }));
};

// Mock data generator untuk simulasi tegangan real-time
const generateVoltageData = () => {
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = (new Date().getHours() - (11 - i) + 24) % 24;
    return hour;
  });

  return hours.map((hour) => ({
    time: `${hour.toString().padStart(2, '0')}:00`,
    voltage: 215 + Math.random() * 15 + Math.sin((hour / 24) * Math.PI * 2) * 8,
    current: 12 + Math.random() * 8 + Math.sin((hour / 24) * Math.PI * 2) * 3,
    power: 0
  })).map(item => ({
    ...item,
    power: (item.voltage * item.current) / 1000,
    voltage: Math.round(item.voltage * 10) / 10,
    current: Math.round(item.current * 10) / 10
  }));
};

export function VoltageBarChart() {
  const [data, setData] = useState(getInitialData());
  const [isRealTime, setIsRealTime] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
    // Load real data after component mounts
    setData(generateVoltageData());
  }, []);

  useEffect(() => {
    if (!isRealTime || !isClient) return;

    const interval = setInterval(() => {
      setData(generateVoltageData());
    }, 3000); // Update setiap 3 detik

    return () => clearInterval(interval);
  }, [isRealTime, isClient]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium mb-2">{`Time: ${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex justify-between items-center gap-4">
              <span style={{ color: pld.color }} className="font-medium">
                {pld.dataKey === 'voltage' ? 'Voltage:' : 
                 pld.dataKey === 'current' ? 'Current:' : 'Power:'}
              </span>
              <span>
                {pld.value}
                {pld.dataKey === 'voltage' ? 'V' : 
                 pld.dataKey === 'current' ? 'A' : 'kW'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Voltage Monitoring - Last 12 Hours</CardTitle>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isRealTime && isClient ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-muted-foreground">
            {isRealTime && isClient ? 'Live' : 'Paused'}
          </span>
          <button 
            onClick={() => setIsRealTime(!isRealTime)}
            className="text-xs px-2 py-1 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
            disabled={!isClient}
          >
            {isRealTime ? 'Pause' : 'Resume'}
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="voltage" 
                name="Voltage (V)"
                fill="hsl(var(--chart-1))" 
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Bar 
                dataKey="current" 
                name="Current (A)"
                fill="hsl(var(--chart-2))" 
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Bar 
                dataKey="power" 
                name="Power (kW)"
                fill="hsl(var(--chart-3))" 
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-1">
              {data[data.length - 1]?.voltage || 220.0}V
            </div>
            <div className="text-sm text-muted-foreground">Current Voltage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-2">
              {data[data.length - 1]?.current || 15.0}A
            </div>
            <div className="text-sm text-muted-foreground">Current Draw</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-chart-3">
              {data[data.length - 1]?.power || 3.3}kW
            </div>
            <div className="text-sm text-muted-foreground">Power Usage</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}