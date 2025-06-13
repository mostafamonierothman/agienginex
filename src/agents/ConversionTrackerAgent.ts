
import { supabase } from '@/integrations/supabase/client'

export const ConversionTrackerAgent = async (leadEmail: string, conversionAmount: number) => {
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('email', leadEmail)
    .single()

  if (lead && !error) {
    // Update only the status field since 'converted' and 'conversion_value' don't exist in the schema
    await supabase
      .from('leads')
      .update({ status: 'converted' })
      .eq('id', lead.id)

    return { success: true, message: 'Lead conversion tracked successfully.' }
  } else {
    return { success: false, message: 'Lead not found or Supabase error.', error }
  }
}
