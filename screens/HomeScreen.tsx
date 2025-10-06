// screens/HomeScreen.tsx

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import BrainStateDisplay from "../components/BrainStateDisplay"
import { useSpotify } from "../hooks/useSpotify"
import { useHeadGesture } from "../hooks/useHeadGesture"
import type { MoodType } from "../types"

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false)
  const [currentMood, setCurrentMood] = useState<MoodType>("focus")
  const [brainwaveData, setBrainwaveData] = useState<any>(null)

  // Hook para control por gestos - integración mínima
  const { 
    headGesture, 
    isEnabled: gestureEnabled, 
    enableGestureControl, 
    disableGestureControl 
  } = useHeadGesture()

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

  // Controlar cambios de canción con movimientos de cabeza
  useEffect(() => {
    if (gestureEnabled && headGesture && isAuthenticated) {
      if (headGesture === 'right') {
        skipToNext()
      } else if (headGesture === 'left') {
        skipToPrevious()
      }
    }
  }, [headGesture, gestureEnabled, isAuthenticated])

  // Función para obtener datos EEG del servidor
  const fetchBrainwaveData = async () => {
    try {
      const response = await fetch("http://10.43.85.125:8000/brainwaves")
      if (response.ok) {
        const data = await response.json()
        setBrainwaveData(data)
      }
    } catch (error) {
      console.log("EEG server not available")
    }
  }

  // Función para determinar el estado de ánimo basado en las bandas cerebrales
  const determineMoodFromBrainwaves = (data: any): MoodType => {
    if (!data) return currentMood
    
    const { delta, theta, alpha, beta, gamma } = data
    
    const focusScore = beta + gamma
    const energyScore = beta + alpha  
    const chillScore = alpha + theta
    
    const scores = {
      focus: focusScore,
      energy: energyScore,
      chill: chillScore
    }
    
    const maxMood = Object.keys(scores).reduce((a, b) => 
      scores[a as MoodType] > scores[b as MoodType] ? a : b
    ) as MoodType
    
    return maxMood
  }

  // Obtener datos EEG cada 2 segundos
  useEffect(() => {
    fetchBrainwaveData()
    const interval = setInterval(fetchBrainwaveData, 2000)
    return () => clearInterval(interval)
  }, [])

  // Actualizar estado de ánimo automáticamente cuando lleguen nuevos datos EEG
  useEffect(() => {
    if (isConnected && brainwaveData && isAuthenticated) {
      const detectedMood = determineMoodFromBrainwaves(brainwaveData)
      
      if (detectedMood !== currentMood) {
        setCurrentMood(detectedMood)
        changeMoodPlaylist(detectedMood)
      }
    }
  }, [brainwaveData, isConnected, isAuthenticated])

  // Cambiar playlist cuando el mood cambie manualmente
  useEffect(() => {
    if (isAuthenticated && !isConnected) {
      changeMoodPlaylist(currentMood)
    }
  }, [currentMood, isAuthenticated, isConnected])

  const handleConnectEEG = () => {
    setIsConnected(!isConnected)
  }

  const handleSpotifyConnect = async () => {
    if (!isAuthenticated) await login()
  }

  const handleMoodChange = (mood: MoodType) => {
    if (!isConnected) {
      setCurrentMood(mood)
    }
  }

  // Función simple para toggle del control por gestos
  const toggleGestureControl = () => {
    if (gestureEnabled) {
      disableGestureControl()
    } else {
      enableGestureControl()
    }
  }

  // Calcular intensidad para BrainStateDisplay
  const calculateIntensity = () => {
    if (!brainwaveData || !isConnected) return 75
    if (brainwaveData.concentration) {
      return Math.min(brainwaveData.concentration * 100, 100)
    }
    return 75
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>NeuroTune</Text>
          <Text style={styles.subtitle}>
            {isConnected ? "Music controlled by your mind" : "Music for your mind"}
          </Text>
        </View>

        {/* Brain visualization */}
        <BrainStateDisplay 
          state={currentMood} 
          intensity={calculateIntensity()} 
        />

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
              {isConnected ? "EEG Connected - Auto Mode" : "EEG Not Connected - Manual Mode"}
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleConnectEEG}>
            <Text style={styles.buttonText}>{isConnected ? "Disconnect EEG" : "Connect EEG"}</Text>
          </TouchableOpacity>
        </View>

        {/* Control por gestos - Tarjeta simple agregada */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Head Gesture Control</Text>
          <Text style={styles.cardDescription}>
            {gestureEnabled 
              ? "Tilt head LEFT/RIGHT to change songs" 
              : "Enable to control music with head movements"
            }
          </Text>
          <TouchableOpacity 
            style={[styles.button, gestureEnabled && styles.gestureButtonActive]}
            onPress={toggleGestureControl}
          >
            <Text style={styles.buttonText}>
              {gestureEnabled ? "Disable Gestures" : "Enable Gestures"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mood selector */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mental State</Text>
          <Text style={styles.cardDescription}>
            {currentPlaylist ? `Playing: ${currentPlaylist}` : "Select your mental state"}
            {isConnected && " • Auto-detecting from brainwaves"}
          </Text>
          <View style={styles.moodButtons}>
            {(["focus", "chill", "energy"] as MoodType[]).map((mood) => (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodButton, 
                  currentMood === mood && styles.moodButtonActive,
                  isConnected && styles.moodButtonAuto
                ]}
                onPress={() => handleMoodChange(mood)}
                disabled={isConnected}
              >
                <Text style={styles.moodButtonText}>
                  {mood === "focus" ? "🎯 Focus" : mood === "chill" ? "😌 Chill" : "⚡ Energy"}
                  {isConnected && currentMood === mood && " 🔄"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {isConnected && (
            <Text style={styles.autoModeNote}>
            </Text>
          )}
        </View>

        {/* Playback controls */}
        {isAuthenticated && currentTrack && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Now Playing</Text>
            <Text style={styles.trackName}>{currentTrack.name}</Text>
            <Text style={styles.artistName}>{currentTrack.artist}</Text>
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
            <Text style={styles.statValue}>
              {brainwaveData ? (brainwaveData.beta * 10).toFixed(0) : "12"}
            </Text>
            <Text style={styles.statUnit}>Hz</Text>
            <Text style={styles.statLabel}>Beta Wave</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {brainwaveData ? (brainwaveData.concentration * 100).toFixed(0) : "85"}
            </Text>
            <Text style={styles.statUnit}>%</Text>
            <Text style={styles.statLabel}>Focus</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {isConnected ? "AUTO" : "MAN"}
            </Text>
            <Text style={styles.statUnit}>Mode</Text>
            <Text style={styles.statLabel}>Control</Text>
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
  trackName: { fontSize: 16, fontWeight: "600", color: "#f9fafb", textAlign: "center" },
  artistName: { fontSize: 14, color: "#9ca3af", textAlign: "center", marginBottom: 16 },
  spotifyButton: { backgroundColor: "#1db954", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  button: { backgroundColor: "#06b6d4", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  gestureButtonActive: { 
    backgroundColor: "#10b981" 
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#6b7280", marginRight: 8 },
  statusDotConnected: { backgroundColor: "#10b981" },
  statusText: { color: "#f9fafb", fontSize: 14 },
  moodButtons: { flexDirection: "row", gap: 8, marginTop: 12 },
  moodButton: { 
    flex: 1, 
    backgroundColor: "#374151", 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  moodButtonActive: { 
    backgroundColor: "#06b6d4" 
  },
  moodButtonAuto: {
    // Mantener el mismo estilo pero deshabilitar interacción
  },
  moodButtonText: { fontSize: 14, color: "#f9fafb" },
  controlsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 24, marginTop: 16 },
  controlButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#1f2937", alignItems: "center", justifyContent: "center" },
  controlIcon: { fontSize: 24, color: "#f9fafb" },
  playButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#06b6d4", alignItems: "center", justifyContent: "center" },
  playIcon: { fontSize: 32, color: "#fff" },
  statsGrid: { flexDirection: "row", paddingHorizontal: 24, marginTop: 24, gap: 12 },
  statCard: { flex: 1, backgroundColor: "#1f2937", padding: 16, borderRadius: 12, alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#06b6d4" },
  statUnit: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  statLabel: { fontSize: 12, color: "#9ca3af", marginTop: 8 },
  autoModeNote: {
    fontSize: 12,
    color: "#10b981",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
})