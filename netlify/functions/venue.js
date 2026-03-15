export const handler = async (event, context) => {
  try {
    const SETLIST_KEY = process.env.SETLIST_FM_API_KEY;
    const SPOTIFY_CLIENT = process.env.SPOTIFY_CLIENT_ID;
    const SPOTIFY_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    if (!SETLIST_KEY || !SPOTIFY_CLIENT || !SPOTIFY_SECRET) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing API keys in Server Environment" }) };
    }

    // 1. Get Setlist Date (Let's use 2 days ago to ensure sets are fully logged globally)
    const date = new Date();
    date.setDate(date.getDate() - 2); 
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const formattedDate = `${dd}-${mm}-${yyyy}`;

    // Get max pages first
    const firstPageRes = await fetch(`https://api.setlist.fm/rest/1.0/search/setlists?date=${formattedDate}`, {
      headers: { 'Accept': 'application/json', 'x-api-key': SETLIST_KEY }
    });
    
    if (!firstPageRes.ok) {
      if (firstPageRes.status === 404) {
        return { statusCode: 404, body: JSON.stringify({ error: "No setlists found for date on Setlist.fm" }) };
      }
      return { statusCode: 500, body: JSON.stringify({ error: "Setlist API failed", status: firstPageRes.status }) };
    }

    const firstPageData = await firstPageRes.json();
    if (!firstPageData.setlist || firstPageData.setlist.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: "No setlists found for date" }) };
    }

    // Cap at 15 to keep random search within a safe limit
    const totalPages = Math.min(Math.ceil(firstPageData.total / firstPageData.itemsPerPage), 15); 
    
    let validSetlist = null;
    let attempts = 0;
    
    while (!validSetlist && attempts < 3) {
      attempts++;
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const pageRes = await fetch(`https://api.setlist.fm/rest/1.0/search/setlists?date=${formattedDate}&p=${randomPage}`, {
        headers: { 'Accept': 'application/json', 'x-api-key': SETLIST_KEY }
      });
      
      if (pageRes.ok) {
        const pageData = await pageRes.json();
        const setlists = pageData.setlist || [];
        const setlistsWithSongs = setlists.filter(s => {
           if (!s.sets || !s.sets.set || s.sets.set.length === 0) return false;
           // Check if at least one set has a song
           return s.sets.set.some(set => set.song && set.song.length > 0);
        });
        
        if (setlistsWithSongs.length > 0) {
          validSetlist = setlistsWithSongs[Math.floor(Math.random() * setlistsWithSongs.length)];
        }
      }
    }

    if (!validSetlist) {
      return { statusCode: 404, body: JSON.stringify({ error: "Could not find any setlists with recorded songs after trying." }) };
    }

    // 2. Parse Valid Setlist
    const artistName = validSetlist.artist.name;
    const venueName = validSetlist.venue?.name || "Unknown Venue";
    const cityName = validSetlist.venue?.city?.name || "Unknown City";
    const countryName = validSetlist.venue?.city?.country?.name || "Unknown Country";
    const latitude = validSetlist.venue?.city?.coords?.lat;
    const longitude = validSetlist.venue?.city?.coords?.long;

    // Build flat song list
    const songs = [];
    validSetlist.sets.set.forEach(set => {
      const isEncore = !!set.encore;
      set.song.forEach(song => {
        if (song.name) {
          songs.push({ name: song.name, isEncore });
        }
      });
    });

    // 3. Spotify Track Integration (Building a playlist mapped to the setlist)
    let spotifyData = null;
    try {
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + Buffer.from(`${SPOTIFY_CLIENT}:${SPOTIFY_SECRET}`).toString("base64")
        },
        body: "grant_type=client_credentials"
      });
      const tokenData = await tokenRes.json();
      const token = tokenData.access_token;

      if (token) {
        // Find the artist first to narrow down track searches
        const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const searchData = await searchRes.json();
        const artist = searchData.artists?.items?.[0];

        if (artist) {
          // Fetch all songs efficiently in parallel to avoid serverless function timeouts
          const trackPromises = songs.map(async (song) => {
            const trackQuery = `${song.name} ${artistName}`;
            try {
              const trackSearchRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(trackQuery)}&type=track&limit=1`, {
                headers: { "Authorization": `Bearer ${token}` }
              });
              
              if (trackSearchRes.ok) {
                const tData = await trackSearchRes.json();
                const track = tData.tracks?.items?.[0];
                if (track) {
                   return {
                     name: track.name,
                     id: track.id,
                     url: track.external_urls?.spotify
                   };
                }
              }
            } catch (err) {
              console.error(`Error fetching track: ${song.name}`, err);
            }
            return null; // Return null if not found or failed
          });

          // Wait for all fetches to complete, then filter out the null/missing tracks
          const results = await Promise.all(trackPromises);
          const matchedTracks = results.filter(t => t !== null);

          if (matchedTracks.length > 0) {
            spotifyData = {
              artist: artist.name,
              artistUrl: artist.external_urls?.spotify,
              tracks: matchedTracks
            };
          }
        }
      }
    } catch (e) {
      console.error("Spotify API Error:", e.message);
    }

    // Send payload
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artist: artistName,
        venue: {
          name: venueName,
          city: cityName,
          country: countryName,
          lat: latitude,
          lng: longitude
        },
        songs,
        spotify: spotifyData
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message })
    };
  }
};
