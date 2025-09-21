import { delay } from '@/constants/mock-api';
import { VoltageAreaChart } from '@/components/voltage-area-chart';

export default async function AreaStats() {
  await delay(2000);
  return <VoltageAreaChart />;
}