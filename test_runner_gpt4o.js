
// External test runner for AGIengineX V7.5 with GPT-4o agents
// Run with: node test_runner_gpt4o.js

const fetch = require('node-fetch');

const BASE_URL = "https://YOUR-AGIengineX-URL"; // Update with your actual URL

async function runAgent(agentName, input = {}) {
  try {
    console.log(`\n🚀 Testing ${agentName}...`);
    
    const response = await fetch(`${BASE_URL}/api/run_agent`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-api-key' // Add if needed
      },
      body: JSON.stringify({ agentName, input })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ [${agentName}] Result:`, JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error(`❌ [${agentName}] Error:`, error.message);
    return { error: error.message };
  }
}

async function testAGIengineX() {
  console.log("=== AGIengineX V7.5 External Test Runner with GPT-4o ===");
  console.log("Testing LLM-powered agents...\n");

  // Test LLM Executive Agent
  await runAgent("llm_executive_agent", { 
    goal: "Optimize AGIengineX system performance",
    context: "Current system has 22 agents running in multi-agent coordination"
  });

  // Test LLM Learning Agent
  await runAgent("llm_learning_agent", { 
    agentResults: {
      executionTime: "2.3s",
      success: true,
      agentsInvolved: ["ChatProcessor", "Executive", "SystemContext"],
      performance: "optimal"
    }
  });

  // Test traditional agents for comparison
  await runAgent("executive_agent", { goal: "System status check" });
  await runAgent("system_context_agent", {});
  await runAgent("chat_processor_agent", { message: "What is the current system status?" });

  // Test agent creation
  await runAgent("enhanced_goal_agent", { goal: "Create new optimization strategies" });

  console.log("\n🎯 Test completed! Check results above.");
}

// Run the test
testAGIengineX().catch(console.error);
