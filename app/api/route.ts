import OpenAI from "openai";
import { Logger } from "../utils/logger";

const logger = new Logger("API");

export async function POST(req: Request) {
  try {
    logger.info("Received POST request");

    const { prompt } = await req.json();
    logger.info("Parsed request body", { prompt });

    const client = new OpenAI();
    logger.debug("Initialized OpenAI client");

    logger.info("Sending request to OpenAI", {
      model: "gpt-4.1",
      serverLabel: "headstarter-mcp-server",
    });

    const formattedPrompt = `
    <INSTRUCTIONS>
    You are a helpful assistant that can help find information about Headstarter members.
    You have access to a database table called 'hs_linkedin_network' through the Headstarter MCP server with the following schema:

    - Basic Profile:
      * id (serial, primary key)
      * urn (varchar): LinkedIn URN
      * username (varchar, unique): LinkedIn username
      * first_name (varchar): First name
      * last_name (varchar): Last name
      * profile_picture (text): Profile picture URL
      * summary (text): Profile summary
      * headline (text): Profile headline

    - Professional Status:
      * is_creator (boolean): Whether this person is a creator
      * is_open_to_work (boolean): Whether this person is open to work
      * is_hiring (boolean): Whether this person is hiring
      * is_headstarter_affiliated (boolean): Whether person has Headstarter experience on LinkedIn

    - Location:
      * city (varchar): City location
      * country (varchar): Country location

    - Experience:
      * fulltime_count (integer): Number of full-time jobs
      * internship_count (integer): Number of internships
      * most_recent_company_name (varchar): Most recent company name
      * most_recent_company_username (varchar): Company's LinkedIn username
      * most_recent_company_logo (text): Company logo URL
      * most_recent_company_title (text): Current job title
      * most_recent_company_year (varchar): Job start year

    - Education:
      * most_recent_school (varchar): Most recent school name
      * most_recent_school_month (integer): Graduation month
      * most_recent_school_year (integer): Graduation year
      * most_recent_school_degree (text): Degree type

    You can use this schema to help answer questions about Headstarter members, their careers, education, and professional status.
    When responding, focus on providing relevant information based on the user's query.

    Do NOT include the most_recent_company_logo in your response.
    <INSTRUCTIONS>

    Here is the user's query:
    <USER_QUERY>
    ${prompt}
    </USER_QUERY>
    `;

    const resp = await client.responses.create({
      model: "gpt-4.1",
      tools: [
        {
          type: "mcp",
          server_label: "headstarter-mcp-server",
          server_url: "https://headstarter-mcp-server.vercel.app/sse",
          require_approval: {
            never: {
              tool_names: [
                "get-headstarter-affiliated-profiles",
                "search-linkedin-profiles",
                "linkedin-sql-query",
                "get-linkedin-profile",
              ],
            },
          },
        },
      ],
      input: formattedPrompt,
    });

    logger.info("Received response from OpenAI");
    logger.debug("OpenAI response details", {
      outputLength: resp.output_text?.length,
    });

    const response = Response.json({
      output: resp.output_text,
    });

    logger.info("Sending response to client");
    return response;
  } catch (error) {
    logger.error("Error processing request", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return Response.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
