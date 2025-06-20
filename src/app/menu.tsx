import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Menu() {
  const rota = useRouter();
  const { usuarioAtual } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, {usuarioAtual}!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => rota.push("/pomodoro")}
      >
        <Text style={styles.buttonText}>Pomodoro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => rota.push("/calendario")}
      >
        <Text style={styles.buttonText}>Calendário</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => rota.push({ pathname: "/chatListScreen", params: { usuarioAtual } })}
      >
        <Text style={styles.buttonText}>Acessar o Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => rota.push("/")}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    marginBottom: 40,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
