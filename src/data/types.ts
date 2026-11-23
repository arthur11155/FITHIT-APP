export type GlucoseStatus = 'normal' | 'high' | 'low';

export interface GlucoseReading {
  id: number;
  value: number;
  date: string;
  time: string;
  period: string;
  status: GlucoseStatus;
}

export interface Hospital {
  id: number;
  name: string;
  specialty: string;
  distance: string;
  address: string;
  phone: string;
  open: boolean;
  rating: number;
  emergencyAvailable: boolean;
}

export interface UpcomingExam {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  preparacao: string;
}

export interface ExamResult {
  id: number;
  name: string;
  date: string;
  result: string;
  reference: string;
}

export interface ExamInfo {
  name: string;
  frequency: string;
  description: string;
  importance: string;
}

export type MealIcon = 'leaf' | 'cafe' | 'apple' | 'sunny' | 'restaurant' | 'moon';

export interface MealItem {
  name: string;
  carbs: number;
  calories: number;
}

export interface Meal {
  id: number;
  meal: string;
  time: string;
  icon: MealIcon;
  completed: boolean;
  items: MealItem[];
}

export interface NutritionTip {
  title: string;
  description: string;
  icon: MealIcon;
}

export interface User {
  name: string;
  email: string;
}
