import { supabase } from "@/integrations/supabase/client";

// Generate or get session ID
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('hospital_finder_session');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('hospital_finder_session', sessionId);
  }
  
  return sessionId;
};

// Track location sharing
export const trackLocationShared = async (latitude: number, longitude: number) => {
  const sessionId = getSessionId();
  
  try {
    await supabase.from('user_sessions').upsert({
      session_id: sessionId,
      location_shared: true,
      latitude,
      longitude,
    }, {
      onConflict: 'session_id'
    });
  } catch (error) {
    console.error('Error tracking location:', error);
  }
};

// Track session without location
export const trackSession = async () => {
  const sessionId = getSessionId();
  
  try {
    const { data: existing } = await supabase
      .from('user_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .single();
    
    if (!existing) {
      await supabase.from('user_sessions').insert({
        session_id: sessionId,
        location_shared: false,
      });
    }
  } catch (error) {
    console.error('Error tracking session:', error);
  }
};

// Track hospital interactions
export const trackHospitalInteraction = async (
  hospitalId: string,
  hospitalName: string,
  interactionType: 'view' | 'call' | 'directions'
) => {
  const sessionId = getSessionId();
  
  try {
    await supabase.from('hospital_interactions').insert({
      session_id: sessionId,
      hospital_id: hospitalId,
      hospital_name: hospitalName,
      interaction_type: interactionType,
    });
  } catch (error) {
    console.error('Error tracking interaction:', error);
  }
};
