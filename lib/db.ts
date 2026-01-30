/**
 * Card Optimizer database: encrypted SQLite with schema, migrations, and seed data.
 * SQLCipher encryption is enabled via app.json (useSQLCipher: true).
 */

import type { SQLiteDatabase } from 'expo-sqlite';
import type { CardOffer } from '@/types/cards';
import { SEED_OFFERS, MERCHANT_RULES } from './seedData';

const DATABASE_VERSION = 4;

export async function migrateDbIfNeeded(db: SQLiteDatabase): Promise<void> {
  await db.execAsync("PRAGMA journal_mode = 'wal'");

  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) return;

  // Force fresh start to ensure new seed data
  if (currentVersion < 4) {
    // Drop existing tables to reset with new data
    await db.execAsync(`
      DROP TABLE IF EXISTS merchant_rules;
      DROP TABLE IF EXISTS card_offers;
    `);
  }

  if (currentVersion < 4) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS card_offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        issuer TEXT NOT NULL,
        category TEXT NOT NULL,
        reward_type TEXT NOT NULL,
        reward_rate REAL NOT NULL,
        annual_fee INTEGER NOT NULL,
        signup_bonus TEXT NOT NULL,
        best_for TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_card_offers_category ON card_offers(category);
      CREATE INDEX IF NOT EXISTS idx_card_offers_reward_type ON card_offers(reward_type);
      CREATE INDEX IF NOT EXISTS idx_card_offers_annual_fee ON card_offers(annual_fee);
      CREATE INDEX IF NOT EXISTS idx_card_offers_issuer ON card_offers(issuer);
    `);

    await seedCardOffers(db);

    // Add merchant_rules table for Smart Search
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS merchant_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        merchant TEXT NOT NULL COLLATE NOCASE,
        card_id INTEGER NOT NULL,
        reward_value REAL NOT NULL,
        reward_unit TEXT NOT NULL DEFAULT '%',
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (card_id) REFERENCES card_offers(id)
      );

      CREATE INDEX IF NOT EXISTS idx_merchant_rules_merchant ON merchant_rules(merchant);
      CREATE INDEX IF NOT EXISTS idx_merchant_rules_card_id ON merchant_rules(card_id);
    `);

    await seedMerchantRules(db);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

async function seedCardOffers(db: SQLiteDatabase): Promise<void> {
  const stmt = await db.prepareAsync(
    `INSERT INTO card_offers (name, issuer, category, reward_type, reward_rate, annual_fee, signup_bonus, best_for)
     VALUES ($name, $issuer, $category, $reward_type, $reward_rate, $annual_fee, $signup_bonus, $best_for)`
  );
  try {
    for (const row of SEED_OFFERS) {
      await stmt.executeAsync({
        $name: row.name,
        $issuer: row.issuer,
        $category: row.category,
        $reward_type: row.reward_type,
        $reward_rate: row.reward_rate,
        $annual_fee: row.annual_fee,
        $signup_bonus: row.signup_bonus,
        $best_for: row.best_for,
      });
    }
  } finally {
    await stmt.finalizeAsync();
  }
}

async function seedMerchantRules(db: SQLiteDatabase): Promise<void> {
  const stmt = await db.prepareAsync(
    `INSERT INTO merchant_rules (merchant, card_id, reward_value, reward_unit, notes)
     VALUES ($merchant, $card_id, $reward_value, $reward_unit, $notes)`
  );
  try {
    for (const rule of MERCHANT_RULES) {
      // Find card_id by name
      const card = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM card_offers WHERE name = $name',
        { $name: rule.cardName }
      );
      if (card) {
        await stmt.executeAsync({
          $merchant: rule.merchant,
          $card_id: card.id,
          $reward_value: rule.rewardValue,
          $reward_unit: rule.rewardUnit,
          $notes: rule.notes ?? null,
        });
      }
    }
  } finally {
    await stmt.finalizeAsync();
  }
}
