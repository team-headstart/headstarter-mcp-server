# Headstarter LinkedIn Network MCP Server

A **Model Context Protocol (MCP) Server** that provides AI assistants with access to LinkedIn profile data from the Headstarter network. This server enables intelligent querying, searching, and analysis of LinkedIn profiles for recruiting, networking, and community building.

## Add to Cursor

1. Go to Cursor Settings
2. Click on "Tools & Integrations"
3. Click on "Add MCP Server"
4. Paste the following JSON into the "MCP Servers" field:

```json
{
  "mcpServers": {
    "Headstarter-MCP": {
      "url": "https://headstarter-mcp-server.vercel.app/sse"
    },
  }
}
```

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io) is a standardized way for AI applications to access external data and functionality. This server implements MCP to expose LinkedIn network data through tools and resources that AI assistants can use.

## Overview

This MCP server provides access to a database of LinkedIn profiles from the Headstarter community, including:

- **Personal Information**: Names, usernames, profile pictures, headlines
- **Work Status**: Open to work status, hiring status, creator status
- **Location Data**: Cities and countries
- **Professional Experience**: Full-time and internship counts
- **Education & Company Info**: Most recent schools and companies
- **Community Affiliation**: Headstarter network connections

## Available Tools

### Core Tools

- **`linkedin-sql-query`** - Execute read-only SELECT queries against the LinkedIn network table
- **`get-linkedin-profile`** - Get a specific profile by username or URN
- **`search-linkedin-profiles`** - Advanced search with multiple filter options

### Specialized Search Tools

- **`get-profiles-by-location`** - Find profiles by city or country
- **`get-open-to-work-profiles`** - Find people currently seeking opportunities
- **`get-hiring-profiles`** - Find people who are actively hiring
- **`get-creator-profiles`** - Find content creators and thought leaders
- **`get-headstarter-affiliated-profiles`** - Find Headstarter community members

## Available Resources

- **`linkedin-network-schema`** - Database table schema and structure
- **`linkedin-network-stats`** - Network statistics and overview

## Usage Examples

### Get Headstarter Alumni in New York

```
Use the get-headstarter-affiliated-profiles tool with city: "New York"
```

### Search for Hiring Managers at Tech Companies

```
Use the get-hiring-profiles tool with company: "Google" or "Meta"
```

### Custom SQL Queries

```
Use the linkedin-sql-query tool with:
query: "SELECT first_name, last_name, city, headline FROM hs_linkedin_network WHERE is_creator = true AND city ILIKE '%San Francisco%'"
```

## Deployment on Vercel

This server is built with Next.js and uses the [Vercel MCP Adapter](https://www.npmjs.com/package/@vercel/mcp-adapter).

### Requirements

- **Database**: PostgreSQL database with `hs_linkedin_network` table
- **Redis**: Required for SSE transport (available as `process.env.REDIS_URL`)
- **Fluid Compute**: Enable for efficient long-running queries

### Environment Variables

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### Deployment Steps

1. Set up your PostgreSQL database with LinkedIn profile data
2. Enable [Fluid compute](https://vercel.com/docs/functions/fluid-compute) in your Vercel project
3. Set `maxDuration` to 800 for Pro/Enterprise accounts in `app/[transport]/route.ts`
4. Configure environment variables
5. Deploy using the [MCP Next.js template](https://vercel.com/templates/next.js/model-context-protocol-mcp-with-next-js)

## Testing

Test your deployed server using the included client script:

```bash
node scripts/test-client.mjs https://your-deployment.vercel.app
```

Or use the MCP Inspector for interactive testing:

```bash
npx @modelcontextprotocol/inspector
```

## Security Features

- **Read-only Access**: Only SELECT queries are allowed for data security
- **Automatic LIMIT Protection**: Queries are automatically limited to prevent large result sets
- **Input Validation**: All parameters are validated using Zod schemas
- **Comprehensive Logging**: Full request/response logging for monitoring

## Use Cases

- **Networking**: Connect with Headstarter alumni in specific locations or companies
- **Market Research**: Analyze where Headstarter alumni are located and what companies they work for
- **Content Collaboration**: Find creators and thought leaders for collaborations

## Development

Built with:

- **Next.js 14** - Full-stack React framework
- **TypeScript** - Type-safe development
- **Drizzle ORM** - Database queries and schema management
- **@vercel/mcp-adapter** - MCP protocol implementation
- **Zod** - Runtime type validation

---

_This MCP server enables AI assistants to intelligently search and analyze LinkedIn profile data, making it easier to find the right people for opportunities, collaborations, and community building._
