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
      "Execute SELECT queries against the LinkedIn Network table (hs_linkedin_network) with automatic LIMIT protection. Contains comprehensive LinkedIn profile data including: Personal info (id, urn, username, first_name, last_name, summary, headline), Work status (is_creator, is_open_to_work, is_hiring, is_headstarter_affiliated), Location (city, country), Experience counts (fulltime_count, internship_count), Recent company details (most_recent_company_name, most_recent_company_username, most_recent_company_title, most_recent_company_logo, most_recent_company_year), and Education info (most_recent_school, most_recent_school_degree, most_recent_school_month, most_recent_school_year). Only SELECT statements allowed for security.",
      {
        query: z
          .string()
          .describe(
            "The SQL query to execute against hs_linkedin_network table. Must start with SELECT for security. Available fields: id, urn, username, first_name, last_name, is_creator, is_open_to_work, is_hiring, summary, headline, city, country, fulltime_count, internship_count, is_headstarter_affiliated, most_recent_company_name, most_recent_company_username, most_recent_school, most_recent_school_month, most_recent_school_year, most_recent_company_logo, most_recent_company_title, most_recent_school_degree, most_recent_company_year"
          ),
        limit: z
          .number()
          .optional()
          .default(100)
          .describe(
            "Maximum number of rows to return (default: 100, automatically added if not specified in query)"
          ),
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
      "Get a specific LinkedIn profile by username or URN from the LinkedIn network. Returns complete profile information including: Personal details (first_name, last_name, summary, headline), Professional status (is_creator, is_open_to_work, is_hiring, is_headstarter_affiliated), Location (city, country), Experience metrics (fulltime_count, internship_count), Current company info (most_recent_company_name, most_recent_company_title, most_recent_company_logo, most_recent_company_year), and Education details (most_recent_school, most_recent_school_degree, graduation year/month). Useful for detailed profile analysis and networking research.",
      {
        identifier: z
          .string()
          .describe(
            "LinkedIn username (without @) or full LinkedIn URN to search for. Examples: 'johndoe' or 'urn:li:person:ABC123'"
          ),
      },
      async ({ identifier }) => {
        logger.info("Get LinkedIn profile tool called", { identifier });

        try {
          logger.debug("Executing LinkedIn profile lookup query");
          const results = await db.execute(sql`
            SELECT 
              id,
              urn,
              username,
              first_name,
              last_name,
              summary,
              headline,
              city,
              country,
              is_creator,
              is_open_to_work,
              is_hiring,
              is_headstarter_affiliated,
              fulltime_count,
              internship_count,
              most_recent_company_name,
              most_recent_company_username,
              most_recent_company_title,
              most_recent_company_logo,
              most_recent_company_year,
              most_recent_school,
              most_recent_school_degree,
              most_recent_school_month,
              most_recent_school_year
            FROM hs_linkedin_network 
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
      "Advanced search of LinkedIn profiles with comprehensive filtering options. Search by work status (is_open_to_work for job seekers, is_hiring for recruiters), professional attributes (is_creator for content creators/influencers, is_headstarter_affiliated for Headstarter community members), geographic location (city/country with partial matching), company/school affiliations (current or recent), and experience levels (minimum full-time or internship counts). Returns profiles with complete professional information including contact details, work history, education, and current status. Perfect for talent sourcing, networking, recruitment, and business development.",
      {
        isOpenToWork: z
          .boolean()
          .optional()
          .describe(
            "Filter by users actively seeking job opportunities (true) or exclude job seekers (false)"
          ),
        isHiring: z
          .boolean()
          .optional()
          .describe(
            "Filter by users who are actively recruiting/hiring (true) or exclude hiring managers (false)"
          ),
        isCreator: z
          .boolean()
          .optional()
          .describe(
            "Filter by LinkedIn content creators and thought leaders who actively post and engage"
          ),
        isHeadstarterAffiliated: z
          .boolean()
          .optional()
          .describe(
            "Filter by Headstarter community members - people who have listed Headstarter experience on their LinkedIn profiles"
          ),
        city: z
          .string()
          .optional()
          .describe(
            "Filter by city name using partial matching (e.g., 'York' matches 'New York', 'York', 'Yorkshire')"
          ),
        country: z
          .string()
          .optional()
          .describe(
            "Filter by country name using partial matching (e.g., 'United' matches 'United States', 'United Kingdom')"
          ),
        company: z
          .string()
          .optional()
          .describe(
            "Filter by most recent company name using partial matching (e.g., 'Google' matches 'Google Inc', 'Google LLC')"
          ),
        school: z
          .string()
          .optional()
          .describe(
            "Filter by most recent school/university using partial matching (e.g., 'Stanford' matches 'Stanford University')"
          ),
        minFulltimeExperience: z
          .number()
          .optional()
          .describe(
            "Minimum number of full-time work experiences/positions (useful for finding experienced professionals)"
          ),
        minInternshipExperience: z
          .number()
          .optional()
          .describe(
            "Minimum number of internship experiences (useful for finding entry-level candidates with internship background)"
          ),
        limit: z
          .number()
          .optional()
          .default(25)
          .describe(
            "Maximum number of profiles to return (default: 25, max recommended: 100 for performance)"
          ),
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
              urn,
              username,
              first_name,
              last_name,
              headline,
              summary,
              city,
              country,
              is_open_to_work,
              is_hiring,
              is_creator,
              is_headstarter_affiliated,
              fulltime_count,
              internship_count,
              most_recent_company_name,
              most_recent_company_title,
              most_recent_company_logo,
              most_recent_company_year,
              most_recent_school,
              most_recent_school_degree,
              most_recent_school_year
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

          query = sql`${query} ORDER BY (fulltime_count + internship_count) DESC, last_name ASC LIMIT ${limit}`;

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
      "Get LinkedIn profiles from specific geographic locations with flexible location matching. Useful for regional talent sourcing, local networking, market research, and finding professionals in specific geographic areas. Supports both partial matching (default) for broader search (e.g., 'York' finds 'New York', 'Yorkshire') and exact matching for precise location filtering. Returns profiles with complete location details, professional status indicators, and recent company/role information. Ideal for recruiters focusing on specific markets, businesses expanding to new regions, or professionals looking to network locally.",
      {
        city: z
          .string()
          .optional()
          .describe(
            "City name to filter by. Supports partial matching by default (e.g., 'Francisco' matches 'San Francisco'). Leave empty to search all cities."
          ),
        country: z
          .string()
          .optional()
          .describe(
            "Country name to filter by. Supports partial matching by default (e.g., 'United' matches 'United States' and 'United Kingdom'). Leave empty to search all countries."
          ),
        exactMatch: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Use exact string matching instead of partial matching. Set to true for precise location filtering, false (default) for broader geographic search."
          ),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe(
            "Maximum number of profiles to return (default: 50). Consider lower limits for broad searches to avoid overwhelming results."
          ),
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
              urn,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              summary,
              most_recent_company_name,
              most_recent_company_title,
              most_recent_company_logo,
              most_recent_school,
              most_recent_school_degree,
              is_open_to_work,
              is_hiring,
              is_creator,
              is_headstarter_affiliated,
              fulltime_count,
              internship_count
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

          query = sql`${query} ORDER BY country ASC, city ASC, last_name ASC LIMIT ${limit}`;

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
      "Get LinkedIn profiles of people who are currently open to work opportunities. Essential tool for recruiters, hiring managers, and talent acquisition teams to find available candidates actively seeking employment. Returns profiles with comprehensive professional information including work history (fulltime_count, internship_count), current location, recent company experience, education background, and professional status indicators. Results are sorted by total experience level (most experienced first) to help prioritize qualified candidates. Supports additional filtering by location, company background, and minimum experience requirements for targeted talent sourcing.",
      {
        city: z
          .string()
          .optional()
          .describe(
            "Filter by city name using partial matching (e.g., 'Angeles' matches 'Los Angeles'). Useful for location-specific hiring."
          ),
        country: z
          .string()
          .optional()
          .describe(
            "Filter by country name using partial matching (e.g., 'Canada' matches profiles in Canada). Useful for geographic hiring constraints."
          ),
        company: z
          .string()
          .optional()
          .describe(
            "Filter by most recent company name using partial matching (e.g., 'Microsoft' matches 'Microsoft Corporation'). Useful for finding candidates with specific company experience."
          ),
        minExperience: z
          .number()
          .optional()
          .describe(
            "Minimum total experience level (sum of fulltime_count + internship_count). Use to filter for entry-level (0-1), mid-level (2-4), or senior-level (5+) candidates."
          ),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe(
            "Maximum number of profiles to return (default: 50). Consider higher limits for comprehensive talent pools, lower for focused searches."
          ),
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
              urn,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              summary,
              most_recent_company_name,
              most_recent_company_title,
              most_recent_company_logo,
              most_recent_company_year,
              most_recent_school,
              most_recent_school_degree,
              most_recent_school_year,
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

          query = sql`${query} ORDER BY (fulltime_count + internship_count) DESC, last_name ASC LIMIT ${limit}`;

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
      "Get LinkedIn profiles of people who are currently hiring and actively recruiting candidates. Essential tool for job seekers and business development to identify hiring managers and decision-makers. Returns complete company information and professional backgrounds sorted by company and seniority.",
      {
        city: z
          .string()
          .optional()
          .describe(
            "Filter by city name using partial matching. Useful for finding local hiring managers and in-person opportunities."
          ),
        country: z
          .string()
          .optional()
          .describe(
            "Filter by country name using partial matching. Useful for geographic job search or regional business development."
          ),
        company: z
          .string()
          .optional()
          .describe(
            "Filter by company name using partial matching (e.g., 'Amazon' matches 'Amazon Web Services', 'Amazon.com'). Useful for targeting specific employers or competitors."
          ),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe(
            "Maximum number of profiles to return (default: 50). Higher limits provide broader networking opportunities."
          ),
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
              urn,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              summary,
              most_recent_company_name,
              most_recent_company_username,
              most_recent_company_title,
              most_recent_company_logo,
              most_recent_company_year,
              fulltime_count,
              internship_count,
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

          query = sql`${query} ORDER BY most_recent_company_name ASC, (fulltime_count + internship_count) DESC, last_name ASC LIMIT ${limit}`;

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
      "Get LinkedIn profiles of content creators, thought leaders, and industry influencers who actively create professional content. Perfect for identifying collaboration partners, brand ambassadors, speakers, and industry experts with comprehensive professional backgrounds.",
      {
        city: z
          .string()
          .optional()
          .describe(
            "Filter by city name using partial matching. Useful for finding local creators for regional events or location-specific content."
          ),
        country: z
          .string()
          .optional()
          .describe(
            "Filter by country name using partial matching. Useful for geographic content strategy or regional thought leadership."
          ),
        company: z
          .string()
          .optional()
          .describe(
            "Filter by company name using partial matching. Useful for finding creators at specific companies or in particular industries."
          ),
        isHeadstarterAffiliated: z
          .boolean()
          .optional()
          .describe(
            "Filter by Headstarter community affiliation. True finds creators within the Headstarter ecosystem, useful for community-specific collaborations."
          ),
        limit: z
          .number()
          .optional()
          .default(50)
          .describe(
            "Maximum number of profiles to return (default: 50). Higher limits provide broader creator discovery opportunities."
          ),
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
              urn,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              summary,
              most_recent_company_name,
              most_recent_company_title,
              most_recent_company_logo,
              most_recent_company_year,
              most_recent_school,
              most_recent_school_degree,
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

          query = sql`${query} ORDER BY (fulltime_count + internship_count) DESC, last_name ASC LIMIT ${limit}`;

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
      "Get LinkedIn profiles of Headstarter community members including Fellows, program participants, employees, and mentors. Essential for community networking, alumni connections, and ecosystem mapping within the Headstarter network with comprehensive professional information.",
      {
        isOpenToWork: z
          .boolean()
          .optional()
          .describe(
            "Filter by Headstarter community members who are actively seeking job opportunities. Useful for internal recruiting or alumni job placement."
          ),
        isHiring: z
          .boolean()
          .optional()
          .describe(
            "Filter by Headstarter community members who are currently hiring. Useful for finding job opportunities within the Headstarter network or partnership opportunities."
          ),
        isCreator: z
          .boolean()
          .optional()
          .describe(
            "Filter by Headstarter community members who are also content creators. Useful for identifying potential ambassadors, speakers, or thought leaders within the community."
          ),
        city: z
          .string()
          .optional()
          .describe(
            "Filter by city name using partial matching. Useful for organizing local Headstarter meetups or finding regional community members."
          ),
        country: z
          .string()
          .optional()
          .describe(
            "Filter by country name using partial matching. Useful for international Headstarter community analysis or regional expansion planning."
          ),
        limit: z
          .number()
          .optional()
          .default(100)
          .describe(
            "Maximum number of profiles to return (default: 100). Higher limits provide comprehensive community mapping."
          ),
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
              urn,
              username,
              first_name,
              last_name,
              city,
              country,
              headline,
              summary,
              most_recent_company_name,
              most_recent_company_title,
              most_recent_company_logo,
              most_recent_company_year,
              most_recent_school,
              most_recent_school_degree,
              most_recent_school_year,
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

          query = sql`${query} ORDER BY (fulltime_count + internship_count) DESC, last_name ASC LIMIT ${limit}`;

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
          description:
            "LinkedIn Network database table schema and structure with detailed field information",
        },
        "linkedin-network-stats": {
          description:
            "LinkedIn Network statistics and overview including counts by professional status and geographic distribution",
        },
      },
      tools: {
        "linkedin-sql-query": {
          description:
            "Execute read-only SELECT queries against the LinkedIn Network table (hs_linkedin_network) with comprehensive profile data including personal information, professional status, location, experience counts, company details, and education information. Automatic LIMIT protection ensures performance. Only SELECT statements allowed for security.",
        },
        "get-linkedin-profile": {
          description:
            "Get a specific LinkedIn profile by username or URN with complete professional information including personal details, work status, location, experience metrics, current company information, and education background. Ideal for detailed profile analysis and targeted networking research.",
        },
        "search-linkedin-profiles": {
          description:
            "Advanced search of LinkedIn profiles with comprehensive filtering options including work status, professional attributes, geographic location, company/school affiliations, and experience levels. Perfect for talent sourcing, networking, recruitment, and business development with intelligent sorting by experience level.",
        },
        "get-profiles-by-location": {
          description:
            "Get LinkedIn profiles from specific geographic locations with flexible partial or exact matching. Essential for regional talent sourcing, local networking, market research, and geographic business expansion. Returns complete location and professional details.",
        },
        "get-open-to-work-profiles": {
          description:
            "Get LinkedIn profiles of people actively seeking job opportunities. Essential for recruiters and hiring managers to find available candidates with comprehensive professional backgrounds, sorted by experience level. Supports filtering by location, company background, and experience requirements.",
        },
        "get-hiring-profiles": {
          description:
            "Get LinkedIn profiles of people currently hiring and recruiting candidates. Essential for job seekers and business development to identify hiring managers and decision-makers. Returns complete company information and professional backgrounds sorted by company and seniority.",
        },
        "get-creator-profiles": {
          description:
            "Get LinkedIn profiles of content creators, thought leaders, and industry influencers who actively create professional content. Perfect for identifying collaboration partners, brand ambassadors, speakers, and industry experts with comprehensive professional backgrounds.",
        },
        "get-headstarter-affiliated-profiles": {
          description:
            "Get LinkedIn profiles of Headstarter community members including Fellows, program participants, employees, and mentors. Essential for community networking, alumni connections, and ecosystem mapping within the Headstarter network with comprehensive professional information.",
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
