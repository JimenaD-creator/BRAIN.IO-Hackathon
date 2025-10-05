import { useState, useEffect } from "react"
import { SpotifyAuthService } from "../services/spotifyAuth"
import { SpotifyApiService } from "../services/spotifyApi"
import type { SpotifyTrack, MoodType } from "../types"

export function useSpotify() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => { checkAuth() }, [])

  const checkAuth = async () => {
    console.log("[v0] Checking authentication...")
    const authenticated = await SpotifyAuthService.isAuthenticated()
    console.log("[v0] Authenticated:", authenticated)
    setIsAuthenticated(authenticated)
    setIsLoading(false)
    if (authenticated) await loadCurrentTrack()
  }

  const skipToNext = async () => {
  if (!isAuthenticated) return
  await SpotifyApiService.skipToNext()
  setTimeout(loadCurrentTrack, 500)
}

const skipToPrevious = async () => {
  if (!isAuthenticated) return
  await SpotifyApiService.skipToPrevious()
  setTimeout(loadCurrentTrack, 500)
}


  const login = async () => {
    setIsLoading(true)
    console.log("[v0] Logging in...")
    const tokens = await SpotifyAuthService.login()
    console.log("[v0] Tokens login:", tokens)
    setIsAuthenticated(tokens !== null)
    setIsLoading(false)
    if (tokens) await loadCurrentTrack()
  }

  const logout = async () => {
    await SpotifyAuthService.logout()
    setIsAuthenticated(false)
    setCurrentTrack(null)
    setIsPlaying(false)
  }

  const loadCurrentTrack = async () => {
    console.log("[v0] Loading current track...")
    const token = await SpotifyAuthService.getValidToken()
    console.log("[v0] Token obtenido:", token)
    if (!token) return

    const track = await SpotifyApiService.getCurrentTrack()
    setCurrentTrack(track)

    const playback = await SpotifyApiService.getCurrentPlayback()
    setIsPlaying(playback?.is_playing || false)
  }

  const togglePlayback = async () => {
    if (!isAuthenticated) return
    await SpotifyApiService.togglePlayback(!isPlaying)
    setIsPlaying(!isPlaying)
  }

  const changeMoodPlaylist = async (mood: MoodType) => {
    if (!isAuthenticated) return
    const playlists = await SpotifyApiService.getPlaylistsForMood(mood)
    if (playlists.length > 0) {
      await SpotifyApiService.playPlaylist(`spotify:playlist:${playlists[0].id}`)
      setTimeout(loadCurrentTrack, 1000)
    }
  }

  return {
  isAuthenticated,
  isLoading,
  currentTrack,
  isPlaying,
  login,
  logout,
  togglePlayback,
  skipToNext,
  skipToPrevious,
  changeMoodPlaylist,
  refreshTrack: loadCurrentTrack,
}

}


