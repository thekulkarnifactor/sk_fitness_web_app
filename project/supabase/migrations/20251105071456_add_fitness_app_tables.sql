/*
# Complete Fitness App Database Schema

Creates all tables in correct dependency order:
1. Base tables (cuisines, ingredients, signature_meals, orders)
2. User tables (user_profiles, user_meals, user_meal_ingredients, user_stats)
3. Relationships and modifications
*/

-- ========================================
-- STEP 1: Create Base Reference Tables
-- ========================================

-- Create cuisines table
CREATE TABLE IF NOT EXISTS cuisines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cuisine_id uuid REFERENCES cuisines(id) ON DELETE CASCADE,
  protein_per_100g decimal NOT NULL,
  carbs_per_100g decimal NOT NULL,
  fats_per_100g decimal NOT NULL,
  calories_per_100g integer NOT NULL,
  cost_per_100g decimal NOT NULL,
  is_vegetarian boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create signature_meals table
CREATE TABLE IF NOT EXISTS signature_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cuisine_id uuid REFERENCES cuisines(id),
  total_calories integer DEFAULT 0,
  total_protein decimal DEFAULT 0,
  total_carbs decimal DEFAULT 0,
  total_fats decimal DEFAULT 0,
  base_cost decimal DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  chef_notes text,
  tier text DEFAULT 'good',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ========================================
-- STEP 2: Create User Tables
-- ========================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  age integer,
  weight decimal,
  height decimal,
  activity_level text DEFAULT 'moderate',
  fitness_goal text DEFAULT 'maintain',
  daily_calories integer DEFAULT 2000,
  daily_protein integer DEFAULT 150,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_meals table
CREATE TABLE IF NOT EXISTS user_meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  meal_type text DEFAULT 'custom',
  signature_meal_id uuid REFERENCES signature_meals(id),
  total_calories integer DEFAULT 0,
  total_protein decimal DEFAULT 0,
  total_carbs decimal DEFAULT 0,
  total_fats decimal DEFAULT 0,
  total_cost decimal DEFAULT 0,
  tier text DEFAULT 'good',
  created_at timestamptz DEFAULT now()
);

-- Create user_meal_ingredients junction table
CREATE TABLE IF NOT EXISTS user_meal_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_meal_id uuid REFERENCES user_meals(id) ON DELETE CASCADE NOT NULL,
  ingredient_id uuid REFERENCES ingredients(id) NOT NULL,
  quantity integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE,
  calories_consumed integer DEFAULT 0,
  calories_burned integer DEFAULT 0,
  current_weight decimal,
  strength_index decimal DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ========================================
-- STEP 3: Modify Orders Table
-- ========================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'meal_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN meal_id uuid REFERENCES user_meals(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_address'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_time'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_time text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN total_amount decimal DEFAULT 0;
  END IF;
END $$;

-- ========================================
-- STEP 4: Enable Row Level Security
-- ========================================

-- Enable RLS on all tables
ALTER TABLE cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 5: Create RLS Policies - Public Tables
-- ========================================

-- Cuisines policies
CREATE POLICY "Anyone can view cuisines"
  ON cuisines FOR SELECT
  TO public
  USING (true);

-- Ingredients policies
CREATE POLICY "Anyone can view ingredients"
  ON ingredients FOR SELECT
  TO public
  USING (true);

-- Signature meals policies
CREATE POLICY "Anyone can view signature meals"
  ON signature_meals FOR SELECT
  TO public
  USING (true);

-- ========================================
-- STEP 6: Create RLS Policies - User Tables
-- ========================================

-- User profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User meals policies
CREATE POLICY "Users can view own meals"
  ON user_meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meals"
  ON user_meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON user_meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON user_meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User meal ingredients policies
CREATE POLICY "Users can view own meal ingredients"
  ON user_meal_ingredients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_meals
      WHERE user_meals.id = user_meal_ingredients.user_meal_id
      AND user_meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own meal ingredients"
  ON user_meal_ingredients FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_meals
      WHERE user_meals.id = user_meal_ingredients.user_meal_id
      AND user_meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own meal ingredients"
  ON user_meal_ingredients FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_meals
      WHERE user_meals.id = user_meal_ingredients.user_meal_id
      AND user_meals.user_id = auth.uid()
    )
  );

-- User stats policies
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Orders policies
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
