
import { HomeIcon, BrainCircuit, Zap, Rocket, Store } from "lucide-react";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    title: "AGI V4",
    to: "/agi-v4",
    icon: <BrainCircuit className="h-4 w-4" />,
  },
  {
    title: "AGI Pro Platform",
    to: "/agi-pro",
    icon: <Store className="h-4 w-4" />,
  },
];
