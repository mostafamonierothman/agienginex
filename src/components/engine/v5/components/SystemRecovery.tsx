
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Upload, Trash2 } from 'lucide-react';
import { createPersistenceService } from '@/services/PersistenceService';

interface SystemRecoveryProps {
  onRestore: (data: any) => void;
  onExport: () => any;
}

const SystemRecovery: React.FC<SystemRecoveryProps> = ({ onRestore, onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleExportSystem = async () => {
    try {
      setIsExporting(true);
      const systemData = onExport();
      
      const dataStr = JSON.stringify(systemData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agienginex-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportSystem = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          onRestore(data);
        } catch (error) {
          console.error('Import failed:', error);
        } finally {
          setIsImporting(false);
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleClearAllData = async () => {
    if (!confirm('Are you sure you want to clear all AGI system data? This cannot be undone.')) {
      return;
    }

    try {
      setIsClearing(true);
      const persistence = createPersistenceService('local');
      
      await persistence.deleteState('agi_agents');
      await persistence.deleteState('agi_kpis');
      await persistence.deleteState('agi_projects');
      await persistence.deleteState('agi_system_state');
      
      // Reload page to reset state
      window.location.reload();
    } catch (error) {
      console.error('Clear failed:', error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-purple-400" />
          System Recovery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={handleExportSystem}
          disabled={isExporting}
          variant="outline"
          className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export System Backup'}
        </Button>

        <Button
          onClick={handleImportSystem}
          disabled={isImporting}
          variant="outline"
          className="w-full border-green-500 text-green-400 hover:bg-green-500/10"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isImporting ? 'Importing...' : 'Import System Backup'}
        </Button>

        <Button
          onClick={handleClearAllData}
          disabled={isClearing}
          variant="outline"
          className="w-full border-red-500 text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {isClearing ? 'Clearing...' : 'Clear All Data'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SystemRecovery;
