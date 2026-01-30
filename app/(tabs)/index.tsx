import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useCardsDb } from '@/hooks/use-cards-db';
import type { CardOfferWithMerchantReward, CardCategory, RewardType, SearchFilters } from '@/types/cards';

const REWARD_TYPES: { value: RewardType; label: string }[] = [
  { value: 'points', label: 'Points' },
  { value: 'cashback', label: 'Cashback' },
  { value: 'miles', label: 'Miles' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { smartSearch, categories, isReady } = useCardsDb();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CardCategory | ''>('');
  const [rewardType, setRewardType] = useState<RewardType | ''>('');
  const [maxFee, setMaxFee] = useState('');
  const [results, setResults] = useState<CardOfferWithMerchantReward[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(async () => {
    setLoading(true);
    try {
      const filters: SearchFilters = {
        query: query.trim() || undefined,
        category: category || undefined,
        reward_type: rewardType || undefined,
        max_annual_fee: maxFee !== '' ? parseInt(maxFee, 10) : undefined,
      };
      if (filters.max_annual_fee != null && isNaN(filters.max_annual_fee)) {
        delete filters.max_annual_fee;
      }
      const list = await smartSearch(filters);
      setResults(list);
    } finally {
      setLoading(false);
    }
  }, [query, category, rewardType, maxFee, smartSearch]);

  // Auto-search as user types (debounced)
  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {
      runSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, category, rewardType, maxFee, isReady, runSearch]);

  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  if (!isReady) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading database…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Card Optimizer
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Search and filter credit card offers
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchSection}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
              color: colors.text,
              borderColor: isDark ? '#444' : '#ddd',
            },
          ]}
          placeholder="Search by name, issuer, or best for…"
          placeholderTextColor={colors.icon}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={runSearch}
          returnKeyType="search"
        />

        <ThemedText type="defaultSemiBold" style={styles.filterLabel}>
          Category
        </ThemedText>
        <FlatList
          horizontal
          data={[{ value: '', label: 'All' }, ...categories.map((c) => ({ value: c, label: c }))]}
          keyExtractor={(item) => item.value || 'all'}
          renderItem={({ item }) => {
            const active = category === item.value;
            return (
              <TouchableOpacity
                style={[
                  styles.chip,
                  active && styles.chipActive,
                  active && { backgroundColor: colors.tint },
                ]}
                onPress={() => setCategory(item.value as CardCategory | '')}
              >
                <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
        />

        <ThemedText type="defaultSemiBold" style={styles.filterLabel}>
          Reward type
        </ThemedText>
        <ThemedView style={styles.chipRow}>
          <TouchableOpacity
            style={[
              styles.chip,
              !rewardType && styles.chipActive,
              !rewardType && { backgroundColor: colors.tint },
            ]}
            onPress={() => setRewardType('')}
          >
            <ThemedText style={[styles.chipText, !rewardType && styles.chipTextActive]}>All</ThemedText>
          </TouchableOpacity>
          {REWARD_TYPES.map((item) => {
            const active = rewardType === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.chip,
                  active && styles.chipActive,
                  active && { backgroundColor: colors.tint },
                ]}
                onPress={() => setRewardType(rewardType === item.value ? '' : item.value)}
              >
                <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ThemedView>

        <ThemedText type="defaultSemiBold" style={styles.filterLabel}>
          Max annual fee (optional)
        </ThemedText>
        <TextInput
          style={[
            styles.inputSmall,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
              color: colors.text,
              borderColor: isDark ? '#444' : '#ddd',
            },
          ]}
          placeholder="e.g. 95"
          placeholderTextColor={colors.icon}
          value={maxFee}
          onChangeText={setMaxFee}
          keyboardType="number-pad"
        />

        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.tint }]}
          onPress={runSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText style={styles.searchButtonText}>Search</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.resultsSection}>
        <ThemedText type="subtitle" style={styles.resultsTitle}>
          Results ({results.length})
        </ThemedText>
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ThemedView
              style={[
                styles.cardRow,
                item.isBestChoice && styles.bestChoiceCard,
              ]}
            >
              {item.isBestChoice && (
                <ThemedView style={styles.bestChoiceBadge}>
                  <ThemedText style={styles.bestChoiceText}>Best Choice</ThemedText>
                </ThemedView>
              )}
              <ThemedText type="defaultSemiBold" style={styles.cardName}>
                {item.name}
              </ThemedText>
              <ThemedText type="default" style={styles.cardIssuer}>
                {item.issuer} · {item.reward_type} · {item.reward_rate}%
              </ThemedText>
              {item.merchantRewardValue != null && (
                <ThemedText type="defaultSemiBold" style={styles.merchantReward}>
                  {item.merchantRewardValue}{item.merchantRewardUnit} on this merchant
                </ThemedText>
              )}
              {item.merchantNotes && (
                <ThemedText type="default" style={styles.merchantNotes}>
                  {item.merchantNotes}
                </ThemedText>
              )}
              <ThemedText type="default" style={styles.cardFee}>
                Annual fee: {item.annual_fee > 1000 ? `₹${item.annual_fee.toLocaleString()}` : `$${item.annual_fee}`} · {item.signup_bonus}
              </ThemedText>
              {item.best_for ? (
                <ThemedText type="default" style={styles.cardBestFor}>
                  Best for: {item.best_for}
                </ThemedText>
              ) : null}
            </ThemedView>
          )}
          ListEmptyComponent={
            !loading ? (
              <ThemedText style={styles.emptyText}>
                Run a search or clear filters to see all cards.
              </ThemedText>
            ) : null
          }
          contentContainerStyle={results.length === 0 ? styles.emptyList : undefined}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    marginTop: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  inputSmall: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    fontSize: 16,
    maxWidth: 120,
  },
  filterLabel: {
    marginBottom: 6,
  },
  chipList: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(128,128,128,0.25)',
  },
  chipActive: {},
  chipText: {
    fontSize: 14,
  },
  chipTextActive: {
    color: '#fff',
  },
  searchButton: {
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  resultsTitle: {
    marginBottom: 12,
  },
  cardRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
    borderRadius: 12,
    marginBottom: 8,
  },
  bestChoiceCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
  },
  bestChoiceBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bestChoiceText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  merchantReward: {
    fontSize: 14,
    color: '#FFD700',
    marginTop: 4,
  },
  merchantNotes: {
    fontSize: 12,
    opacity: 0.8,
    fontStyle: 'italic',
    marginTop: 2,
  },
  cardName: {
    fontSize: 16,
    marginBottom: 4,
  },
  cardIssuer: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 2,
  },
  cardFee: {
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 2,
  },
  cardBestFor: {
    fontSize: 13,
    opacity: 0.7,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    opacity: 0.7,
    marginTop: 24,
  },
});
