import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.https://asksguycdiygwqkzjenn.supabase.co
const supabaseKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFza3NndXljZGl5Z3dxa3pqZW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODYxNjcsImV4cCI6MjA3OTk2MjE2N30.iNOoS-wChmigQmojOEd7y3OE1TApWzQ96LYT1H1tJMU


export const supabase = createClient(supabaseUrl, supabaseKey)
