import { useState, useCallback, useEffect } from "react"
import { SpotifyAuthService } from "../services/spotifyAuth"
import { SpotifyApiService } from "../services/spotifyApi"
import type { SpotifyTrack, MoodType } from "../types"

export function useSpotify() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState<SpotifyTrack[]>([])
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = await SpotifyAuthService.getValidToken()
      setIsAuthenticated(!!token)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async () => {
    try {
      setIsLoading(true)
      await SpotifyAuthService.login()
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await SpotifyAuthService.logout()
      setIsAuthenticated(false)
      setCurrentTrack(null)
      setQueue([])
      setCurrentPlaylist(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // 🔄 Refrescar canción actual (con reintento si Spotify tarda)
  // Reemplaza la función refreshTrack
// En useSpotify.ts, modifica refreshTrack:
const refreshTrack = useCallback(async () => {
  if (!isAuthenticated) return

  try {
    const track = await SpotifyApiService.getCurrentTrack()
    const playback = await SpotifyApiService.getCurrentPlayback()

    setCurrentTrack(track)
    setIsPlaying(playback?.is_playing || false)

    // Intentar primero obtener la cola de Spotify
    const spotifyQueue = await SpotifyApiService.getQueue()
    if (spotifyQueue.length > 0) {
      setQueue(spotifyQueue)
    } else {
      // Fallback: obtener de la playlist actual
      const playlistTracks = await SpotifyApiService.getCurrentPlaylistTracks()
      setQueue(playlistTracks)
    }

  } catch (error) {
    console.error("Error refreshing track:", error)
  }
}, [isAuthenticated])

  // 🔀 Cambiar playlist según el mood
  const changeMoodPlaylist = useCallback(async (mood: MoodType) => {
  if (!isAuthenticated) return

  try {
    const playlists = await SpotifyApiService.getPlaylistsForMood(mood)
    if (playlists.length > 0) {
      const selectedPlaylist = playlists[0]
      const playlistUri = `spotify:playlist:${selectedPlaylist.id}`
      await SpotifyApiService.playPlaylist(playlistUri)
      setCurrentPlaylist(selectedPlaylist.id)

      // Esperar un poco para que empiece la reproducción
      setTimeout(() => refreshTrack(), 3000)
    }
  } catch (error) {
    console.error("Error changing mood playlist:", error)
  }
}, [isAuthenticated, refreshTrack])

  // ▶️ Pausar/Reanudar playback
  const togglePlayback = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      await SpotifyApiService.togglePlayback(!isPlaying)
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error("Error toggling playback:", error)
    }
  }, [isAuthenticated, isPlaying])

  // ⏭️ Siguiente canción (espera más tiempo antes de refrescar)
  const skipToNext = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      await SpotifyApiService.skipToNext()
      setTimeout(() => refreshTrack(), 2000) // Esperar más tiempo
    } catch (error) {
      console.error("Error skipping to next:", error)
    }
  }, [isAuthenticated, refreshTrack])

  // ⏮️ Canción anterior (igual, espera más)
  const skipToPrevious = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      await SpotifyApiService.skipToPrevious()
      setTimeout(() => refreshTrack(), 2000)
    } catch (error) {
      console.error("Error skipping to previous:", error)
    }
  }, [isAuthenticated, refreshTrack])

  return {
    isAuthenticated,
    isLoading,
    currentTrack,
    isPlaying,
    queue,
    currentPlaylist,
    login,
    logout,
    togglePlayback,
    skipToNext,
    skipToPrevious,
    refreshTrack,
    changeMoodPlaylist,
  }
}
