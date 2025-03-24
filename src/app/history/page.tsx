'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format, subDays, subMonths } from 'date-fns';
import ThemeToggle from '@/components/ThemeToggle';

interface Entry {
  _id: string;
  date: string;
  mood: { value: number; label: string };
  activity: { value: number; label: string };
  sweetFood: { value: number; label: string };
}

type TimeRange = 'week' | 'month' | 'year';

export default function History() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  useEffect(() => {
    fetchEntries();
  }, []);
  
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/entries');
      
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError('Failed to load your tracking history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const getFilteredEntries = () => {
    const now = new Date();
    let startDate: Date;
    
    switch(timeRange) {
      case 'week':
        startDate = subDays(now, 7);
        break;
      case 'month':
        startDate = subMonths(now, 1);
        break;
      case 'year':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subDays(now, 7);
    }
    
    return entries
      .filter(entry => new Date(entry.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        ...entry,
        formattedDate: format(new Date(entry.date), 'MMM dd')
      }));
  };
  
  const filteredEntries = getFilteredEntries();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">History</h1>
              <p className="text-gray-600 dark:text-gray-400">View your tracking history and trends</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Loading your data...</div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">History</h1>
              <p className="text-gray-600 dark:text-gray-400">View your tracking history and trends</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">History</h1>
            <p className="text-gray-600 dark:text-gray-400">View your tracking history and trends</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-8">
          {/* Time Range Selector */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Past Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Past Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Past Year
            </button>
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={filteredEntries}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="formattedDate" 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#F3F4F6'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="mood.value" 
                    name="Mood" 
                    stroke="#6366F1" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activity.value" 
                    name="Activity" 
                    stroke="#10B981" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sweetFood.value" 
                    name="Sweet Food" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Mood
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sweet Food
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEntries.map((entry) => (
                    <tr key={entry._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {format(new Date(entry.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {entry.mood.label} ({entry.mood.value})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {entry.activity.label} ({entry.activity.value})
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {entry.sweetFood.label} ({entry.sweetFood.value})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 