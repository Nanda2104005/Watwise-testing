'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { IconBolt, IconHome, IconSnowflake, IconFridge } from '@tabler/icons-react';

// Static initial data
const getInitialData = () => [
  {
    name: 'Air Conditioning',
    value: 35.0,
    color: '#FF6B6B', // Red
    icon: IconSnowflake
  },
  {
    name: 'Water Heater',
    value: 20.0,
    color: '#4ECDC4', // Teal
    icon: IconHome
  },
  {
    name: 'Refrigerator',
    value: 15.0,
    color: '#45B7D1', // Blue
    icon: IconFridge
  },
  {
    name: 'Electronics',
    value: 12.0,
    color: '#96CEB4', // Green
    icon: IconBolt
  },
  {
    name: 'Lighting',
    value: 8.0,
    color: '#FFEAA7', // Yellow
    icon: IconBolt
  },
  {
    name: 'Others',
    value: 10.0,
    color: '#DDA0DD', // Plum
    icon: IconHome
  }
];

// Mock data for power consumption by appliances
const generatePowerConsumptionData = () => {
  return [
    {
      name: 'Air Conditioning',
      value: 35 + Math.random() * 10,
      color: '#FF6B6B', // Red - vibrant
      icon: IconSnowflake
    },
    {
      name: 'Water Heater',
      value: 20 + Math.random() * 8,
      color: '#4ECDC4', // Teal - vibrant
      icon: IconHome
    },
    {
      name: 'Refrigerator',
      value: 15 + Math.random() * 5,
      color: '#45B7D1', // Blue - vibrant
      icon: IconFridge
    },
    {
      name: 'Electronics',
      value: 12 + Math.random() * 8,
      color: '#96CEB4', // Green - vibrant
      icon: IconBolt
    },
    {
      name: 'Lighting',
      value: 8 + Math.random() * 5,
      color: '#FFEAA7', // Yellow - vibrant
      icon: IconBolt
    },
    {
      name: 'Others',
      value: 10 + Math.random() * 5,
      color: '#DDA0DD', // Plum - vibrant
      icon: IconHome
    }
  ].map(item => ({
    ...item,
    value: Math.round(item.value * 10) / 10
  }));
};

export function PowerConsumptionPie() {
  const [data, setData] = useState(getInitialData());
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag and load real data
  useEffect(() => {
    setIsClient(true);
    setData(generatePowerConsumptionData());
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setData(generatePowerConsumptionData());
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [isClient]);

  const totalPower = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const Icon = data.icon;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4" />
            <span className="font-medium">{data.name}</span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between gap-4">
              <span>Percentage:</span>
              <span className="font-medium">{((data.value / totalPower) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Power:</span>
              <span className="font-medium">{((data.value / 100) * 3.5).toFixed(2)} kW</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <IconBolt className="w-5 h-5" />
          Power Consumption Distribution
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Real-time appliance power usage
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={0}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={activeIndex === index ? '#ffffff' : entry.color}
                    strokeWidth={activeIndex === index ? 3 : 1}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.1) drop-shadow(0 0 6px rgba(0,0,0,0.3))' : 'brightness(1)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2 mt-4">
          {data.map((item, index) => {
            const Icon = item.icon;
            const percentage = ((item.value / totalPower) * 100).toFixed(1);
            const powerKW = ((item.value / 100) * 3.5).toFixed(2);
            
            return (
              <div 
                key={item.name}
                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  activeIndex === index 
                    ? 'bg-muted shadow-sm scale-[1.02]' 
                    : 'hover:bg-muted/50'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-4 h-4 rounded-full border-2 ${
                      activeIndex === index ? 'border-white shadow-md' : 'border-transparent'
                    }`}
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: activeIndex === index ? `0 0 10px ${item.color}50` : 'none'
                    }}
                  ></div>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium" style={{ color: item.color }}>
                    {percentage}%
                  </div>
                  <div className="text-xs text-muted-foreground">{powerKW} kW</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Power Consumption:</span>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">3.50 kW</div>
              <div className="text-xs text-muted-foreground">Current usage</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}