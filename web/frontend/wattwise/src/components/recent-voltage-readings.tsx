'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { IconBolt, IconAlertTriangle, IconShield, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

type VoltageReading = {
  id: string;
  location: string;
  voltage: number;
  current: number;
  power: number;
  status: 'normal' | 'warning' | 'critical';
  timestamp: Date;
  trend: 'up' | 'down' | 'stable';
};

// Generate mock voltage readings
const generateVoltageReadings = (): VoltageReading[] => {
  const locations = [
    'Main Panel A1',
    'Kitchen Circuit',
    'Living Room',
    'Bedroom 1',
    'Bedroom 2',
    'Bathroom',
    'Garage',
    'Outdoor Lighting'
  ];

  return locations.slice(0, 6).map((location, index) => {
    const voltage = 215 + Math.random() * 20;
    const current = 8 + Math.random() * 12;
    const power = (voltage * current) / 1000;
    
    let status: 'normal' | 'warning' | 'critical' = 'normal';
    if (voltage < 200 || voltage > 240) status = 'critical';
    else if (voltage < 210 || voltage > 230) status = 'warning';

    const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
    const trend = trends[Math.floor(Math.random() * trends.length)];

    return {
      id: `reading-${index}`,
      location,
      voltage: Math.round(voltage * 10) / 10,
      current: Math.round(current * 10) / 10,
      power: Math.round(power * 100) / 100,
      status,
      timestamp: new Date(Date.now() - Math.random() * 300000), // Random time within last 5 minutes
      trend
    };
  });
};

export function RecentVoltageReadings() {
  const [readings, setReadings] = useState<VoltageReading[]>(generateVoltageReadings());

  useEffect(() => {
    const interval = setInterval(() => {
      setReadings(generateVoltageReadings());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <IconAlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <IconAlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <IconShield className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Warning</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Normal</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <IconTrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <IconTrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Recent Voltage Readings</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Live monitoring from all circuits
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-3">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10">
                      <IconBolt className="w-5 h-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium leading-none">
                        {reading.location}
                      </p>
                      {getStatusIcon(reading.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{reading.voltage}V</span>
                      <span>{reading.current}A</span>
                      <span>{reading.power}kW</span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1">
                    {getStatusBadge(reading.status)}
                    {getTrendIcon(reading.trend)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(reading.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm font-medium text-green-600">
                {readings.filter(r => r.status === 'normal').length}
              </div>
              <div className="text-xs text-muted-foreground">Normal</div>
            </div>
            <div>
              <div className="text-sm font-medium text-orange-600">
                {readings.filter(r => r.status === 'warning').length}
              </div>
              <div className="text-xs text-muted-foreground">Warning</div>
            </div>
            <div>
              <div className="text-sm font-medium text-red-600">
                {readings.filter(r => r.status === 'critical').length}
              </div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}