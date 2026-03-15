import { useState, useEffect } from 'react';
import './index.css';
import VenueCard from './components/VenueCard';
import Setlist from './components/Setlist';
import SpotifyLink from './components/SpotifyLink';
import BackgroundDecal from './components/BackgroundDecal';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fading, setFading] = useState(false);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/venue');
      if (!response.ok) {
        throw new Error('Connection lost. The night is quiet.');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenue();
  }, []);

  const handleNext = () => {
    if (loading) return;
    setFading(true);
    setTimeout(() => {
      fetchVenue().then(() => setFading(false));
    }, 400); 
  };

  return (
    <>
      <BackgroundDecal />
      
      <div className="app-container">
        
        <div className="desktop-layout">
          
          {loading && !data && (
            <div className="retro-window main-window fade-in" style={{ maxWidth: '400px' }}>
              <div className="window-header">
                <span className="window-title">C:\EXECUTE.EXE</span>
              </div>
              <div className="window-content" style={{ padding: '3rem', alignItems: 'center' }}>
                <div className="loading-wrapper">
                  SEARCHING NETWORK<span className="blink">_</span>
                </div>
              </div>
            </div>
          )}

          {error && !data && (
            <div className="retro-window main-window fade-in" style={{ borderColor: 'var(--accent-glow)', maxWidth: '400px' }}>
               <div className="window-header" style={{ background: 'var(--accent-glow)' }}>
                <span className="window-title">FATAL ERROR</span>
              </div>
              <div className="window-content" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--accent-glow)', fontSize: '1.5rem', marginBottom: '2rem' }}>{error}</p>
                <button className="retro-btn" onClick={fetchVenue}>RETRY CONNECTION</button>
              </div>
            </div>
          )}

          {data && (
            <div className={`retro-window main-window ${fading ? 'fade-out' : 'fade-in'}`}>
              <div className="window-header">
                <span className="window-title">LIVE_FEED.EXE</span>
              </div>
              
              <div className="window-content">
                <VenueCard venue={data.venue} />
                <Setlist artist={data.artist} songs={data.songs} />
                
                <div className="footer-row">
                  {data.spotify && <SpotifyLink spotify={data.spotify} />}
                </div>

                <button 
                  className="retro-btn" 
                  onClick={handleNext} 
                  disabled={loading}
                >
                  {loading ? 'HACKING...' : 'REROUTE IP ADDRESS'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default App;
