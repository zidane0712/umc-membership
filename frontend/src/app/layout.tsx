"use client";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";

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
          <div className="flex-1 flex flex-col">
            <Navbar />

            <div className="flex flex-1 p-6">
              <Sidebar isSidebarOpen={isSidebarOpen} />
              <MainContent>{children}</MainContent>
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
