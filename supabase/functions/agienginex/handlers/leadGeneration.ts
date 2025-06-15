
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

export async function executeRealLeadGeneration(
  count: number = 50, 
  targetMarket: string = 'medical tourism',
  supabase: any,
  supabaseUrl: string,
  supabaseKey: string
) {
  try {
    console.log(`🎯 Executing REAL lead generation: ${count} leads for ${targetMarket}`);
    
    // Call the real-business-executor edge function for actual lead generation
    const response = await fetch(`${supabaseUrl}/functions/v1/real-business-executor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        taskType: 'lead_generation',
        parameters: {
          target_market: targetMarket,
          lead_count: count,
          service: 'medical tourism consultation',
          target_industry: 'medical tourism'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Real business executor failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return {
        success: true,
        leads_generated: result.data?.leads_generated || 0,
        revenue_potential: result.data?.revenue_potential || 0,
        actual_leads: result.data?.leads || [],
        description: result.data?.description || `Generated ${count} real leads`,
        next_steps: result.data?.next_steps || []
      };
    } else {
      throw new Error(result.message || 'Lead generation failed');
    }
  } catch (error) {
    console.error('Real lead generation error:', error);
    throw error;
  }
}

export function detectLeadGenerationCommand(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  return (
    lowerPrompt.includes('lead') || 
    lowerPrompt.includes('medical tourism') || 
    lowerPrompt.includes('generate') && (lowerPrompt.includes('50') || lowerPrompt.includes('leads')) ||
    lowerPrompt.includes('lasik') || 
    lowerPrompt.includes('dental') ||
    lowerPrompt.includes('create leads')
  );
}
