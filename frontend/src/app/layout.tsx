"use client";
import "./globals.css";
import { useState } from "react";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Top Navigation Bar */}
            <nav
              className="flex items-center justify-between h-16 bg-[#0D0D0D] text-white shadow-md"
              style={{ paddingLeft: "16px", paddingRight: "16px" }}
            >
              <div
                className="flex items-center gap-4"
                style={{ marginLeft: "16px" }}
              >
                <a>
                  <Image
                    alt="UMC Membership Profile"
                    src="/favicon.ico"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                </a>
                <p>United Methodist Church Membership System</p>
              </div>
              <div
                className="flex items-center gap-4 mr-4"
                style={{ marginRight: "16px" }}
              >
                <p className="text-md">Welcome, John Doe</p>
                <button className="bg-white text-blue-600 px-3 py-1 rounded-md">
                  Logout
                </button>
              </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-1 p-16">
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
