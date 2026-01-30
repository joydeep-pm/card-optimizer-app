/**
 * Card Optimizer types: offer data and search filters.
 */

export type RewardType = 'points' | 'cashback' | 'miles';

export type CardCategory =
  | 'travel'
  | 'cashback'
  | 'dining'
  | 'business'
  | 'premium'
  | 'everyday'
  | 'gas'
  | 'groceries';

export interface CardOffer {
  id: number;
  name: string;
  issuer: string;
  category: CardCategory;
  reward_type: RewardType;
  reward_rate: number; // e.g. 2 = 2%
  annual_fee: number;
  signup_bonus: string;
  best_for: string; // comma-separated tags
  created_at: string;
}

export interface SearchFilters {
  query?: string;
  category?: CardCategory;
  reward_type?: RewardType;
  max_annual_fee?: number | null;
  min_reward_rate?: number | null;
}

export interface OptimizerScenario {
  spendCategory: CardCategory | 'general';
  monthlySpend: number;
}

/**
 * Merchant rule for Smart Search: maps merchants to cards with specific rewards.
 */
export interface MerchantRule {
  id: number;
  merchant: string;
  card_id: number;
  reward_value: number;
  reward_unit: string;
  notes: string | null;
  created_at: string;
}

/**
 * Extended card offer with merchant-specific reward info.
 */
export interface CardOfferWithMerchantReward extends CardOffer {
  isBestChoice?: boolean;
  merchantRewardValue?: number;
  merchantRewardUnit?: string;
  merchantNotes?: string;
}
