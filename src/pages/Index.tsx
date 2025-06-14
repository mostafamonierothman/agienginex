import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export default function Index() {
  return (
    <main className="flex flex-col items-center space-y-4 mt-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        AGIengineX Playground
      </h1>
      <p className="text-muted-foreground text-sm">
        Explore the possibilities of AI Agents and Autonomous Systems.
      </p>
      {/* Add a link to the AGIengineX chat page */}
      <Link
        to="/agi-chat"
        className="px-4 py-2 bg-purple-700 text-white rounded hover-scale transition"
      >
        Try AGIengineX Chat →
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card className="hover-scale transition">
          <Link to="/agi-v5">
            <div className="p-4">
              <h2 className="text-lg font-semibold">AGI V5</h2>
              <p className="text-sm text-muted-foreground">
                Advanced Agent Orchestration and Goal Management.
              </p>
            </div>
          </Link>
        </Card>
        <Card className="hover-scale transition">
          <Link to="/chatgpt-import">
            <div className="p-4">
              <h2 className="text-lg font-semibold">ChatGPT Import</h2>
              <p className="text-sm text-muted-foreground">
                Import and run your ChatGPT conversations as AGI tasks.
              </p>
            </div>
          </Link>
        </Card>
        <Card className="hover-scale transition">
          <Link to="/functional-agi">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Functional AGI</h2>
              <p className="text-sm text-muted-foreground">
                Unified AGI Core with advanced capabilities.
              </p>
            </div>
          </Link>
        </Card>
      </div>
    </main>
  );
}
