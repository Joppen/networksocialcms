import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://olbxkubhzydvgflmvrmz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sYnhrdWJoenlkdmdmbG12cm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MTM5NzMsImV4cCI6MjA1NTA4OTk3M30.WyMoQxXBAIm_rwonZchL28MN1QfYBUkPToVjj300Avk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
