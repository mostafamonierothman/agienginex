
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ChatGPTImportButton: React.FC = () => (
  <div className="my-8 flex justify-center">
    <Button asChild className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold px-6 py-3 shadow-lg hover:scale-105 transition">
      <Link to="/chatgpt-import">Import ChatGPT Conversations</Link>
    </Button>
  </div>
);

export default ChatGPTImportButton;
