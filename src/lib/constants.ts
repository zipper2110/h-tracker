// Constants for data mappings

export interface LevelOption {
  value: number;
  label: string;
}

export const MOOD_LEVELS: LevelOption[] = [
  { value: 0, label: "totally awful" },
  { value: 1, label: "very bad" },
  { value: 2, label: "bad" },
  { value: 3, label: "not cool" },
  { value: 4, label: "okay" },
  { value: 5, label: "nice" },
  { value: 6, label: "good" },
  { value: 7, label: "great" },
  { value: 8, label: "superb" }
];

export const ACTIVITY_LEVELS: LevelOption[] = [
  { value: 0, label: "none" },
  { value: 1, label: "a bit" },
  { value: 2, label: "mild" },
  { value: 3, label: "good" },
  { value: 4, label: "intense" },
  { value: 5, label: "extreme" }
];

export const SWEET_FOOD_LEVELS: LevelOption[] = [
  { value: 0, label: "none" },
  { value: 1, label: "a tiny bit" },
  { value: 2, label: "small amount" },
  { value: 3, label: "medium amount" },
  { value: 4, label: "big chunk" },
  { value: 5, label: "a lot" },
  { value: 6, label: "over the top" }
]; 