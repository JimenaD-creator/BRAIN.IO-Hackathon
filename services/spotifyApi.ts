import { SPOTIFY_API_BASE } from "../config/spotify"
import { SpotifyAuthService } from "./spotifyAuth"
import type { SpotifyTrack, SpotifyPlaylist, MoodType } from "../types"

export class SpotifyApiService {
  private static async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = await SpotifyAuthService.getValidToken()
    if (!token) throw new Error("No valid token - Please login to Spotify first")

    const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (response.status === 204) return null // Evita error JSON vacío
    if (response.status === 401) throw new Error("No valid token - Session expired")
    if (!response.ok) throw new Error(`Spotify API error: ${response.status}`)

    return response.json()
  }

  static async getCurrentUser() {
    return this.fetchWithAuth("/me")
  }

  static async getCurrentPlayback() {
    try {
      return await this.fetchWithAuth("/me/player")
    } catch (error) {
      if (error instanceof Error && !error.message.includes("No valid token")) {
        console.error("Error getting playback:", error)
      }
      return null
    }
  }

  static async getCurrentTrack(): Promise<SpotifyTrack | null> {
    try {
      const data = await this.fetchWithAuth("/me/player/currently-playing")
      if (!data || !data.item) return null

      return {
        id: data.item.id,
        name: data.item.name,
        artist: data.item.artists[0]?.name || "Unknown",
        album: data.item.album.name,
        duration: data.item.duration_ms,
        imageUrl: data.item.album.images[0]?.url || "",
        previewUrl: data.item.preview_url,
      }
    } catch (error) {
      if (error instanceof Error && !error.message.includes("No valid token")) {
        console.error("Error getting current track:", error)
      }
      return null
    }
  }

  static async togglePlayback(play: boolean) {
    const endpoint = play ? "/me/player/play" : "/me/player/pause"
    try { await this.fetchWithAuth(endpoint, { method: "PUT" }) }
    catch (error) { console.error("Error toggling playback:", error) }
  }

  static async skipToNext() {
    try { await this.fetchWithAuth("/me/player/next", { method: "POST" }) }
    catch (error) { console.error("Error skipping track:", error) }
  }

  static async skipToPrevious() {
    try { await this.fetchWithAuth("/me/player/previous", { method: "POST" }) }
    catch (error) { console.error("Error going to previous track:", error) }
  }

  static async getPlaylistsForMood(mood: MoodType): Promise<SpotifyPlaylist[]> {
    try {
      const moodQueries: Record<MoodType, string> = {
        focus: "focus study concentration",
        chill: "chill relax ambient",
        energy: "workout energy motivation",
      }
      const query = moodQueries[mood]
      const data = await this.fetchWithAuth(`/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`)

      return data.playlists.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        tracks: [],
        imageUrl: item.images[0]?.url || "",
      }))
    } catch (error) {
      console.error("Error getting playlists:", error)
      return []
    }
  }

  static async playPlaylist(playlistUri: string) {
    try {
      await this.fetchWithAuth("/me/player/play", {
        method: "PUT",
        body: JSON.stringify({ context_uri: playlistUri }),
      })
    } catch (error) {
      console.error("Error playing playlist:", error)
    }
  }
}
