# APOD Map

Inspired by NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) archive. Very much a WIP.

## Run

From the home folder, run

```bash
npm run dev
```

The home folder's `package.json` is set up so that this concurrently runs the following two commands:

```bash
cd backend && node server.js
cd frontend && npm start
```

## Configuration

The backend is a Node/Express server, running on `localhost:3000`.
The frontend uses Vite for better ES moduling, etc., and serves the homepage on `localhost:5173`.
- Honestly, I don't fully understand Vite yet – using it only because it seems like OpenLayers prefers a bundler.

At some point I'm going to need to figure out how to deploy all this, but it seems like it should be fairly straightforward? 🙏