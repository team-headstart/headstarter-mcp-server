// app/page.tsx
"use client";

import { Logo } from "./components/logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass-effect border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo
              className="h-8"
              onClick={() => (window.location.href = "/")}
            />
            <a
              href="https://github.com/team-headstart/headstarter-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-slate-400 font-medium hover:text-white transition-colors duration-200 group"
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>View Source</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 hero-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Headstarter MCP Server
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            A Model Context Protocol (MCP) Server that provides AI assistants
            with intelligent access to LinkedIn profile data from the
            Headstarter network. Enable powerful querying, searching, and
            analysis for recruiting, networking, and community building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("integration")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="relative z-10">Add to Cursor</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("tools")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group relative px-8 py-4 glass-effect hover:bg-slate-800/50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 border border-slate-700 hover:border-slate-600"
            >
              <span className="relative z-10">Explore Tools</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 glass-effect">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2 transition-transform duration-300 group-hover:scale-110">
                8
              </div>
              <div className="text-slate-300 font-medium">Search Tools</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2 transition-transform duration-300 group-hover:scale-110">
                2
              </div>
              <div className="text-slate-300 font-medium">Data Resources</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2 transition-transform duration-300 group-hover:scale-110">
                ∞
              </div>
              <div className="text-slate-300 font-medium">AI Queries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful LinkedIn Profile
              <span className="gradient-text"> Tools</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Access comprehensive LinkedIn profile data through specialized
              tools designed for different use cases.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Core Tools */}
            <div className="group relative glass-effect rounded-2xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                  <span className="text-white font-bold text-lg">SQL</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  Custom SQL Queries
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Execute advanced SELECT queries against the LinkedIn network
                  database with automatic LIMIT protection.
                </p>
                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                  linkedin-sql-query
                </div>
              </div>
            </div>

            <div className="group relative glass-effect rounded-2xl p-6 border border-slate-800 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                  <span className="text-white text-xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-300 transition-colors">
                  Profile Lookup
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Get specific LinkedIn profiles by username or URN with
                  complete professional information.
                </p>
                <div className="inline-block px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
                  get-linkedin-profile
                </div>
              </div>
            </div>

            <div className="group relative glass-effect rounded-2xl p-6 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                  <span className="text-white text-xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  Advanced Search
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Multi-filter search by work status, location, company,
                  experience level, and professional attributes.
                </p>
                <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30">
                  search-linkedin-profiles
                </div>
              </div>
            </div>

            {/* Specialized Tools */}
            <div className="group relative glass-effect rounded-2xl p-6 border border-slate-800 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                  <span className="text-white text-xl">📍</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-300 transition-colors">
                  Location-Based
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Find profiles by city or country with flexible partial
                  matching for regional talent sourcing.
                </p>
                <div className="inline-block px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-medium rounded-full border border-orange-500/30">
                  get-profiles-by-location
                </div>
              </div>
            </div>

            <div className="group relative glass-effect rounded-2xl p-6 border border-slate-800 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                  <span className="text-white text-xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-red-300 transition-colors">
                  Open to Work
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Find candidates actively seeking opportunities, perfect for
                  recruiters and hiring managers.
                </p>
                <div className="inline-block px-3 py-1 bg-red-500/20 text-red-300 text-xs font-medium rounded-full border border-red-500/30">
                  get-open-to-work-profiles
                </div>
              </div>
            </div>

            <div className="group relative glass-effect rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                  <span className="text-white text-xl">🏢</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  Currently Hiring
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Identify hiring managers and decision-makers for job
                  opportunities and business development.
                </p>
                <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/30">
                  get-hiring-profiles
                </div>
              </div>
            </div>

            <div className="group relative glass-effect rounded-2xl p-6 border border-slate-800 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                  <span className="text-white text-xl">⭐</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-pink-300 transition-colors">
                  Content Creators
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Find thought leaders and influencers for collaborations,
                  partnerships, and brand ambassadorships.
                </p>
                <div className="inline-block px-3 py-1 bg-pink-500/20 text-pink-300 text-xs font-medium rounded-full border border-pink-500/30">
                  get-creator-profiles
                </div>
              </div>
            </div>

            <div className="group relative glass-effect rounded-2xl p-6 border border-slate-800 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-300 transition-colors">
                  Headstarter Network
                </h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Connect with Headstarter Fellows, alumni, and community
                  members for networking and opportunities.
                </p>
                <div className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-medium rounded-full border border-yellow-500/30">
                  get-headstarter-affiliated-profiles
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integration" className="relative z-10 py-20 glass-effect">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Add to <span className="gradient-text">Cursor</span> in 3 Steps
            </h2>
            <p className="text-xl text-slate-300">
              Integrate with your AI assistant in minutes
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-6 p-6 glass-effect rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Open Cursor Settings
                </h3>
                <p className="text-slate-300">
                  Navigate to Settings → Tools & Integrations
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 glass-effect rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Add MCP Server
                </h3>
                <p className="text-slate-300 mb-4">
                  Click "Add MCP Server" and paste this configuration:
                </p>
                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">
                    {`{
  "mcpServers": {
    "Headstarter-MCP": {
      "url": "https://headstarter-mcp-server.vercel.app/sse"
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 glass-effect rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start Using
                </h3>
                <p className="text-slate-300">
                  Ask your AI assistant to search LinkedIn profiles, find hiring
                  managers, or analyze the Headstarter network!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Perfect <span className="gradient-text">For</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                Recruiters
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Find qualified candidates, analyze talent pools, and identify
                hiring managers across different companies and locations.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-green-300 transition-colors">
                Networkers
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Connect with professionals in your industry, find alumni in
                specific companies, and build meaningful relationships.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">
                Researchers
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Analyze market trends, study professional migration patterns,
                and understand industry landscapes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="gradient-text">Open Source</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            This MCP server is completely open source. View the code,
            contribute, or fork it for your own projects.
          </p>
          <a
            href="https://github.com/team-headstart/headstarter-mcp-server"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center space-x-3 px-8 py-4 glass-effect hover:bg-slate-800/50 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 border border-slate-700 hover:border-slate-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="relative z-10">View on GitHub</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 glass-effect text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Logo className="h-8" />
              </div>
              <p className="text-slate-400 leading-relaxed">
                Empowering AI assistants with intelligent LinkedIn profile
                access from the Headstarter community.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Headstarter Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
