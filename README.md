# Homevia

Homevia is a responsive real-estate discovery platform for browsing, mapping, saving, and scheduling visits to premium properties. It provides dedicated experiences for buyers and sellers while maintaining a consistent luxury visual design across desktop and mobile devices.

## Features

- Responsive layouts optimized for phones from 320px upward, tablets, and desktop displays
- Property browsing with search, category, price, bedroom, and sorting filters
- Grid, split, and interactive Map View modes
- Keyless OpenStreetMap street tiles and Esri World Imagery satellite tiles
- Address geocoding and support for legacy listings with missing or text-based coordinates
- Detailed property galleries, amenities, mortgage estimates, and seller information
- Interactive room-by-room virtual property tours
- Private viewing and live video tour booking
- Saved properties and personalized user dashboards
- Property listing creation and editing
- Firebase Authentication and Firestore synchronization
- Luxury Charcoal and Elegance Ivory themes

## Technology

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Firebase Authentication and Firestore
- Leaflet
- Motion
- Lucide React

## Requirements

- Node.js 22.x
- npm 10.x

## Local development

Install dependencies using the committed lockfile:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

The application is available at [http://localhost:3000](http://localhost:3000). The development server listens on all network interfaces, so it can also be tested from another device on the same network.

## Firebase configuration

Firebase client settings are read from `firebase-applet-config.json` in the project root. Configure the following values for your Firebase project:

```json
{
  "apiKey": "your-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.firebasestorage.app",
  "messagingSenderId": "your-sender-id",
  "appId": "your-app-id",
  "firestoreDatabaseId": "(default)"
}
```

Firestore security rules are provided in `firestore.rules`. Review and deploy them before using the application in production.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run lint` | Run TypeScript validation without emitting files |
| `npm run build` | Create an optimized production build in `dist` |
| `npm run preview` | Preview the production build locally |

## Maps and location data

Map View uses free, keyless providers:

- OpenStreetMap for street maps
- Esri World Imagery for satellite maps

New or edited listings are geocoded from their full address. Coordinates already stored as strings are normalized automatically, and older listings without coordinates are resolved when Map View loads. Map-provider attribution remains visible as required by the providers.

## Production build

Validate the application and create a production bundle:

```bash
npm run lint
npm run build
```

The generated static application is written to `dist`.

## Deploying to Vercel

The repository includes `vercel.json` with reproducible deployment settings:

- Framework: Vite
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback routing to `index.html`

Import the repository into Vercel and deploy it from the project root. Vercel will use Node.js 22 and the committed npm lockfile.

## Project structure

```text
src/
|-- components/       Reusable interface and modal components
|-- data/             Initial property listings
|-- lib/              Firebase setup and data operations
|-- utils/            Geocoding and virtual-tour utilities
|-- App.tsx           Main application state and composition
|-- index.css         Global styles and theme rules
|-- main.tsx          React entry point
`-- types.ts          Shared TypeScript models
```

## Map attribution

Property maps display attribution for OpenStreetMap contributors or Esri and its imagery contributors, depending on the selected map style.
