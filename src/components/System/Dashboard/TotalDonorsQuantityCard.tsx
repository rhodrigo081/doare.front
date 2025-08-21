import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardStore } from "@/zustand/dashboardStore";

const TotalDonorsQuantityCard = () => {
  const last6MonthDonors = dashboardStore((state) => state.last6MonthDonors);

  const totalQuantityDonors = last6MonthDonors.reduce(
    (acc, donation) => acc + donation.totalPartners,
    0
  );
  return (
    <Card>
      <CardHeader className="text-lg font-semibold">
        <CardTitle>Total de novos doadores</CardTitle>
        <CardDescription>últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-primary text-xl font-semibold">
          {totalQuantityDonors}
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalDonorsQuantityCard;
