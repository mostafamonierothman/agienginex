
import { useEffect, useState } from "react";
import { DataFusionEngine } from "@/utils/data_fusion";

export function useExternalWorldSync({ enabled = false, onData = () => {} }) {
  const [status, setStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");

  useEffect(() => {
    if (!enabled) return;
    setStatus("syncing");

    async function sync() {
      try {
        // Use a few reliable current sources (demonstration only)
        const demoSources = [
          { url: "https://www.cnbc.com/id/100003114/device/rss/rss.html", type: "rss" as const, name: "CNBC Tech", update_frequency: 60 },
          { url: "https://www.reutersagency.com/feed/?best-sectors=technology", type: "rss" as const, name: "Reuters Tech", update_frequency: 60 },
        ];
        for (const src of demoSources) {
          if (src.type === "rss") {
            await DataFusionEngine.processRSSFeed(src.url, "core-agi-agent");
          }
          // If you want to add more sources or web data, add here
        }
        setStatus("done");
        onData?.();
      } catch (e) {
        setStatus("error");
      }
    }
    sync();
    // Only run on mount or when enabled changes to true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return status;
}
