import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const hs_linkedin_network = pgTable("hs_linkedin_network", {
  id: serial("id").primaryKey(), // Primary key
  urn: varchar("urn", { length: 255 }), // LinkedIn URN
  username: varchar("username", { length: 255 }).unique(), // LinkedIn username
  first_name: varchar("first_name", { length: 255 }), // First name
  last_name: varchar("last_name", { length: 255 }), // Last name
  is_creator: boolean("is_creator"), // Whether this person is a creator
  is_open_to_work: boolean("is_open_to_work"), // Whether this person is open to work
  is_hiring: boolean("is_hiring"), // Whether this person is hiring
  profile_picture: text("profile_picture"), // Profile picture
  summary: text("summary"), // Summary
  headline: text("headline"), // Headline
  city: varchar("city", { length: 255 }), // City
  country: varchar("country", { length: 255 }), // Country
  fulltime_count: integer("fulltime_count"), // Number of full-time jobs
  internship_count: integer("internship_count"), // Number of internships
  is_headstarter_affiliated: boolean("is_headstarter_affiliated"), // Whether this person has added Headstarter as an experience on their LinkedIn profile
  most_recent_company_name: varchar("most_recent_company_name", {
    length: 255,
  }), // Company name
  most_recent_company_username: varchar("most_recent_company_username", {
    length: 255,
  }), // Company username
  most_recent_school: varchar("most_recent_school", { length: 255 }),
  most_recent_school_month: integer("most_recent_school_month"), // Graduation month
  most_recent_school_year: integer("most_recent_school_year"), // Graduation year
  most_recent_company_logo: text("most_recent_company_logo"), // Company logo
  most_recent_company_title: text("most_recent_company_title"), // Job title
  most_recent_school_degree: text("most_recent_school_degree"), // Degree
  most_recent_company_year: varchar("most_recent_company_year", {
    length: 255,
  }), // Job start year
});
