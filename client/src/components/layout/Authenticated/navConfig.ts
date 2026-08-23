import {
  LayoutDashboard,
  Home as HomeIcon,
  Heart,
  MessageCircle,
  Building2,
  Users,
  UserCog,
  type LucideIcon,
  User,
} from "lucide-react";

import type { UserRole } from "@/features/auth/types/auth.types";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const clientNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Browse Properties", to: "/properties", icon: HomeIcon },
  { label: "Favorites", to: "/favorites", icon: Heart },
  { label: "My Inquiries", to: "/inquiries", icon: MessageCircle },
  {
    label: "Profile",
    to: "/profile",
    icon: User,
  },
];

const agentNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "My Properties", to: "/agent/properties", icon: Building2 },
  { label: "Inquiries", to: "/agent/inquiries", icon: MessageCircle },
   {label: "Profile", to: "/profile", icon: User, },
];

const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Inquiries", to: "/admin/inquiries", icon: MessageCircle },
  { label: "Agents", to: "/admin/agents", icon: UserCog },
  { label: "Users", to: "/admin/users", icon: Users },
  {label: "Profile", to: "/profile", icon: User, },
];

export function getNavIcleartems(role: UserRole): NavItem[] {
  switch (role) {
    case "AGENT":
      return agentNav;
    case "ADMIN":
      return adminNav;
    case "CLIENT":
    default:
      return clientNav;
  }
}