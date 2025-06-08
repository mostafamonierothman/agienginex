
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MemoryViewer from '../components/MemoryViewer';
import { HardDrive, Database, Brain } from 'lucide-react';

const MemoryPage = () => {
  const [memory] = useState({
    "vision": "To build a trillion-dollar AGI company using autonomous agents",
    "market": "AI, Healthcare, Automation, Financial Services",
    "core_strategy": "Deploy 19+ specialized agents for autonomous operation",
    "current_projects": "Medical AI Research, AGI V6 Development, Financial Analysis",
    "key_learnings": "Enhanced agents show 300% better performance than core agents",
    "optimization_targets": "Reduce cycle time, increase agent coordination, expand market reach"
  });

  const [vectorMemory] = useState([
    { id: 1, type: "Project Memory", content: "Medical AI research showing promising results in diagnostic accuracy", embedding_strength: 0.95 },
    { id: 2, type: "Agent Learning", content: "BrowserAgent improved web scraping efficiency by 40%", embedding_strength: 0.88 },
    { id: 3, type: "Market Intelligence", content: "Financial markets showing increased AI adoption trends", embedding_strength: 0.92 },
    { id: 4, type: "Strategic Insight", content: "Parallel agent execution reduces overall task completion time", embedding_strength: 0.91 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <HardDrive className="h-8 w-8 text-purple-400" />
          Persistent Memory
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Database className="h-3 w-3 mr-1" />
            {Object.keys(memory).length} Core Memories
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            <Brain className="h-3 w-3 mr-1" />
            {vectorMemory.length} Vector Memories
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-green-400" />
              Core Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MemoryViewer memory={memory} />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Vector Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vectorMemory.map((item) => (
                <div key={item.id} className="p-3 bg-slate-700/50 rounded border border-slate-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400">
                      {item.type}
                    </Badge>
                    <div className="text-xs text-gray-400">
                      Strength: {(item.embedding_strength * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-sm text-gray-300">{item.content}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white">Memory Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{Object.keys(memory).length}</div>
              <div className="text-sm text-gray-400">Core Memories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{vectorMemory.length}</div>
              <div className="text-sm text-gray-400">Vector Memories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {(vectorMemory.reduce((acc, item) => acc + item.embedding_strength, 0) / vectorMemory.length * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Avg Strength</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">24/7</div>
              <div className="text-sm text-gray-400">Active Learning</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryPage;
