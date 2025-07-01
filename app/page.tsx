// app/page.tsx
"use client";

import { Logo } from "./components/logo";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-lg">
        <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse"></div>
            <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-20 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="divide-y divide-slate-700/50">
          <div className="p-6">
            <div className="space-y-6">
              {/* Title skeleton */}
              <div className="flex items-center space-x-3">
                <div className="h-6 bg-slate-700 rounded w-1/4 animate-pulse"></div>
                <div className="h-px flex-1 bg-slate-700/50"></div>
              </div>

              {/* Paragraph skeletons with different widths */}
              <div className="space-y-4">
                <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse delay-100"></div>
                <div className="h-4 bg-slate-700 rounded w-full animate-pulse delay-200"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse delay-300"></div>
              </div>

              {/* List skeleton */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-slate-700 rounded-full mt-1 animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-slate-700 rounded-full mt-1 animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-slate-700 rounded-full mt-1 animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>

              {/* Code block skeleton */}
              <div className="bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700/50">
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const predefinedQueries = [
    { text: "Headstarter members at Amazon in New York", icon: "🎯" },
    { text: "Headstarter members who are now Founders", icon: "🎓" },
    {
      text: "Headstarter members who attended New York University",
      icon: "🗽",
    },
  ];

  const handleChipClick = async (query: string) => {
    setPrompt(query);
    setIsLoading(true);
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await res.json();
      setResponse(data.output);
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrompt(value);

    // Only search if there's input
    if (value.trim()) {
      setIsLoading(true);
      try {
        const res = await fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: value }),
        });
        const data = await res.json();
        setResponse(data.output);
      } catch (error) {
        console.error("Error:", error);
        setResponse("An error occurred while processing your request.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Clear response if input is empty
      setResponse("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

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

          {/* AI Query Form */}
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto mb-12 mt-12 px-6"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <svg
                      className="h-6 w-6 text-slate-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={prompt}
                    onChange={handleInputChange}
                    placeholder="Find Headstarter members by company, location, etc."
                    className="w-full pl-16 pr-6 py-5 bg-slate-900/50 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-left text-lg"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                      <svg
                        className="animate-spin h-6 w-6 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Predefined Query Chips */}
          <div className="flex flex-col gap-3 items-center mt-8 mb-12 px-4 sm:px-0">
            {/* Top row with 2 chips */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
              {predefinedQueries.slice(0, 2).map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleChipClick(query.text)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 group sm:whitespace-nowrap w-full sm:w-auto"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {query.icon}
                  </span>
                  <span className="text-sm font-medium">{query.text}</span>
                </button>
              ))}
            </div>
            {/* Bottom row with 1 chip */}
            <div className="flex justify-center w-full">
              {predefinedQueries.slice(2, 3).map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleChipClick(query.text)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 group sm:whitespace-nowrap w-full sm:w-auto"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {query.icon}
                  </span>
                  <span className="text-sm font-medium">{query.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Loading State or Response */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : response ? (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-lg">
                <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <h3 className="text-sm font-medium text-slate-300">
                      Search Results
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-slate-700/50 transition-all duration-200"
                      title="Copy to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-emerald-400 font-medium">
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-slate-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          <span className="text-sm text-slate-400 font-medium">
                            Copy
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-slate-700/50">
                  <div className="p-6 text-left">
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="text-slate-300 mb-4 last:mb-0">
                              {children}
                            </p>
                          ),
                          h1: ({ children }) => (
                            <div className="flex items-center space-x-3 mb-6">
                              <h1 className="text-2xl font-bold text-white">
                                {children}
                              </h1>
                              <div className="h-px flex-1 bg-slate-700"></div>
                            </div>
                          ),
                          h2: ({ children }) => (
                            <div className="flex items-center space-x-3 mb-4 mt-8">
                              <h2 className="text-xl font-bold text-white">
                                {children}
                              </h2>
                              <div className="h-px flex-1 bg-slate-700/50"></div>
                            </div>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-bold text-white mb-3 mt-6">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="space-y-3 mb-6 text-slate-300">
                              {children}
                            </ul>
                          ),
                          li: ({ children }) => (
                            <li className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{children}</span>
                            </li>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                          code: ({ children }) => (
                            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-sm text-slate-200 font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-slate-800/50 px-4 py-3 rounded-lg overflow-x-auto mb-6 border border-slate-700/50 text-sm">
                              {children}
                            </pre>
                          ),
                          img: ({ src, alt }) => (
                            <img
                              src={src}
                              alt={alt}
                              className="max-w-full h-auto rounded-lg my-4 mx-auto"
                              style={{
                                maxHeight: "400px",
                                objectFit: "contain",
                              }}
                            />
                          ),
                        }}
                      >
                        {response}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-8">
            About Headstarter MCP
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed">
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
