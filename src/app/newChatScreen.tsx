import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useChatDataBase } from "../database/useChatDataBase";
import { useLocalSearchParams } from "expo-router";

export default function NewChatScreen() {
  const { listarUsuarios } = useChatDataBase(); // função que busca emails no banco
  const [emailDigitado, setEmailDigitado] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [erro, setErro] = useState("");
  const router = useRouter();
  const { usuarioAtual } = useLocalSearchParams();

  useEffect(() => {
    async function carregarUsuarios() {
      const lista = await listarUsuarios();
      setUsuarios(lista);
    }
    carregarUsuarios();
  }, []);

  useEffect(() => {
    // filtra sugestões conforme digita o email
    if (emailDigitado.length === 0) {
      setSugestoes([]);
      setErro("");
      return;
    }
    const filtro = usuarios.filter((usuario) =>
      usuario.toLowerCase().startsWith(emailDigitado.toLowerCase())
    );
    setSugestoes(filtro);

    // Validação se o email existe na lista completa de usuários
    if (
      emailDigitado.length > 0 &&
      !usuarios.some(
        (usuario) => usuario.toLowerCase() === emailDigitado.toLowerCase()
      )
    ) {
      setErro("Email não encontrado no sistema.");
    } else {
      setErro("");
    }
  }, [emailDigitado, usuarios]);

  const iniciarConversa = (email) => {
    if (!email) return;
    if (!usuarios.some((usuario) => usuario.toLowerCase() === email.toLowerCase())) {
      setErro("Email não encontrado no sistema.");
      return;
    }
    router.push({
      pathname: "/chatScreen",
      params: { contato: emailDigitado, usuarioAtual }, // ajuste aqui o seu usuário atual
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Conversa</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o email do contato"
        value={emailDigitado}
        onChangeText={setEmailDigitado}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {sugestoes.length > 0 && (
        <FlatList
          data={sugestoes}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sugestaoItem}
              onPress={() => {
                setEmailDigitado(item);
                setSugestoes([]);
                setErro("");
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.sugestoesLista}
        />
      )}

      {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

      <TouchableOpacity
        style={[styles.button, erro ? { backgroundColor: "#ccc" } : {}]}
        onPress={() => iniciarConversa(emailDigitado)}
        disabled={erro !== ""}
      >
        <Text style={styles.buttonText}>Iniciar Conversa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.voltarButton}
        onPress={() => router.back()} // Volta para a tela anterior
      >
        <Text style={styles.voltarButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sugestoesLista: {
    maxHeight: 150,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  sugestaoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  erroTexto: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00adf5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
