"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"

export default function PlaylistScreen() {
  const [isPlaying, setIsPlaying] = useState(false)

  // Mock current track
  const currentTrack = {
    name: "Lofi Study Beats",
    artist: "Chill Hop Music",
    album: "Focus Flow",
    imageUrl: "https://via.placeholder.com/300",
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reproduciendo</Text>
          <Text style={styles.subtitle}>Modo: Enfocado 🎯</Text>
        </View>

        {/* Album art */}
        <View style={styles.albumContainer}>
          <View style={styles.albumArt}>
            <Text style={styles.albumPlaceholder}>🎵</Text>
          </View>
        </View>

        {/* Track info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{currentTrack.name}</Text>
          <Text style={styles.artistName}>{currentTrack.artist}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "45%" }]} />
          </View>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>1:23</Text>
            <Text style={styles.timeText}>3:05</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playButton} onPress={() => setIsPlaying(!isPlaying)}>
            <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>

        {/* Playlist queue */}
        <View style={styles.queueSection}>
          <Text style={styles.queueTitle}>Siguiente en cola</Text>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.queueItem}>
              <View style={styles.queueThumb}>
                <Text style={styles.queueThumbText}>🎵</Text>
              </View>
              <View style={styles.queueInfo}>
                <Text style={styles.queueTrack}>Track {item}</Text>
                <Text style={styles.queueArtist}>Artist Name</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

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
  albumContainer: {
    alignItems: "center",
    marginTop: 48,
  },
  albumArt: {
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
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#9ca3af",
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
    fontSize: 18,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 16,
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  queueThumb: {
    width: 48,
    height: 48,
    backgroundColor: "#374151",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  queueThumbText: {
    fontSize: 20,
  },
  queueInfo: {
    marginLeft: 12,
    flex: 1,
  },
  queueTrack: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f9fafb",
  },
  queueArtist: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
})
