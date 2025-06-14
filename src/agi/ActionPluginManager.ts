
type ActionPluginContext = {
  goal: string;
  thoughts: string;
  memory: any;
};

export type ActionPlugin = {
  name: string;
  description: string;
  execute: (ctx: ActionPluginContext) => Promise<string>;
};

export class ActionPluginManager {
  private plugins: ActionPlugin[] = [];

  register(plugin: ActionPlugin) {
    if (!this.plugins.some(p => p.name === plugin.name)) {
      this.plugins.push(plugin);
    }
  }

  getPlugins(): ActionPlugin[] {
    return [...this.plugins];
  }

  async run(goal: string, thoughts: string, memory: any): Promise<{name: string; output: string}[]> {
    const results: {name: string; output: string}[] = [];
    for (const plugin of this.plugins) {
      const output = await plugin.execute({ goal, thoughts, memory });
      results.push({ name: plugin.name, output });
    }
    return results;
  }

  clear() {
    this.plugins = [];
  }
}
