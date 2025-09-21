import { delay } from '@/constants/mock-api';
import { PowerConsumptionPie } from '@/components/power-consumption-pie';

export default async function Stats() {
  await delay(1000);
  return <PowerConsumptionPie />;
}