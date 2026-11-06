import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://tatuuayrzlcfqebwtvgp.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdHV1YXlyemxjZnFlYnd0dmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NDIwMDIsImV4cCI6MjEwOTUxODAwMn0.FC50Dacu67VnCHeNaA6BhGNEC81MsibY2-XHPRIQOkQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
