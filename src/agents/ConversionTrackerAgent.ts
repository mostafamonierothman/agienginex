
import { supabase } from '@/integrations/supabase/client';

export const ConversionTrackerAgent = async (leadEmail: string, conversionAmount: number) => {
  const { data: lead, error } = await supabase
    .from('api.leads' as any)
    .select('*')
    .eq('email', leadEmail)
    .maybeSingle();

  if (lead !== null && typeof lead === 'object' && 'id' in lead && !error) {
    await supabase
      .from('api.leads' as any)
      .update({ status: 'converted' })
      .eq('id', (lead as any).id);

    return { success: true, message: 'Lead conversion tracked successfully.' }
  } else {
    return { success: false, message: 'Lead not found or Supabase error.', error }
  }
}
