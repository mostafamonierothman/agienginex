
// Refactored index.ts: Only handles routing and global error handling
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@4.0.0';
import { corsHeaders, TaskRequest } from './utils.ts';
import { executeLeadGeneration } from './leadGeneration.ts';
import { executeEmailOutreach } from './emailOutreach.ts';
import { createLandingPage } from './landingPage.ts';
import { conductMarketResearch } from './marketResearch.ts';

// Initialize Supabase client and Resend for any main/global handlers if needed
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// This primary client isn't directly used anymore here but is kept for forward compatibility.
// const supabase = createClient(supabaseUrl, supabaseServiceKey, { db: { schema: 'api' } });
// const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskType, parameters }: TaskRequest = await req.json();

    console.log(`🚀 Real Business Executor: Processing ${taskType} task`);

    let result: any = {};

    switch (taskType.toLowerCase()) {
      case 'lead_generation':
        result = await executeLeadGeneration(parameters);
        break;
      case 'email_outreach':
        result = await executeEmailOutreach(parameters);
        break;
      case 'landing_page':
        result = await createLandingPage(parameters);
        break;
      case 'market_research':
        result = await conductMarketResearch(parameters);
        break;
      default:
        throw new Error(`Unknown task type: ${taskType}`);
    }

    // Only create primary global client if you need it for supervisor_queue, or refactor it as needed!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, { db: { schema: 'api' } });
    await supabase
      .from('supervisor_queue')
      .insert({
        user_id: 'real_business_executor',
        agent_name: 'RealBusinessExecutor',
        action: 'business_execution',
        input: JSON.stringify({ taskType, parameters }),
        status: 'completed',
        output: JSON.stringify(result)
      });

    console.log(`✅ Task completed successfully: ${result.description}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Real business task completed: ${result.description}`,
        data: result
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Real business execution error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Real business execution failed: ${error.message}`,
        error: error.message
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
