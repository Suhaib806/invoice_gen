'use client';

import React, { useState } from 'react';
import Head from 'next/head';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Contact Us | InvoiceGen</title>
        <meta
          name="description"
          content="Get in touch with the InvoiceGen team. We'd love to hear from you."
        />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-100/60 via-purple-100/40 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 flex items-center justify-center">
        <section className="w-full mx-3 max-w-6xl bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-800 p-6 md:p-10 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-transparent rounded-full blur-2xl pointer-events-none print:hidden" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Heading, description, contact info */}
            <div>
              <header className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-purple-300">Contact Us</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
                  Questions, feedback, or partnership ideas? Send us a message and we’ll get back to you shortly.
                </p>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                <div className="rounded-xl p-4 border border-blue-100 dark:border-gray-800 bg-blue-50/60 dark:bg-gray-800/60">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                  <div className="font-semibold text-gray-900 dark:text-white break-words">support@example.com</div>
                </div>
                <div className="rounded-xl p-4 border border-blue-100 dark:border-gray-800 bg-blue-50/60 dark:bg-gray-800/60">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                  <div className="font-semibold text-gray-900 dark:text-white">+1 (555) 000-0000</div>
                </div>
                <div className="rounded-xl p-4 border border-blue-100 dark:border-gray-800 bg-blue-50/60 dark:bg-gray-800/60">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Hours</div>
                  <div className="font-semibold text-gray-900 dark:text-white">Mon–Fri, 9am–5pm</div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-700 dark:text-purple-300 mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full px-3 py-2 border border-blue-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                  >
                    Send Message
                  </button>
                </div>

                {submitted && (
                  <div className="p-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold shadow">
                    Message sent! We will get back to you soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ContactPage;

