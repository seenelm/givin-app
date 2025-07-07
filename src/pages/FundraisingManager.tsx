import React, { useState, useEffect } from 'react';
import './styles/FundraisingManager.css';
// import './styles/Dashboard.css';
import Controls from '../components/controls/Controls';
import Stub from '../components/stub/Stub';
import fundraisingManagerStubProps from '../models/FundraisingManagerStub';
import { fetchGifts, type GiftData } from '../utils/supabaseClient';



const FundraisingManager: React.FC = () => {
  const [gifts, setGifts] = useState<GiftData[]>([]);

  useEffect(() => {
    const loadGifts = async () => {
      const { data, error } = await fetchGifts();
      if (error) {
        console.error('Error loading campaigns:', error);
      } else {
        setGifts(data || []);
      }
    };
    loadGifts();
  }, []);

  return (
    <div className="content-body fundraising-manager-container">
      <div className="manager-header">
        <h2>Fundraising Manager</h2>
        <p className="manager-description">
          Organize your fundraising campaigns, track donations, and manage donor relationships.
        </p>
      </div>

      <Controls
        filterOptions={{
          defaultOption: 'All Gifts',
          options: ['All Gifts', 'Recurring', 'One-time']
        }}
        onFilterChange={(option) => console.log(`Filter changed to: ${option}`)}
        onPrimaryAction={() => console.log('Create gift')}
      />

      <div className="campaigns-container">
        {gifts.length === 0 ? (
          // Empty state
          <Stub {...fundraisingManagerStubProps} />
        ) : (
          // Campaign list would go here
          <div className="campaign-list">
            {/* Campaign list implementation */}
            <table className="campaign-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Gift Amount</th>
                  <th>Gift Date</th>
                  <th>Payment Method</th>
                  <th>Gift Source</th>
                  <th>Recurring</th>
                  <th>Receipt Number</th>
                  <th>Receipt PDF</th>
                </tr>
              </thead>
              <tbody>
                {gifts.map(gift => (
                  <tr key={gift.giftid || Math.random().toString()}>
                    <td>{gift.donor}</td>
                    <td>{gift.totalamount}</td>
                    <td>{gift.giftdate}</td>
                    <td>{gift.paymentmethod}</td>
                    <td>{gift.giftsource}</td>
                    <td>{gift.isrecurring.toString()}</td>
                    <td>{gift.receiptnumber}</td>
                    <td>{gift.receiptpdf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundraisingManager;
