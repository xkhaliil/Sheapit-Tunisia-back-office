"use client";

import { useState } from "react";

import DashboardOverview from "./DashboardOverview";
import Header from "./Header";
import ReportsSection from "./ReportsSection";
import SettingsSection from "./SettingsSection";
import { Sidebar } from "./Sidebar";
import SubscriptionManagement from "./SubscriptionManagement";
import UsersManagement from "./UsersManagement";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 p-6 dark:bg-gray-900">
          {activeSection === "overview" && <DashboardOverview />}
          {activeSection === "users" && <UsersManagement />}
          {activeSection === "subscriptions" && <SubscriptionManagement />}
          {activeSection === "reports" && <ReportsSection />}
          {activeSection === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}
