import { pgTable, text, serial, integer, boolean, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Constituent (person requesting help)
export const constituents = pgTable("constituents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  avatar: text("avatar").notNull(),
  address: text("address"),
  district: text("district")
});

export const insertConstituentSchema = createInsertSchema(constituents).pick({
  name: true,
  email: true,
  phone: true,
  avatar: true,
  address: true,
  district: true
});

export type Constituent = typeof constituents.$inferSelect;
export type InsertConstituent = z.infer<typeof insertConstituentSchema>;

// Team members (minister's staff)
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  avatar: text("avatar").notNull(),
  phone: text("phone").notNull()
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  name: true,
  email: true,
  role: true,
  avatar: true,
  phone: true
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

// Request categories
export const categoryEnum = z.enum([
  "appointment",
  "startup-support",
  "infrastructure",
  "public-issue",
  "emergency"
]);

// Request statuses
export const statusEnum = z.enum([
  "new",
  "in-progress",
  "under-review",
  "awaiting-feedback",
  "resolved"
]);

// Request priorities
export const priorityEnum = z.enum([
  "high",
  "medium",
  "low"
]);

export type Category = z.infer<typeof categoryEnum>;
export type Status = z.infer<typeof statusEnum>;
export type Priority = z.infer<typeof priorityEnum>;

// Requests
export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  constituentId: integer("constituent_id").notNull().references(() => constituents.id),
  category: text("category").notNull().$type<Category>(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().$type<Status>().default("new"),
  priority: text("priority").notNull().$type<Priority>(),
  assignedToId: integer("assigned_to_id").references(() => teamMembers.id),
  location: text("location"),
  attachments: text("attachments").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const insertRequestSchema = createInsertSchema(requests).pick({
  constituentId: true,
  category: true,
  subject: true,
  description: true,
  priority: true,
  location: true,
  attachments: true,
});

export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;

// Request notes
export const requestNotes = pgTable("request_notes", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => requests.id),
  teamMemberId: integer("team_member_id").references(() => teamMembers.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const insertRequestNoteSchema = createInsertSchema(requestNotes).pick({
  requestId: true,
  teamMemberId: true,
  text: true
});

export type RequestNote = typeof requestNotes.$inferSelect;
export type InsertRequestNote = z.infer<typeof insertRequestNoteSchema>;

// Call logs
export const callLogs = pgTable("call_logs", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => requests.id),
  teamMemberId: integer("team_member_id").references(() => teamMembers.id),
  outcome: text("outcome").notNull(),
  notes: text("notes"),
  callTime: timestamp("call_time").notNull().defaultNow()
});

export const insertCallLogSchema = createInsertSchema(callLogs).pick({
  requestId: true,
  teamMemberId: true,
  outcome: true,
  notes: true
});

export type CallLog = typeof callLogs.$inferSelect;
export type InsertCallLog = z.infer<typeof insertCallLogSchema>;

// Appointments (special type of request with a scheduled time)
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => requests.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration").notNull(),
  location: text("location"),
  isConfirmed: boolean("is_confirmed").default(false)
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  requestId: true,
  scheduledDate: true,
  duration: true,
  location: true,
  isConfirmed: true
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// Users (login accounts for the minister and team)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  teamMemberId: integer("team_member_id").references(() => teamMembers.id),
  role: text("role").notNull(),
  isAdmin: boolean("is_admin").default(false)
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  teamMemberId: true,
  role: true,
  isAdmin: true
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
