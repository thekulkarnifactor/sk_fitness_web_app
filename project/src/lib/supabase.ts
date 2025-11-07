import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Cuisine {
  id: string;
  name: string;
  description: string;
}

export interface Ingredient {
  id: string;
  name: string;
  cuisine_id: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fats_per_100g: number;
  cost_per_100g: number;
  category: string;
}

export interface SignatureMeal {
  id: string;
  name: string;
  description: string;
  cuisine_id: string;
  image_url: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  base_price: number;
  is_active: boolean;
  chef_notes?: string;
  tier?: string;
  is_featured?: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  age: number;
  weight: number;
  height: number;
  activity_level: string;
  fitness_goal: string;
  daily_calories: number;
  daily_protein: number;
  created_at: string;
  updated_at: string;
}

export interface UserMeal {
  id: string;
  user_id: string;
  name: string;
  meal_type: string;
  signature_meal_id?: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  total_cost: number;
  tier: string;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  date: string;
  calories_consumed: number;
  calories_burned: number;
  current_weight: number;
  strength_index: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  meal_id: string;
  delivery_address: string;
  delivery_time: string;
  status: string;
  total_amount: number;
  created_at: string;
}
