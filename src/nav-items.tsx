
import { HomeIcon, Users, Zap, Settings, Target } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "AGI V4",
    to: "/agi-v4",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    title: "AGI V5",
    to: "/agi-v5",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    title: "AGI Pro",
    to: "/agi-pro",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: "Agent Manager",
    to: "/agent-manager",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Lead Dashboard",
    to: "/leads",
    icon: <Target className="h-4 w-4" />,
  },
];
