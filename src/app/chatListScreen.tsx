import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useChatDataBase } from "../database/useChatDataBase";
import { useLocalSearchParams } from "expo-router";

export default function ChatListScreen() {
  const { listarUsuarios } = useChatDataBase();
  const [usuarios, setUsuarios] = useState<string[]>([]);
  const rota = useRouter();
  const { usuarioAtual } = useLocalSearchParams();

  

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const resultado = await listarUsuarios();
        setUsuarios(resultado);
      } catch (error) {
        console.log("Erro ao carregar usuários:", error);
      }
    }

    carregarUsuarios();
  }, []);

  const abrirChat = (contato) => {
    rota.push({
      pathname: "/chatScreen",
      params: { contato, usuarioAtual },
    });
  };
  
  const abrirNovaConversa = () => {
    rota.push({
      pathname: "/newChatScreen",
      params: { usuarioAtual },
    });
  };
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => abrirChat(item)}
    >
      <Text style={styles.text}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Conversas</Text>

      <FlatList
        data={usuarios}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity
        style={styles.novaConversaButton}
        onPress={() => rota.push("/newChatScreen")}
      >
        <Text style={styles.novaConversaText}>Nova Conversa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.voltarButton}
        onPress={() => rota.back()}
      >
        <Text style={styles.voltarButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  item: {
    padding: 15,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    marginBottom: 10,
  },
  text: { fontSize: 18 },

  novaConversaButton: {
    backgroundColor: "#00adf5",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  novaConversaText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  voltarButton: {
    backgroundColor: "#888",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  voltarButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
