import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { 
  addAuthorizedEmail, 
  listAuthorizedEmails, 
  removeAuthorizedEmail 
} from '../utils/supabaseClient';
import './styles/AuthAdmin.css';

interface AuthorizedEmail {
  id: number;
  email: string;
  created_at: string;
}

const AuthAdmin: React.FC = () => {
  const [emails, setEmails] = useState<AuthorizedEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is not logged in or not authorized
    if (!user) {
      navigate('/login');
    }
    
    fetchAuthorizedEmails();
  }, [user, navigate]);

  const fetchAuthorizedEmails = async () => {
    setLoading(true);
    try {
      const { data, error } = await listAuthorizedEmails();
      
      if (error) {
        throw new Error(error);
      }
      
      if (data) {
        setEmails(data);
      }
    } catch (err) {
      setError('Failed to fetch authorized emails');
      console.error('Error fetching authorized emails:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!newEmail || !newEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    try {
      const { success, error } = await addAuthorizedEmail(newEmail);
      
      if (error) {
        throw new Error(error);
      }
      
      if (success) {
        setSuccess(`${newEmail} has been added to authorized emails`);
        setNewEmail('');
        fetchAuthorizedEmails();
      }
    } catch (err) {
      setError('Failed to add email');
      console.error('Error adding email:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEmail = async (id: number, email: string) => {
    setError(null);
    setSuccess(null);
    
    if (window.confirm(`Are you sure you want to remove ${email} from authorized emails?`)) {
      setLoading(true);
      try {
        const { success, error } = await removeAuthorizedEmail(id);
        
        if (error) {
          throw new Error(error);
        }
        
        if (success) {
          setSuccess(`${email} has been removed from authorized emails`);
          fetchAuthorizedEmails();
        }
      } catch (err) {
        setError('Failed to remove email');
        console.error('Error removing email:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="auth-admin-container">
      <div className="auth-admin-content">
        <h1>Manage Authorized Emails</h1>
        <p className="auth-admin-description">
          Only users with emails in this list can log in to the application.
        </p>
        
        {error && <div className="auth-admin-error">{error}</div>}
        {success && <div className="auth-admin-success">{success}</div>}
        
        <div className="auth-admin-card">
          <h2>Add New Authorized Email</h2>
          <form onSubmit={handleAddEmail} className="auth-admin-form">
            <div className="form-group">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                disabled={loading}
                required
              />
              <button 
                type="submit" 
                className="add-email-button"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Email'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="auth-admin-card">
          <h2>Authorized Emails</h2>
          {loading && <p className="loading-text">Loading...</p>}
          
          {!loading && emails.length === 0 && (
            <p className="no-emails-text">No authorized emails found.</p>
          )}
          
          {!loading && emails.length > 0 && (
            <table className="emails-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Added On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((item) => (
                  <tr key={item.id}>
                    <td>{item.email}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>
                      <button
                        className="remove-email-button"
                        onClick={() => handleRemoveEmail(item.id, item.email)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthAdmin;
