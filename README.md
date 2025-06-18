# Echosigns

Echosigns is a modern video calling platform designed for the deaf and hard of hearing community, featuring sign language translation, learning resources, and accessible meeting tools.

![Landing Page Screenshot](src/assets/Meeting-Apps.png)

## Features

- **User Authentication**: Register and login securely with Firebase Authentication.
- **Video Meetings**: Create or join video meetings with sign language support (powered by Jitsi).
- **Schedule Management**: (Coming soon) Manage and schedule your meetings with calendar integration.
- **Learn Sign Language**: Interactive lessons and video demonstrations for American Sign Language (ASL).
- **Responsive & Accessible UI**: Built with Chakra UI for a clean, colorful, and accessible experience.
- **Social Links**: Connect with the community via GitHub, Twitter, and LinkedIn.

## Tech Stack

- **Frontend**: React (TypeScript & JavaScript)
- **UI Library**: Chakra UI
- **Authentication**: Firebase Auth
- **Video Conferencing**: Jitsi Meet SDK
- **State Management**: React Context API
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/echosigns.git
   cd echosigns
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Firebase Setup:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable **Email/Password** authentication.
   - Copy your Firebase config and update `src/firebase.js` accordingly.

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in your browser:**
   ```
   http://localhost:5173
   ```

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
VITE_BACKEND_URL=http://localhost:5000
```

For production deployment, set this to your backend URL (e.g., `https://your-backend.onrender.com`).

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
