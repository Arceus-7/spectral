export default function Setlist({ artist, songs }) {
  if (!songs || songs.length === 0) return null;

  const mainSet = songs.filter((s) => !s.isEncore);
  const encoreSet = songs.filter((s) => s.isEncore);

  return (
    <div className="setlist-container">
      <h2 className="setlist-artist">BAND: {artist}</h2>
      
      <ul className="song-list">
        {mainSet.map((song, i) => (
          <li key={i} className="song-item">{song.name}</li>
        ))}
      </ul>

      {encoreSet.length > 0 && (
        <>
          <div className="encore-divider">ENCORE_BLOCK</div>
          <ul className="song-list">
            {encoreSet.map((song, i) => (
              <li key={`encore-${i}`} className="song-item">{song.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
