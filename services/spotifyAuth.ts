import * as AuthSession from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SPOTIFY_CONFIG } from "../config/spotify"

WebBrowser.maybeCompleteAuthSession()

const discovery = {
  authorizationEndpoint: SPOTIFY_CONFIG.authEndpoint,
  tokenEndpoint: SPOTIFY_CONFIG.tokenEndpoint,
}

export interface SpotifyTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const STORAGE_KEY = "@neurotune_spotify_tokens"

export class SpotifyAuthService {
  private static request = new AuthSession.AuthRequest({
    clientId: SPOTIFY_CONFIG.clientId,
    scopes: SPOTIFY_CONFIG.scopes,
    redirectUri: AuthSession.makeRedirectUri({ scheme: "neurotune" }),
    responseType: AuthSession.ResponseType.Code,
  })

  static async login(): Promise<SpotifyTokens | null> {
    try {
      const result = await this.request.promptAsync(discovery)

      console.log("[v0] Auth result:", result)

      if (result.type === "success" && result.params.code) {
        const tokens = await this.exchangeCodeForTokens(result.params.code)
        await this.saveTokens(tokens)
        return tokens
      }

      return null
    } catch (error) {
      console.error("[v0] Spotify login error:", error)
      return null
    }
  }

  private static async exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
    const response = await fetch(SPOTIFY_CONFIG.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: AuthSession.makeRedirectUri({ scheme: "neurotune" }),
        client_id: SPOTIFY_CONFIG.clientId,
      }).toString(),
    })

    const data = await response.json()
    console.log("[v0] Exchange code response:", data)

    if (!data.access_token) throw new Error("No access token returned from Spotify")

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }
  }

  static async refreshAccessToken(refreshToken: string): Promise<SpotifyTokens | null> {
    try {
      const response = await fetch(SPOTIFY_CONFIG.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: SPOTIFY_CONFIG.clientId,
        }).toString(),
      })

      const data = await response.json()
      console.log("[v0] Refresh token response:", data)

      if (!data.access_token) return null

      const tokens: SpotifyTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresAt: Date.now() + data.expires_in * 1000,
      }

      await this.saveTokens(tokens)
      return tokens
    } catch (error) {
      console.error("[v0] Token refresh error:", error)
      return null
    }
  }

  static async getValidToken(): Promise<string | null> {
    const tokens = await this.getTokens()
    if (!tokens) return null

    if (Date.now() >= tokens.expiresAt) {
      const newTokens = await this.refreshAccessToken(tokens.refreshToken)
      return newTokens?.accessToken || null
    }

    return tokens.accessToken
  }

  static async saveTokens(tokens: SpotifyTokens): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
  }

  static async getTokens(): Promise<SpotifyTokens | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  }

  static async logout(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY)
  }

  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getValidToken()
    return token !== null
  }
}
