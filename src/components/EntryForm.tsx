import { useState, useEffect } from 'react';
import { MOOD_LEVELS, ACTIVITY_LEVELS, SWEET_FOOD_LEVELS, LevelOption } from '@/lib/constants';

interface EntryFormProps {
  onSubmit: (data: EntryData) => void;
  initialData?: EntryData;
  isLoading?: boolean;
}

export interface EntryData {
  date: string;
  mood: {
    value: number;
    label: string;
  };
  activity: {
    value: number;
    label: string;
  };
  sweetFood: {
    value: number;
    label: string;
  };
}

export default function EntryForm({ onSubmit, initialData, isLoading = false }: EntryFormProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<EntryData>({
    date: today,
    mood: MOOD_LEVELS[4], // Default to "okay"
    activity: ACTIVITY_LEVELS[0], // Default to "none"
    sweetFood: SWEET_FOOD_LEVELS[0], // Default to "none"
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLevelChange = (type: 'mood' | 'activity' | 'sweetFood', value: number) => {
    let levels: LevelOption[];
    
    switch (type) {
      case 'mood':
        levels = MOOD_LEVELS;
        break;
      case 'activity':
        levels = ACTIVITY_LEVELS;
        break;
      case 'sweetFood':
        levels = SWEET_FOOD_LEVELS;
        break;
    }
    
    const selectedLevel = levels.find(level => level.value === value) || levels[0];
    
    setFormData({
      ...formData,
      [type]: selectedLevel
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mood
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {MOOD_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleLevelChange('mood', level.value)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  formData.mood.value === level.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Physical Activity
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {ACTIVITY_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleLevelChange('activity', level.value)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  formData.activity.value === level.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sweet Food
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {SWEET_FOOD_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleLevelChange('sweetFood', level.value)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  formData.sweetFood.value === level.value
                    ? 'bg-red-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
} 