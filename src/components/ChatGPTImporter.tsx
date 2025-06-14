
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImportResult {
  total: number;
  success: number;
  errorCount: number;
}

type ChatGPTExport = {
  title: string;
  create_time?: number;
  mapping: {
    [id: string]: {
      id: string;
      message?: {
        author: { role: string };
        content: { parts: string[] };
        create_time: number;
      };
      parent: string | null;
      children: string[];
    };
  };
};

function extractMessagesFromExport(json: ChatGPTExport): {
  conversation_id: string;
  conversation_title: string;
  role: string;
  content: string;
  message_index: number;
  created_at: string;
  raw_json: any;
}[] {
  const conversation_id = Object.keys(json.mapping)[0] || "";
  const conversation_title = json.title || "Untitled";
  const results: any[] = [];
  let idx = 0;

  // Sort nodes by create_time
  const nodes = Object.values(json.mapping)
    .filter((n) => n.message && n.message.content?.parts?.length)
    .sort((a, b) => (a.message!.create_time || 0) - (b.message!.create_time || 0));

  for (const node of nodes) {
    results.push({
      conversation_id,
      conversation_title,
      role: node.message?.author.role || "unknown",
      content: node.message?.content?.parts?.join("\n") || "",
      message_index: idx++,
      created_at: node.message?.create_time
        ? new Date(node.message.create_time * 1000).toISOString()
        : new Date().toISOString(),
      raw_json: node,
    });
  }
  return results;
}

const ChatGPTImporter: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    setImportResult(null);
    try {
      const text = await selectedFile.text();
      const json: ChatGPTExport = JSON.parse(text);
      const messages = extractMessagesFromExport(json);

      let success = 0;
      let errorCount = 0;
      for (const message of messages) {
        const { error } = await supabase.from("imported_conversations").insert([
          {
            conversation_id: message.conversation_id,
            conversation_title: message.conversation_title,
            topic: "", // Optional: user can fill in later
            project_tag: "", // Optional: user can fill in later
            role: message.role,
            content: message.content,
            message_index: message.message_index,
            created_at: message.created_at,
            imported_at: new Date().toISOString(),
            code_snippet: "", // Extraction logic can be enhanced per user needs
            raw_json: message.raw_json,
          },
        ]);
        if (error) {
          errorCount++;
        } else {
          success++;
        }
      }

      setImportResult({
        total: messages.length,
        success,
        errorCount,
      });

      if (success) {
        toast({
          title: "Import successful",
          description: `Imported ${success} messages from ChatGPT export.`,
        });
      }
      if (errorCount) {
        toast({
          title: "Errors occurred",
          description: `Failed to import ${errorCount} messages.`,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Import failed",
        description: err.message,
        variant: "destructive",
      });
    }
    setImporting(false);
    setSelectedFile(null);
  };

  return (
    <div className="max-w-xl mx-auto my-8">
      <Card className="bg-slate-800/80 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Import ChatGPT Export</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Upload your exported ChatGPT conversation (JSON format). The messages will be parsed and stored in your project knowledge base for advanced AGI agent workflows.
          </p>
          <Input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            disabled={importing}
            className="mb-4"
          />
          <Button
            onClick={handleImport}
            disabled={!selectedFile || importing}
            className="w-full"
          >
            {importing ? "Importing..." : "Upload & Import"}
          </Button>
          {importResult && (
            <div className="mt-4 text-sm text-white">
              Imported: <span className="font-semibold">{importResult.success}</span> / {importResult.total}
              {!!importResult.errorCount && (
                <span className="ml-2 text-red-400">({importResult.errorCount} failed)</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatGPTImporter;

