import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

type BrainwaveData = {
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
};

export default function BrainwaveMonitor() {
  const [data, setData] = useState<BrainwaveData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBrainwaves = async () => {
    try {
      const res = await fetch("http://10.43.95.200:8081/brainwaves");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching brainwave data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrainwaves();
    const interval = setInterval(fetchBrainwaves, 2000); // refresh every 2s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#007AFF" />;

  if (!data) return <Text>Error loading data</Text>;

  const renderBar = (label: string, value: number, color: string) => (
    <View style={styles.barContainer} key={label}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.bar, { width: `${value * 5}%`, backgroundColor: color }]} />
      <Text style={styles.value}>{value} Hz</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brainwave Monitor</Text>
      {renderBar("Delta", data.delta, "#4B0082")}
      {renderBar("Theta", data.theta, "#4169E1")}
      {renderBar("Alpha", data.alpha, "#00CED1")}
      {renderBar("Beta", data.beta, "#FFD700")}
      {renderBar("Gamma", data.gamma, "#FF4500")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#0B0B0D",
  },
  title: {
    fontSize: 22,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 30,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    color: "#FFF",
    width: 70,
    fontWeight: "bold",
  },
  bar: {
    height: 12,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  value: {
    color: "#FFF",
    width: 60,
  },
});
