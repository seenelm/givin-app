import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faMoneyBillWave, 
  faUsers, 
  faBullseye,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import type { DonationMetrics } from '../utils/openaiClient';
// import type { DonationData } from '../utils/supabaseClient';

interface DonationMetricsPanelProps {
  metrics: DonationMetrics | null;
  isLoading: boolean;
}

const DonationMetricsPanel: React.FC<DonationMetricsPanelProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="metrics-panel loading">
        <div className="metrics-spinner"></div>
        <p>Analyzing your donation data...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="metrics-panel empty">
        <FontAwesomeIcon icon={faChartLine} size="2x" />
        <h3>No Metrics Available</h3>
        <p>Import your donation data to see AI-generated metrics and insights.</p>
      </div>
    );
  }

  return (
    <div className="metrics-panel">
      <div className="metrics-header">
        <h2>Donation Metrics</h2>
        <p className="metrics-subtitle">AI-generated insights from your donation data</p>
      </div>

      <div className="metrics-grid">
        {/* Key metrics */}
        <div className="metric-card">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
          <div className="metric-content">
            <h3>Total Donations</h3>
            <div className="metric-value">${metrics.totalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
            <div className="metric-detail">{metrics.totalDonations} donations</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="metric-content">
            <h3>Donor Retention</h3>
            <div className="metric-value">{(metrics.donorRetentionRate * 100).toFixed(1)}%</div>
            <div className="metric-detail">of donors are returning</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <FontAwesomeIcon icon={faBullseye} />
          </div>
          <div className="metric-content">
            <h3>Growth Rate</h3>
            <div className="metric-value">{(metrics.growthRate * 100).toFixed(1)}%</div>
            <div className="metric-detail">compared to previous period</div>
          </div>
        </div>
      </div>

      {/* Top campaigns */}
      <div className="metrics-section">
        <h3>Top Campaigns</h3>
        <div className="campaigns-list">
          {metrics.topCampaigns.map((campaign, index) => (
            <div key={index} className="campaign-item">
              <div className="campaign-name">{campaign.name}</div>
              <div className="campaign-amount">${campaign.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
              <div className="campaign-bar">
                <div 
                  className="campaign-bar-fill" 
                  style={{ 
                    width: `${(campaign.amount / metrics.topCampaigns[0].amount) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donation trends */}
      <div className="metrics-section">
        <h3>Donation Trends</h3>
        <div className="trends-chart-container">
          <div className="trends-chart-grid">
            {/* Grid background */}
          </div>
          <div className="trends-chart-dots">
            {metrics.donationTrends.map((trend, index) => {
              // Calculate position
              const xPosition = (index / (metrics.donationTrends.length - 1)) * 100;
              const maxAmount = Math.max(...metrics.donationTrends.map(t => t.amount));
              const yPosition = 100 - ((trend.amount / maxAmount) * 100);
              
              return (
                <div 
                  key={index} 
                  className="trend-dot-container"
                  style={{
                    left: `${xPosition}%`,
                    bottom: `${100 - yPosition}%`
                  }}
                >
                  <div className="trend-dot" />
                  <div className="trend-dot-label">${trend.amount.toLocaleString()}</div>
                  {/* <div className="trend-dot-connector" 
                    style={{
                      width: index > 0 ? '100%' : '0',
                      // Connect to previous dot
                      transform: index > 0 ? `rotate(${Math.atan2(
                        yPosition - (100 - ((metrics.donationTrends[index-1].amount / maxAmount) * 100)),
                        xPosition - ((index - 1) / (metrics.donationTrends.length - 1)) * 100
                      ) * (180 / Math.PI)}deg)` : 'none'
                    }}
                  /> */}
                </div>
              );
            })}
          </div>
          <div className="trends-chart-labels">
            {metrics.donationTrends.map((trend, index) => (
              <div 
                key={`label-${index}`} 
                className="trend-period-label"
                style={{
                  left: `${(index / (metrics.donationTrends.length - 1)) * 100}%`,
                }}
              >
                {trend.period}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="metrics-section insights-section">
        <h3><FontAwesomeIcon icon={faLightbulb} /> AI Insights</h3>
        <ul className="insights-list">
          {metrics.insights.map((insight, index) => (
            <li key={index} className="insight-item">{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DonationMetricsPanel;
