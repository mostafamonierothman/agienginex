
import { ActionPluginManager } from "./ActionPluginManager";
import type { ActionPlugin } from "./ActionPluginManager";

export class AGIPluginHandler {
  private plugins: ActionPluginManager = new ActionPluginManager();

  register(plugin: ActionPlugin) {
    this.plugins.register(plugin);
  }

  unregister(name: string) {
    this.plugins.unregister(name);
  }

  getPlugins() {
    return this.plugins.getPlugins();
  }

  clear() {
    this.plugins.clear();
  }

  async run(goal: string, thoughts: string, memory: any) {
    return this.plugins.run(goal, thoughts, memory);
  }
}
