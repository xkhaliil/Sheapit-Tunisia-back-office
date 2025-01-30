"use client";

import { useEffect, useState } from "react";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { jsPDF } from "jspdf";
import {
  AlertTriangle,
  CreditCard,
  DollarSign,
  Download,
  Flag,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import { CSVLink } from "react-csv";

import "jspdf-autotable";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { Breadcrumb } from "./Breadcrumb";
import { DashboardSkeleton } from "./Skeleton";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
);

export default function DashboardOverview() {
  const [activeChart, setActiveChart] = useState("users");
  const [loading, setLoading] = useState(true);

  const stats = [
    {
      label: "Total Users",
      value: "10,234",
      icon: Users,
      trend: "up",
      percentage: "12%",
    },
    {
      label: "Active Subscriptions",
      value: "8,569",
      icon: CreditCard,
      trend: "up",
      percentage: "8%",
    },
    {
      label: "Total Revenue",
      value: "$123,456",
      icon: DollarSign,
      trend: "up",
      percentage: "15%",
    },
    {
      label: "Pending Reports",
      value: "23",
      icon: Flag,
      trend: "down",
      percentage: "5%",
    },
  ];

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Users",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
      {
        label: "Subscriptions",
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Dashboard Overview",
      },
    },
  };

  const exportCSV = () => {
    const csvData = chartData.datasets.map((dataset, index) => {
      return {
        label: dataset.label,
        ...Object.fromEntries(
          chartData.labels.map((label, i) => [label, dataset.data[i]]),
        ),
      };
    });
    return csvData;
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Dashboard Overview", 14, 15);
    doc.autoTable({
      head: [["Month", ...chartData.datasets.map((ds) => ds.label)]],
      body: chartData.labels.map((label, index) => [
        label,
        ...chartData.datasets.map((ds) => ds.data[index]),
      ]),
    });
    doc.save("dashboard-overview.pdf");
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const recentActivities = [
    {
      user: "John Doe",
      action: "Subscribed to Premium Plan",
      time: "2 hours ago",
    },
    { user: "Jane Smith", action: "Reported a post", time: "4 hours ago" },
    {
      user: "Mike Johnson",
      action: "Cancelled subscription",
      time: "1 day ago",
    },
    { user: "Emily Brown", action: "Updated profile", time: "2 days ago" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Overview", href: "/overview" },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg dark:bg-gray-800 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-bold text-accent sm:text-2xl lg:text-3xl">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-full bg-accent/10 p-2 sm:p-3">
                <stat.icon className="h-4 w-4 text-accent sm:h-6 sm:w-6" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.percentage}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">
                  Since last month
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 sm:p-6"
      >
        <div className="mb-4 flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-3 py-1 text-sm transition-colors duration-200 sm:px-4 sm:py-2 sm:text-base ${
                activeChart === "users"
                  ? "bg-accent text-accent-foreground"
                  : "bg-accent/10 text-accent hover:bg-accent/20 dark:text-accent-foreground/80"
              }`}
              onClick={() => setActiveChart("users")}
            >
              Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-3 py-1 text-sm transition-colors duration-200 sm:px-4 sm:py-2 sm:text-base ${
                activeChart === "subscriptions"
                  ? "bg-accent text-accent-foreground"
                  : "bg-accent/10 text-accent hover:bg-accent/20 dark:text-accent-foreground/80"
              }`}
              onClick={() => setActiveChart("subscriptions")}
            >
              Subscriptions
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <CSVLink
                data={exportCSV()}
                filename={"dashboard-overview.csv"}
                className="flex items-center rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground transition duration-200 hover:bg-accent/90 dark:bg-accent dark:text-accent-foreground sm:px-4 sm:py-2 sm:text-base"
              >
                <Download className="mr-1 inline-block h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                Export CSV
              </CSVLink>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportPDF}
              className="flex items-center rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground transition duration-200 hover:bg-accent/90 dark:bg-accent dark:text-accent-foreground sm:px-4 sm:py-2 sm:text-base"
            >
              <Download className="mr-1 inline-block h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
              Export PDF
            </motion.button>
          </div>
        </div>
        <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
          {activeChart === "users" ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest user actions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <div className="rounded-full bg-accent/10 p-2">
                    <Users className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {activity.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Current status of key system components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">Server CPU Usage</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="bg-accent/10" />
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">Database Load</span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <Progress value={60} className="bg-accent/10" />
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="bg-accent/10" />
              </div>
            </div>
            <div className="mt-6">
              <h4 className="mb-2 text-sm font-medium">Active Alerts</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">High memory usage detected</span>
                </li>
                <li className="flex items-center space-x-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">
                    All other systems operating normally
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
