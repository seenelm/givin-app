import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../utils/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the URL hash and query parameters
      const hash = window.location.hash;
      const query = window.location.search;

      try {
        // Process the callback URL
        if (hash || query) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          
          if (error) {
            console.error('Error exchanging code for session:', error);
            navigate('/login?error=auth-callback-failed');
            return;
          }
        }
        
        // Redirect to dashboard on successful authentication
        navigate('/dashboard');
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login?error=auth-callback-error');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="auth-callback-container">
      <div className="auth-callback-content">
        <h2>Completing login...</h2>
        <div className="auth-loading-spinner"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
