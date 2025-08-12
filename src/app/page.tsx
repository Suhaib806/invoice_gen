'use client'
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useEffect } from "react";

export default function Home() {
  // Handle redirect for static hosting
  useEffect(() => {
    // Check if we're on a static hosting platform and need to handle redirects
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      
      // If there's a redirect query parameter, handle it
      if (search.includes('?/')) {
        const redirectPath = search.replace('?/', '');
        if (redirectPath) {
          // Clean up the URL and navigate
          const cleanPath = redirectPath.replace(/~and~/g, '&');
          window.history.replaceState(null, '', cleanPath);
          
          // Navigate to the correct route
          if (cleanPath.startsWith('/invoices')) {
            window.location.href = cleanPath;
          }
        }
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>InvoiceGen | Professional Invoice Generator</title>
        <meta name="description" content="Create stunning, professional invoices in minutes. Streamline your billing process with InvoiceGen." />
      </Head>
      <main className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <section className="container mx-auto px-4 py-10 sm:py-16">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Professional Invoice
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Generator</span>
            </h1>
            <p className="text-base xs:text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Create stunning, professional invoices in minutes. Streamline your billing process
              with our modern, intuitive invoice generator designed for businesses of all sizes.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/invoices"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 xs:px-8 py-3 xs:py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 text-base sm:text-lg w-full md:w-2/5 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Your First Invoice</span>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Generate professional invoices in under 2 minutes with our streamlined interface.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Professional Design</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Choose from beautiful, customizable templates that make your business look professional.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Your data is protected with enterprise-grade security and automatic backups.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              Join thousands of businesses who trust InvoiceGen for their billing needs.
            </p>
            <Link
              href="/invoices"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 inline-block text-center text-base sm:text-lg"
            >
              Start Creating Invoices
            </Link>
          </section>
        </section>
      </main>
    </>
  );
}
