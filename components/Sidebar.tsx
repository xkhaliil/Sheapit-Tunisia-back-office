import { motion } from "framer-motion";
import { CreditCard, Flag, Home, LogOut, Settings, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { handleSignOut } from "@/app/actions/auth";

const menuItems = [
  { icon: Home, label: "Overview", value: "overview" },
  { icon: Users, label: "Users", value: "users" },
  { icon: CreditCard, label: "Subscriptions", value: "subscriptions" },
  { icon: Flag, label: "Reports", value: "reports" },
  { icon: Settings, label: "Settings", value: "settings" },
];

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function Sidebar({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-lg px-4 py-3"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-baseline gap-1"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-[1.75rem] font-normal tracking-normal text-foreground dark:text-white"
              >
                Sheapit
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-[0.875rem] font-medium tracking-wider text-[#E70013]"
              >
                TUNISIA
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight dark:text-white">
            Menu
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.value}
                variant={activeSection === item.value ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  activeSection === item.value
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "hover:bg-accent/10 hover:text-accent dark:text-white dark:hover:bg-accent/20 dark:hover:text-accent-foreground"
                }`}
                onClick={() => {
                  setActiveSection(item.value);
                  setIsSidebarOpen(false);
                }}
              >
                <item.icon
                  className={`mr-2 h-4 w-4 ${
                    activeSection === item.value
                      ? "text-accent-foreground"
                      : "text-accent dark:text-white"
                  }`}
                />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-accent/10 hover:text-accent dark:text-white dark:hover:bg-accent/20 dark:hover:text-accent-foreground"
          onClick={() => handleSignOut()}
        >
          <LogOut className="mr-2 h-4 w-4 text-accent dark:text-white" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <ScrollArea className="flex h-full flex-col border-r bg-white dark:bg-gray-800">
          {SidebarContent}
        </ScrollArea>
      </aside>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <ScrollArea className="h-full bg-white dark:bg-gray-800">
            {SidebarContent}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
