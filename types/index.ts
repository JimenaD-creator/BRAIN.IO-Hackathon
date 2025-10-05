// Types for NeuroTune Expo App

export type MoodType = "focus" | "chill" | "energy"

export interface EEGData {
  alpha: number // 8-13 Hz - relaxation
  beta: number // 13-30 Hz - focus/concentration
  theta: number // 4-8 Hz - meditation/creativity
  delta: number // 0.5-4 Hz - deep sleep
  gamma: number // 30-100 Hz - high cognitive activity
  timestamp: number
}

export interface BrainState {
  mood: MoodType
  intensity: number // 0-100
  quality: number // Signal quality 0-100
  eegData: EEGData
  isConnected: boolean
}

export interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: string
  duration: number
  imageUrl: string
  previewUrl?: string
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  tracks: SpotifyTrack[]
  imageUrl: string
}

export interface DeviceConfig {
  deviceName: string
  deviceId: string
  isConnected: boolean
  batteryLevel?: number
  signalQuality: number
}

export interface UserSettings {
  autoPlayEnabled: boolean
  moodSensitivity: number // 1-10
  preferredGenres: string[]
  volumeLevel: number
  notificationsEnabled: boolean
}
