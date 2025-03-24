'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { format, subMonths } from 'date-fns';
import ThemeToggle from '@/components/ThemeToggle';

interface Entry {
  _id: string;
  date: string;
  mood: { value: number; label: string };
  activity: { value: number; label: string };
  sweetFood: { value: number; label: string };
}

interface AverageData {
  name: string;
  value: number;
}

interface CorrelationData {
  x: number;
  y: number;
  z: number;
  name: string;
}

export default function Insights() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      setError('Failed to load your tracking data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Get entries from the last 3 months
  const getRecentEntries = () => {
    const startDate = subMonths(new Date(), 3);
    return entries.filter(entry => new Date(entry.date) >= startDate);
  };
  
  const recentEntries = getRecentEntries();
  
  // Calculate averages
  const calculateAverages = (): AverageData[] => {
    if (recentEntries.length === 0) return [];
    
    const moodSum = recentEntries.reduce((sum, entry) => sum + entry.mood.value, 0);
    const activitySum = recentEntries.reduce((sum, entry) => sum + entry.activity.value, 0);
    const sweetFoodSum = recentEntries.reduce((sum, entry) => sum + entry.sweetFood.value, 0);
    
    return [
      { name: 'Average Mood', value: parseFloat((moodSum / recentEntries.length).toFixed(1)) },
      { name: 'Average Activity', value: parseFloat((activitySum / recentEntries.length).toFixed(1)) },
      { name: 'Average Sweet Food', value: parseFloat((sweetFoodSum / recentEntries.length).toFixed(1)) }
    ];
  };
  
  // Group by day of week
  const getDayOfWeekData = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayData = daysOfWeek.map(day => ({
      name: day,
      mood: 0,
      activity: 0,
      sweetFood: 0,
      count: 0
    }));
    
    recentEntries.forEach(entry => {
      const date = new Date(entry.date);
      const dayIndex = date.getDay();
      
      dayData[dayIndex].mood += entry.mood.value;
      dayData[dayIndex].activity += entry.activity.value;
      dayData[dayIndex].sweetFood += entry.sweetFood.value;
      dayData[dayIndex].count++;
    });
    
    // Calculate averages
    return dayData.map(day => ({
      name: day.name,
      mood: day.count ? parseFloat((day.mood / day.count).toFixed(1)) : 0,
      activity: day.count ? parseFloat((day.activity / day.count).toFixed(1)) : 0,
      sweetFood: day.count ? parseFloat((day.sweetFood / day.count).toFixed(1)) : 0
    }));
  };
  
  // Create correlation data
  const getCorrelationData = (): CorrelationData[] => {
    return recentEntries.map(entry => ({
      x: entry.activity.value,
      y: entry.sweetFood.value,
      z: 1,
      name: format(new Date(entry.date), 'MMM dd')
    }));
  };
  
  // Generate insights text
  const generateInsights = () => {
    if (recentEntries.length < 7) {
      return "Not enough data to generate meaningful insights. Continue tracking for at least a week.";
    }
    
    const averages = calculateAverages();
    const dayData = getDayOfWeekData();
    
    // Find best and worst days
    const bestMoodDay = [...dayData].sort((a, b) => b.mood - a.mood)[0];
    const worstMoodDay = [...dayData].sort((a, b) => a.mood - b.mood)[0];
    
    // Check activity correlation
    const activeEntries = recentEntries.filter(e => e.activity.value >= 3);
    const inactiveEntries = recentEntries.filter(e => e.activity.value < 3);
    
    const avgMoodActive = activeEntries.length > 0 
      ? activeEntries.reduce((sum, e) => sum + e.mood.value, 0) / activeEntries.length 
      : 0;
      
    const avgMoodInactive = inactiveEntries.length > 0 
      ? inactiveEntries.reduce((sum, e) => sum + e.mood.value, 0) / inactiveEntries.length 
      : 0;
    
    // Check sweet food correlation
    const lowSugarEntries = recentEntries.filter(e => e.sweetFood.value <= 2);
    const highSugarEntries = recentEntries.filter(e => e.sweetFood.value > 2);
    
    const avgMoodLowSugar = lowSugarEntries.length > 0 
      ? lowSugarEntries.reduce((sum, e) => sum + e.mood.value, 0) / lowSugarEntries.length 
      : 0;
      
    const avgMoodHighSugar = highSugarEntries.length > 0 
      ? highSugarEntries.reduce((sum, e) => sum + e.mood.value, 0) / highSugarEntries.length 
      : 0;
    
    let insights = [];
    
    // Add general insights
    insights.push(`Your average mood is ${averages[0].value.toFixed(1)} out of 8.`);
    
    // Day of week insights
    if (bestMoodDay.mood > 0) {
      insights.push(`Your mood tends to be best on ${bestMoodDay.name}s (${bestMoodDay.mood.toFixed(1)}).`);
    }
    
    if (worstMoodDay.mood > 0 && worstMoodDay.name !== bestMoodDay.name) {
      insights.push(`Your mood tends to be lowest on ${worstMoodDay.name}s (${worstMoodDay.mood.toFixed(1)}).`);
    }
    
    // Activity correlation
    if (activeEntries.length > 0 && inactiveEntries.length > 0) {
      const diff = avgMoodActive - avgMoodInactive;
      if (diff > 1) {
        insights.push(`You tend to feel better on days with more physical activity (+${diff.toFixed(1)} mood points).`);
      } else if (diff < -1) {
        insights.push(`Interestingly, you tend to feel better on days with less physical activity (${Math.abs(diff).toFixed(1)} mood points higher).`);
      }
    }
    
    // Sweet food correlation
    if (lowSugarEntries.length > 0 && highSugarEntries.length > 0) {
      const diff = avgMoodLowSugar - avgMoodHighSugar;
      if (diff > 1) {
        insights.push(`You tend to feel better on days with less sweet food consumption (+${diff.toFixed(1)} mood points).`);
      } else if (diff < -1) {
        insights.push(`You tend to feel better on days with more sweet food consumption (+${Math.abs(diff).toFixed(1)} mood points).`);
      }
    }
    
    return insights.join(' ');
  };
  
  const averages = calculateAverages();
  const dayOfWeekData = getDayOfWeekData();
  const correlationData = getCorrelationData();
  const insights = generateInsights();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Analyzing your data...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        {error}
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Insights & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover patterns and trends in your tracking data</p>
        </div>
        <ThemeToggle />
      </div>
      
      {recentEntries.length < 5 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">Not enough data to generate meaningful insights.</p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Track for at least 5 days to see analytics.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Insights Panel */}
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-900 dark:text-indigo-200">AI-Powered Insights</h2>
            <p className="text-indigo-800 dark:text-indigo-100">{insights}</p>
          </div>
          
          {/* Averages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Averages</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={averages}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    domain={[0, 8]} 
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
                  <Bar dataKey="value" name="Average Value" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Day of Week Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Day of Week Analysis</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dayOfWeekData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    domain={[0, 8]} 
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
                  <Bar dataKey="mood" name="Mood" fill="#6366F1" />
                  <Bar dataKey="activity" name="Activity" fill="#10B981" />
                  <Bar dataKey="sweetFood" name="Sweet Food" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Correlation Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Activity vs Sweet Food Correlation</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Activity" 
                    domain={[0, 5]}
                    label={{ value: 'Activity Level', position: 'bottom', offset: 0 }}
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Sweet Food" 
                    domain={[0, 6]}
                    label={{ value: 'Sweet Food Consumption', angle: -90, position: 'insideLeft' }}
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <ZAxis type="number" dataKey="z" range={[100, 200]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#F3F4F6'
                    }}
                  />
                  <Scatter name="Your Data Points" data={correlationData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              This scatter plot shows the relationship between your physical activity level and sweet food consumption.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 