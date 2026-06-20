import { pgTable, uuid, varchar, boolean, integer, time, unique, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./userSchema";
import { appointments } from "./appointmentSchema";

export const barberProfiles = pgTable("barber_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  bio: varchar("bio", { length: 500 }),
  specialty: varchar("specialty", { length: 120 }),
  active: boolean("active").notNull().default(true),
});

export const schedules = pgTable(
  "schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    barberId: uuid("barber_id")
      .notNull()
      .references(() => barberProfiles.id, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(), // 0-6
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    isAvailable: boolean("is_available").notNull().default(true),
  },
  (table) => ({
    uniqueSlot: unique().on(table.barberId, table.weekday, table.startTime),
  })
);

export const barberProfilesRelations = relations(barberProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [barberProfiles.userId],
    references: [users.id],
  }),
  schedules: many(schedules),
  appointmentsAsBarber: many(appointments),
}));

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  barber: one(barberProfiles, {
    fields: [schedules.barberId],
    references: [barberProfiles.id],
  }),
  appointments: many(appointments),
}));

export type BarberProfile = typeof barberProfiles.$inferSelect;
export type NewBarberProfile = typeof barberProfiles.$inferInsert;
export type Schedule = typeof schedules.$inferSelect;
export type NewSchedule = typeof schedules.$inferInsert;