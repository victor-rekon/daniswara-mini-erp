import {
  BarChart3,
  ClipboardList,
  Factory,
  FileText,
  LayoutDashboard,
  ReceiptText,
  Settings,
  TableProperties,
  Truck,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Input Command",
    href: "/input",
    icon: ClipboardList,
  },
  {
    label: "Production / HPP",
    href: "/production",
    icon: Factory,
  },
  {
    label: "Quotation",
    href: "/quotation",
    icon: FileText,
  },
  {
    label: "Sales & Delivery",
    href: "/sales-delivery",
    icon: Truck,
  },
  {
    label: "Invoice & Payment",
    href: "/invoice-payment",
    icon: ReceiptText,
  },
  {
    label: "Accounting Light",
    href: "/accounting",
    icon: ClipboardList,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    label: "Master Data",
    href: "/master-data",
    icon: TableProperties,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
