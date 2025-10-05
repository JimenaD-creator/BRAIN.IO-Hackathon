"use client"

import { useEffect, useState } from "react" // Añade useState si no está
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSpotify } from "../hooks/useSpotify"

export default function PlaylistScreen() {
  const { 
    isAuthenticated, 
    currentTrack, 
    isPlaying, 
    togglePlayback, 
    skipToNext, 
    skipToPrevious, 
    refreshTrack,
    queue 
  } = useSpotify()

  // Mueve todos los hooks al inicio, sin condiciones
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      refreshTrack()
      const interval = setInterval(refreshTrack, 5000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, refreshTrack])

  // Renderizado condicional al final, no en medio de hooks
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No conectado a Spotify</Text>
          <Text style={styles.emptyText}>Conecta tu cuenta de Spotify desde la pantalla de inicio</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No music is being reproduced</Text>
          <Text style={styles.emptyText}>Start to play music on Spotify</Text>
        </View>
      </SafeAreaView>
    )
  }

  // El resto del componente permanece igual...
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reproducing</Text>
          <Text style={styles.subtitle}>Connected to Spotify</Text>
        </View>

        <View style={styles.albumContainer}>
          {currentTrack.imageUrl ? (
            <Image source={{ uri: currentTrack.imageUrl }} style={styles.albumArt} />
          ) : (
            <View style={styles.albumArtPlaceholder}>
              <Text style={styles.albumPlaceholder}>🎵</Text>
            </View>
          )}
        </View>

        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{currentTrack.name}</Text>
          <Text style={styles.artistName}>{currentTrack.artist}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "45%" }]} />
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={skipToPrevious}>
            <Text style={styles.controlIcon}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
            <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={skipToNext}>
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>

        {/* Queue Section */}
        <View style={styles.queueSection}>
          <Text style={styles.queueTitle}>Next songs</Text>
          {queue.length > 0 ? (
            queue.map((track, index) => (
              <View key={`${track.id}-${index}`} style={styles.queueItem}>
                {track.imageUrl ? (
                  <Image source={{ uri: track.imageUrl }} style={styles.queueArt} />
                ) : (
                  <View style={styles.queueArtPlaceholder}>
                    <Text style={styles.queuePlaceholder}>🎵</Text>
                  </View>
                )}
                <View style={styles.queueInfo}>
                  <Text style={styles.queueTrackName} numberOfLines={1}>
                    {track.name}
                  </Text>
                  <Text style={styles.queueArtistName} numberOfLines={1}>
                    {track.artist}
                  </Text>
                </View>
                <Text style={styles.queueNumber}>
                  {index + 1}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyQueue}>
              <Text style={styles.emptyQueueText}>No songs in queue</Text>
              <Text style={styles.emptyQueueSubtext}></Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// Los estilos permanecen igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f9fafb",
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#f9fafb",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  albumContainer: {
    alignItems: "center",
    marginTop: 48,
  },
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 16,
  },
  albumArtPlaceholder: {
    width: 280,
    height: 280,
    backgroundColor: "#1f2937",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  albumPlaceholder: {
    fontSize: 80,
  },
  trackInfo: {
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 24,
  },
  trackName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f9fafb",
    textAlign: "center",
  },
  artistName: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 8,
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#374151",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#06b6d4",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    gap: 24,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },
  controlIcon: {
    fontSize: 24,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#06b6d4",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 32,
    color: "#ffffff",
  },
  queueSection: {
    marginTop: 48,
    paddingHorizontal: 24,
  },
  queueTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f9fafb",
    marginBottom: 16,
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  queueArt: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  queueArtPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: "#374151",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  queuePlaceholder: {
    fontSize: 16,
  },
  queueInfo: {
    flex: 1,
    marginLeft: 12,
  },
  queueTrackName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f9fafb",
  },
  queueArtistName: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  queueNumber: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  emptyQueue: {
    padding: 24,
    alignItems: "center",
  },
  emptyQueueText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 4,
  },
  emptyQueueSubtext: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
})