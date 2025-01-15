[![Build Status](https://github.com/michaelschung/apod-map/actions/workflows/ci.yml/badge.svg)](https://github.com/michaelschung/apod-map/actions/workflows/ci.yml) ![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D23.3.0-brightgreen) ![License](https://img.shields.io/badge/license-GPL%20v3-blue)

# APOD Map

## Introduction

NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) (APOD) archive has been an inspiration for decades, teaching the public daily tidbits about the vast universe that we inhabit.

The photos posted to APOD are a mix of official NASA images from across its myriad historical and current missions, as well as many incredible photos taken by individuals in the wider astrophotography community. This web app seeks to appreciate the global scale of the APOD archive by visualizing its contributors on a map.

## Table of Contents

- [Technical overview](#technical-overview)
- [View the map!](#view-the-map)
- [Running locally](#running-locally)
- [License](#license)

## Technical overview:

- This app displays a calendar month of pins at a time, with a default of the current month.
- The month range is fed into NASA's [APOD API](https://api.nasa.gov/), which returns a JSON blob of APOD data.
- The JSON blob is then fed through the [OpenAI API](https://platform.openai.com/docs/overview), which does its best to extract location data.
- Finally, the location data is plotted onto the map as clickable pins.
- (Additionally, each month of processed data is stored in a Mongo Atlas database. Previously-processed months are fetched directly from the database to save on API calls.)

## View the map!

This app is publicly hosted as a [Render](https://render.com/) app -- feel free to [check it out here](https://apod-map.onrender.com/)!

Please note:
- This app spins down with inactivity, so it may take a while to boot up if no one's accessed it for a while.
- The app relies on the [OpenAI API](https://platform.openai.com/docs/overview) to extract location data. By default, this is using my personal API key, so apologies if that runs out of credits. In the future I may add an option to enter your own API key.

## Running locally

*Please note: Running APOD Map locally requires that you provide 1) your own OpenAI API key, 2) your own NASA API key, and 3) your own Mongo Atlas connection string.*

Clone this repo and enter the home folder.

```bash
$ git clone git@github.com:michaelschung/apod-map.git apod-map
$ cd apod-map
```

This project relies on three environment variables. Create a file `backend/.env` and provide the following three variables:

```dotenv
OPENAI_API_KEY="sk-EXAMPLE"
NASA_API_KEY="EXAMPLE"
MONGO_URI="mongodb+srv://EXAMPLE"
```

Run the provided `install:all` script to install dependencies for the entire project.

```bash
$ npm run install:all
```

From here, you can either:
1. [Run in development mode](#run-in-development-mode): Serve the frontend and backend separately for easier development and hot-reloading.
2. [Run in production mode](#run-in-production-mode): Build the frontend files and serve them via the backend for a single-port production deployment.

### Run in development mode

To spin up your own dev server, execute the `dev` script.

```bash
$ npm run dev
```

This will run the frontend and backend concurrently on two separate ports.
- The backend is a Node/Express server, running on `localhost:3000`.
- The frontend uses Vite for better ES moduling and hot-reloading, and serves the homepage on `localhost:5173`.

Once the servers start up, view the webpage by visiting [`localhost:5173`](http://localhost:5173/).

### Run in production mode

To build the static frontend files, run the `build` script.

```bash
$ npm run build
```

This executes `vite build` in `frontend/`, which generates static files and stores them in `frontend/dist/`.

Finally, run the `start` script to spin up the backend server on port 3000, which is already configured to serve the static files from `frontend/dist/`.

View the webpage by visiting [`localhost:3000`](http://localhost:3000/).

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](https://github.com/michaelschung/apod-map/blob/main/LICENSE) file for details.