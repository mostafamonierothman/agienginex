import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@4.0.0';
import { corsHeaders } from './utils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey,
  { db: { schema: 'api' } }
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

export async function executeEmailOutreach(params: any) {
  const { campaign_name = 'Medical Tourism Outreach', target_industry = 'medical tourism' } = params;
  
  try {
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'new')
      .eq('industry', target_industry)
      .limit(25);

    if (leadsError) throw leadsError;
    if (!leads || leads.length === 0) {
      throw new Error('No new leads found for outreach');
    }

    // Create email campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .insert({
        name: campaign_name,
        subject: 'Transform Your Healthcare Journey with Premium Medical Tourism',
        template: `Hi {{first_name}},

I hope this email finds you well. I'm reaching out because I noticed your involvement in the healthcare industry and wanted to share an exciting opportunity.

Our premium medical tourism consultancy has helped over 500+ patients save 60-80% on medical procedures while receiving world-class care abroad.

Here's what we offer:
• Vetted international hospitals and surgeons
• Complete care coordination from consultation to recovery
• 24/7 patient support and medical translation
• Transparent pricing with no hidden costs

Would you be interested in a 15-minute call to discuss how medical tourism could benefit your patients or organization?

Best regards,
Medical Tourism Expert

P.S. We're offering a free consultation assessment for healthcare professionals this month.`,
        target_industry: target_industry,
        status: 'active'
      })
      .select()
      .single();

    if (campaignError) throw campaignError;

    let emailsSent = 0;
    let emailErrors = 0;

    // Send emails to leads
    for (const lead of leads) {
      try {
        const emailContent = campaign.template
          .replace('{{first_name}}', lead.first_name || 'there');

        const { data: emailResult, error: emailError } = await resend.emails.send({
          from: 'Medical Tourism Expert <onboarding@resend.dev>',
          to: [lead.email],
          subject: campaign.subject,
          html: emailContent.replace(/\n/g, '<br>')
        });

        if (emailError) {
          console.error(`Failed to send email to ${lead.email}:`, emailError);
          emailErrors++;
          continue;
        }

        // Log email sent
        await supabase
          .from('email_logs')
          .insert({
            lead_id: lead.id,
            campaign_id: campaign.id,
            email: lead.email,
            subject: campaign.subject,
            content: emailContent,
            status: 'sent',
            resend_email_id: emailResult?.id
          });

        // Update lead status
        await supabase
          .from('leads')
          .update({ status: 'contacted', updated_at: new Date().toISOString() })
          .eq('id', lead.id);

        emailsSent++;
      } catch (error) {
        console.error(`Error sending email to ${lead.email}:`, error);
        emailErrors++;
      }
    }

    // Update campaign stats
    await supabase
      .from('email_campaigns')
      .update({ 
        emails_sent: emailsSent,
        updated_at: new Date().toISOString() 
      })
      .eq('id', campaign.id);

    return {
      description: `Sent ${emailsSent} real emails for ${campaign_name}`,
      emails_sent: emailsSent,
      email_errors: emailErrors,
      actual_revenue: 0,
      revenue_potential: emailsSent * 500, // Potential revenue from email responses
      campaign_id: campaign.id,
      next_steps: [
        'Monitor email open rates',
        'Track replies and engagement',
        'Follow up with interested prospects',
        'Schedule consultation calls'
      ]
    };
  } catch (error) {
    throw new Error(`Email outreach failed: ${error.message}`);
  }
}
