import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export type BrainwaveData = {
  delta: number;
  theta: number;
  alpha: number;
  beta: number;
  gamma: number;
  concentration: number;
};

export default function BrainwaveMonitor() {
  const [data, setData] = useState<BrainwaveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrainwaves = async () => {
    try {
      console.log("🔄 Fetching brainwave data...");
      
      const response = await fetch("http://10.43.85.125:8000/brainwaves", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      console.log("📊 Received data:", json);
        
      if (json && typeof json.delta === 'number') {
        setData(json as BrainwaveData);
        setError(null);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("❌ Error fetching brainwave data:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      
      // Datos de ejemplo para debugging
      setData({
        delta: 1.5,
        theta: 1.2,
        alpha: 1.8,
        beta: 2.1,
        gamma: 0.9,
        concentration: 0.7
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrainwaves();
    const interval = setInterval(fetchBrainwaves, 2000);
    return () => clearInterval(interval);
  }, []);

  // Función para renderizar cada valor de brainwave
  const renderValue = (label: string, value: number, color: string) => (
    <View style={styles.valueContainer} key={label}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>
        {value.toFixed(3)}
      </Text>
    </View>
  );

  // Mostrar estado de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Connecting to EEG Server...</Text>
      </View>
    );
  }

  // Mostrar error
  if (error && !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <Text style={styles.helpText}>
          Check if the Python server is running on http://10.43.85.125:8000
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brainwave Monitor</Text>
      
      {error && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>Using simulated data - {error}</Text>
        </View>
      )}
      
      {data && (
        <View style={styles.valuesGrid}>
          {renderValue("Delta", data.delta, "#8A2BE2")}       {/* Violeta */}
          {renderValue("Theta", data.theta, "#4169E1")}       {/* Azul real */}
          {renderValue("Alpha", data.alpha, "#00CED1")}       {/* Turquesa */}
          {renderValue("Beta", data.beta, "#FFD700")}         {/* Oro */}
          {renderValue("Gamma", data.gamma, "#FF6347")}       {/* Tomate */}
          
          {/* Concentration con diseño especial */}
          <View style={styles.concentrationContainer}>
            <Text style={styles.concentrationLabel}>Concentration:</Text>
            <Text style={[
              styles.concentrationValue, 
              { color: data.concentration > 1 ? "#32CD32" : "#FFD700" }
            ]}>
              {data.concentration.toFixed(3)}
            </Text>
          </View>
        </View>
      )}
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
    fontWeight: "bold",
  },
  loadingText: {
    color: "#FFF",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  errorDetail: {
    color: "#FFA8A8",
    textAlign: "center",
    marginBottom: 20,
  },
  helpText: {
    color: "#888",
    textAlign: "center",
    fontSize: 12,
  },
  valuesGrid: {
    alignItems: "center",
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 60,
    textAlign: "right",
  },
  concentrationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  concentrationLabel: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  concentrationValue: {
    fontWeight: "bold",
    fontSize: 18,
    minWidth: 60,
    textAlign: "right",
  },
  warningBanner: {
    backgroundColor: "rgba(255,165,0,0.2)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FFA500",
  },
  warningText: {
    color: "#FFA500",
    textAlign: "center",
    fontSize: 12,
  },
});