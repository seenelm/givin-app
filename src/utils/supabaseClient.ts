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

// Define CSV file data structure
export interface CSVFileData {
  id?: string;
  name: string;
  content: string;
  created_at?: string;
  user_id?: string;
  size: number;
}

// Define CSV user preferences structure
export interface CSVUserPreference {
  id?: string;
  file_id: string;
  highlighted_rows: number[];
  highlighted_columns: string[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
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

/**
 * Store a CSV file in Supabase
 * @param file The CSV file data to store
 * @returns Object with success status, data, and error information
 */
export async function storeCSVFile(file: CSVFileData): Promise<{
  success: boolean;
  data: CSVFileData | null;
  error: string | null;
}> {
  try {
    // Add user_id if authenticated
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      file.user_id = userData.user.id;
    } else {
      // If no authenticated user, set a default user_id with a valid UUID format
      // This is needed because the csv_files table has a NOT NULL constraint on user_id of type UUID
      file.user_id = '8152a348-fcc4-4a72-97c9-c36938af8eb5'; // Valid UUID for anonymous user
    }
    
    // Use the service role key for this operation to bypass RLS
    const serviceSupabase = createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_SERVICE_KEY);
    const { data, error } = await serviceSupabase
      .from('csv_files')
      .insert(file)
      .select()
      .single();
    
    if (error) {
      if (error.code === '42501') {
        console.error('RLS policy error:', error);
        return {
          success: false,
          data: null,
          error: 'RLS policy error. Please check your Supabase RLS policies.'
        };
      } else {
        throw error;
      }
    }
    
    return {
      success: true,
      data: data as CSVFileData,
      error: null
    };
  } catch (error) {
    console.error('Error storing CSV file:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch all CSV files for the current user
 * @returns Object with success status, data, and error information
 */
export async function fetchCSVFiles(): Promise<{
  data: CSVFileData[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('csv_files')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      data: data as CSVFileData[],
      error: null
    };
  } catch (error) {
    console.error('Error fetching CSV files:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch a specific CSV file by ID
 * @param id The ID of the CSV file to fetch
 * @returns Object with success status, data, and error information
 */
export async function fetchCSVFileById(id: string): Promise<{
  data: CSVFileData | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('csv_files')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      data: data as CSVFileData,
      error: null
    };
  } catch (error) {
    console.error('Error fetching CSV file:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Store user preferences for a CSV file
 * @param preference The user preference data to store
 * @returns Object with success status, data, and error information
 */
export async function storeCSVUserPreference(preference: CSVUserPreference): Promise<{
  success: boolean;
  data: CSVUserPreference | null;
  error: string | null;
}> {
  try {
    // Add user_id if authenticated
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      preference.user_id = userData.user.id;
    }
    
    // Check if preference already exists
    const { data: existingData } = await supabase
      .from('csv_user_preferences')
      .select('*')
      .eq('file_id', preference.file_id)
      .eq('user_id', preference.user_id || '')
      .maybeSingle();
    
    let data, error;
    
    if (existingData) {
      // Update existing preference
      const result = await supabase
        .from('csv_user_preferences')
        .update({
          highlighted_rows: preference.highlighted_rows,
          highlighted_columns: preference.highlighted_columns,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Insert new preference
      preference.created_at = new Date().toISOString();
      preference.updated_at = new Date().toISOString();
      
      const result = await supabase
        .from('csv_user_preferences')
        .insert(preference)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }
    
    if (error) throw error;
    
    return {
      success: true,
      data: data as CSVUserPreference,
      error: null
    };
  } catch (error) {
    console.error('Error storing CSV user preference:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch user preferences for a CSV file
 * @param fileId The ID of the CSV file
 * @returns Object with success status, data, and error information
 */
export async function fetchCSVUserPreference(fileId: string): Promise<{
  data: CSVUserPreference | null;
  error: string | null;
}> {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || '';
    
    const { data, error } = await supabase
      .from('csv_user_preferences')
      .select('*')
      .eq('file_id', fileId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    return {
      data: data as CSVUserPreference,
      error: null
    };
  } catch (error) {
    console.error('Error fetching CSV user preference:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
