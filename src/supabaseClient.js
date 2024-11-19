import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqljcnotachrroeaetja.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbGpjbm90YWNocnJvZWFldGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNjk5NzUsImV4cCI6MjA0Njk0NTk3NX0.yHdk-lGpqmEPRCzXuGuqiTHQMZAOUer5AJeE3YeX2RY';
export const supabase = createClient(supabaseUrl, supabaseKey);
