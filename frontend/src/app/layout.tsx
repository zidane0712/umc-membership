"use client";
import "./globals.css";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=League+Gothic&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="flex items-center justify-between h-25 text-white shadow-md">
              <div className=" items-center gap-4 !ml-6">
                <p className="text-xl font-league mis-title tracking-wider !pt-5">
                  United Methodist Church
                </p>
                <p className="mis-title text-4xl !pb-5">
                  MEMBERSHIP INFORMATION SYSTEM
                </p>
              </div>
              <div className="flex items-center gap-4 !m-6">
                <p className="text-md">Welcome, John Doe</p>
                <button className="bg-white text-blue-600 px-3 py-1 rounded-md">
                  Logout
                </button>
              </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-1 p-6">
              {/* Sidebar (Dashboard) */}
              <aside
                className={`w-64 bg-white shadow-md h-screen transition-transform transform ${
                  isSidebarOpen ? "translate-x-0" : "translate-x-full"
                } absolute right-0 md:relative md:translate-x-0`}
              >
                <div className="p-4">
                  <h2 className="text-lg font-semibold">Dashboard</h2>
                  <ul className="mt-4 space-y-2">
                    <li className="p-2 bg-gray-200 rounded-md">Home</li>
                    <li className="p-2 bg-gray-200 rounded-md">Members</li>
                    <li className="p-2 bg-gray-200 rounded-md">Settings</li>
                  </ul>
                </div>
              </aside>

              {/* Main Section (Membership System) */}
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>

          {/* Sidebar Toggle Button */}
          <button
            className="fixed right-4 bottom-4 bg-blue-600 text-white p-2 rounded-full md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "Hide" : "Show"} Dashboard
          </button>
        </div>
      </body>
    </html>
  );
}
