// Constants for data mappings

export interface LevelOption {
  value: number;
  label: string;
}

export const SELF_FEELING_LEVELS: LevelOption[] = [
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

export const OVEREATING_LEVELS: LevelOption[] = [
  { value: 0, label: "not at all" },
  { value: 1, label: "a bit" },
  { value: 2, label: "moderately" },
  { value: 3, label: "on a larger side" },
  { value: 4, label: "a lot" },
  { value: 5, label: "over the top" }
];

export const SLEEP_RECOVERY_LEVELS: LevelOption[] = [
  { value: 0, label: "super-poorly" },
  { value: 1, label: "poorly" },
  { value: 2, label: "not cool" },
  { value: 3, label: "okay" },
  { value: 4, label: "nice" },
  { value: 5, label: "good" },
  { value: 6, label: "excellent" }
]; 