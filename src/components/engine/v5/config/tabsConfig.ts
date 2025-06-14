
import { 
  Brain, Bot, MessageSquare, Activity, Target, Zap, Settings, Database, 
  FileText, Globe, Users, DollarSign, BarChart 
} from 'lucide-react';

// Import all page components
import DashboardPage from '../pages/DashboardPage';
import AgentsPage from '../pages/AgentsPage';
import ChatPage from '../pages/ChatPage';
import MemoryPage from '../pages/MemoryPage';
import LogsPage from '../pages/LogsPage';
import SettingsPage from '../pages/SettingsPage';
import TrillionPathPage from '../pages/TrillionPathPage';
import DeepAgentsPage from '../pages/DeepAgentsPage';
import MedicalTourismAgentsPage from '../pages/MedicalTourismAgentsPage';
import MarketResearchPage from '../pages/MarketResearchPage';
import ProjectsPage from '../pages/ProjectsPage';
import RevenueGenerationPage from '../pages/RevenueGenerationPage';
import ConsultancyPage from '../pages/ConsultancyPage';
import LeadTestDashboard from '@/components/LeadTestDashboard';
import MetaAGICommandCenter from '../pages/MetaAGICommandCenter';

export const tabsConfig = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    shortLabel: 'Home',
    icon: Brain,
    component: DashboardPage,
    badge: 'AGI',
    badgeColor: 'bg-purple-500'
  },
  {
    id: 'revenue',
    label: 'Revenue Generation',
    shortLabel: 'Revenue',
    icon: DollarSign,
    component: RevenueGenerationPage,
    badge: '$200K+',
    badgeColor: 'bg-green-500'
  },
  {
    id: 'consultancy',
    label: 'AGI Consultancy',
    shortLabel: 'Consult',
    icon: FileText,
    component: ConsultancyPage,
    badge: 'New',
    badgeColor: 'bg-cyan-500'
  },
  {
    id: 'lead-test',
    label: 'Lead Test Dashboard',
    shortLabel: 'Test',
    icon: Database,
    component: LeadTestDashboard,
    badge: 'Live',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 'agents',
    label: 'Agent Registry',
    shortLabel: 'Agents',
    icon: Bot,
    component: AgentsPage,
    badge: '46+',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 'chat',
    label: 'Chat Interface',
    shortLabel: 'Chat',
    icon: MessageSquare,
    component: ChatPage,
    badge: 'LLM',
    badgeColor: 'bg-green-500'
  },
  {
    id: 'deep-agents',
    label: 'Deep Agents',
    shortLabel: 'Deep',
    icon: Zap,
    component: DeepAgentsPage,
    badge: 'V7',
    badgeColor: 'bg-cyan-500'
  },
  {
    id: 'medical-tourism',
    label: 'Medical Tourism',
    shortLabel: 'Medical',
    icon: Users,
    component: MedicalTourismAgentsPage,
    badge: 'Leads',
    badgeColor: 'bg-pink-500'
  },
  {
    id: 'market-research',
    label: 'Market Research',
    shortLabel: 'Research',
    icon: Globe,
    component: MarketResearchPage,
    badge: 'Data',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 'memory',
    label: 'Memory System',
    shortLabel: 'Memory',
    icon: Database,
    component: MemoryPage,
    badge: 'Vector',
    badgeColor: 'bg-indigo-500'
  },
  {
    id: 'trillion-path',
    label: 'Trillion Path',
    shortLabel: 'Trillion',
    icon: Target,
    component: TrillionPathPage,
    badge: 'Engine',
    badgeColor: 'bg-yellow-500'
  },
  {
    id: 'projects',
    label: 'Projects',
    shortLabel: 'Projects',
    icon: Activity,
    component: ProjectsPage,
    badge: 'Tasks',
    badgeColor: 'bg-red-500'
  },
  {
    id: 'logs',
    label: 'System Logs',
    shortLabel: 'Logs',
    icon: FileText,
    component: LogsPage,
    badge: 'Live',
    badgeColor: 'bg-gray-500'
  },
  {
    id: 'settings',
    label: 'Settings',
    shortLabel: 'Config',
    icon: Settings,
    component: SettingsPage
  },
  {
    id: 'meta-command-center',
    label: 'Meta AGI Command',
    shortLabel: 'Meta',
    icon: BarChart,
    component: MetaAGICommandCenter,
    badge: 'Meta',
    badgeColor: 'bg-cyan-500'
  }
];
