import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare } from "lucide-react";

const MetaFeedbackPanel: React.FC = () => {
  const [fb, setFb] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!fb.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from('supervisor_queue')
      .insert({
        agent_name: "user_feedback",
        action: "meta_suggestion",
        status: "submitted",
        output: fb
      });

    if (error) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Feedback Received", description: "Your idea/suggestion will inform AGI evolution!" });
      setFb("");
    }
    setLoading(false);
  };

  return (
    <Card className="bg-slate-800/80 border-cyan-900 flex flex-col h-full min-h-[230px]">
      <CardHeader className="pb-2 flex-row items-center flex gap-2">
        <CardTitle className="text-cyan-200 text-md flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Suggest an AGI Upgrade!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-2">
          <Input
            disabled={loading}
            className="bg-slate-900/70 text-cyan-100"
            value={fb}
            placeholder="Describe your improvement or new tool/feature…"
            onChange={e => setFb(e.target.value)}
          />
          <Button size="sm" disabled={loading || !fb.trim()} onClick={submitFeedback} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            {loading ? "Sending..." : "Submit"}
          </Button>
        </div>
        <div className="text-xs text-cyan-300">
          Your suggestions will be processed by system agents and may directly shape the next evolution cycle.
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaFeedbackPanel;
