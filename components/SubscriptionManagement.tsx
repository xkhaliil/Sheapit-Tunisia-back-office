"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart, Edit, Plus, Save, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Breadcrumb } from "./Breadcrumb";
import { SubscriptionManagementSkeleton } from "./Skeleton";
import { SubscriptionAnalytics } from "./SubscriptionAnalytics";

interface Plan {
  id: number;
  name: string;
  duration: number;
  price: number;
  features: string[];
}

interface NewPlan {
  name: string;
  duration: string;
  price: string;
  features: string[];
}

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 1,
      name: "Basic",
      duration: 1,
      price: 9.99,
      features: ["Feature 1", "Feature 2"],
    },
    {
      id: 2,
      name: "Pro",
      duration: 3,
      price: 24.99,
      features: ["Feature 1", "Feature 2", "Feature 3"],
    },
    {
      id: 3,
      name: "Premium",
      duration: 6,
      price: 44.99,
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    },
    {
      id: 4,
      name: "Enterprise",
      duration: 12,
      price: 79.99,
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "Feature 5",
      ],
    },
  ]);

  const [editingPlan, setEditingPlan] = useState<number | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState<NewPlan>({
    name: "",
    duration: "",
    price: "",
    features: [],
  });
  const [coupons, setCoupons] = useState([
    { id: 1, code: "SUMMER20", discount: 20, type: "percentage" },
    { id: 2, code: "NEWUSER", discount: 10, type: "fixed" },
  ]);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "percentage",
  });
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan.id);
  };

  const handleSavePlan = (plan: Plan) => {
    setPlans(plans.map((p) => (p.id === plan.id ? { ...p, ...plan } : p)));
    setEditingPlan(null);
  };

  const handleAddPlan = () => {
    const plan = {
      id: plans.length + 1,
      name: newPlan.name,
      duration: Number.parseInt(newPlan.duration),
      price: Number.parseFloat(newPlan.price),
      features: newPlan.features,
    };
    setPlans([...plans, plan]);
    setIsAddingPlan(false);
    setNewPlan({ name: "", duration: "", price: "", features: [] });
  };

  const handleAddCoupon = () => {
    const coupon = {
      id: coupons.length + 1,
      code: newCoupon.code,
      discount: Number.parseFloat(newCoupon.discount),
      type: newCoupon.type,
    };
    setCoupons([...coupons, coupon]);
    setIsAddingCoupon(false);
    setNewCoupon({ code: "", discount: "", type: "percentage" });
  };

  const handleDeleteCoupon = (id: number) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  if (isLoading) {
    return <SubscriptionManagementSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800"
    >
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Subscription Management", href: "/subscriptions" },
        ]}
      />
      <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
        Subscription Management
      </h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Subscription Plans
          </h3>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration (months)</TableHead>
                  <TableHead>Price ($)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {plans.map((plan) => (
                    <motion.tr
                      key={plan.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>{plan.name}</TableCell>
                      <TableCell>{plan.duration}</TableCell>
                      <TableCell>
                        {editingPlan === plan.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={plan.price}
                            onChange={(e) =>
                              handleSavePlan({
                                ...plan,
                                price: Number.parseFloat(e.target.value),
                              })
                            }
                            className="w-20 rounded border px-2 py-1"
                          />
                        ) : (
                          `$${plan.price.toFixed(2)}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingPlan === plan.id ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => handleSavePlan(plan)}
                                size="sm"
                                variant="outline"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Save changes</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => handleEditPlan(plan)}
                                size="sm"
                                variant="outline"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit plan</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Plan
              </motion.button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Plan</DialogTitle>
                <DialogDescription>
                  Create a new subscription plan.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newPlan.name}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duration (months)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newPlan.duration}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, duration: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newPlan.price}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, price: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="features" className="text-right">
                    Features
                  </Label>
                  <Input
                    id="features"
                    value={newPlan.features.join(", ")}
                    onChange={(e) =>
                      setNewPlan({
                        ...newPlan,
                        features: e.target.value.split(", "),
                      })
                    }
                    className="col-span-3"
                    placeholder="Feature 1, Feature 2, ..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddPlan}>Add Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Coupons and Discounts
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {coupons.map((coupon) => (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>{coupon.code}</TableCell>
                      <TableCell>{coupon.discount}</TableCell>
                      <TableCell>{coupon.type}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDeleteCoupon(coupon.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          <Dialog open={isAddingCoupon} onOpenChange={setIsAddingCoupon}>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 flex items-center rounded-md bg-green-500 px-4 py-2 text-white transition duration-200 hover:bg-green-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Coupon
              </motion.button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Coupon</DialogTitle>
                <DialogDescription>
                  Create a new coupon or discount.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="code"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount" className="text-right">
                    Discount
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    value={newCoupon.discount}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discount: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newCoupon.type}
                    onValueChange={(value) =>
                      setNewCoupon({ ...newCoupon, type: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCoupon}>Add Coupon</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8"
      >
        <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Subscription Analytics
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded bg-gray-100 p-4 dark:bg-gray-700"
          >
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Total Revenue
            </h4>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              $12,345.67
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded bg-gray-100 p-4 dark:bg-gray-700"
          >
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Churn Rate
            </h4>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              2.5%
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded bg-gray-100 p-4 dark:bg-gray-700"
          >
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Trial Conversion Rate
            </h4>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              68%
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded bg-gray-100 p-4 dark:bg-gray-700"
          >
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Monthly Recurring Revenue (MRR)
            </h4>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              $5,678.90
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded bg-gray-100 p-4 dark:bg-gray-700"
          >
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Annual Recurring Revenue (ARR)
            </h4>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              $68,146.80
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="rounded bg-gray-100 p-4 dark:bg-gray-700"
          >
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Lifetime Value (LTV)
            </h4>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              $1,234.56
            </p>
          </motion.div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 flex items-center rounded-md bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600"
          onClick={() => setShowDetailedAnalytics(true)}
        >
          <BarChart className="mr-2 h-4 w-4" />
          View Detailed Analytics
        </motion.button>
      </motion.div>
      <Dialog
        open={showDetailedAnalytics}
        onOpenChange={setShowDetailedAnalytics}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detailed Subscription Analytics</DialogTitle>
          </DialogHeader>
          <SubscriptionAnalytics />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
