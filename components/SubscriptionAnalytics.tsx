"use client";

import { useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4500 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 5500 },
];

const churnData = [
  { month: "Jan", churnRate: 2.1 },
  { month: "Feb", churnRate: 2.3 },
  { month: "Mar", churnRate: 2.0 },
  { month: "Apr", churnRate: 2.5 },
  { month: "May", churnRate: 2.2 },
  { month: "Jun", churnRate: 1.8 },
];

const conversionData = [
  { month: "Jan", conversionRate: 65 },
  { month: "Feb", conversionRate: 68 },
  { month: "Mar", conversionRate: 70 },
  { month: "Apr", conversionRate: 72 },
  { month: "May", conversionRate: 75 },
  { month: "Jun", conversionRate: 78 },
];

export function SubscriptionAnalytics() {
  const [activeTab, setActiveTab] = useState("revenue");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Analytics</CardTitle>
        <CardDescription>Detailed view of subscription metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="churn">Churn Rate</TabsTrigger>
            <TabsTrigger value="conversion">Conversion Rate</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue">
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="churn">
            <ChartContainer
              config={{
                churnRate: {
                  label: "Churn Rate",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={churnData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="churnRate"
                    stroke="var(--color-churnRate)"
                    name="Churn Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="conversion">
            <ChartContainer
              config={{
                conversionRate: {
                  label: "Conversion Rate",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="conversionRate"
                    stroke="var(--color-conversionRate)"
                    name="Conversion Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
