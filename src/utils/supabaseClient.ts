import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Initialize the database by creating necessary tables if they don't exist
 * Note: This function only checks if the table exists. The actual table creation
 * must be done manually in the Supabase dashboard or via a migration script.
 */
export async function initializeDatabase(): Promise<{ success: boolean; error: string | null }> {
  try {
    // Check if the donations table exists
    const { error: checkError } = await supabase
      .from('donations')
      .select('id')
      .limit(1);
    
    // If we can query the table without error, it exists
    if (!checkError) {
      console.log('Donations table already exists');
      return { success: true, error: null };
    }
    
    // If we get here, the table doesn't exist
    console.error('Donations table does not exist. Please create it in the Supabase dashboard with the following structure:');
    console.error(`
      CREATE TABLE donations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        amount NUMERIC NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        campaign TEXT NOT NULL,
        donor_id TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX donations_donor_id_idx ON donations (donor_id);
      CREATE INDEX donations_campaign_idx ON donations (campaign);
      CREATE INDEX donations_date_idx ON donations (date);
    `);
    
    return { 
      success: false, 
      error: 'Donations table does not exist. Please create it in the Supabase dashboard.' 
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Define the donation data structure
export interface DonationData {
  amount: number;
  date: string; // ISO date string
  campaign: string;
  donor_id: string;
  metadata?: Record<string, any>;
}

// Function to store donation data in Supabase
export async function storeDonations(donations: DonationData[]): Promise<{
  success: boolean;
  count: number;
  error: string | null;
}> {
  try {
    console.log('Attempting to store donations:', donations.length);
    
    // Log the first donation for debugging
    if (donations.length > 0) {
      console.log('Sample donation:', JSON.stringify(donations[0], null, 2));
    }
    
    // Check if Supabase URL and key are set
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      return {
        success: false,
        count: 0,
        error: 'Missing Supabase credentials. Check your environment variables.'
      };
    }
    
    const { data, error } = await supabase
      .from('donations')
      .insert(donations)
      .select();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    console.log('Successfully stored donations:', data?.length || donations.length);
    
    return {
      success: true,
      count: donations.length,
      error: null
    };
  } catch (error) {
    console.error('Error storing donations:', error);
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Function to fetch donations from Supabase
export async function fetchDonations(): Promise<{
  data: DonationData[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*');
    
    if (error) throw error;
    
    return {
      data: data as DonationData[],
      error: null
    };
  } catch (error) {
    console.error('Error fetching donations:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
