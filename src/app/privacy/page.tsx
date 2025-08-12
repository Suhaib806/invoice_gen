'use client';

import React from 'react';
import Head from 'next/head';

const PrivacyPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | InvoiceGen</title>
        <meta
          name="description"
          content="Learn how InvoiceGen collects, uses, and protects your information."
        />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 flex items-center justify-center">
        <section className="w-full mx-3 max-w-4xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-800 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-transparent rounded-full blur-2xl pointer-events-none print:hidden" />

          <header className="mb-6 md:mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-purple-300">Privacy Policy</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your privacy matters. This policy explains what data we collect, why we collect it, and how we keep it safe.
            </p>
          
          </header>

          <div className="space-y-6">
            <section className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">Information We Collect</h2>
              <p className="text-gray-700 dark:text-gray-300">
                InvoiceGen primarily stores your invoice data locally in your browser using localStorage. This can include
                client names, contact information, invoice items, totals, and any notes you provide. If you upload a logo,
                it is stored as a data URL along with your invoice data.
              </p>
            </section>

            <section className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">How We Use Your Information</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Your data is used to generate, display, and export invoices. We do not sell your data. When exporting PDFs,
                we generate the document in your browser and do not transmit your invoice contents to a server.
              </p>
            </section>

            <section className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">Local Storage and Cookies</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We use browser localStorage to persist invoices and preferences (such as currency) on your device. We may
                use essential cookies for site functionality. You can clear your browser storage at any time, which will
                remove saved invoices and preferences.
              </p>
            </section>

            <section className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">Data Security</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We take reasonable measures to protect your information. Because your data is stored locally on your
                device, please ensure your device is secured and access is controlled.
              </p>
            </section>

            <section className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">Your Choices</h2>
              <p className="text-gray-700 dark:text-gray-300">
                You can edit or delete invoices at any time within the app. You can also clear your browser’s local
                storage to remove all saved data related to InvoiceGen.
              </p>
            </section>

            <section className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">Third-Party Services</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Our site may link to third-party resources. We are not responsible for the privacy practices of those
                websites. Please review their policies.
              </p>
            </section>

            <section className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have questions about this policy or your data, contact us at
                <span className="font-semibold"> support@example.com</span>.
              </p>
            </section>

            <section className="bg-blue-50/60 dark:bg-gray-800/60 rounded-xl p-6 border border-blue-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-purple-300 mb-2">Changes to This Policy</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We may update this Privacy Policy from time to time. We will post the new policy on this page and update
                the date above.
              </p>
            </section>
          </div>
        </section>
      </main>
    </>
  );
};

export default PrivacyPage;

