
import { useNavigate } from 'react-router-dom';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import PortfolioSummary from '@/components/business/PortfolioSummary';
import { Button } from '@/components/ui/button';
import { Target, Rocket } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🤖 AGIengineX
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Next-Generation Autonomous AI Agent System
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/leads')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              size="lg"
            >
              <Target className="mr-2 h-5 w-5" />
              Lead Generation Dashboard
            </Button>
            <Button
              onClick={() => navigate('/agi-pro')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              size="lg"
            >
              <Rocket className="mr-2 h-5 w-5" />
              AGI Pro Platform
            </Button>
          </div>
        </div>
        
        <PortfolioSummary 
          totalRevenue={0} 
          engineState={{ 
            active_agents: 0, 
            estimated_days_to_10M_path: 'N/A', 
            tasks_completed_last_sec: 0 
          }} 
        />
        
        <div className="mt-8">
          <DashboardTabs />
        </div>
      </div>
    </div>
  );
};

export default Index;
