"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { Bell, LogOut, Moon, Palette, Save, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

import { Breadcrumb } from "./Breadcrumb";
import { SettingsSkeleton } from "./Skeleton";

type AccentColor = "blue" | "green" | "violet" | "yellow" | "orange" | "red";

interface AccentColorConfig {
  name: string;
  value: string;
  hsl: {
    primary: string;
    secondary: string;
    foreground: string;
  };
}

const accentColors: Record<AccentColor, AccentColorConfig> = {
  blue: {
    name: "Blue",
    value: "#3b82f6",
    hsl: {
      primary: "221.2 83.2% 53.3%",
      secondary: "221.2 83.2% 93.3%",
      foreground: "222.2 47.4% 11.2%",
    },
  },
  green: {
    name: "Green",
    value: "#22c55e",
    hsl: {
      primary: "142.1 76.2% 36.3%",
      secondary: "142.1 76.2% 96.3%",
      foreground: "142.1 76.2% 11.2%",
    },
  },
  violet: {
    name: "Violet",
    value: "#8b5cf6",
    hsl: {
      primary: "262.1 83.3% 57.8%",
      secondary: "262.1 83.3% 97.8%",
      foreground: "262.1 83.3% 11.2%",
    },
  },
  yellow: {
    name: "Yellow",
    value: "#eab308",
    hsl: {
      primary: "47.9 95.8% 53.1%",
      secondary: "47.9 95.8% 93.1%",
      foreground: "47.9 95.8% 11.2%",
    },
  },
  orange: {
    name: "Orange",
    value: "#f97316",
    hsl: {
      primary: "24.6 95% 53.1%",
      secondary: "24.6 95% 93.1%",
      foreground: "24.6 95% 11.2%",
    },
  },
  red: {
    name: "Red",
    value: "#ef4444",
    hsl: {
      primary: "346.8 77.2% 49.8%",
      secondary: "346.8 77.2% 89.8%",
      foreground: "346.8 77.2% 11.2%",
    },
  },
};

const ACCENT_COLOR_COOKIE = "accentColor";

export default function SettingsSection() {
  const [settings, setSettings] = useState({
    name: "Admin User",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
    twoFactorAuth: false,
  });

  const [emailTemplates, setEmailTemplates] = useState({
    subscriptionReminder:
      "Dear {user},\n\nYour subscription is about to expire. Please renew to continue enjoying our services.\n\nBest regards,\nYour App Team",
    reportUpdate:
      "Dear {user},\n\nYour report has been {status}. Thank you for helping us maintain a safe community.\n\nBest regards,\nYour App Team",
  });

  const auditLogs = [
    { action: "User banned", admin: "Admin1", timestamp: "2023-05-10 14:30" },
    {
      action: "Subscription changed",
      admin: "Admin2",
      timestamp: "2023-05-09 11:15",
    },
    {
      action: "Report resolved",
      admin: "Admin1",
      timestamp: "2023-05-08 16:45",
    },
  ];

  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    // Try to get the color from cookie first, fallback to "blue"
    return (Cookies.get(ACCENT_COLOR_COOKIE) as AccentColor) || "blue";
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Get color from cookie on mount
    const savedAccentColor = Cookies.get(ACCENT_COLOR_COOKIE) as AccentColor;
    if (savedAccentColor && accentColors[savedAccentColor]) {
      setAccentColor(savedAccentColor);
      updateAccentColor(savedAccentColor);
    }
  }, []);

  const updateAccentColor = (color: AccentColor) => {
    const root = document.documentElement;
    const colorConfig = accentColors[color];

    root.style.setProperty("--accent", colorConfig.hsl.primary);
    root.style.setProperty("--accent-secondary", colorConfig.hsl.secondary);
    root.style.setProperty("--accent-foreground", colorConfig.hsl.foreground);
    root.style.setProperty("--ring", colorConfig.hsl.primary);
  };

  const handleSettingChange = (setting: string, value: string) => {
    setSettings({ ...settings, [setting]: value });
  };

  const handleEmailTemplateChange = (template: string, value: string) => {
    setEmailTemplates({ ...emailTemplates, [template]: value });
  };

  const handleSaveSettings = () => {
    if (settings.password !== settings.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    // Implement save settings logic here
    console.log("Saving settings:", settings);
    toast({
      title: "Settings saved",
      description: "Your settings have been successfully updated.",
    });
  };

  const handleSaveEmailTemplates = () => {
    // Implement save email templates logic here
    console.log("Saving email templates:", emailTemplates);
    toast({
      title: "Email templates saved",
      description: "Your email templates have been successfully updated.",
    });
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out");
  };

  const handleAccentChange = (color: AccentColor) => {
    setAccentColor(color);
    // Save to both localStorage and cookies
    localStorage.setItem("accentColor", color);
    Cookies.set(ACCENT_COLOR_COOKIE, color, { expires: 365 }); // Expires in 1 year
    updateAccentColor(color);
  };

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", href: "/settings" },
        ]}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex h-auto min-w-full space-x-1 rounded-lg bg-muted p-1 text-muted-foreground sm:min-w-0 sm:space-x-2">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium ring-offset-background transition-all hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="email-templates"
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium ring-offset-background transition-all hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
            >
              Email
            </TabsTrigger>
            <TabsTrigger
              value="audit-logs"
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium ring-offset-background transition-all hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
            >
              Logs
            </TabsTrigger>
            <TabsTrigger
              value="theme"
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium ring-offset-background transition-all hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
            >
              Theme
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
              <CardDescription>
                Update your admin profile and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => handleSettingChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={settings.password}
                  onChange={(e) =>
                    handleSettingChange("password", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) =>
                    handleSettingChange("confirmPassword", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="two-factor"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    handleSettingChange("twoFactorAuth", checked.toString())
                  }
                />
                <Label htmlFor="two-factor">
                  Enable Two-Factor Authentication
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email-templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize email templates for various notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subscription-reminder">
                  Subscription Reminder
                </Label>
                <Textarea
                  id="subscription-reminder"
                  value={emailTemplates.subscriptionReminder}
                  onChange={(e) =>
                    handleEmailTemplateChange(
                      "subscriptionReminder",
                      e.target.value,
                    )
                  }
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-update">Report Update</Label>
                <Textarea
                  id="report-update"
                  value={emailTemplates.reportUpdate}
                  onChange={(e) =>
                    handleEmailTemplateChange("reportUpdate", e.target.value)
                  }
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveEmailTemplates}>
                <Save className="mr-2 h-4 w-4" />
                Save Templates
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="audit-logs">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                View a log of all admin actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.admin}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
                <Label htmlFor="dark-mode">Dark Mode</Label>
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <Label>Accent Color</Label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(accentColors).map(
                    ([key, { name, value }]) => (
                      <Button
                        key={key}
                        variant={accentColor === key ? "default" : "outline"}
                        className="gap-2"
                        onClick={() => handleAccentChange(key as AccentColor)}
                      >
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: value }}
                        />
                        {name}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Theme Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
