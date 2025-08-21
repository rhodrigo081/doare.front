import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardStore } from "@/zustand/dashboardStore";

const TotalDonationValueCard = () => {
  const last6MonthDonations = dashboardStore(
    (state) => state.last6MonthDonations
  );

  const totalValueDonation = last6MonthDonations.reduce(
    (acc, donation) => acc + donation.totalAmount,
    0
  );
  return (
    <Card>
      <CardHeader className="text-lg font-semibold">
        <CardTitle>Valor arrecadado</CardTitle>
        <CardDescription>últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-primary text-xl font-semibold">
          {totalValueDonation.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalDonationValueCard;
