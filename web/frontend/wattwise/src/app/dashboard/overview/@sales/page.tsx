import { delay } from '@/constants/mock-api';
import { RecentVoltageReadings } from '@/components/recent-voltage-readings';

export default async function Sales() {
  await delay(3000);
  return <RecentVoltageReadings />;
}