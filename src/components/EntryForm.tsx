import { useState, useEffect } from 'react';
import { SELF_FEELING_LEVELS, ACTIVITY_LEVELS, SWEET_FOOD_LEVELS, OVEREATING_LEVELS, SLEEP_RECOVERY_LEVELS, LevelOption } from '@/lib/constants';
import LevelSelector from './LevelSelector';

interface EntryFormProps {
  onSubmit: (data: EntryData) => void;
  initialData?: EntryData;
  isLoading?: boolean;
}

export interface EntryData {
  date: string;
  selfFeeling: {
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
  overeating: {
    value: number;
    label: string;
  };
  sleepRecovery: {
    value: number;
    label: string;
  };
}

export default function EntryForm({ onSubmit, initialData, isLoading = false }: EntryFormProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<EntryData>({
    date: today,
    selfFeeling: SELF_FEELING_LEVELS[4], // Default to "okay"
    activity: ACTIVITY_LEVELS[0], // Default to "none"
    sweetFood: SWEET_FOOD_LEVELS[0], // Default to "none"
    overeating: OVEREATING_LEVELS[0], // Default to "not at all"
    sleepRecovery: SLEEP_RECOVERY_LEVELS[3], // Default to "okay"
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

  const handleLevelChange = (type: keyof Omit<EntryData, 'date'>, value: number) => {
    let levels: LevelOption[];
    
    switch (type) {
      case 'selfFeeling':
        levels = SELF_FEELING_LEVELS;
        break;
      case 'activity':
        levels = ACTIVITY_LEVELS;
        break;
      case 'sweetFood':
        levels = SWEET_FOOD_LEVELS;
        break;
      case 'overeating':
        levels = OVEREATING_LEVELS;
        break;
      case 'sleepRecovery':
        levels = SLEEP_RECOVERY_LEVELS;
        break;
      default:
        return;
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

        <LevelSelector 
          label="Self-Feeling"
          levels={SELF_FEELING_LEVELS}
          selectedValue={formData.selfFeeling.value}
          onChange={(value) => handleLevelChange('selfFeeling', value)}
          columns={5}
        />

        <LevelSelector 
          label="Activity"
          levels={ACTIVITY_LEVELS}
          selectedValue={formData.activity.value}
          onChange={(value) => handleLevelChange('activity', value)}
          columns={6}
        />

        <LevelSelector 
          label="Sweet Food"
          levels={SWEET_FOOD_LEVELS}
          selectedValue={formData.sweetFood.value}
          onChange={(value) => handleLevelChange('sweetFood', value)}
          columns={7}
        />

        <LevelSelector 
          label="Overeating"
          levels={OVEREATING_LEVELS}
          selectedValue={formData.overeating.value}
          onChange={(value) => handleLevelChange('overeating', value)}
          columns={6}
        />

        <LevelSelector 
          label="Sleep Recovery"
          levels={SLEEP_RECOVERY_LEVELS}
          selectedValue={formData.sleepRecovery.value}
          onChange={(value) => handleLevelChange('sleepRecovery', value)}
          columns={7}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
} 