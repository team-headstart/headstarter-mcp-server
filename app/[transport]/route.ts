import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import { db } from "@/app/db";
import { sql } from "drizzle-orm";
import { env } from "@/app/config/env";
import { Logger } from "@/app/utils/logger";

export const maxDuration = 800;

const logger = new Logger("MCP:LinkedInNetwork");

logger.info("Initializing LinkedIn Network MCP handler");

const handler = createMcpHandler(
  server => {
    logger.info("Setting up LinkedIn Network MCP server tools and resources");

    // LinkedIn Network schema resource - shows table definition
    server.resource(
      "linkedin-network-schema",
      "schema://linkedin-network",
      async uri => {
        logger.info("LinkedIn Network schema resource requested", {
          uri: uri.href,
        });

        try {
          logger.debug("Executing schema query for hs_linkedin_network table");
          const tableSchemas = await db.execute(sql`
            SELECT 
              column_name,
              data_type,
              is_nullable,
              column_default
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'hs_linkedin_network'
            ORDER BY ordinal_position
          `);

          const rows = Array.isArray(tableSchemas)
            ? tableSchemas
            : tableSchemas.rows || [];
          logger.info("Schema query completed", { rowCount: rows.length });

          const schemaText = rows.reduce((acc: string, row: any) => {
            return (
              acc +
              `Column: ${row.column_name} (${row.data_type}${row.is_nullable === "YES" ? ", nullable" : ", not null"})\n`
            );
          }, "LinkedIn Network Table (hs_linkedin_network):\n");

          const result = {
            contents: [
              {
                uri: uri.href,
                text: schemaText || "No LinkedIn network table found",
              },
            ],
          };

          logger.debug("LinkedIn Network schema resource response prepared", {
            hasContent: !!schemaText,
          });
          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Error fetching LinkedIn network schema", {
            error: errorMessage,
          });

          return {
            contents: [
              {
                uri: uri.href,
                text: `Error fetching LinkedIn network schema: ${errorMessage}`,
              },
            ],
          };
        }
      }
    );

    // LinkedIn Network statistics resource
    server.resource(
      "linkedin-network-stats",
      "stats://linkedin-network",
      async uri => {
        logger.info("LinkedIn Network stats resource requested", {
          uri: uri.href,
        });

        try {
          logger.debug("Executing stats queries for LinkedIn network");
          const stats = await db.execute(sql`
            SELECT 
              COUNT(*) as total_profiles,
              COUNT(CASE WHEN is_open_to_work = true THEN 1 END) as open_to_work_count,
              COUNT(CASE WHEN is_hiring = true THEN 1 END) as hiring_count,
              COUNT(CASE WHEN is_creator = true THEN 1 END) as creator_count,
              COUNT(CASE WHEN is_headstarter_affiliated = true THEN 1 END) as headstarter_affiliated_count,
              COUNT(DISTINCT city) as unique_cities,
              COUNT(DISTINCT country) as unique_countries,
              COUNT(DISTINCT most_recent_company_name) as unique_companies
            FROM hs_linkedin_network
          `);

          const rows = Array.isArray(stats) ? stats : stats.rows || [];
          logger.info("Stats query completed", { statsCount: rows.length });

          const statsData = rows[0] || {};
          const statsText = `LinkedIn Network Statistics:
                              Total Profiles: ${statsData.total_profiles || 0}
                              Open to Work: ${statsData.open_to_work_count || 0}
                              Currently Hiring: ${statsData.hiring_count || 0}
                              Creators: ${statsData.creator_count || 0}
                              Headstarter Affiliated: ${statsData.headstarter_affiliated_count || 0}
                              Unique Cities: ${statsData.unique_cities || 0}
                              Unique Countries: ${statsData.unique_countries || 0}
                              Unique Companies: ${statsData.unique_companies || 0}`;

          const result = {
            contents: [
              {
                uri: uri.href,
                text: statsText,
              },
            ],
          };

          logger.debug("LinkedIn Network stats resource response prepared");
          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Error fetching LinkedIn network stats", {
            error: errorMessage,
          });

          return {
            contents: [
              {
                uri: uri.href,
                text: `Error fetching LinkedIn network stats: ${errorMessage}`,
              },
            ],
          };
        }
      }
    );

    // LinkedIn Network SQL query tool
    server.tool(
      "linkedin-sql-query",
      "Execute SELECT queries against the LinkedIn Network table (hs_linkedin_network) with automatic LIMIT protection. Contains LinkedIn profile data including personal info, work status, location, experience, and education details. Only SELECT statements allowed for security.",
      {
        query: z
          .string()
          .describe(
            "The SQL query to execute against hs_linkedin_network table"
          ),
        limit: z
          .number()
          .optional()
          .default(100)
          .describe("Maximum number of rows to return (default: 100)"),
      },
      async ({ query, limit = 100 }) => {
        logger.info("LinkedIn SQL query tool called", {
          query: query.substring(0, 100),
          limit,
        });

        try {
          // Add LIMIT clause if not present and it's a SELECT query
          let finalQuery = query.trim();

          // SECURITY: Only allow SELECT statements to prevent data deletion/modification
          if (!finalQuery.toLowerCase().startsWith("select")) {
            logger.warn("Non-SELECT query blocked for security", {
              query: finalQuery.substring(0, 100),
            });
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Security Error: Only SELECT queries are allowed. Query must start with 'SELECT'.`,
                },
              ],
              isError: true,
            };
          }

          if (!finalQuery.toLowerCase().includes("limit")) {
            finalQuery = `${finalQuery} LIMIT ${limit}`;
            logger.debug("Added LIMIT clause to SELECT query", {
              originalQuery: query,
              finalQuery,
            });
          }

          logger.debug("Executing LinkedIn SQL query", { finalQuery });
          const results = await db.execute(sql.raw(finalQuery));
          const rows = Array.isArray(results) ? results : results.rows || [];

          logger.info("LinkedIn SQL query completed successfully", {
            rowCount: rows.length,
          });

          const response = {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(rows, null, 2),
              },
            ],
          };

          logger.debug("LinkedIn SQL query response prepared", {
            responseLength: response.content[0].text.length,
          });
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("LinkedIn SQL query failed", {
            query,
            error: errorMessage,
          });

          return {
            content: [
              {
                type: "text" as const,
                text: `SQL Error: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get LinkedIn profile tool
    server.tool(
      "get-linkedin-profile",
      "Get a specific LinkedIn profile by username or URN from the LinkedIn network. Returns complete profile information including personal details, work status, location, experience counts, and most recent company/school information.",
      {
        identifier: z.string().describe("Username or URN to search for"),
      },
      async ({ identifier }) => {
        logger.info("Get LinkedIn profile tool called", { identifier });

        try {
          logger.debug("Executing LinkedIn profile lookup query");
          const results = await db.execute(sql`
            SELECT * FROM hs_linkedin_network 
            WHERE username = ${identifier} OR urn = ${identifier}
            LIMIT 1
          `);

          const rows = Array.isArray(results) ? results : results.rows || [];

          if (rows.length === 0) {
            logger.info("LinkedIn profile not found", { identifier });
            return {
              content: [
                {
                  type: "text" as const,
                  text: `No LinkedIn profile found with identifier: ${identifier}`,
                },
              ],
            };
          }

          logger.info("LinkedIn profile found successfully", {
            identifier,
            profileId: rows[0].id,
          });

          const response = {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(rows[0], null, 2),
              },
            ],
          };

          logger.debug("LinkedIn profile lookup response prepared", {
            profileId: rows[0].id,
          });
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Error fetching LinkedIn profile", {
            identifier,
            error: errorMessage,
          });

          return {
            content: [
              {
                type: "text" as const,
                text: `Error fetching LinkedIn profile: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Search LinkedIn profiles tool
    server.tool(
      "search-linkedin-profiles",
      "Advanced search of LinkedIn profiles with multiple filter options. Filter by work status (open to work, hiring), professional attributes (creator status, Headstarter affiliation), location (city, country), and experience levels. Great for talent sourcing and networking.",
      {
        isOpenToWork: z
          .boolean()
          .optional()
          .describe("Filter by users open to work"),
        isHiring: z
          .boolean()
          .optional()
          .describe("Filter by users who are hiring"),
        isCreator: z.boolean().optional().describe("Filter by creator status"),
        isHeadstarterAffiliated: z
          .boolean()
          .optional()
          .describe("Filter by Headstarter affiliation"),
        city: z.string().optional().describe("Filter by city (partial match)"),
        country: z
          .string()
          .optional()
          .describe("Filter by country (partial match)"),
        company: z
          .string()
          .optional()
          .describe("Filter by most recent company name (partial match)"),
        school: z
          .string()
          .optional()
          .describe("Filter by most recent school (partial match)"),
        minFulltimeExperience: z
          .number()
          .optional()
          .describe("Minimum number of full-time experiences"),
        minInternshipExperience: z
          .number()
          .optional()
          .describe("Minimum number of internship experiences"),
        limit: z
          .number()
          .optional()
          .default(25)
          .describe("Maximum number of profiles to return (default: 25)"),
      },
      async ({
        isOpenToWork,
        isHiring,
        isCreator,
        isHeadstarterAffiliated,
        city,
        country,
        company,
        school,
        minFulltimeExperience,
        minInternshipExperience,
        limit = 25,
      }) => {
        logger.info("Search LinkedIn profiles tool called", {
          isOpenToWork,
          isHiring,
          isCreator,
          isHeadstarterAffiliated,
          city,
          country,
          company,
          school,
          minFulltimeExperience,
          minInternshipExperience,
          limit,
        });

        try {
          let query = sql`
            SELECT 
              id,
              username,
              first_name,
              last_name,
              is_open_to_work,
              is_hiring,
              is_creator,
              is_headstarter_affiliated,
              city,
              country,
              headline,
              most_recent_company_name,
              most_recent_company_title,
              most_recent_school,
              fulltime_count,
              internship_count
            FROM hs_linkedin_network
            WHERE 1=1
          `;

          if (isOpenToWork !== undefined) {
            query = sql`${query} AND is_open_to_work = ${isOpenToWork}`;
          }
          if (isHiring !== undefined) {
            query = sql`${query} AND is_hiring = ${isHiring}`;
          }
          if (isCreator !== undefined) {
            query = sql`${query} AND is_creator = ${isCreator}`;
          }
          if (isHeadstarterAffiliated !== undefined) {
            query = sql`${query} AND is_headstarter_affiliated = ${isHeadstarterAffiliated}`;
          }
          if (city) {
            query = sql`${query} AND city ILIKE ${`%${city}%`}`;
          }
          if (country) {
            query = sql`${query} AND country ILIKE ${`%${country}%`}`;
          }
          if (company) {
            query = sql`${query} AND most_recent_company_name ILIKE ${`%${company}%`}`;
          }
          if (school) {
            query = sql`${query} AND most_recent_school ILIKE ${`%${school}%`}`;
          }
          if (minFulltimeExperience !== undefined) {
            query = sql`${query} AND fulltime_count >= ${minFulltimeExperience}`;
          }
          if (minInternshipExperience !== undefined) {
            query = sql`${query} AND internship_count >= ${minInternshipExperience}`;
          }

          query = sql`${query} ORDER BY id LIMIT ${limit}`;

          logger.debug("Executing search LinkedIn profiles query");
          const results = await db.execute(query);
          const rows = Array.isArray(results) ? results : results.rows || [];

          logger.info("Search LinkedIn profiles query completed", {
            profileCount: rows.length,
          });

          const response = {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(rows, null, 2),
              },
            ],
          };

          logger.debug("Search LinkedIn profiles response prepared", {
            profileCount: rows.length,
          });
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Error searching LinkedIn profiles", {
            error: errorMessage,
          });

          return {
            content: [
              {
                type: "text" as const,
                text: `Error searching LinkedIn profiles: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get profiles by location tool
    server.tool(
      "get-profiles-by-location",
      "Get LinkedIn profiles from specific geographic locations. Useful for finding talent or connections in particular cities or countries. Returns profiles with location details and basic professional information.",
      {
        city: z
          .string()
          .optional()
          .describe("City name (partial match supported)"),
        country: z
          .string()
          .optional()
          .describe("Country name (partial match supported)"),
        exactMatch: z
          .boolean()
          .optional()
          .default(false)
          .describe("Whether to use exact match or partial match for location"),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe("Maximum number of profiles to return (default: 50)"),
      },
      async ({ city, country, exactMatch = false, limit = 50 }) => {
        logger.info("Get profiles by location tool called", {
          city,
          country,
          exactMatch,
          limit,
        });

        if (!city && !country) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Please provide at least one location parameter (city or country)",
              },
            ],
            isError: true,
          };
        }

        try {
          let query = sql`
            SELECT 
              id,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              most_recent_company_name,
              most_recent_company_title,
              is_open_to_work,
              is_hiring,
              is_creator,
              is_headstarter_affiliated
            FROM hs_linkedin_network
            WHERE 1=1
          `;

          if (city) {
            if (exactMatch) {
              query = sql`${query} AND city = ${city}`;
            } else {
              query = sql`${query} AND city ILIKE ${`%${city}%`}`;
            }
          }

          if (country) {
            if (exactMatch) {
              query = sql`${query} AND country = ${country}`;
            } else {
              query = sql`${query} AND country ILIKE ${`%${country}%`}`;
            }
          }

          query = sql`${query} ORDER BY city, country, last_name LIMIT ${limit}`;

          logger.debug("Executing get profiles by location query");
          const results = await db.execute(query);
          const rows = Array.isArray(results) ? results : results.rows || [];

          logger.info("Get profiles by location query completed", {
            profileCount: rows.length,
          });

          const response = {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(rows, null, 2),
              },
            ],
          };

          logger.debug("Get profiles by location response prepared", {
            profileCount: rows.length,
          });
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Error getting profiles by location", {
            city,
            country,
            error: errorMessage,
          });

          return {
            content: [
              {
                type: "text" as const,
                text: `Error getting profiles by location: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get open to work profiles
    server.tool(
      "get-open-to-work-profiles",
      "Get LinkedIn profiles of people who are currently open to work opportunities. Useful for recruiters and hiring managers to find available talent. Returns profiles with work status and professional details.",
      {
        city: z.string().optional().describe("Filter by city"),
        country: z.string().optional().describe("Filter by country"),
        company: z
          .string()
          .optional()
          .describe("Filter by most recent company"),
        minExperience: z
          .number()
          .optional()
          .describe("Minimum total experience (fulltime + internship count)"),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe("Maximum number of profiles to return (default: 50)"),
      },
      async ({ city, country, company, minExperience, limit = 50 }) => {
        logger.info("Get open to work profiles tool called", {
          city,
          country,
          company,
          minExperience,
          limit,
        });

        try {
          let query = sql`
            SELECT 
              id,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              summary,
              most_recent_company_name,
              most_recent_company_title,
              most_recent_school,
              fulltime_count,
              internship_count,
              is_creator,
              is_headstarter_affiliated
            FROM hs_linkedin_network
            WHERE is_open_to_work = true
          `;

          if (city) {
            query = sql`${query} AND city ILIKE ${`%${city}%`}`;
          }
          if (country) {
            query = sql`${query} AND country ILIKE ${`%${country}%`}`;
          }
          if (company) {
            query = sql`${query} AND most_recent_company_name ILIKE ${`%${company}%`}`;
          }
          if (minExperience !== undefined) {
            query = sql`${query} AND (fulltime_count + internship_count) >= ${minExperience}`;
          }

          query = sql`${query} ORDER BY (fulltime_count + internship_count) DESC LIMIT ${limit}`;

          logger.debug("Executing get open to work profiles query");
          const results = await db.execute(query);
          const rows = Array.isArray(results) ? results : results.rows || [];

          logger.info("Get open to work profiles query completed", {
            profileCount: rows.length,
          });

          const response = {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(rows, null, 2),
              },
            ],
          };

          logger.debug("Get open to work profiles response prepared", {
            profileCount: rows.length,
          });
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Error getting open to work profiles", {
            error: errorMessage,
          });

          return {
            content: [
              {
                type: "text" as const,
                text: `Error getting open to work profiles: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get hiring profiles
    server.tool(
      "get-hiring-profiles",
      "Get LinkedIn profiles of people who are currently hiring. Useful for job seekers to find potential opportunities and connect with hiring managers. Returns profiles with company details and contact information.",
      {
        city: z.string().optional().describe("Filter by city"),
        country: z.string().optional().describe("Filter by country"),
        company: z.string().optional().describe("Filter by company name"),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe("Maximum number of profiles to return (default: 50)"),
      },
      async ({ city, country, company, limit = 50 }) => {
        logger.info("Get hiring profiles tool called", {
          city,
          country,
          company,
          limit,
        });

        try {
          let query = sql`
            SELECT 
              id,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              summary,
              most_recent_company_name,
              most_recent_company_title,
              is_creator,
              is_headstarter_affiliated
            FROM hs_linkedin_network
            WHERE is_hiring = true
          `;

          if (city) {
            query = sql`${query} AND city ILIKE ${`%${city}%`}`;
          }
          if (country) {
            query = sql`${query} AND country ILIKE ${`%${country}%`}`;
          }
          if (company) {
            query = sql`${query} AND most_recent_company_name ILIKE ${`%${company}%`}`;
          }

          query = sql`${query} ORDER BY most_recent_company_name, last_name LIMIT ${limit}`;

          logger.debug("Executing get hiring profiles query");
          const results = await db.execute(query);
          const rows = Array.isArray(results) ? results : results.rows || [];

          logger.info("Get hiring profiles query completed", {
            profileCount: rows.length,
          });

          const response = {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(rows, null, 2),
              },
            ],
          };

          logger.debug("Get hiring profiles response prepared", {
            profileCount: rows.length,
          });
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Error getting hiring profiles", {
            error: errorMessage,
          });

          return {
            content: [
              {
                type: "text" as const,
                text: `Error getting hiring profiles: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get creator profiles
    server.tool(
      "get-creator-profiles",
      "Get LinkedIn profiles of content creators and thought leaders. Useful for finding influencers, potential collaborators, or learning from industry experts. Returns creator profiles with their professional background.",
      {
        city: z.string().optional().describe("Filter by city"),
        country: z.string().optional().describe("Filter by country"),
        company: z.string().optional().describe("Filter by company name"),
        isHeadstarterAffiliated: z
          .boolean()
          .optional()
          .describe("Filter by Headstarter affiliation"),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe("Maximum number of profiles to return (default: 50)"),
      },
      async ({
        city,
        country,
        company,
        isHeadstarterAffiliated,
        limit = 50,
      }) => {
        logger.info("Get creator profiles tool called", {
          city,
          country,
          company,
          isHeadstarterAffiliated,
          limit,
        });

        try {
          let query = sql`
              SELECT 
              id,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              summary,
              most_recent_company_name,
              most_recent_company_title,
              most_recent_school,
              is_open_to_work,
              is_hiring,
              is_headstarter_affiliated,
              fulltime_count,
              internship_count
            FROM hs_linkedin_network
            WHERE is_creator = true
          `;

          if (city) {
            query = sql`${query} AND city ILIKE ${`%${city}%`}`;
          }
          if (country) {
            query = sql`${query} AND country ILIKE ${`%${country}%`}`;
          }
          if (company) {
            query = sql`${query} AND most_recent_company_name ILIKE ${`%${company}%`}`;
          }
          if (isHeadstarterAffiliated !== undefined) {
            query = sql`${query} AND is_headstarter_affiliated = ${isHeadstarterAffiliated}`;
          }

          query = sql`${query} ORDER BY last_name LIMIT ${limit}`;

          logger.debug("Executing get creator profiles query");
          const results = await db.execute(query);
          const rows = Array.isArray(results) ? results : results.rows || [];

          logger.info("Get creator profiles query completed", {
            profileCount: rows.length,
          });

          const response = {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(rows, null, 2),
              },
            ],
          };

          logger.debug("Get creator profiles response prepared", {
            profileCount: rows.length,
          });
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Error getting creator profiles", {
            error: errorMessage,
          });

          return {
            content: [
              {
                type: "text" as const,
                text: `Error getting creator profiles: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Get Headstarter affiliated profiles
    server.tool(
      "get-headstarter-affiliated-profiles",
      "Get LinkedIn profiles of people affiliated with Headstarter. Useful for finding Headstarter community members, alumni, and network connections. Returns profiles with their professional background and current status.",
      {
        isOpenToWork: z
          .boolean()
          .optional()
          .describe("Filter by users open to work"),
        isHiring: z
          .boolean()
          .optional()
          .describe("Filter by users who are hiring"),
        isCreator: z.boolean().optional().describe("Filter by creator status"),
        city: z.string().optional().describe("Filter by city"),
        country: z.string().optional().describe("Filter by country"),
        limit: z
          .number()
          .optional()
          .default(100)
          .describe("Maximum number of profiles to return (default: 100)"),
      },
      async ({
        isOpenToWork,
        isHiring,
        isCreator,
        city,
        country,
        limit = 100,
      }) => {
        logger.info("Get Headstarter affiliated profiles tool called", {
          isOpenToWork,
          isHiring,
          isCreator,
          city,
          country,
          limit,
        });

        try {
          let query = sql`
            SELECT 
              id,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              summary,
              most_recent_company_name,
              most_recent_company_title,
              most_recent_school,
              is_open_to_work,
              is_hiring,
              is_creator,
              fulltime_count,
              internship_count
            FROM hs_linkedin_network
            WHERE is_headstarter_affiliated = true
          `;

          if (isOpenToWork !== undefined) {
            query = sql`${query} AND is_open_to_work = ${isOpenToWork}`;
          }
          if (isHiring !== undefined) {
            query = sql`${query} AND is_hiring = ${isHiring}`;
          }
          if (isCreator !== undefined) {
            query = sql`${query} AND is_creator = ${isCreator}`;
          }
          if (city) {
            query = sql`${query} AND city ILIKE ${`%${city}%`}`;
          }
          if (country) {
            query = sql`${query} AND country ILIKE ${`%${country}%`}`;
          }

          query = sql`${query} ORDER BY last_name LIMIT ${limit}`;

          logger.debug("Executing get Headstarter affiliated profiles query");
          const results = await db.execute(query);
          const rows = Array.isArray(results) ? results : results.rows || [];

          logger.info("Get Headstarter affiliated profiles query completed", {
            profileCount: rows.length,
          });

          const response = {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(rows, null, 2),
              },
            ],
          };

          logger.debug(
            "Get Headstarter affiliated profiles response prepared",
            {
              profileCount: rows.length,
            }
          );
          return response;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          logger.error("Error getting Headstarter affiliated profiles", {
            error: errorMessage,
          });

          return {
            content: [
              {
                type: "text" as const,
                text: `Error getting Headstarter affiliated profiles: ${errorMessage}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    logger.info(
      "LinkedIn Network MCP server tools and resources setup completed"
    );
  },
  {
    capabilities: {
      resources: {
        "linkedin-network-schema": {
          description: "LinkedIn Network database table schema and structure",
        },
        "linkedin-network-stats": {
          description: "LinkedIn Network statistics and overview",
        },
      },
      tools: {
        "linkedin-sql-query": {
          description:
            "Execute read-only queries against the LinkedIn Network table (hs_linkedin_network) with automatic LIMIT protection. Contains LinkedIn profile data including personal info, work status, location, experience, and education details. Only SELECT statements allowed for security.",
        },
        "get-linkedin-profile": {
          description:
            "Get a specific LinkedIn profile by username or URN from the LinkedIn network. Returns complete profile information including personal details, work status, location, experience counts, and most recent company/school information.",
        },
        "search-linkedin-profiles": {
          description:
            "Advanced search of LinkedIn profiles with multiple filter options. Filter by work status (open to work, hiring), professional attributes (creator status, Headstarter affiliation), location (city, country), and experience levels. Great for talent sourcing and networking.",
        },
        "get-profiles-by-location": {
          description:
            "Get LinkedIn profiles from specific geographic locations. Useful for finding talent or connections in particular cities or countries. Returns profiles with location details and basic professional information.",
        },
        "get-open-to-work-profiles": {
          description:
            "Get LinkedIn profiles of people who are currently open to work opportunities. Useful for recruiters and hiring managers to find available talent. Returns profiles with work status and professional details.",
        },
        "get-hiring-profiles": {
          description:
            "Get LinkedIn profiles of people who are currently hiring. Useful for job seekers to find potential opportunities and connect with hiring managers. Returns profiles with company details and contact information.",
        },
        "get-creator-profiles": {
          description:
            "Get LinkedIn profiles of content creators and thought leaders. Useful for finding influencers, potential collaborators, or learning from industry experts. Returns creator profiles with their professional background.",
        },
        "get-headstarter-affiliated-profiles": {
          description:
            "Get LinkedIn profiles of people affiliated with Headstarter. These are people who have added Headstarter as an experience on their LinkedIn profile. Useful for finding Headstarter community members, alumni, and network connections. Returns profiles with their professional background and current status.",
        },
      },
    },
  },
  {
    redisUrl: env.REDIS_URL,
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
  }
);

logger.info("LinkedIn Network MCP handler created successfully", {
  redisUrl: !!env.REDIS_URL,
  verboseLogs: true,
  maxDuration: 60,
});

export { handler as GET, handler as POST, handler as DELETE };
