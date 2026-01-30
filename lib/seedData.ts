/**
 * Card Optimizer seed data: curated Indian premium card portfolio and merchant-specific yield rules.
 * PRECISION PORTFOLIO: Only 8 cards with hardcoded arbitrage yields.
 */

import type { CardOffer } from '@/types/cards';

/**
 * RESTRICTED PORTFOLIO - Premium Indian Credit Cards Only
 * Cards: Axis Atlas, ICICI Emeralde Private, SBI Cashback, HSBC Premier,
 *        Tata Neu Infinity, ICICI Sapphiro Mastercard, American Express, SBI Ola Money
 */
export const SEED_OFFERS: Omit<CardOffer, 'id' | 'created_at'>[] = [
  {
    name: 'Axis Atlas',
    issuer: 'Axis',
    category: 'travel',
    reward_type: 'miles',
    reward_rate: 2,
    annual_fee: 5000,
    signup_bonus: '5,000 Atlas Miles on joining',
    best_for: 'travel,flights,hotels,makemytrip',
  },
  {
    name: 'ICICI Emeralde Private',
    issuer: 'ICICI',
    category: 'premium',
    reward_type: 'points',
    reward_rate: 4,
    annual_fee: 12000,
    signup_bonus: 'Invitation only - 25,000 bonus points',
    best_for: 'premium,travel,dining,luxury,hotels,flights',
  },
  {
    name: 'SBI Cashback',
    issuer: 'SBI',
    category: 'cashback',
    reward_type: 'cashback',
    reward_rate: 5,
    annual_fee: 999,
    signup_bonus: 'Rs 500 cashback on first transaction',
    best_for: 'online,everyday,cashback',
  },
  {
    name: 'HSBC Premier',
    issuer: 'HSBC',
    category: 'travel',
    reward_type: 'points',
    reward_rate: 4,
    annual_fee: 0,
    signup_bonus: 'Complimentary for Premier customers',
    best_for: 'hotels,accor,travel,premium',
  },
  {
    name: 'Tata Neu Infinity',
    issuer: 'HDFC',
    category: 'cashback',
    reward_type: 'points',
    reward_rate: 5,
    annual_fee: 2999,
    signup_bonus: '10,000 NeuCoins on joining',
    best_for: 'tata,bigbasket,1mg,croma,everyday',
  },
  {
    name: 'ICICI Sapphiro Mastercard',
    issuer: 'ICICI',
    category: 'premium',
    reward_type: 'points',
    reward_rate: 2,
    annual_fee: 6500,
    signup_bonus: '15,000 reward points on activation',
    best_for: 'travel,dining,shopping,premium',
  },
  {
    name: 'American Express Platinum',
    issuer: 'American Express',
    category: 'premium',
    reward_type: 'points',
    reward_rate: 1,
    annual_fee: 60000,
    signup_bonus: '25,000 MR points on first transaction',
    best_for: 'travel,lounges,premium,hotels,luxury',
  },
  {
    name: 'SBI Ola Money',
    issuer: 'SBI',
    category: 'cashback',
    reward_type: 'cashback',
    reward_rate: 7,
    annual_fee: 499,
    signup_bonus: 'Rs 500 Ola Money credit',
    best_for: 'ola,uber,ride,everyday',
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
  rewardUnit: string;
  notes?: string;
  /** Effective yield percentage for ranking (e.g., 72 for HSBC Premier Hotels) */
  effectiveYield?: number;
}

/**
 * PRECISION YIELD RULES - Hardcoded arbitrage calculations
 */
export const MERCHANT_RULES: MerchantRule[] = [
  // ═══════════════════════════════════════════════════════════════════
  // HSBC PREMIER - 72% HOTEL ARBITRAGE
  // Logic: 12X Points = 36% Base. 1:1 Accor Transfer @ ₹2.00/point = 72% Total Yield
  // ═══════════════════════════════════════════════════════════════════
  {
    merchant: 'Hotels',
    cardName: 'HSBC Premier',
    rewardValue: 72,
    rewardUnit: '%',
    notes: '12X points + Accor transfer = 72% effective yield',
    effectiveYield: 72,
  },
  {
    merchant: 'Accor',
    cardName: 'HSBC Premier',
    rewardValue: 72,
    rewardUnit: '%',
    notes: '12X points + Accor ALL transfer bonus = 72% yield',
    effectiveYield: 72,
  },
  {
    merchant: 'Novotel',
    cardName: 'HSBC Premier',
    rewardValue: 72,
    rewardUnit: '%',
    notes: 'Accor property - 72% effective yield via points transfer',
    effectiveYield: 72,
  },
  {
    merchant: 'Sofitel',
    cardName: 'HSBC Premier',
    rewardValue: 72,
    rewardUnit: '%',
    notes: 'Accor property - 72% effective yield via points transfer',
    effectiveYield: 72,
  },
  {
    merchant: 'Ibis',
    cardName: 'HSBC Premier',
    rewardValue: 72,
    rewardUnit: '%',
    notes: 'Accor property - 72% effective yield via points transfer',
    effectiveYield: 72,
  },
  {
    merchant: 'Mercure',
    cardName: 'HSBC Premier',
    rewardValue: 72,
    rewardUnit: '%',
    notes: 'Accor property - 72% effective yield via points transfer',
    effectiveYield: 72,
  },
  {
    merchant: 'Fairmont',
    cardName: 'HSBC Premier',
    rewardValue: 72,
    rewardUnit: '%',
    notes: 'Accor property - 72% effective yield via points transfer',
    effectiveYield: 72,
  },

  // ═══════════════════════════════════════════════════════════════════
  // ICICI EMERALDE PRIVATE (EPM) - iMobile iShop Portal Yields
  // Hotels: 36% via iShop portal
  // Flights: 18% via iShop portal
  // ═══════════════════════════════════════════════════════════════════
  {
    merchant: 'Hotels',
    cardName: 'ICICI Emeralde Private',
    rewardValue: 36,
    rewardUnit: '%',
    notes: '36% yield via iMobile iShop hotel portal',
    effectiveYield: 36,
  },
  {
    merchant: 'Flights',
    cardName: 'ICICI Emeralde Private',
    rewardValue: 18,
    rewardUnit: '%',
    notes: '18% yield via iMobile iShop flight portal',
    effectiveYield: 18,
  },
  {
    merchant: 'Taj Hotels',
    cardName: 'ICICI Emeralde Private',
    rewardValue: 36,
    rewardUnit: '%',
    notes: '36% yield via iMobile iShop + Taj partnership',
    effectiveYield: 36,
  },
  {
    merchant: 'ITC Hotels',
    cardName: 'ICICI Emeralde Private',
    rewardValue: 36,
    rewardUnit: '%',
    notes: '36% yield via iMobile iShop + ITC partnership',
    effectiveYield: 36,
  },
  {
    merchant: 'MakeMyTrip',
    cardName: 'ICICI Emeralde Private',
    rewardValue: 18,
    rewardUnit: '%',
    notes: '18% yield on MMT via iMobile iShop',
    effectiveYield: 18,
  },

  // ═══════════════════════════════════════════════════════════════════
  // AXIS ATLAS - Travel Partner Miles
  // ═══════════════════════════════════════════════════════════════════
  {
    merchant: 'MakeMyTrip',
    cardName: 'Axis Atlas',
    rewardValue: 5,
    rewardUnit: 'Miles/₹100',
    notes: '5 Atlas Miles per Rs 100 on travel bookings',
    effectiveYield: 10,
  },
  {
    merchant: 'Yatra',
    cardName: 'Axis Atlas',
    rewardValue: 5,
    rewardUnit: 'Miles/₹100',
    notes: '5 Atlas Miles per Rs 100 on travel bookings',
    effectiveYield: 10,
  },
  {
    merchant: 'Cleartrip',
    cardName: 'Axis Atlas',
    rewardValue: 5,
    rewardUnit: 'Miles/₹100',
    notes: '5 Atlas Miles per Rs 100 on travel bookings',
    effectiveYield: 10,
  },
  {
    merchant: 'Flights',
    cardName: 'Axis Atlas',
    rewardValue: 5,
    rewardUnit: 'Miles/₹100',
    notes: '5 Atlas Miles per Rs 100 on flight bookings',
    effectiveYield: 10,
  },

  // ═══════════════════════════════════════════════════════════════════
  // TATA NEU INFINITY - Tata Ecosystem Yields
  // ═══════════════════════════════════════════════════════════════════
  {
    merchant: 'BigBasket',
    cardName: 'Tata Neu Infinity',
    rewardValue: 10,
    rewardUnit: '%',
    notes: '10% NeuCoins on BigBasket via Tata Neu app',
    effectiveYield: 10,
  },
  {
    merchant: 'Croma',
    cardName: 'Tata Neu Infinity',
    rewardValue: 7.5,
    rewardUnit: '%',
    notes: '7.5% NeuCoins on Croma purchases',
    effectiveYield: 7.5,
  },
  {
    merchant: '1mg',
    cardName: 'Tata Neu Infinity',
    rewardValue: 10,
    rewardUnit: '%',
    notes: '10% NeuCoins on 1mg via Tata Neu app',
    effectiveYield: 10,
  },
  {
    merchant: 'Tata CLiQ',
    cardName: 'Tata Neu Infinity',
    rewardValue: 10,
    rewardUnit: '%',
    notes: '10% NeuCoins on Tata CLiQ via Tata Neu app',
    effectiveYield: 10,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SBI OLA MONEY - Ride-hailing Yields
  // ═══════════════════════════════════════════════════════════════════
  {
    merchant: 'Ola',
    cardName: 'SBI Ola Money',
    rewardValue: 15,
    rewardUnit: '%',
    notes: '15% cashback on Ola rides (capped)',
    effectiveYield: 15,
  },
  {
    merchant: 'Uber',
    cardName: 'SBI Ola Money',
    rewardValue: 7,
    rewardUnit: '%',
    notes: '7% cashback on all transportation',
    effectiveYield: 7,
  },

  // ═══════════════════════════════════════════════════════════════════
  // AMERICAN EXPRESS PLATINUM - Premium Travel
  // ═══════════════════════════════════════════════════════════════════
  {
    merchant: 'Hotels',
    cardName: 'American Express Platinum',
    rewardValue: 5,
    rewardUnit: 'X',
    notes: '5X MR points on prepaid hotels via Amex Travel',
    effectiveYield: 5,
  },
  {
    merchant: 'Flights',
    cardName: 'American Express Platinum',
    rewardValue: 5,
    rewardUnit: 'X',
    notes: '5X MR points on flights booked via Amex Travel',
    effectiveYield: 5,
  },

  // ═══════════════════════════════════════════════════════════════════
  // SBI CASHBACK - Online Shopping
  // ═══════════════════════════════════════════════════════════════════
  {
    merchant: 'Amazon',
    cardName: 'SBI Cashback',
    rewardValue: 5,
    rewardUnit: '%',
    notes: '5% cashback on all online purchases',
    effectiveYield: 5,
  },
  {
    merchant: 'Flipkart',
    cardName: 'SBI Cashback',
    rewardValue: 5,
    rewardUnit: '%',
    notes: '5% cashback on all online purchases',
    effectiveYield: 5,
  },
  {
    merchant: 'Myntra',
    cardName: 'SBI Cashback',
    rewardValue: 5,
    rewardUnit: '%',
    notes: '5% cashback on all online purchases',
    effectiveYield: 5,
  },
];
