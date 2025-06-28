import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const hs_linkedin_network = pgTable("hs_linkedin_network", {
  id: serial("id").primaryKey(),
  urn: varchar("urn", { length: 255 }),
  username: varchar("username", { length: 255 }).unique(),
  first_name: varchar("first_name", { length: 255 }),
  last_name: varchar("last_name", { length: 255 }),
  is_creator: boolean("is_creator"),
  is_open_to_work: boolean("is_open_to_work"),
  is_hiring: boolean("is_hiring"),
  profile_picture: text("profile_picture"),
  summary: text("summary"),
  headline: text("headline"),
  city: varchar("city", { length: 255 }),
  country: varchar("country", { length: 255 }),
  fulltime_count: integer("fulltime_count"),
  internship_count: integer("internship_count"),
  is_headstarter_affiliated: boolean("is_headstarter_affiliated"),
  most_recent_company_name: varchar("most_recent_company_name", {
    length: 255,
  }),
  most_recent_company_username: varchar("most_recent_company_username", {
    length: 255,
  }),
  most_recent_school: varchar("most_recent_school", { length: 255 }),
  most_recent_school_month: integer("most_recent_school_month"),
  most_recent_school_year: integer("most_recent_school_year"),
  most_recent_company_logo: text("most_recent_company_logo"),
  most_recent_company_title: text("most_recent_company_title"),
  most_recent_school_degree: text("most_recent_school_degree"),
  most_recent_company_year: varchar("most_recent_company_year", {
    length: 255,
  }),
});
