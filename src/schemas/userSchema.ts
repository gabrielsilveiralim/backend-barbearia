import { pgTable, uuid, varchar, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { barberProfiles } from "./barberSchema";
import { appointments } from "./appointmentSchema";

export const userRoleEnum = pgEnum("user_role", ["client", "barber", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").notNull().default("client"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  barberProfile: one(barberProfiles, {
    fields: [users.id],
    references: [barberProfiles.userId],
  }),
  appointmentsAsClient: many(appointments),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;