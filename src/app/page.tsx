'use client';

import { useState } from 'react';
import EntryForm, { EntryData } from '@/components/EntryForm';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: EntryData) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save entry');
      }
      
      setMessage({
        text: 'Entry saved successfully!',
        type: 'success'
      });
      
      // Refresh the page data
      router.refresh();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving entry:', error);
      setMessage({
        text: 'Failed to save entry. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">H-Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your daily mood, activity, and sweet food consumption</p>
          </div>
          <ThemeToggle />
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('success') 
              ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <EntryForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href="/history" 
            className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">View History</h2>
            <p className="text-gray-600 dark:text-gray-400">Check your past entries and trends</p>
          </Link>
          <Link 
            href="/insights" 
            className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Get Insights</h2>
            <p className="text-gray-600 dark:text-gray-400">Discover patterns in your data</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
