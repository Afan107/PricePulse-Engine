export interface RevenueMilestone {
  id: string;
  threshold_usd: number;
  label: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  description: string;
  is_triggered: boolean;
  triggered_at?: string;
  sound_or_haptic?: boolean;
}

export interface AlertNotification {
  id: string;
  milestone_id: string;
  threshold_usd: number;
  title: string;
  message: string;
  timestamp: string;
  type: 'milestone_unlocked' | 'threshold_exceeded' | 'fraud_burst';
  read: boolean;
}
