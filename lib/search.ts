/**
 * Card Optimizer search logic: build SQL and run queries from filters.
 * Includes Smart Search for merchant-specific reward optimization.
 */

import type { SQLiteDatabase } from 'expo-sqlite';
import type { CardOffer, CardOfferWithMerchantReward, SearchFilters } from '@/types/cards';

function rowToCardOffer(row: Record<string, unknown>): CardOffer {
  return {
    id: row.id as number,
    name: row.name as string,
    issuer: row.issuer as string,
    category: row.category as CardOffer['category'],
    reward_type: row.reward_type as CardOffer['reward_type'],
    reward_rate: row.reward_rate as number,
    annual_fee: row.annual_fee as number,
    signup_bonus: row.signup_bonus as string,
    best_for: row.best_for as string,
    created_at: row.created_at as string,
  };
}

function rowToCardOfferWithMerchant(row: Record<string, unknown>): CardOfferWithMerchantReward {
  return {
    ...rowToCardOffer(row),
    isBestChoice: row.is_best_choice === 1,
    merchantRewardValue: row.merchant_reward_value as number | undefined,
    merchantRewardUnit: row.merchant_reward_unit as string | undefined,
    merchantNotes: row.merchant_notes as string | undefined,
  };
}

/**
 * Smart Search: searches for merchant-specific rewards first, then falls back to regular search.
 * Returns cards with merchant-specific reward info and marks the best choice.
 */
export async function smartSearch(
  db: SQLiteDatabase,
  filters: SearchFilters
): Promise<CardOfferWithMerchantReward[]> {
  const query = filters.query?.trim() ?? '';

  // First, check if query matches a merchant with specific rules
  if (query) {
    const merchantCards = await db.getAllAsync<Record<string, unknown>>(
      `SELECT
        c.*,
        m.reward_value as merchant_reward_value,
        m.reward_unit as merchant_reward_unit,
        m.notes as merchant_notes,
        CASE WHEN m.reward_value = (
          SELECT MAX(m2.reward_value) FROM merchant_rules m2
          WHERE m2.merchant LIKE $merchant
        ) THEN 1 ELSE 0 END as is_best_choice
      FROM merchant_rules m
      JOIN card_offers c ON c.id = m.card_id
      WHERE m.merchant LIKE $merchant
      ORDER BY m.reward_value DESC, c.annual_fee ASC`,
      { $merchant: `%${query}%` }
    );

    if (merchantCards.length > 0) {
      // We found merchant-specific rules
      const results = merchantCards.map(rowToCardOfferWithMerchant);

      // Also include other cards that mention this merchant in best_for but don't have specific rules
      const otherCards = await db.getAllAsync<Record<string, unknown>>(
        `SELECT * FROM card_offers
        WHERE best_for LIKE $query
        AND id NOT IN (
          SELECT card_id FROM merchant_rules WHERE merchant LIKE $merchant
        )
        ORDER BY reward_rate DESC, annual_fee ASC`,
        { $query: `%${query}%`, $merchant: `%${query}%` }
      );

      for (const row of otherCards) {
        results.push({
          ...rowToCardOffer(row),
          isBestChoice: false,
        });
      }

      return results;
    }
  }

  // Fall back to regular search
  const regularResults = await searchCards(db, filters);
  return regularResults.map((card) => ({ ...card, isBestChoice: false }));
}

/**
 * Search card offers by text and filters. Uses parameterized queries.
 */
export async function searchCards(
  db: SQLiteDatabase,
  filters: SearchFilters
): Promise<CardOffer[]> {
  const conditions: string[] = [];
  const params: Record<string, string | number> = {};

  if (filters.query?.trim()) {
    const escaped = filters.query
      .trim()
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
    const pattern = `%${escaped}%`;
    conditions.push(
      "(name LIKE $query ESCAPE '\\' OR issuer LIKE $query ESCAPE '\\' OR best_for LIKE $query ESCAPE '\\' OR signup_bonus LIKE $query ESCAPE '\\')"
    );
    params.$query = pattern;
  }
  if (filters.category) {
    conditions.push('category = $category');
    params.$category = filters.category;
  }
  if (filters.reward_type) {
    conditions.push('reward_type = $reward_type');
    params.$reward_type = filters.reward_type;
  }
  if (filters.max_annual_fee != null && filters.max_annual_fee !== '') {
    conditions.push('annual_fee <= $max_annual_fee');
    params.$max_annual_fee = filters.max_annual_fee;
  }
  if (filters.min_reward_rate != null && filters.min_reward_rate !== '') {
    conditions.push('reward_rate >= $min_reward_rate');
    params.$min_reward_rate = filters.min_reward_rate;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM card_offers ${where} ORDER BY reward_rate DESC, annual_fee ASC`;

  const rows = await db.getAllAsync<Record<string, unknown>>(sql, params);
  return rows.map(rowToCardOffer);
}

/**
 * Get all distinct categories for filter chips.
 */
export async function getCategories(db: SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ category: string }>(
    'SELECT DISTINCT category FROM card_offers ORDER BY category'
  );
  return rows.map((r) => r.category);
}

/**
 * Get best cards for a spend category (optimizer: rank by reward rate, then low fee).
 */
export async function getBestForCategory(
  db: SQLiteDatabase,
  category: string
): Promise<CardOffer[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM card_offers
     WHERE category = $category OR best_for LIKE $best_for
     ORDER BY reward_rate DESC, annual_fee ASC
     LIMIT 10`,
    { $category: category, $best_for: `%${category}%` }
  );
  return rows.map(rowToCardOffer);
}
