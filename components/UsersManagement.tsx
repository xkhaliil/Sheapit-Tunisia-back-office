"use client";

import { useEffect, useState } from "react";

import { jsPDF } from "jspdf";
import {
  Eye,
  FileDown,
  Mail,
  MoreHorizontal,
  Search,
  Send,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { CSVLink } from "react-csv";

import "jspdf-autotable";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { TooltipProvider } from "@/components/ui/tooltip";

import { Breadcrumb } from "./Breadcrumb";
import { Pagination } from "./Pagination";
import { UserManagementSkeleton } from "./Skeleton";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  joinDate: string;
}

interface UsersByType {
  drivers: User[];
  companies: User[];
  admins: User[];
}

type TabType = "drivers" | "companies" | "admins";

// Generate mock data
const generateMockData = (count: number, role: string) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${role} ${i + 1}`,
    email: `${role.toLowerCase()}${i + 1}@example.com`,
    status: ["Active", "Inactive", "Suspended"][Math.floor(Math.random() * 3)],
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split("T")[0],
  }));
};

export default function UsersManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("drivers");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [users, setUsers] = useState<UsersByType>({
    drivers: generateMockData(50, "Driver"),
    companies: generateMockData(30, "Company"),
    admins: generateMockData(20, "Admin"),
  });
  const [newUsers, setNewUsers] = useState({
    drivers: generateMockData(5, "New Driver"),
    companies: generateMockData(3, "New Company"),
    admins: generateMockData(2, "New Admin"),
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [isComposingEmail, setIsComposingEmail] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentNewPage, setCurrentNewPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = users[activeTab].filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "All" || user.status === statusFilter) &&
      (!startDate || user.joinDate >= startDate) &&
      (!endDate || user.joinDate <= endDate),
  );

  const filteredNewUsers = newUsers[activeTab].filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!startDate || user.joinDate >= startDate) &&
      (!endDate || user.joinDate <= endDate),
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const paginatedNewUsers = filteredNewUsers.slice(
    (currentNewPage - 1) * itemsPerPage,
    currentNewPage * itemsPerPage,
  );

  const handleUserAction = (userId: number, action: "suspend" | "activate") => {
    setUsers({
      ...users,
      [activeTab]: users[activeTab].map((user) =>
        user.id === userId
          ? { ...user, status: action === "suspend" ? "Suspended" : "Active" }
          : user,
      ),
    });
  };

  const handleNewUserAction = (
    userId: number,
    action: "approve" | "reject",
  ) => {
    if (action === "approve") {
      const approvedUser = newUsers[activeTab].find(
        (user) => user.id === userId,
      );
      setUsers({
        ...users,
        [activeTab]: [
          ...users[activeTab],
          { ...approvedUser, status: "Active" },
        ],
      });
      setNewUsers({
        ...newUsers,
        [activeTab]: newUsers[activeTab].filter((user) => user.id !== userId),
      });
    } else if (action === "reject") {
      setNewUsers({
        ...newUsers,
        [activeTab]: newUsers[activeTab].filter((user) => user.id !== userId),
      });
    }
  };

  const handleSendEmail = (userId: number) => {
    const user =
      users[activeTab].find((u) => u.id === userId) ||
      newUsers[activeTab].find((u) => u.id === userId);
    setSelectedUser(user || null);
    setIsComposingEmail(true);
  };

  const handleSendEmailSubmit = () => {
    // Implement email sending logic here
    console.log(`Sending email to ${selectedUser?.email}:`, emailContent);
    setIsComposingEmail(false);
    setEmailContent("");
  };

  const exportCSV = (data: User[]) => {
    return data.map(({ id, ...user }) => user);
  };

  const exportPDF = (data: User[]) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Name", "Email", "Status", "Join Date"]],
      body: data.map((user) => [
        user.name,
        user.email,
        user.status,
        user.joinDate,
      ]),
    });
    doc.save("users.pdf");
  };

  const stats = {
    drivers: {
      total: users.drivers.length,
      active: users.drivers.filter((user) => user.status === "Active").length,
      new: newUsers.drivers.length,
    },
    companies: {
      total: users.companies.length,
      active: users.companies.filter((user) => user.status === "Active").length,
      new: newUsers.companies.length,
    },
    admins: {
      total: users.admins.length,
      active: users.admins.filter((user) => user.status === "Active").length,
      new: newUsers.admins.length,
    },
  };

  if (isLoading) {
    return <UserManagementSkeleton />;
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "User Management", href: "/users" },
          ]}
        />
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <h2 className="text-3xl font-bold tracking-tight">
              User Management
            </h2>
            <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:gap-4">
              <CSVLink
                data={exportCSV(filteredUsers)}
                filename="users.csv"
                className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export CSV
              </CSVLink>
              <Button
                onClick={() => exportPDF(filteredUsers)}
                className="w-full sm:w-auto"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabType)}
          >
            <TabsList>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="companies">Transport Companies</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
            {["drivers", "companies", "admins"].map((role) => (
              <TabsContent key={role} value={role}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                    >
                      <h3 className="mb-2 text-lg font-semibold">
                        Total {role}
                      </h3>
                      <p className="text-3xl font-bold">
                        {stats[role as keyof typeof stats].total}
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                    >
                      <h3 className="mb-2 text-lg font-semibold">
                        Active {role}
                      </h3>
                      <p className="text-3xl font-bold">
                        {stats[role as keyof typeof stats].active}
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="rounded-lg bg-white p-4 shadow dark:bg-gray-800"
                    >
                      <h3 className="mb-2 text-lg font-semibold">New {role}</h3>
                      <p className="text-3xl font-bold">
                        {stats[role as keyof typeof stats].new}
                      </p>
                    </motion.div>
                  </div>

                  <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={`Search ${role}...`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Status</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-[150px]"
                      />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-[150px]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Existing {role}</h3>
                    {paginatedUsers.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.status}</TableCell>
                              <TableCell>{user.joinDate}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setIsViewingDetails(true);
                                      }}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      <span>View Details</span>
                                    </DropdownMenuItem>
                                    {user.status !== "Suspended" ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUserAction(user.id, "suspend")
                                        }
                                      >
                                        <UserMinus className="mr-2 h-4 w-4" />
                                        <span>Suspend Account</span>
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUserAction(user.id, "activate")
                                        }
                                      >
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        <span>Activate Account</span>
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => handleSendEmail(user.id)}
                                    >
                                      <Mail className="mr-2 h-4 w-4" />
                                      <span>Send Email</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="rounded-lg bg-gray-50 py-10 text-center dark:bg-gray-800">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                          No users found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          No {role} match your search criteria.
                        </p>
                      </div>
                    )}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(
                        filteredUsers.length / itemsPerPage,
                      )}
                      onPageChange={setCurrentPage}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">New {role}</h3>
                    {paginatedNewUsers.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedNewUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.joinDate}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleNewUserAction(user.id, "approve")
                                    }
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleNewUserAction(user.id, "reject")
                                    }
                                  >
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsViewingDetails(true);
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="rounded-lg bg-gray-50 py-10 text-center dark:bg-gray-800">
                        <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                          No new users
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          There are no new {role} waiting for approval.
                        </p>
                      </div>
                    )}
                    <Pagination
                      currentPage={currentNewPage}
                      totalPages={Math.ceil(
                        filteredNewUsers.length / itemsPerPage,
                      )}
                      onPageChange={setCurrentNewPage}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              {selectedUser && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Name:</Label>
                    <span className="col-span-3">{selectedUser.name}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Email:</Label>
                    <span className="col-span-3">{selectedUser.email}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Status:</Label>
                    <span className="col-span-3">{selectedUser.status}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Join Date:</Label>
                    <span className="col-span-3">{selectedUser.joinDate}</span>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewingDetails(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isComposingEmail} onOpenChange={setIsComposingEmail}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Email</DialogTitle>
              </DialogHeader>
              {selectedUser && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recipient" className="text-right">
                      To:
                    </Label>
                    <Input
                      id="recipient"
                      value={selectedUser.email}
                      readOnly
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email-content" className="text-right">
                      Message:
                    </Label>
                    <Textarea
                      id="email-content"
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      className="col-span-3"
                      rows={5}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={handleSendEmailSubmit}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
}
