import OpenAI from 'openai';
import type { DonationData } from './supabaseClient';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from the server
});

export interface DonationMetrics {
  totalDonations: number;
  totalAmount: number;
  averageDonation: number;
  topCampaigns: { name: string; amount: number }[];
  donationTrends: { period: string; amount: number }[];
  growthRate: number;
  donorRetentionRate: number;
  insights: string[];
}

/**
 * Generate metrics and insights from donation data using OpenAI
 */
export async function generateDonationMetrics(
  donations: DonationData[]
): Promise<DonationMetrics | null> {
  try {
    if (!donations.length) {
      console.error('No donation data provided');
      return null;
    }

    // Calculate basic metrics directly
    const totalDonations = donations.length;
    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const averageDonation = totalAmount / totalDonations;

    // Prepare data for OpenAI
    const donationSummary = JSON.stringify(donations);

    // Call OpenAI API to analyze the data
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert data analyst for nonprofit organizations. 
          Analyze the donation data provided and extract meaningful insights and metrics.
          Format your response as a JSON object with the following structure:
          {
            "topCampaigns": [{"name": string, "amount": number}], // Top 3 campaigns by donation amount
            "donationTrends": [{"period": string, "amount": number}], // Monthly or quarterly trends
            "growthRate": number, // Growth rate compared to previous periods if applicable
            "donorRetentionRate": number, // Percentage of repeat donors if applicable
            "insights": [string, string, string] // 3-5 key insights about the donation data
          }`
        },
        {
          role: "user",
          content: `Here is my nonprofit's donation data: ${donationSummary}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysisText = completion.choices[0].message.content;
    
    if (!analysisText) {
      throw new Error('No analysis received from OpenAI');
    }

    // Parse the AI-generated analysis
    const analysis = JSON.parse(analysisText);

    // Combine calculated metrics with AI analysis
    return {
      totalDonations,
      totalAmount,
      averageDonation,
      topCampaigns: analysis.topCampaigns || [],
      donationTrends: analysis.donationTrends || [],
      growthRate: analysis.growthRate || 0,
      donorRetentionRate: analysis.donorRetentionRate || 0,
      insights: analysis.insights || []
    };
  } catch (error) {
    console.error('Error generating metrics:', error);
    return null;
  }
}
