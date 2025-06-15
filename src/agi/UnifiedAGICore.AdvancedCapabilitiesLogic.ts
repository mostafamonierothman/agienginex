
import { AGIAdvancedCapabilities } from "./AGIAdvancedCapabilities";
import { AutonomousResearchEngine } from "./AutonomousResearchEngine";
import { CrossSystemIntegrationManager } from "./CrossSystemIntegrationManager";
import { MultiAGIOrchestrator } from "./MultiAGIOrchestrator";
import { AdvancedMemoryConsolidator } from "./AdvancedMemoryConsolidator";
import { SelfModificationProtocol } from "./SelfModificationProtocol";

export function advancedAGIInitAndAssess(params: {
  researchEngine: AutonomousResearchEngine;
  systemIntegration: CrossSystemIntegrationManager;
  multiAGIOrchestrator: MultiAGIOrchestrator;
  memoryConsolidator: AdvancedMemoryConsolidator;
  selfModification: SelfModificationProtocol;
  log: (msg: string) => void;
}): AGIAdvancedCapabilities {
  return new AGIAdvancedCapabilities({
    researchEngine: params.researchEngine,
    systemIntegration: params.systemIntegration,
    multiAGIOrchestrator: params.multiAGIOrchestrator,
    memoryConsolidator: params.memoryConsolidator,
    selfModification: params.selfModification,
    log: params.log,
  });
}
