import { Play } from 'lucide-react';

export default function SpotifyLink({ spotify }) {
  if (!spotify || !spotify.tracks || spotify.tracks.length === 0) return null;

  return (
    <div className="spotify-playlist-container">
      <div className="spotify-playlist-header">
        <span className="spotify-artist-name">&lt; {spotify.artist} &gt; // AUDIO_LOG</span>
      </div>
      
      <div className="spotify-tracks-list">
        {spotify.tracks.map((track, i) => (
          <a
            key={track.id}
            href={track.url || `spotify:track:${track.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-track-link"
          >
            <div className="spotify-icon" style={{ color: 'var(--accent-glow)' }}>
              <Play size={16} fill="currentColor" />
            </div>
            <span className="spotify-track-name">
              [{String(i + 1).padStart(2, '0')}] {track.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
