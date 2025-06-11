import { supabase } from '@/integrations/supabase'

export const ConversionTrackerAgent = async (leadEmail: string, conversionAmount: number) => {
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('email', leadEmail)
    .single()

  if (lead && !error) {
    await supabase
      .from('leads')
      .update({ converted: true, conversion_value: conversionAmount })
      .eq('id', lead.id)

    return { success: true, message: 'Lead conversion tracked successfully.' }
  } else {
    return { success: false, message: 'Lead not found or Supabase error.', error }
  }
}
