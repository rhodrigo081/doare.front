import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardStore } from "@/zustand/dashboardStore";

const TotalDonationQuantityCard = () => {
  const last6MonthDonations = dashboardStore(
    (state) => state.last6MonthDonations
  );

  const totalQuantityDonation = last6MonthDonations.reduce(
    (acc, donation) => acc + donation.totalDonations,
    0
  );
  return (
    <Card>
      <CardHeader className="text-lg font-semibold">
        <CardTitle>Total de doações</CardTitle>
        <CardDescription>últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-primary text-xl font-semibold">
          {totalQuantityDonation}
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalDonationQuantityCard;
