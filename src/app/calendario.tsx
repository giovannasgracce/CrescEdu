import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import { useCalendarioDataBase } from "../database/useCalendarioDataBase";

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState({});
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [editandoEvento, setEditandoEvento] = useState(null); // controle de edição
  const rota = useRouter();
  const { criar, analisar, alterar, apagar } = useCalendarioDataBase();

  useEffect(() => {
    carregarDatasMarcadas();
  }, []);

  const carregarDatasMarcadas = async () => {
    try {
      const eventosDoBanco = await analisar("");
      const novasDatasMarcadas = {};

      eventosDoBanco.forEach((evento) => {
        let corDot = "#00adf5";

        if (evento.prioridade === "Alta") corDot = "#FF0000";
        else if (evento.prioridade === "Média") corDot = "#FFD700";
        else if (evento.prioridade === "Baixa") corDot = "#008000";

        if (novasDatasMarcadas[evento.data]) {
          if (!Array.isArray(novasDatasMarcadas[evento.data].dots)) {
            novasDatasMarcadas[evento.data].dots = [];
          }
          novasDatasMarcadas[evento.data].dots.push({ color: corDot });
        } else {
          novasDatasMarcadas[evento.data] = {
            marked: true,
            dots: [{ color: corDot }],
          };
        }
      });

      setMarkedDates(novasDatasMarcadas);
    } catch (error) {
      console.log("Erro ao carregar datas marcadas:", error);
    }
  };

  const carregarEventosDoDia = async (data) => {
    try {
      const resultado = await analisar(data);
      setEvents((prev) => ({
        ...prev,
        [data]: resultado,
      }));
    } catch (error) {
      console.log("Erro ao buscar eventos:", error);
    }
  };

  const resetarFormulario = () => {
    setTitulo("");
    setDescricao("");
    setPrioridade("");
    setEditandoEvento(null);
  };

  const salvarEvento = async () => {
    if (!selectedDate || titulo.trim() === "") {
      Alert.alert("Erro", "Selecione uma data e preencha o título");
      return;
    }

    if (editandoEvento) {
      // Atualizar evento existente
      try {
        await alterar({
          id: editandoEvento.id,
          data: selectedDate,
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          prioridade: prioridade.trim(),
        });
        await carregarEventosDoDia(selectedDate);
        await carregarDatasMarcadas();
        resetarFormulario();
      } catch (error) {
        console.log("Erro ao atualizar evento:", error);
      }
    } else {
      // Criar novo evento
      try {
        await criar({
          data: selectedDate,
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          prioridade: prioridade.trim(),
        });
        await carregarEventosDoDia(selectedDate);
        await carregarDatasMarcadas();
        resetarFormulario();
      } catch (error) {
        console.log("Erro ao criar evento:", error);
      }
    }
  };

  const iniciarEdicao = (evento) => {
    setEditandoEvento(evento);
    setTitulo(evento.titulo);
    setDescricao(evento.descricao);
    setPrioridade(evento.prioridade);
    setSelectedDate(evento.data);
  };

  const apagarEvento = (id) => {
    Alert.alert(
      "Confirmação",
      "Deseja realmente apagar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            try {
              await apagar(id);
              await carregarEventosDoDia(selectedDate);
              await carregarDatasMarcadas();

              // Se estava editando este evento, reseta o formulário
              if (editandoEvento?.id === id) resetarFormulario();
            } catch (error) {
              console.log("Erro ao apagar evento:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getPriorityStyle = (prioridade) => {
    switch (prioridade) {
      case "Alta":
        return { backgroundColor: "#ffe5e5" };
      case "Média":
        return { backgroundColor: "#fff3cd" };
      case "Baixa":
        return { backgroundColor: "#d4edda" };
      default:
        return { backgroundColor: "#f0f8ff" };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agenda</Text>

      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          carregarEventosDoDia(day.dateString);
          resetarFormulario();
        }}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...(markedDates[selectedDate] || {}),
            selected: true,
            selectedColor: "#00adf5",
            disableTouchEvent: true,
          },
        }}
        markingType="multi-dot"
        theme={{
          todayTextColor: "#00adf5",
          arrowColor: "#00adf5",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
        }}
      />

      <Text style={styles.selected}>
        {selectedDate ? `Selecionado: ${selectedDate}` : "Selecione um dia"}
      </Text>

      {selectedDate && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={prioridade}
              onValueChange={(itemValue) => setPrioridade(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione a prioridade" value="" />
              <Picker.Item label="Alta" value="Alta" />
              <Picker.Item label="Média" value="Média" />
              <Picker.Item label="Baixa" value="Baixa" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={salvarEvento}>
            <Text style={styles.addButtonText}>
              {editandoEvento ? "Atualizar" : "Adicionar"}
            </Text>
          </TouchableOpacity>
          {editandoEvento && (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#888", marginTop: 10 }]}
              onPress={resetarFormulario}
            >
              <Text style={styles.addButtonText}>Cancelar edição</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {selectedDate && events[selectedDate]?.length > 0 && (
        <View style={styles.eventList}>
          <Text style={styles.eventTitle}>Compromissos:</Text>
          {events[selectedDate].map((item, index) => (
            <View
              key={index}
              style={[styles.eventItem, getPriorityStyle(item.prioridade)]}
            >
              <Text style={{ fontWeight: "bold" }}>{item.titulo}</Text>
              <Text>Descrição: {item.descricao}</Text>
              <Text>Prioridade: {item.prioridade}</Text>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#007AFF" }]}
                  onPress={() => iniciarEdicao(item)}
                >
                  <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#FF3B30", marginLeft: 10 }]}
                  onPress={() => apagarEvento(item.id)}
                >
                  <Text style={styles.actionButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => rota.push("/menu")}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  selected: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  formContainer: {
    marginTop: 20,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#00adf5",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  eventList: {
    marginTop: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventItem: {
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginVertical: 30,
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
