import { pgTable, uuid, varchar, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { appointments } from "./appointmentSchema";

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  active: boolean("active").notNull().default(true),
});

export const servicesRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
}));

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;