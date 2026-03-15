# What's Playing There

"What's Playing There" is a specialized website designed to act as a digital window into authentic, real-world live music events occurring around the globe. You open the website and it finds a real, randomly selected venue somewhere in the world that had a live show today or in the last 48 hours, pulled from Setlist.fm's live data. It shows you the venue’s name, city, country, capacity. It shows you the setlist, every song played, in order. It shows you the artist. You get a photo of the venue if available (sourced from their website or a static asset). If the artist is on Spotify, a 'Listen' button lets you play the song that was just performed. You don't scroll. You don't search. You just get one room. A 'Take me somewhere else' button gives you another. The design feels like pressing your ear against a wall and hearing music from the other side.
## Disclaimer

This project was built primarily for fun and exploration. It was created with the assistance of "vibecoding", i.e. using AI to refine parts of the codebase, as I am not entirely proficient in JSX, React, or Vite build configurations. As such, the code may contain unconventional patterns or structure, but since it gets the job done I did not bother refining it further, any comments or suggestions are welcome where I can improve it.

## Architecture

*   **Frontend**: React configured with Vite.
*   **Styling**: Vanilla CSS utilizing Flexbox, custom scrollbars, and a VT323 pixel font.
*   **Backend Proxy**: Netlify Serverless Functions (`netlify/functions`).
*   **Data Sources**: Setlist.fm API and Spotify Web API (Client Credentials flow).

## Prerequisites

To run this application, you must acquire free API keys from the following services:

1.  **Setlist.fm API Key**: Register at [Setlist.fm Developer Settings](https://www.setlist.fm/settings/api).
2.  **Spotify Client ID & Secret**: Register an application at the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

## Local Development Setup

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```

2.  Create an environment variables file. Copy the provided example file:
    ```bash
    cp .env.example .env
    ```

3.  Open the newly created `.env` file and insert your API credentials.

4.  Start the local Netlify development server:
    ```bash
    npx netlify dev
    ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
