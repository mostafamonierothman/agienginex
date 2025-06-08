
import { agiApiClient } from '@/services/AGIApiClient';
import { vectorMemoryService } from '@/services/VectorMemoryService';

export async function agentCollaborate(
  sourceAgent: string, 
  targetAgent: string, 
  message: string,
  context?: any
): Promise<any> {
  try {
    console.log(`🤝 ${sourceAgent} → ${targetAgent}: ${message}`);
    
    // Store collaboration in memory
    await vectorMemoryService.storeMemory(
      sourceAgent,
      `Collaborated with ${targetAgent}: ${message}`,
      'collaboration',
      0.8
    );

    // Run target agent with collaboration context
    const result = await agiApiClient.runAgent({
      agent_name: targetAgent,
      input: {
        collaboration: true,
        from: sourceAgent,
        message,
        context
      }
    });

    // Store response in source agent's memory
    if (result.success) {
      await vectorMemoryService.storeMemory(
        sourceAgent,
        `Received from ${targetAgent}: ${result.message}`,
        'collaboration_response',
        0.8
      );
    }

    return result;
  } catch (error) {
    console.error('Collaboration failed:', error);
    return { success: false, error: error.message };
  }
}

export async function broadcastToAgents(
  sourceAgent: string,
  agentList: string[],
  message: string
): Promise<any[]> {
  const results = await Promise.all(
    agentList.map(agent => 
      agentCollaborate(sourceAgent, agent, message)
    )
  );
  
  console.log(`📢 ${sourceAgent} broadcasted to ${agentList.length} agents`);
  return results;
}

export async function formAgentTeam(
  teamLeader: string,
  teamMembers: string[],
  objective: string
): Promise<void> {
  console.log(`👥 Forming team: ${teamLeader} leading ${teamMembers.join(', ')}`);
  
  for (const member of teamMembers) {
    await agentCollaborate(
      teamLeader,
      member,
      `Team objective: ${objective}. You are part of this mission.`
    );
  }
}
