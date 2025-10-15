
  ## 🎧 NeuroTune

  NeuroTune is a brain-driven music application that connects your mind to your music.  
  By integrating EEG technology with the Spotify API, NeuroTune analyzes real-time brainwave data — 
  including beta, gamma, alpha, and theta frequencies — to detect the user's mental state 
  and automatically play the playlist that best matches their mood.

  ## 🧠 Concept

  Traditional music apps require users to manually select songs or playlists, interrupting workflow 
  and failing to reflect their current emotions.  
  NeuroTune eliminates this friction by syncing EEG brainwave patterns with Spotify playlists 
  in real time, adapting music to your focus, relaxation, or energy levels.

  ## ⚙️ Tech Stack

  - Frontend (App): React Native (TypeScript, Expo)
  - Backend: Python (Flask)
  - Brain Interface: Unicorn Hybrid Black EEG
  - API Integration: Spotify Web API
  - Signal Processing: NumPy, SciPy, MNE
  - Communication: REST / HTTP JSON

  ## 🧩 System Architecture

  [Unicorn EEG Device]
          ↓  (BLE)
  [Python Backend - EEG Processing]
          ↓  (HTTP/JSON)
  [Flask API]  ⇆  [Spotify API]
          ↓
  [React Native App - UI]

  - EEG Module (Python): Processes brainwave data, calculates beta/alpha/theta/gamma ratios, 
    and classifies emotional state.
  - Backend API (Flask): Sends mood and playlist data to the mobile app.
  - Mobile App (React Native): Displays playlists, controls playback, and reacts dynamically 
    to mental states.

  ## 🛠️ Installation & Setup

  1. Clone the repository:
     ```
     git clone https://github.com/<your-username>/neurotune.git
     cd neurotune
     ```

  2. Install dependencies (React Native App):
     ```
     cd app
     npm install
     npx expo start
     ```

  3. Install dependencies (Python Backend):
     ```
     cd backend
     python -m venv venv
     source venv/bin/activate  # or venv\Scripts\activate on Windows
     pip install -r requirements.txt
     python app.py
     ```

  4. Configure Spotify API:
     - Create a new app on [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
     - Copy your Client ID and Client Secret into a `.env` file inside the backend directory:
       ```
       SPOTIFY_CLIENT_ID=your_client_id
       SPOTIFY_CLIENT_SECRET=your_client_secret
       ```
  ## 🎮 Usage

  1. Start the Python backend to handle EEG input and Spotify API communication.  
  2. Launch the React Native app (Expo) on your phone or simulator.  
  3. The app displays playlists corresponding to the detected brain state (e.g., focus, calm, energy).  
  4. As EEG signals change, the app automatically updates the playlist in real time.

  ## 📊 Current Status

  ✅ EEG signal processing (simulated & real Unicorn data)  
  ✅ Spotify API integration (OAuth 2.0 + Client Credentials)  
  ✅ React Native interface with navigation and playlist visualization  
  🚧 Upcoming: real-time WebSocket sync and ML-based emotion classifier  

  ## 🌟 Future Work

  - Integrate machine learning for emotion recognition.  
  - Expand compatibility to other EEG devices (e.g., Muse, Emotiv).  
  - Enable hands-free navigation using BCI control patterns.  
  - Build a recommendation system for personalized neural music experiences.  

  ## 👥 Team G55

  - Ilan Gómez Guerrero  
  - María Guadalupe Soto Acosta  
  - Jimena Díaz Franco  
  - Gilberto Sagaón López  

  🎶 "Where your mind meets your music."

