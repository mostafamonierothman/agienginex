
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
        AGIengineX
      </h1>
      <p className="text-muted-foreground text-base mb-6">
        Welcome to AGIengineX playground. Start chatting with your AGI!
      </p>
      <Link to="/agi-chat">
        <Button className="px-6 py-3 text-lg bg-purple-700 hover:bg-purple-800 rounded-lg shadow-lg">
          Chat with AGIengineX →
        </Button>
      </Link>
      <p className="mt-8 text-sm text-gray-400">
        (You now land directly in the AGI chat!<br/>
        This original landing page remains accessible at <b>/landing</b>.)
      </p>
    </main>
  );
}
