import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useChatDataBase, ChatMessage } from "../database/useChatDataBase";
import { useRouter } from "expo-router";


export default function ChatScreen() {
  const { buscarMensagens, enviarMensagem } = useChatDataBase();
  const rota = useRouter();
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const { contato, usuarioAtual } = useLocalSearchParams();

  useEffect(() => {
    carregarMensagens();
  }, []);

  async function carregarMensagens() {
    const resultado = await buscarMensagens(
      String(usuarioAtual),
      String(contato)
    );
    setMensagens(resultado);
  }

  async function handleEnviar() {
    if (novaMensagem.trim() === "") return;
  
    const novaMsg = {
      remetente: String(usuarioAtual),
      destinatario: String(contato),
      mensagem: novaMensagem.trim(),
      dataHora: new Date().toISOString(),
    };
  
    await enviarMensagem(novaMsg);
    setNovaMensagem("");
    carregarMensagens();
  
    // 🚨 Aqui vem a notificação simples por enquanto:
    alert(`Mensagem para ${contato} enviada com sucesso! Conteúdo: "${novaMsg.mensagem}"`);
  }
  

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.mensagem,
        item.remetente === usuarioAtual
          ? styles.mensagemEnviada
          : styles.mensagemRecebida,
      ]}
    >
      <Text style={styles.textoMensagem}>{item.mensagem}</Text>
      <Text style={styles.textoData}>{item.dataHora}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Conversando com: {contato}</Text>

      <FlatList
        data={mensagens}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.lista}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={novaMensagem}
          onChangeText={setNovaMensagem}
        />
        <TouchableOpacity style={styles.botao} onPress={handleEnviar}>
          <Text style={styles.botaoTexto}>Enviar</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.voltarButton}
            onPress={() => rota.back()}  // Volta para a tela anterior
            >
            <Text style={styles.voltarButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  titulo: { fontSize: 20, marginBottom: 10, textAlign: "center" },
  lista: { flex: 1 },
  mensagem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  mensagemEnviada: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  mensagemRecebida: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  textoMensagem: { fontSize: 16 },
  textoData: { fontSize: 12, color: "#555", marginTop: 5 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  botao: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  botaoTexto: {
    color: "#fff",
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
