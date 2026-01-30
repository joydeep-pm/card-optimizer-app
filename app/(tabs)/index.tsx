import { useCallback, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { CardView } from '@/components/CardView';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useCardsDb } from '@/hooks/use-cards-db';
import type { CardOfferWithMerchantReward, SearchFilters } from '@/types/cards';

/**
 * GlowingVerdict - Animated glow wrapper for the winning card
 */
function GlowingVerdict({ card }: { card: CardOfferWithMerchantReward }) {
  const glowOpacity = useSharedValue(0.3);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [glowOpacity, glowScale]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <View style={glowStyles.container}>
      {/* Outer glow */}
      <Animated.View style={[glowStyles.glowOuter, glowStyle]} />
      {/* Card */}
      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={glowStyles.cardWrapper}>
        <CardView card={{ ...card, isBestChoice: true }} />
      </Animated.View>
    </View>
  );
}

const glowStyles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    top: -24,
    left: -24,
    right: -24,
    bottom: -24,
    borderRadius: BorderRadius.card + 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(0,255,133,0.3)',
    shadowColor: '#00FF85',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
  },
  cardWrapper: {
    position: 'relative',
    zIndex: 1,
  },
});

/**
 * HomeScreen - Verdict-First UI
 * Progressive disclosure: Giant search → Single verdict card
 */
export default function HomeScreen() {
  const { smartSearch, isReady } = useCardsDb();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CardOfferWithMerchantReward[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // The winning verdict
  const verdict = results.length > 0 ? results[0] : null;

  const runSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const filters: SearchFilters = {
        query: query.trim(),
      };
      const list = await smartSearch(filters);
      setResults(list);
    } finally {
      setLoading(false);
    }
  }, [query, smartSearch]);

  // Auto-search with debounce
  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {
      runSearch();
    }, 400);
    return () => clearTimeout(timer);
  }, [query, isReady, runSearch]);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  }, []);

  // Loading state
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FF85" />
        <ThemedText style={styles.loadingText} numberOfLines={1}>
          Initializing Yield Engine…
        </ThemedText>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <View style={styles.titleRow}>
              <ThemedText style={styles.title} numberOfLines={1}>
                Card
              </ThemedText>
              <ThemedText style={styles.titleAccent} numberOfLines={1}>
                Optimizer
              </ThemedText>
            </View>
            <ThemedText style={styles.tagline} numberOfLines={1}>
              Find your highest-yield card instantly
            </ThemedText>
          </Animated.View>

          {/* Search Section */}
          <Animated.View
            entering={FadeInDown.duration(500).delay(100)}
            style={styles.searchSection}
          >
            <View style={styles.searchContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                style={styles.searchGradient}
              >
                <View style={styles.searchInputWrapper}>
                  <ThemedText style={styles.searchIcon}>🔍</ThemedText>
                  <TextInput
                    ref={inputRef}
                    style={styles.searchInput}
                    placeholder="Hotels, Flights, Amazon, Ola…"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={runSearch}
                    returnKeyType="search"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {query.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                      <ThemedText style={styles.clearIcon}>✕</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>

            {/* Quick suggestions */}
            {!hasSearched && (
              <Animated.View entering={FadeIn.delay(300)} style={styles.suggestions}>
                <ThemedText style={styles.suggestionsLabel} numberOfLines={1}>
                  Try searching for
                </ThemedText>
                <View style={styles.suggestionChips}>
                  {['Hotels', 'Flights', 'BigBasket', 'Ola'].map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.suggestionChip}
                      onPress={() => setQuery(suggestion)}
                    >
                      <ThemedText style={styles.suggestionText} numberOfLines={1}>
                        {suggestion}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            )}
          </Animated.View>

          {/* Results Section */}
          <View style={styles.resultsSection}>
            {loading ? (
              <View style={styles.loadingResults}>
                <ActivityIndicator size="large" color="#00FF85" />
                <ThemedText style={styles.loadingResultsText} numberOfLines={1}>
                  Analyzing yields…
                </ThemedText>
              </View>
            ) : verdict ? (
              <Animated.View
                entering={FadeInDown.duration(400)}
                exiting={FadeOut.duration(200)}
                style={styles.verdictSection}
              >
                {/* Verdict Header */}
                <View style={styles.verdictHeader}>
                  <View style={styles.verdictLabelRow}>
                    <View style={styles.verdictDot} />
                    <ThemedText style={styles.verdictLabel} numberOfLines={1}>
                      THE VERDICT
                    </ThemedText>
                  </View>
                  <View style={styles.resultsBadge}>
                    <ThemedText style={styles.resultsBadgeText} numberOfLines={1}>
                      {results.length} analyzed
                    </ThemedText>
                  </View>
                </View>

                {/* The Verdict Card */}
                <GlowingVerdict card={verdict} />

                {/* Verdict footer */}
                <ThemedText style={styles.verdictFooter} numberOfLines={2}>
                  Highest effective yield for "{query}"
                </ThemedText>
              </Animated.View>
            ) : hasSearched ? (
              <Animated.View
                entering={FadeIn.duration(300)}
                style={styles.emptyState}
              >
                <ThemedText style={styles.emptyIcon}>🔎</ThemedText>
                <ThemedText style={styles.emptyText} numberOfLines={2}>
                  No matching cards found.
                </ThemedText>
                <ThemedText style={styles.emptySubtext} numberOfLines={2}>
                  Try searching for a merchant, category, or card name.
                </ThemedText>
              </Animated.View>
            ) : (
              <Animated.View
                entering={FadeIn.delay(400)}
                style={styles.welcomeState}
              >
                <View style={styles.welcomeContent}>
                  <ThemedText style={styles.welcomeEmoji}>💳</ThemedText>
                  <ThemedText style={styles.welcomeTitle} numberOfLines={2}>
                    Enter a merchant or category above
                  </ThemedText>
                  <ThemedText style={styles.welcomeSubtext} numberOfLines={3}>
                    We'll find the card with the highest effective yield from your portfolio.
                  </ThemedText>
                </View>

                {/* Portfolio indicator */}
                <View style={styles.portfolioIndicator}>
                  <ThemedText style={styles.portfolioLabel} numberOfLines={1}>
                    8 PREMIUM CARDS IN PORTFOLIO
                  </ThemedText>
                  <View style={styles.portfolioDots}>
                    {[...Array(8)].map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.portfolioDot,
                          { backgroundColor: i % 2 === 0 ? '#00FF85' : '#7000FF' },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </Animated.View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  keyboardView: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },

  loadingText: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.5)',
  },

  // Header
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },

  title: {
    ...Typography.headlineLarge,
    color: '#FFFFFF',
    marginRight: Spacing.sm,
  },

  titleAccent: {
    ...Typography.headlineLarge,
    color: '#00FF85',
  },

  tagline: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.5)',
  },

  // Search
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },

  searchContainer: {
    borderRadius: BorderRadius.input,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  searchGradient: {
    padding: 2,
  },

  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.input - 2,
    paddingHorizontal: Spacing.md,
    height: 56,
  },

  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },

  searchInput: {
    flex: 1,
    ...Typography.bodyLarge,
    color: '#FFFFFF',
    height: '100%',
  },

  clearButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },

  clearIcon: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
  },

  // Suggestions
  suggestions: {
    marginTop: Spacing.md,
  },

  suggestionsLabel: {
    ...Typography.labelSmall,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: Spacing.sm,
  },

  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  suggestionChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.badge,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  suggestionText: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
  },

  // Results
  resultsSection: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  loadingResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },

  loadingResultsText: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.5)',
  },

  // Verdict
  verdictSection: {
    flex: 1,
    paddingTop: Spacing.sm,
  },

  verdictHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },

  verdictLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  verdictDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF85',
    marginRight: Spacing.sm,
  },

  verdictLabel: {
    ...Typography.labelMedium,
    color: '#00FF85',
    letterSpacing: 2,
  },

  resultsBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.badge,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  resultsBadgeText: {
    ...Typography.labelSmall,
    color: 'rgba(255,255,255,0.5)',
  },

  verdictFooter: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: Spacing.lg,
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },

  emptyText: {
    ...Typography.headlineSmall,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  emptySubtext: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },

  // Welcome state
  welcomeState: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },

  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },

  welcomeEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },

  welcomeTitle: {
    ...Typography.headlineSmall,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  welcomeSubtext: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    maxWidth: 280,
  },

  // Portfolio indicator
  portfolioIndicator: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },

  portfolioLabel: {
    ...Typography.labelSmall,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: Spacing.sm,
  },

  portfolioDots: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  portfolioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
