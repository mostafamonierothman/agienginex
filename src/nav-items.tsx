
import { HomeIcon, Brain, Zap, TrendingUp, Users, Target } from "lucide-react";
import Index from "./pages/Index";
import AGIV4 from "./pages/AGIV4";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "AGI V4",
    to: "/agi-v4",
    icon: <Brain className="h-4 w-4" />,
    page: <AGIV4 />,
  },
];
