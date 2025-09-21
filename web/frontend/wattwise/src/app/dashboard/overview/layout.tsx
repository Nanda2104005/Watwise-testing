import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp, IconBolt, IconAlertTriangle, IconShield, IconActivity } from '@tabler/icons-react';
import React from 'react';

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            ⚡ Voltage Monitoring Dashboard
          </h2>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-1'>
              <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
              <span className='text-sm text-muted-foreground'>System Online</span>
            </div>
          </div>
        </div>

        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          <Card className='@container/card border-l-4 border-l-green-500'>
            <CardHeader>
              <CardDescription className='flex items-center gap-2'>
                <IconBolt className='w-4 h-4 text-green-600' />
                Current Voltage
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600'>
                220.5V
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className='text-green-600 border-green-200'>
                  <IconTrendingUp />
                  Normal
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium text-green-600'>
                Voltage is stable <IconShield className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Within normal range (200-240V)
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card border-l-4 border-l-blue-500'>
            <CardHeader>
              <CardDescription className='flex items-center gap-2'>
                <IconActivity className='w-4 h-4 text-blue-600' />
                Current Draw
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-blue-600'>
                15.2A
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className='text-blue-600 border-blue-200'>
                  <IconTrendingUp />
                  +2.1A
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium text-blue-600'>
                Load increased slightly <IconTrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Current consumption monitoring
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card border-l-4 border-l-purple-500'>
            <CardHeader>
              <CardDescription className='flex items-center gap-2'>
                <IconBolt className='w-4 h-4 text-purple-600' />
                Power Consumption
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-purple-600'>
                3.35kW
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className='text-purple-600 border-purple-200'>
                  <IconTrendingUp />
                  +5.2%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium text-purple-600'>
                Efficient power usage <IconActivity className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                Real-time power calculation
              </div>
            </CardFooter>
          </Card>

          <Card className='@container/card border-l-4 border-l-orange-500'>
            <CardHeader>
              <CardDescription className='flex items-center gap-2'>
                <IconAlertTriangle className='w-4 h-4 text-orange-600' />
                Voltage Alerts
              </CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600'>
                0
              </CardTitle>
              <CardAction>
                <Badge variant='outline' className='text-green-600 border-green-200'>
                  <IconShield />
                  Safe
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium text-green-600'>
                No voltage anomalies <IconShield className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                System operating normally
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* Recent voltage readings */}
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}