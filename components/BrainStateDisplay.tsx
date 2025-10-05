
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import type { MoodType } from "../types"

interface BrainStateDisplayProps {
  state: MoodType
  intensity?: number
}

const moodConfig = {
  focus: {
    color: "#06b6d4",
    label: "Enfocado",
    emoji: "🎯",
  },
  chill: {
    color: "#ec4899",
    label: "Relajado",
    emoji: "🌊",
  },
  energy: {
    color: "#f59e0b",
    label: "Energético",
    emoji: "⚡",
  },
}

export default function BrainStateDisplay({ state, intensity = 75 }: BrainStateDisplayProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current
  const config = moodConfig[state]

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  return (
    <View style={styles.container}>
      {/* Brain wave visualization */}
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: config.color,
            opacity: 0.2, 
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <View style={[styles.circle, { backgroundColor: config.color, opacity: 0.4 }]} />
      <View style={[styles.innerCircle, { backgroundColor: config.color, opacity:1 }]}>
        <Text style={[styles.label, { color: '#ffffff' }]}>{config.label}</Text>
        <Text style={styles.intensity}>{intensity}% intensidad</Text>


      </View>

      {/* State label */}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 35
  },
  circle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    
  },
  innerCircle: {
    width: 150,
    height: 150,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 48,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 18,
  },
  intensity: {
    fontSize: 14,
    color: "#ffffff",
    marginTop: 7,
  },
})
