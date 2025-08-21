import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { ChartConfig } from "@/components/ui/chart";
import { dashboardStore } from "@/zustand/dashboardStore";
import { months } from "@/utils/MonthsArray";

export const description = "An area chart with a legend";

const chartConfig = {
  totalDonations: {
    label: "Doações",
    color: "var(--chart-1)",
  },
  totalAmount: {
    label: "Valor",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DonationsChart() {
  const last6MonthDonations = dashboardStore(
    (state) => state.last6MonthDonations
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doações dos últimos 6 meses</CardTitle>
        <CardDescription>
          Acompanhe o total de doações realizadas nos últimos 6 meses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={last6MonthDonations}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => months[value - 1]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  
                />
              }
            />
            <Area
              dataKey="totalDonations"
              type="monotone"
              fill="var(--color-totalDonations)"
              fillOpacity={0.4}
              stroke="var(--color-totalDonations)"
              stackId="a"
            />
            <Area
              dataKey="totalAmount"
              type="monotone"
              fill="var(--color-totalAmount)"
              fillOpacity={0.4}
              stroke="var(--color-totalAmount)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
