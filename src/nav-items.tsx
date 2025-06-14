
// Only Home and AGI V5 tabs
import { HomeIcon, Zap } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "AGI V5",
    to: "/agi-v5",
    icon: <Zap className="h-4 w-4" />,
  },
];
