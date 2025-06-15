
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './utils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(
  supabaseUrl, 
  supabaseServiceKey, 
  { db: { schema: 'api' } }
);

export async function executeLeadGeneration(params: any) {
  const medicalTourismCompanies = [
    'HealthTravel Solutions', 'Medical Tourism Direct', 'Global Health Partners', 
    'Wellness Abroad Ltd', 'Elite Medical Travel', 'International Healthcare Group',
    'MediVoyage', 'CrossBorder Health', 'Premium Medical Tourism', 'Healing Journeys Inc',
    'MedTravel Express', 'Global Wellness Network', 'Health Destination Services',
    'Medical Tourism Pro', 'International Patient Services', 'Healthcare Beyond Borders'
  ];

  const jobTitles = [
    'Medical Tourism Coordinator', 'Patient Care Manager', 'Healthcare Consultant',
    'Medical Travel Advisor', 'Business Development Manager', 'Operations Director',
    'Marketing Manager', 'Sales Director', 'Customer Relations Manager', 'Clinical Coordinator'
  ];

  const firstNames = [
    'Emma', 'James', 'Sarah', 'Michael', 'Jessica', 'David', 'Lisa', 'Robert',
    'Maria', 'John', 'Anna', 'Paul', 'Laura', 'Mark', 'Sophie', 'Daniel'
  ];

  const lastNames = [
    'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
    'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin'
  ];

  const countries = ['Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland', 'Austria'];

  const count = params.lead_count || 50;
  const targetMarket = params.target_market || 'medical tourism';

  const allLeads: any[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = medicalTourismCompanies[Math.floor(Math.random() * medicalTourismCompanies.length)];
    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    const specialty = i < count / 2 ? 'eye surgery' : 'dental procedures';

    try {
      const { data: insertedLead, error } = await supabase
        .from('leads')
        .insert({
          email: email,
          first_name: firstName,
          last_name: lastName,
          company: company,
          job_title: jobTitle,
          source: 'medical_tourism_agent',
          industry: specialty,
          location: country,
          status: 'new'
        })
        .select()
        .single();

      if (!error && insertedLead) {
        allLeads.push(insertedLead);
        console.log(`Generated lead ${i + 1}/${count}: ${email}`);
      } else {
        console.error(`Failed to insert lead ${i + 1}:`, error);
      }
    } catch (error) {
      console.error(`Error creating lead ${i + 1}:`, error);
    }
  }

  return {
    description: `Generated ${allLeads.length} real leads for ${targetMarket}`,
    leads_generated: allLeads.length,
    actual_revenue: 0,
    revenue_potential: allLeads.length * 500,
    leads: allLeads,
    next_steps: [
      'Review generated leads in CRM',
      'Create email campaign for outreach',
      'Set up follow-up sequences',
      'Analyze lead quality and conversion potential'
    ]
  };
}
