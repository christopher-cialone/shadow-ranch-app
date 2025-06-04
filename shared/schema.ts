import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  pfpUrl: text("pfp_url"), // Profile picture URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ranches = pgTable("ranches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  coins: integer("coins").default(100).notNull(),
  experience: integer("experience").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // "Beginner", "Intermediate", "Advanced"
  duration: text("duration").notNull(),
  reward: integer("reward").default(100).notNull(),
  requiredLessons: jsonb("required_lessons").$type<number[]>().default([]),
  steps: jsonb("steps").$type<LessonStep[]>().notNull(),
  category: text("category").notNull(), // "rust", "anchor", "seahorse"
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  currentStep: integer("current_step").default(0).notNull(),
  attempts: integer("attempts").default(0).notNull(),
  completedAt: timestamp("completed_at"),
  lastAttemptAt: timestamp("last_attempt_at").defaultNow().notNull(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  ranchId: integer("ranch_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "sheriff", "deputy", "merchant", etc.
  rarity: text("rarity").notNull(), // "common", "uncommon", "rare", "epic", "legendary"
  level: integer("level").default(1).notNull(),
  experience: integer("experience").default(0).notNull(),
  position: jsonb("position").$type<{ x: number; y: number }>().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  acquiredAt: timestamp("acquired_at").defaultNow().notNull(),
});

export const buildings = pgTable("buildings", {
  id: serial("id").primaryKey(),
  ranchId: integer("ranch_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "saloon", "stable", "library", "water_tower", etc.
  level: integer("level").default(1).notNull(),
  position: jsonb("position").$type<{ x: number; y: number }>().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  builtAt: timestamp("built_at").defaultNow().notNull(),
});

export const rewardNfts = pgTable("reward_nfts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Firebase user ID
  lessonId: integer("lesson_id").notNull(),
  nftImageUrl: text("nft_image_url").notNull(),
  mintAddress: text("mint_address"), // Optional: if it's a real minted NFT
  rewardName: text("reward_name").notNull(),
  awardedAt: timestamp("awarded_at").defaultNow().notNull(),
});

// Types for lesson steps
export interface LessonStep {
  id: number;
  title: string;
  narrative: string;
  instructions: string[];
  hints: string[];
  validationRules: ValidationRule[];
  starterCode?: string;
  expectedOutput?: string;
}

export interface ValidationRule {
  type: "contains" | "regex" | "function_exists" | "variable_exists";
  pattern: string;
  message: string;
  required: boolean;
}

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertRanchSchema = createInsertSchema(ranches).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAttemptAt: true,
  completedAt: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
  acquiredAt: true,
});

export const insertBuildingSchema = createInsertSchema(buildings).omit({
  id: true,
  builtAt: true,
});

export const insertRewardNftSchema = createInsertSchema(rewardNfts).omit({
  id: true,
  awardedAt: true,
});

// Select types
export type User = typeof users.$inferSelect;
export type Ranch = typeof ranches.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type Building = typeof buildings.$inferSelect;
export type RewardNft = typeof rewardNfts.$inferSelect;

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRanch = z.infer<typeof insertRanchSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type InsertBuilding = z.infer<typeof insertBuildingSchema>;
export type InsertRewardNft = z.infer<typeof insertRewardNftSchema>;
