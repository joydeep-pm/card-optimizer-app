import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useCardsDb } from '@/hooks/use-cards-db';
import type { CardOfferWithMerchantReward } from '@/types/cards';

// Brand colors for card badges
const BRAND_COLORS: Record<string, string> = {
  'American Express': '#006FCF',
  'Amex': '#006FCF',
  'HSBC': '#DB0011',
  'HDFC': '#004C8F',
  'ICICI': '#F58220',
  'SBI': '#22409A',
  'Axis': '#97144D',
  'Tata': '#1A1F71',
};

function getBrandColor(issuer: string): string {
  const normalizedIssuer = issuer.toLowerCase();
  for (const [brand, color] of Object.entries(BRAND_COLORS)) {
    if (normalizedIssuer.includes(brand.toLowerCase())) {
      return color;
    }
  }
  return '#444444';
}

/**
 * PortfolioCard - Compact card display for the portfolio grid
 */
function PortfolioCard({ card, index }: { card: CardOfferWithMerchantReward; index: number }) {
  const brandColor = getBrandColor(card.issuer);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 100)}
      style={styles.portfolioCard}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
        style={styles.portfolioCardGradient}
      >
        {/* Brand indicator */}
        <View style={[styles.brandIndicator, { backgroundColor: brandColor }]} />

        {/* Card content */}
        <View style={styles.portfolioCardContent}>
          <View style={styles.portfolioCardHeader}>
            <ThemedText style={styles.issuerLabel} numberOfLines={1}>
              {card.issuer}
            </ThemedText>
            <View style={styles.yieldBadge}>
              <ThemedText style={styles.yieldBadgeText} numberOfLines={1}>
                {card.reward_rate}%
              </ThemedText>
            </View>
          </View>

          <ThemedText style={styles.cardNameSmall} numberOfLines={2}>
            {card.name}
          </ThemedText>

          <View style={styles.portfolioCardFooter}>
            <ThemedText style={styles.feeLabel} numberOfLines={1}>
              {card.annual_fee === 0 ? 'FREE' : `₹${card.annual_fee.toLocaleString('en-IN')}`}
            </ThemedText>
            <ThemedText style={styles.typeLabel} numberOfLines={1}>
              {card.reward_type}
            </ThemedText>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

/**
 * PortfolioScreen - Shows all 8 premium cards in the portfolio
 */
export default function PortfolioScreen() {
  const { searchCards, isReady } = useCardsDb();
  const [cards, setCards] = useState<CardOfferWithMerchantReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    async function loadPortfolio() {
      setLoading(true);
      try {
        const allCards = await searchCards({});
        setCards(allCards);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, [isReady, searchCards]);

  if (!isReady || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00FF85" />
        <ThemedText style={styles.loadingText} numberOfLines={1}>
          Loading portfolio…
        </ThemedText>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ThemedText style={styles.title} numberOfLines={1}>
            Your
          </ThemedText>
          <ThemedText style={styles.titleAccent} numberOfLines={1}>
            Portfolio
          </ThemedText>
        </View>
        <ThemedText style={styles.subtitle} numberOfLines={1}>
          {cards.length} premium cards optimized for yield
        </ThemedText>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue} numberOfLines={1}>
            {cards.length}
          </ThemedText>
          <ThemedText style={styles.statLabel} numberOfLines={1}>
            CARDS
          </ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue} numberOfLines={1}>
            72%
          </ThemedText>
          <ThemedText style={styles.statLabel} numberOfLines={1}>
            MAX YIELD
          </ThemedText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue} numberOfLines={1}>
            ₹0
          </ThemedText>
          <ThemedText style={styles.statLabel} numberOfLines={1}>
            MIN FEE
          </ThemedText>
        </View>
      </View>

      {/* Cards Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsGrid}>
          {cards.map((card, index) => (
            <PortfolioCard key={card.id} card={card} index={index} />
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText} numberOfLines={2}>
            Search for a merchant on the Optimize tab to find the best card for your spend.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    color: '#7000FF',
  },

  subtitle: {
    ...Typography.bodyMedium,
    color: 'rgba(255,255,255,0.5)',
  },

  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.container,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    ...Typography.headlineMedium,
    color: '#00FF85',
  },

  statLabel: {
    ...Typography.labelSmall,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  // Cards Grid
  cardsGrid: {
    gap: Spacing.md,
  },

  // Portfolio Card
  portfolioCard: {
    borderRadius: BorderRadius.container,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  portfolioCardGradient: {
    flexDirection: 'row',
  },

  brandIndicator: {
    width: 4,
  },

  portfolioCardContent: {
    flex: 1,
    padding: Spacing.md,
  },

  portfolioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },

  issuerLabel: {
    ...Typography.labelSmall,
    color: 'rgba(255,255,255,0.5)',
    flex: 1,
  },

  yieldBadge: {
    backgroundColor: 'rgba(0,255,133,0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.badge,
  },

  yieldBadgeText: {
    ...Typography.labelSmall,
    color: '#00FF85',
  },

  cardNameSmall: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: Spacing.sm,
  },

  portfolioCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  feeLabel: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.6)',
  },

  typeLabel: {
    ...Typography.labelSmall,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'capitalize',
  },

  // Footer
  footer: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },

  footerText: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    maxWidth: 280,
  },
});
