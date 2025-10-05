// screens/HomeScreen.tsx

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import BrainStateDisplay from "../components/BrainStateDisplay"
import { useSpotify } from "../hooks/useSpotify"
import type { MoodType } from "../types"

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false)
  const [currentMood, setCurrentMood] = useState<MoodType>("focus")

  const {
    isAuthenticated,
    login,
    currentTrack,
    isPlaying,
    togglePlayback,
    skipToNext,
    skipToPrevious,
    changeMoodPlaylist,
    currentPlaylist,
  } = useSpotify()

  // Cambiar playlist cuando el mood cambie (sin necesidad de conectar EEG)
  useEffect(() => {
    if (isAuthenticated) {
      changeMoodPlaylist(currentMood)
    }
  }, [currentMood, isAuthenticated])

  const handleConnectEEG = () => setIsConnected(!isConnected)
  const handleSpotifyConnect = async () => {
    if (!isAuthenticated) await login()
  }

  const handleMoodChange = (mood: MoodType) => {
    setCurrentMood(mood)
    // No esperar al useEffect - cambiar inmediatamente
    if (isAuthenticated) {
      changeMoodPlaylist(mood)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>NeuroTune</Text>
          <Text style={styles.subtitle}>Music for your mind</Text>
        </View>

        {/* Brain visualization */}
        <BrainStateDisplay state={currentMood} intensity={75} />

        {/* Spotify login card */}
        {!isAuthenticated && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Connect to Spotify</Text>
            <Text style={styles.cardDescription}>Connect to your account</Text>
            <TouchableOpacity style={styles.spotifyButton} onPress={handleSpotifyConnect}>
              <Text style={styles.buttonText}>Connect to Spotify</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* EEG connection status */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isConnected && styles.statusDotConnected]} />
            <Text style={styles.statusText}>
              {isConnected ? "Device connected" : "Device not connected"}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleConnectEEG}>
            <Text style={styles.buttonText}>{isConnected ? "Disconnect EEG" : "Connect EEG"}</Text>
          </TouchableOpacity>
        </View>

        {/* Mood selector */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mood</Text>
          <Text style={styles.cardDescription}>
            {currentPlaylist ? `Playlist: ${currentPlaylist}` : "Select your level of energy"}
          </Text>
          <View style={styles.moodButtons}>
            {(["focus", "chill", "energy"] as MoodType[]).map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[styles.moodButton, currentMood === mood && styles.moodButtonActive]}
                onPress={() => handleMoodChange(mood)}
              >
                <Text style={styles.moodButtonText}>
                  {mood === "focus" ? "🎯 Focus" : mood === "chill" ? "😌 Chill" : "⚡ Energy"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Playback controls */}
        {isAuthenticated && currentTrack && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Playing</Text>
            <Text style={styles.cardDescription}>{currentTrack.name} — {currentTrack.artist}</Text>
            <View style={styles.controlsRow}>
              <TouchableOpacity onPress={skipToPrevious} style={styles.controlButton}>
                <Text style={styles.controlIcon}>⏮</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
                <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={skipToNext} style={styles.controlButton}>
                <Text style={styles.controlIcon}>⏭</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statUnit}>Hz</Text>
            <Text style={styles.statLabel}>Frequency</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85</Text>
            <Text style={styles.statUnit}>%</Text>
            <Text style={styles.statLabel}>Quality</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statUnit}>min</Text>
            <Text style={styles.statLabel}>Session</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827" },
  scrollContent: { paddingBottom: 32 },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#374151" },
  title: { fontSize: 28, fontWeight: "bold", color: "#f9fafb" },
  subtitle: { fontSize: 14, color: "#9ca3af", marginTop: 4 },
  card: { backgroundColor: "#1f2937", marginHorizontal: 24, marginTop: 24, padding: 24, borderRadius: 16 },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#f9fafb", marginBottom: 8 },
  cardDescription: { fontSize: 14, color: "#9ca3af", marginBottom: 16 },
  spotifyButton: { backgroundColor: "#1db954", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  button: { backgroundColor: "#06b6d4", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#6b7280", marginRight: 8 },
  statusDotConnected: { backgroundColor: "#10b981" },
  statusText: { color: "#f9fafb", fontSize: 14 },
  moodButtons: { flexDirection: "row", gap: 8, marginTop: 12 },
  moodButton: { flex: 1, backgroundColor: "#374151", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  moodButtonActive: { backgroundColor: "#06b6d4" },
  moodButtonText: { fontSize: 14, color: "#f9fafb" },
  controlsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 24, marginTop: 16 },
  controlButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#1f2937", alignItems: "center", justifyContent: "center" },
  controlIcon: { fontSize: 24 },
  playButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#06b6d4", alignItems: "center", justifyContent: "center" },
  playIcon: { fontSize: 32, color: "#fff" },
  statsGrid: { flexDirection: "row", paddingHorizontal: 24, marginTop: 24, gap: 12 },
  statCard: { flex: 1, backgroundColor: "#1f2937", padding: 16, borderRadius: 12, alignItems: "center" },
  statValue: { fontSize: 28, fontWeight: "bold", color: "#06b6d4" },
  statUnit: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  statLabel: { fontSize: 12, color: "#9ca3af", marginTop: 8 },
})