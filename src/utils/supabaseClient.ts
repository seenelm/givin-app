import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Donor data interface
export interface DonorData {
  donorid: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  tp_guid?: string;
  created_at?: string;
}

// Gift data interface
export interface GiftData {
  giftid: string;
  donorid: string;
  totalamount: number;
  isrecurring: boolean;
  giftdate?: string;
  paymentmethod?: string;
  created_at?: string;
  giftsource?: string;
  iszakat?: boolean;
  campaign?: string;
  receiptnumber?: string;
  receiptpdf?: string;
  donor?: string;
}

/**
 * Verify database connection and table existence
 */
export async function initializeDatabase(): Promise<{ success: boolean; error: string | null }> {
  try {
    // Check if gifts table exists
    const { error } = await supabase
      .from('gifts')
      .select('giftid')
      .limit(1);
    
    if (error) {
      console.error('Database initialization error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('Database initialized successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('Database initialization exception:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Fetch all donors from the database
 */
export async function fetchDonors(): Promise<{
  data: DonorData[] | null;
  error: string | null;
}> {
  try {
    console.log('Fetching donors...');
    
    // Simple query to get all donors
    const { data, error } = await supabase
      .from('donors')
      .select();
    
    if (error) throw error;
    
    console.log(`Found ${data?.length || 0} donors`);
    return { data: data as DonorData[], error: null };
  } catch (error) {
    console.error('Error fetching donors:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch all gifts from the database
 */
export async function fetchGifts (): Promise<{
  data: GiftData[] | null;
  error: string | null;
}> {
  try {
    console.log('Fetching gifts...');
    
    // Query to get all gifts with donor information
    const { data, error } = await supabase
      .from('gifts')
      .select(`
        *,
        donors:donorid (
          firstname,
          lastname
        )
      `)
      .order('giftdate', { ascending: false });
    
    if (error) throw error;
    
    // Process the data to add the donor field
    const processedData = data?.map(gift => {
      const donorInfo = gift.donors as { firstname: string; lastname: string } | null;
      return {
        ...gift,
        donor: donorInfo ? `${donorInfo.firstname} ${donorInfo.lastname}`.trim() : '',
        donors: undefined // Remove the nested donors object
      };
    });
    
    console.log(`Found ${processedData?.length || 0} gifts`);
    return { data: processedData as GiftData[], error: null };
  } catch (error) {
    console.error('Error fetching gifts:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch a single donor by ID
 */
export async function fetchDonorById(id: string): Promise<{
  data: DonorData | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('donors')
      .select()
      .eq('donorid', id)
      .single();
    
    if (error) throw error;
    
    return { data: data as DonorData, error: null };
  } catch (error) {
    console.error(`Error fetching donor ${id}:`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch gifts for a specific donor
 */
export async function fetchGiftsByDonorId(donorId: string): Promise<{
  data: GiftData[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('gifts')
      .select()
      .eq('donorid', donorId);
    
    if (error) throw error;
    
    return { data: data as GiftData[], error: null };
  } catch (error) {
    console.error(`Error fetching gifts for donor ${donorId}:`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
