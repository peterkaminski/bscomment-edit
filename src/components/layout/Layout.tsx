import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            bsComment Editor
          </h1>
          <p className="text-gray-600 mt-2">
            Edit HTML files on GitHub through metadata-driven identification
          </p>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          bsComment Editor - Automated HTML file editing for GitHub repositories
        </div>
      </footer>
    </div>
  );
}