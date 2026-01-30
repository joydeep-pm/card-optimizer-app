/**
 * Hook for Card Optimizer: search and categories from SQLite.
 * Includes Smart Search for merchant-specific reward optimization.
 */

import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import * as searchLib from '@/lib/search';
import type { CardOffer, CardOfferWithMerchantReward, SearchFilters } from '@/types/cards';

export function useCardsDb() {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    searchLib.getCategories(db).then((list) => {
      if (!cancelled) setCategories(list);
      if (!cancelled) setIsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [db]);

  const searchCards = useCallback(
    async (filters: SearchFilters): Promise<CardOffer[]> => {
      return searchLib.searchCards(db, filters);
    },
    [db]
  );

  /**
   * Smart Search: finds best cards for merchants with specific reward rules.
   * Returns cards with isBestChoice flag and merchant-specific reward info.
   */
  const smartSearch = useCallback(
    async (filters: SearchFilters): Promise<CardOfferWithMerchantReward[]> => {
      return searchLib.smartSearch(db, filters);
    },
    [db]
  );

  const getBestForCategory = useCallback(
    async (category: string): Promise<CardOffer[]> => {
      return searchLib.getBestForCategory(db, category);
    },
    [db]
  );

  return { searchCards, smartSearch, getBestForCategory, categories, isReady };
}
