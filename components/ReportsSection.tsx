"use client";

import { useEffect, useState } from "react";

import { jsPDF } from "jspdf";
import {
  AlertCircle,
  Ban,
  CheckCircle,
  Eye,
  FileDown,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { CSVLink } from "react-csv";

import "jspdf-autotable";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Breadcrumb } from "./Breadcrumb";
import { Pagination } from "./Pagination";
import { ReportCardSkeleton } from "./Skeleton";

interface Report {
  id: number;
  reportedUser: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: string;
  announcementLink: string;
  comments?: { text: string; date: string }[];
}

// Generate mock data for reports
const generateMockReports = (count: number) => {
  const reasons = [
    "Inappropriate content",
    "Harassment",
    "Spam",
    "Fake account",
    "Other",
  ];
  const statuses = ["Pending", "Resolved", "Under review", "Dismissed"];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    reportedUser: `User ${i + 1}`,
    reportedBy: `Reporter ${i + 1}`,
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      .toISOString()
      .split("T")[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    announcementLink: `https://example.com/announcement/${i + 1}`,
  }));
};

// Mock data for reports
const initialReports = generateMockReports(100);

// Mock data for report trends
const reportTrends = [
  { date: "2023-05-01", reports: 5 },
  { date: "2023-05-02", reports: 8 },
  { date: "2023-05-03", reports: 12 },
  { date: "2023-05-04", reports: 7 },
  { date: "2023-05-05", reports: 10 },
  { date: "2023-05-06", reports: 15 },
  { date: "2023-05-07", reports: 9 },
];

export default function ReportsSection() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [comment, setComment] = useState("");
  const [isComposingEmail, setIsComposingEmail] = useState(false);
  const [emailContent, setEmailContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      (report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || report.status === statusFilter) &&
      (dateFilter === "All" || report.date >= dateFilter),
  );

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleReportAction = (id: number, action: string) => {
    setReports(
      reports.map((report) =>
        report.id === id
          ? {
              ...report,
              status:
                action === "resolve"
                  ? "Resolved"
                  : action === "dismiss"
                    ? "Dismissed"
                    : report.status,
            }
          : report,
      ),
    );
  };

  const handleBanUser = (reportedUser: string) => {
    // Implement user banning logic here
    console.log(`Banning reported user: ${reportedUser}`);
  };

  const handleAddComment = () => {
    if (selectedReport && comment) {
      setReports(
        reports.map((report) =>
          report.id === selectedReport.id
            ? {
                ...report,
                comments: [
                  ...(report.comments || []),
                  { text: comment, date: new Date().toISOString() },
                ],
              }
            : report,
        ),
      );
      setComment("");
    }
  };

  const handleSendEmail = (reportId: number) => {
    const report = reports.find((r) => r.id === reportId);
    setSelectedReport(report || null);
    setIsComposingEmail(true);
  };

  const handleSendEmailSubmit = () => {
    // Implement email sending logic here
    console.log(
      `Sending email regarding report ${selectedReport?.id}:`,
      emailContent,
    );
    setIsComposingEmail(false);
    setEmailContent("");
  };

  const exportCSV = () => {
    return filteredReports.map(({ id, ...report }) => report);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Reported User", "Reported By", "Reason", "Date", "Status"]],
      body: filteredReports.map((report) => [
        report.reportedUser,
        report.reportedBy,
        report.reason,
        report.date,
        report.status,
      ]),
    });
    doc.save("reports.pdf");
  };

  const totalReports = reports.length;
  const resolvedReports = reports.filter(
    (report) => report.status === "Resolved",
  ).length;
  const averageResolutionTime = "2.5 days"; // This would be calculated based on actual data

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Reports", href: "/reports" },
          ]}
        />
        {isLoading ? (
          <div className="space-y-4">
            <ReportCardSkeleton />
            <ReportCardSkeleton />
            <ReportCardSkeleton />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <CSVLink
                  data={exportCSV()}
                  filename="reports.csv"
                  className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export CSV
                </CSVLink>
                <Button onClick={exportPDF} className="w-full sm:w-auto">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReports}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resolved Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{resolvedReports}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg. Resolution Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {averageResolutionTime}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Report Trends</CardTitle>
                <CardDescription>Number of reports over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    reports: {
                      label: "Reports",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px] w-full sm:h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="reports"
                        stroke="var(--color-reports)"
                        name="Reports"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1">
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Dismissed">Dismissed</SelectItem>
                  <SelectItem value="Under review">Under Review</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-[180px]"
              />
            </div>

            {paginatedReports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reported User</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.reportedUser}</TableCell>
                      <TableCell>{report.reportedBy}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.status}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setIsViewingDetails(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleBanUser(report.reportedUser)
                                }
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ban Reported User</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleReportAction(report.id, "dismiss")
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Dismiss Report</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleReportAction(report.id, "resolve")
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as Resolved</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendEmail(report.id)}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Send Email</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg bg-gray-50 py-10 text-center dark:bg-gray-800">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                  No reports found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  There are no reports matching your search criteria.
                </p>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredReports.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />

            <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Report Details</DialogTitle>
                </DialogHeader>
                {selectedReport && (
                  <div className="space-y-4">
                    <div>
                      <Label className="font-bold">Reported User:</Label>
                      <p>{selectedReport.reportedUser}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Reported By:</Label>
                      <p>{selectedReport.reportedBy}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Reason:</Label>
                      <p>{selectedReport.reason}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Date:</Label>
                      <p>{selectedReport.date}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Status:</Label>
                      <p>{selectedReport.status}</p>
                    </div>
                    <div>
                      <Label className="font-bold">Announcement Link:</Label>
                      <a
                        href={selectedReport.announcementLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Announcement
                      </a>
                    </div>
                    <div>
                      <Label className="font-bold">Comments:</Label>
                      {selectedReport.comments &&
                      selectedReport.comments.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {selectedReport.comments.map((comment, index) => (
                            <li key={index}>
                              {comment.text} -{" "}
                              {new Date(comment.date).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No comments yet.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comment">Add Comment:</Label>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Enter your comment here..."
                      />
                      <Button onClick={handleAddComment}>Add Comment</Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <Dialog open={isComposingEmail} onOpenChange={setIsComposingEmail}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Email</DialogTitle>
                </DialogHeader>
                {selectedReport && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recipient" className="text-right">
                        To:
                      </Label>
                      <Input
                        id="recipient"
                        value={selectedReport.reportedUser}
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
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
