/**
 * Card Optimizer seed data: card offers and merchant-specific reward rules.
 */

import type { CardOffer } from '@/types/cards';

export const SEED_OFFERS: Omit<CardOffer, 'id' | 'created_at'>[] = [
  // Indian Premium Cards
  {
    name: 'HDFC Infinia',
    issuer: 'HDFC',
    category: 'premium',
    reward_type: 'points',
    reward_rate: 3.3,
    annual_fee: 12500,
    signup_bonus: '12,500 reward points on joining',
    best_for: 'travel,dining,premium,zomato,swiggy',
  },
  {
    name: 'Amex Gold',
    issuer: 'Amex',
    category: 'dining',
    reward_type: 'points',
    reward_rate: 4,
    annual_fee: 9000,
    signup_bonus: '4,000 MR points on first transaction',
    best_for: 'dining,amazon,online,travel',
  },
  {
    name: 'HDFC Diners Club Black',
    issuer: 'HDFC',
    category: 'premium',
    reward_type: 'points',
    reward_rate: 3.3,
    annual_fee: 10000,
    signup_bonus: '10,000 reward points on joining',
    best_for: 'travel,dining,premium',
  },
  {
    name: 'SBI Elite',
    issuer: 'SBI',
    category: 'premium',
    reward_type: 'points',
    reward_rate: 2,
    annual_fee: 4999,
    signup_bonus: 'Welcome vouchers worth Rs 5,000',
    best_for: 'travel,movies,dining',
  },
  {
    name: 'ICICI Amazon Pay',
    issuer: 'ICICI',
    category: 'cashback',
    reward_type: 'cashback',
    reward_rate: 5,
    annual_fee: 0,
    signup_bonus: 'Rs 500 Amazon Pay cashback',
    best_for: 'amazon,online,everyday',
  },
  // US Cards
  {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    category: 'travel',
    reward_type: 'points',
    reward_rate: 2.5,
    annual_fee: 95,
    signup_bonus: '60,000 points after $4k spend in 3 months',
    best_for: 'travel,dining',
  },
  {
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    category: 'travel',
    reward_type: 'points',
    reward_rate: 3,
    annual_fee: 550,
    signup_bonus: '60,000 points after $4k spend in 3 months',
    best_for: 'travel,dining,premium',
  },
  {
    name: 'American Express Platinum',
    issuer: 'Amex',
    category: 'premium',
    reward_type: 'points',
    reward_rate: 1,
    annual_fee: 695,
    signup_bonus: '80,000 points after $8k spend in 6 months',
    best_for: 'travel,premium,lounges',
  },
  {
    name: 'American Express Gold',
    issuer: 'Amex',
    category: 'dining',
    reward_type: 'points',
    reward_rate: 4,
    annual_fee: 250,
    signup_bonus: '60,000 points after $6k spend in 6 months',
    best_for: 'dining,groceries',
  },
  {
    name: 'Citi Double Cash',
    issuer: 'Citi',
    category: 'cashback',
    reward_type: 'cashback',
    reward_rate: 2,
    annual_fee: 0,
    signup_bonus: 'None',
    best_for: 'everyday,cashback',
  },
  {
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    category: 'travel',
    reward_type: 'miles',
    reward_rate: 2,
    annual_fee: 395,
    signup_bonus: '75,000 miles after $4k spend in 3 months',
    best_for: 'travel,everyday',
  },
];

/**
 * Merchant-specific reward rules for Smart Search.
 * These override the base card reward rates for specific merchants.
 */
export interface MerchantRule {
  merchant: string;
  cardName: string;
  rewardValue: number;
  rewardUnit: string; // '%' for percentage, 'X' for multiplier
  notes?: string;
}

export const MERCHANT_RULES: MerchantRule[] = [
  // HDFC Infinia - 5X points on Zomato = 16.6% value
  {
    merchant: 'Zomato',
    cardName: 'HDFC Infinia',
    rewardValue: 16.6,
    rewardUnit: '%',
    notes: '5X reward points on Zomato via SmartBuy',
  },
  {
    merchant: 'Swiggy',
    cardName: 'HDFC Infinia',
    rewardValue: 16.6,
    rewardUnit: '%',
    notes: '5X reward points on Swiggy via SmartBuy',
  },
  // Amex Gold - 5X MR points on Amazon
  {
    merchant: 'Amazon',
    cardName: 'Amex Gold',
    rewardValue: 5,
    rewardUnit: 'X',
    notes: '5X Membership Rewards points on Amazon',
  },
  // ICICI Amazon Pay - 5% on Amazon Prime
  {
    merchant: 'Amazon',
    cardName: 'ICICI Amazon Pay',
    rewardValue: 5,
    rewardUnit: '%',
    notes: '5% cashback for Prime members, 3% for non-Prime',
  },
  // HDFC Diners Club Black - 10X on dining partners
  {
    merchant: 'Zomato',
    cardName: 'HDFC Diners Club Black',
    rewardValue: 13,
    rewardUnit: '%',
    notes: '10X reward points on Zomato',
  },
];
