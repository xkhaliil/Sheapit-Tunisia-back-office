import { useState } from "react";

import Link from "next/link";
import { Bell, LogOut, Menu, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ModeToggle } from "./mode-toggle";

export default function Header({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New User Registration",
      message: "John Doe has registered",
      time: "2 minutes ago",
    },
    {
      id: 2,
      title: "New Subscription",
      message: "Sarah Smith upgraded to premium",
      time: "2 hour ago",
    },
    {
      id: 3,
      title: "System Update",
      message: "New features available",
      time: "2 hours ago",
    },
  ];

  const handleLogout = () => {
    // Implement logout functionality
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 shadow-md dark:bg-gray-800">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white"></h1>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E70013] text-[10px] text-white">
              3
            </span>
          </Button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold dark:text-white">
                Notifications
              </h3>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex flex-col space-y-1 border-b pb-2 last:border-0 dark:border-gray-700"
                  >
                    <span className="font-medium dark:text-white">
                      {notification.title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {notification.message}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {notification.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="group relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full ring-2 ring-foreground transition-all duration-300 group-hover:ring-accent"
                src="/placeholder.svg?height=40&width=40"
                alt="Admin"
              />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></div>
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-medium text-foreground group-hover:text-accent">
                John Doe
              </span>
              <span className="text-xs text-muted-foreground">
                Administrator
              </span>
            </div>
          </div>
          <div className="absolute -left-4 top-10 z-10 hidden min-w-[150px] gap-2 rounded-md bg-popover p-4 text-sm shadow-md sm:flex-col sm:group-hover:flex">
            <Link
              href="/settings"
              className="flex items-center gap-2 hover:text-accent"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-accent"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
