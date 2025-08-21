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

const chartConfig = {
  totalPartners: {
    label: "Doadores",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function DonorsChart() {
  const last6MonthDonors = dashboardStore((state) => state.last6MonthDonors);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doadores dos últimos 6 meses</CardTitle>
        <CardDescription>
          Acompanhe o total de novos doadores nos últimos 6 meses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={last6MonthDonors}
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
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="totalPartners"
              type="monotone"
              fill="var(--color-totalPartners)"
              fillOpacity={0.4}
              stroke="var(--color-totalPartners)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
