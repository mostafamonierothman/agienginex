
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Props {
  pluginName: string;
  pluginDesc: string;
  pluginCode: string;
  pluginError: string | null;
  onNameChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onCodeChange: (v: string) => void;
  onRegister: () => void;
  plugins: string[];
  onUnregister: (name: string) => void;
}

export function PluginPanel({
  pluginName,
  pluginDesc,
  pluginCode,
  pluginError,
  onNameChange,
  onDescChange,
  onCodeChange,
  onRegister,
  plugins,
  onUnregister,
}: Props) {
  return (
    <div className="mb-6 bg-slate-800 p-4 rounded">
      <div className="font-bold text-blue-300 mb-2">Register Action Plugin</div>
      <div className="mb-2 flex flex-col gap-2">
        <Input placeholder="Plugin Name" value={pluginName} onChange={e => onNameChange(e.target.value)} />
        <Input placeholder="Short Description" value={pluginDesc} onChange={e => onDescChange(e.target.value)} />
        <Textarea
          placeholder={`Async plugin code. Example:\nreturn \`Echo: \${ctx.goal} -- \${ctx.thoughts}\`;`}
          value={pluginCode}
          onChange={e => onCodeChange(e.target.value)}
          className="font-mono"
          rows={4}
        />
        <Button onClick={onRegister} className="bg-blue-600 hover:bg-blue-700">
          ➕ Register Plugin
        </Button>
        {pluginError && <div className="text-red-400 text-xs">{pluginError}</div>}
      </div>
      <div className="mt-3">
        <span className="text-cyan-400 font-semibold">Active Plugins:</span>
        {plugins && plugins.length > 0 ? (
          <ul className="ml-5 mt-2 text-xs">
            {plugins.map((p: string) => (
              <li key={p} className="flex items-center gap-2 mb-1">
                <span className="text-white">{p}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  className="py-0.5 px-2 text-xs"
                  onClick={() => onUnregister(p)}
                >
                  Unregister
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <span className="ml-2 text-gray-400">No plugins registered.</span>
        )}
      </div>
    </div>
  );
}
