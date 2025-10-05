import { SPOTIFY_API_BASE } from "../config/spotify"
import { SpotifyAuthService } from "./spotifyAuth"
import type { SpotifyTrack, SpotifyPlaylist, MoodType } from "../types"

export class SpotifyApiService {
  
  private static async fetchWithAuth(endpoint: string, options: RequestInit = {}, retries = 3): Promise<any> {
    const token = await SpotifyAuthService.getValidToken()

    if (!token) {
      throw new Error("No valid token - Please login to Spotify first")
    }

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
          ...options,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
          },
        })

        if (response.status === 401) {
          throw new Error("No valid token - Session expired")
        }

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || '1'
          const waitTime = parseInt(retryAfter) * 1000
          console.warn(`Rate limited. Waiting ${retryAfter} seconds...`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue // Retry the request
        }

        if (!response.ok && response.status !== 204) {
          throw new Error(`Spotify API error: ${response.status} ${response.statusText}`)
        }

        // For 204 No Content responses, return null immediately
        if (response.status === 204) {
          return null
        }

        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          // For successful non-JSON responses, return the text
          const text = await response.text()
          if (response.ok) {
            return text || null
          }
          throw new Error(`Unexpected response format: ${text.substring(0, 50)}`)
        }

        return await response.json()

      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error)
        
        // If it's the last attempt, throw the error
        if (attempt === retries - 1) {
          if (error instanceof Error) {
            throw error
          }
          throw new Error('Unknown error occurred while contacting Spotify API')
        }

        // Wait before retrying (exponential backoff)
        const waitTime = 1000 * Math.pow(2, attempt)
        console.log(`Retrying in ${waitTime}ms...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
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
    try { 
      await this.fetchWithAuth(endpoint, { method: "PUT" }) 
    } catch (error) { 
      console.error("Error toggling playback:", error) 
    }
  }

  static async skipToNext() {
    try { 
      await this.fetchWithAuth("/me/player/next", { method: "POST" }) 
    } catch (error) { 
      // Only log errors that aren't related to successful empty responses
      if (error instanceof Error && !error.message.includes("Unexpected response format")) {
        console.error("Error skipping track:", error) 
      }
    }
  }

  static async skipToPrevious() {
    try { 
      await this.fetchWithAuth("/me/player/previous", { method: "POST" }) 
    } catch (error) { 
      // Only log errors that aren't related to successful empty responses
      if (error instanceof Error && !error.message.includes("Unexpected response format")) {
        console.error("Error going to previous track:", error) 
      }
    }
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

  // Additional utility method to check if Spotify is available
  static async checkSpotifyAvailability(): Promise<boolean> {
    try {
      await this.fetchWithAuth("/me", {}, 1) // Quick check with 1 retry
      return true
    } catch (error) {
      console.error("Spotify unavailable:", error)
      return false
    }
  }
}