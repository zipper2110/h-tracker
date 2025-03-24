import { LevelOption } from '@/lib/constants';

interface LevelSelectorProps {
  label: string;
  levels: LevelOption[];
  selectedValue: number;
  onChange: (value: number) => void;
  columns?: number;
}

export default function LevelSelector({ 
  label, 
  levels, 
  selectedValue, 
  onChange,
  columns = 5
}: LevelSelectorProps) {
  // Generate grid columns class based on provided columns
  const getGridColumnsClass = () => {
    switch (columns) {
      case 5: return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5';
      case 6: return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6';
      case 7: return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-7';
      default: return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className={`grid ${getGridColumnsClass()} gap-2`}>
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              selectedValue === level.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
} 