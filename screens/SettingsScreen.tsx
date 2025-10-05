"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SettingsScreen() {
  const [autoPlay, setAutoPlay] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [sensitivity, setSensitivity] = useState(7)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ajustes</Text>
          <Text style={styles.subtitle}>Configura tu experiencia</Text>
        </View>

        {/* Device section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivo EEG</Text>
          <View style={styles.card}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>Muse 2</Text>
              <View style={styles.deviceStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>No conectado</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Conectar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Playback settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reproducción</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Reproducción automática</Text>
                <Text style={styles.settingDescription}>Cambia música según tu estado mental</Text>
              </View>
              <Switch
                value={autoPlay}
                onValueChange={setAutoPlay}
                trackColor={{ false: "#374151", true: "#06b6d4" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* Sensitivity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sensibilidad</Text>
          <View style={styles.card}>
            <Text style={styles.settingLabel}>Nivel de sensibilidad: {sensitivity}</Text>
            <Text style={styles.settingDescription}>Qué tan rápido responde a cambios de estado</Text>
            <View style={styles.sensitivityBar}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.sensitivityDot, level <= sensitivity && styles.sensitivityDotActive]}
                  onPress={() => setSensitivity(level)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Notificaciones</Text>
                <Text style={styles.settingDescription}>Alertas de cambio de estado</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#374151", true: "#06b6d4" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          <View style={styles.card}>
            <Text style={styles.aboutText}>NeuroTune v1.0.0</Text>
            <Text style={styles.aboutDescription}>Música controlada por ondas cerebrales</Text>
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
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1f2937",
    padding: 20,
    borderRadius: 16,
  },
  deviceInfo: {
    marginBottom: 16,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f9fafb",
  },
  deviceStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6b7280",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#9ca3af",
  },
  connectButton: {
    backgroundColor: "#06b6d4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  connectButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
  },
  settingDescription: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  sensitivityBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  sensitivityDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#374151",
  },
  sensitivityDotActive: {
    backgroundColor: "#06b6d4",
  },
  aboutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
  },
  aboutDescription: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
})
