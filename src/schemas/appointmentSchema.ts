import { pgTable, uuid, date, pgEnum, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./userSchema";
import { barberProfiles, schedules } from "./barberSchema";
import { services } from "./servicesSchema";

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
]);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    barberId: uuid("barber_id")
      .notNull()
      .references(() => barberProfiles.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "restrict" }),
    scheduleId: uuid("schedule_id")
      .notNull()
      .references(() => schedules.id, { onDelete: "restrict" }),
    appointmentDate: date("appointment_date").notNull(),
    status: appointmentStatusEnum("status").notNull().default("scheduled"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueSlotPerDate: unique().on(table.scheduleId, table.appointmentDate),
  })
);

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  client: one(users, {
    fields: [appointments.clientId],
    references: [users.id],
  }),
  barber: one(barberProfiles, {
    fields: [appointments.barberId],
    references: [barberProfiles.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
  schedule: one(schedules, {
    fields: [appointments.scheduleId],
    references: [schedules.id],
  }),
}));

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;