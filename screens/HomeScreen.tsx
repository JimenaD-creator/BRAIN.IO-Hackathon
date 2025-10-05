"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import BrainStateDisplay from "../components/BrainStateDisplay"
import type { MoodType } from "../types"

export default function HomeScreen() {
  const [isConnected, setIsConnected] = useState(false)
  const [currentMood, setCurrentMood] = useState<MoodType>("energy")

  const handleConnect = () => {
    setIsConnected(!isConnected)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>NeuroTune</Text>
          <Text style={styles.subtitle}>Música controlada por tu mente</Text>
        </View>

        {/* Brain state visualization */}
        <BrainStateDisplay state={currentMood} intensity={75} />

        {/* Connection status */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isConnected && styles.statusDotConnected]} />
            <Text style={styles.statusText}>{isConnected ? "Dispositivo conectado" : "Dispositivo no conectado"}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleConnect}>
            <Text style={styles.buttonText}>{isConnected ? "Desconectar" : "Conectar EEG"}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statUnit}>Hz</Text>
            <Text style={styles.statLabel}>Frecuencia</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85</Text>
            <Text style={styles.statUnit}>%</Text>
            <Text style={styles.statLabel}>Calidad</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statUnit}>min</Text>
            <Text style={styles.statLabel}>Sesión</Text>
          </View>
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
  card: {
    backgroundColor: "#1f2937",
    marginHorizontal: 24,
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6b7280",
    marginRight: 8,
  },
  statusDotConnected: {
    backgroundColor: "#10b981",
  },
  statusText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  button: {
    backgroundColor: "#06b6d4",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#06b6d4",
  },
  statUnit: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
  },
})
