import { StyleSheet, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Colors, Glass, Spacing, Typography } from '@/constants/theme';
import type { CardOfferWithMerchantReward } from '@/types/cards';

// Brand-specific gradient colors - refined for OLED
const BRAND_GRADIENTS: Record<string, [string, string]> = {
  'American Express': ['#006FCF', '#00A3E0'],
  'Amex': ['#006FCF', '#00A3E0'],
  'HSBC': ['#DB0011', '#FF2D2D'],
  'HDFC': ['#004C8F', '#0077CC'],
  'ICICI': ['#F58220', '#FF9933'],
  'SBI': ['#22409A', '#3355BB'],
  'Axis': ['#97144D', '#C41E5C'],
  'Tata': ['#1A1F71', '#3D44AA'],
  'default': ['#1A1A1A', '#2D2D2D'],
};

function getBrandGradient(issuer: string): [string, string] {
  const normalizedIssuer = issuer.toLowerCase();
  for (const [brand, gradient] of Object.entries(BRAND_GRADIENTS)) {
    if (normalizedIssuer.includes(brand.toLowerCase())) {
      return gradient;
    }
  }
  return BRAND_GRADIENTS.default;
}

interface CardViewProps {
  card: CardOfferWithMerchantReward;
  spendAmount?: number; // For calculating INR savings
}

/**
 * VerdictCard - Premium glassmorphic card with prominent yield display
 * Shows "INR Value Saved" prominently when spendAmount is provided
 */
export function CardView({ card, spendAmount = 10000 }: CardViewProps) {
  const gradient = getBrandGradient(card.issuer);
  const rewardRate = card.merchantRewardValue ?? card.reward_rate;
  const rewardUnit = card.merchantRewardUnit ?? '%';

  // Calculate INR savings based on yield percentage
  const isPercentYield = rewardUnit === '%';
  const inrSaved = isPercentYield ? Math.round((rewardRate / 100) * spendAmount) : 0;

  return (
    <View style={styles.container}>
      {/* Glassmorphic background */}
      <View style={styles.glassBackground}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={Glass.blurIntensity} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBlurFallback]} />
        )}

        {/* Subtle gradient accent at top */}
        <LinearGradient
          colors={[`${gradient[0]}40`, 'transparent']}
          style={styles.gradientAccent}
        />

        {/* Inner glow for OLED depth */}
        <View style={styles.innerGlow} />

        {/* Card Content */}
        <View style={styles.content}>
          {/* Header Row */}
          <View style={styles.header}>
            <View style={styles.issuerContainer}>
              <View style={[styles.issuerDot, { backgroundColor: gradient[0] }]} />
              <ThemedText style={styles.issuerText} numberOfLines={1}>
                {card.issuer}
              </ThemedText>
            </View>
            {card.isBestChoice && (
              <View style={styles.verdictBadge}>
                <ThemedText style={styles.verdictBadgeText} numberOfLines={1}>
                  VERDICT
                </ThemedText>
              </View>
            )}
          </View>

          {/* Card Name */}
          <ThemedText style={styles.cardName} numberOfLines={2}>
            {card.name}
          </ThemedText>

          {/* Main Yield Display */}
          <View style={styles.yieldContainer}>
            <View style={styles.yieldRow}>
              <ThemedText style={styles.yieldValue} numberOfLines={1}>
                {rewardRate}
              </ThemedText>
              <ThemedText style={styles.yieldUnit} numberOfLines={1}>
                {rewardUnit}
              </ThemedText>
            </View>
            <ThemedText style={styles.yieldLabel} numberOfLines={1}>
              EFFECTIVE YIELD
            </ThemedText>
          </View>

          {/* INR Savings - The Verdict Highlight */}
          {isPercentYield && inrSaved > 0 && (
            <View style={styles.savingsContainer}>
              <LinearGradient
                colors={['rgba(0,255,133,0.15)', 'rgba(0,255,133,0.05)']}
                style={styles.savingsGradient}
              >
                <ThemedText style={styles.savingsLabel}>
                  YOU SAVE
                </ThemedText>
                <View style={styles.savingsRow}>
                  <ThemedText style={styles.savingsCurrency} numberOfLines={1}>₹</ThemedText>
                  <ThemedText style={styles.savingsValue} numberOfLines={1}>
                    {inrSaved.toLocaleString('en-IN')}
                  </ThemedText>
                </View>
                <ThemedText style={styles.savingsSubtext} numberOfLines={1}>
                  on ₹{spendAmount.toLocaleString('en-IN')} spend
                </ThemedText>
              </LinearGradient>
            </View>
          )}

          {/* Merchant Notes */}
          {card.merchantNotes && (
            <View style={styles.notesContainer}>
              <ThemedText style={styles.notesText} numberOfLines={2}>
                {card.merchantNotes}
              </ThemedText>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <ThemedText style={styles.footerLabel} numberOfLines={1}>
                ANNUAL FEE
              </ThemedText>
              <ThemedText style={styles.footerValue} numberOfLines={1}>
                {card.annual_fee === 0
                  ? 'FREE'
                  : `₹${card.annual_fee.toLocaleString('en-IN')}`}
              </ThemedText>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerItem}>
              <ThemedText style={styles.footerLabel} numberOfLines={1}>
                REWARD TYPE
              </ThemedText>
              <ThemedText style={styles.footerValue} numberOfLines={1}>
                {card.reward_type.charAt(0).toUpperCase() + card.reward_type.slice(1)}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    // Subtle glow shadow
    shadowColor: '#00FF85',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },

  glassBackground: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },

  androidBlurFallback: {
    backgroundColor: 'rgba(20,20,20,0.95)',
  },

  gradientAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },

  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,255,133,0.08)',
  },

  content: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  issuerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  issuerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },

  issuerText: {
    ...Typography.labelMedium,
    color: 'rgba(255,255,255,0.6)',
    flexShrink: 1,
    maxWidth: '70%',
  },

  verdictBadge: {
    backgroundColor: '#00FF85',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.badge,
  },

  verdictBadgeText: {
    ...Typography.labelSmall,
    color: '#000000',
    fontWeight: '800',
  },

  // Card Name
  cardName: {
    ...Typography.headlineMedium,
    color: '#FFFFFF',
    marginBottom: Spacing.md,
  },

  // Yield Display
  yieldContainer: {
    marginBottom: Spacing.md,
    paddingBottom: 24,
  },

  yieldRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  yieldValue: {
    fontSize: 64,
    fontWeight: '800',
    color: '#00FF85',
    letterSpacing: -2,
    lineHeight: 84,
    paddingVertical: 10,
    textShadowColor: 'rgba(0,255,133,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  yieldUnit: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00FF85',
    marginLeft: 4,
    letterSpacing: -0.5,
  },

  yieldLabel: {
    ...Typography.labelSmall,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },

  // INR Savings
  savingsContainer: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.container,
    overflow: 'hidden',
  },

  savingsGradient: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,255,133,0.2)',
    borderRadius: BorderRadius.container,
  },

  savingsLabel: {
    ...Typography.labelSmall,
    color: '#00FF85',
    marginBottom: 4,
  },

  savingsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  savingsCurrency: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 40,
    marginRight: 2,
  },

  savingsValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 40,
    letterSpacing: -1,
  },

  savingsSubtext: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },

  // Notes
  notesContainer: {
    backgroundColor: 'rgba(112,0,255,0.1)',
    borderRadius: BorderRadius.badge,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#7000FF',
  },

  notesText: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    flexShrink: 1,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },

  footerItem: {
    flex: 1,
  },

  footerDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: Spacing.sm,
  },

  footerLabel: {
    ...Typography.labelSmall,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 2,
  },

  footerValue: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: '#FFFFFF',
    flexShrink: 1,
  },
});
