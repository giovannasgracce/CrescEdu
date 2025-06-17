import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
	const [selectedDate, setSelectedDate] = useState("");
	const [events, setEvents] = useState({});
	const [titulo, setTitulo] = useState("");
	const [descricao, setDescricao] = useState("");
	const [prioridade, setPrioridade] = useState("");
	const rota = useRouter();

	const addEvent = () => {
		if (selectedDate && titulo.trim() !== "") {
			const novoEvento = {
				titulo: titulo.trim(),
				descricao: descricao.trim(),
				prioridade: prioridade.trim(),
			};

			setEvents((prev) => {
				const updated = { ...prev };
				if (!updated[selectedDate]) updated[selectedDate] = [];
				updated[selectedDate].push(novoEvento);
				return updated;
			});

			// Limpar campos
			setTitulo("");
			setDescricao("");
			setPrioridade("");
		}
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
				onDayPress={(day) => setSelectedDate(day.dateString)}
				markedDates={{
					[selectedDate]: {
						selected: true,
						selectedColor: "#00adf5",
						disableTouchEvent: true,
					},
				}}
				theme={{
					todayTextColor: "#00adf5",
					arrowColor: "#00adf5",
					selectedDayBackgroundColor: "#00adf5",
					selectedDayTextColor: "#ffffff",
				}}
			/>

			<Text style={styles.selected}>
				{selectedDate
					? `Selecionado: ${selectedDate}`
					: "Selecione um dia"}
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
					<TouchableOpacity style={styles.addButton} onPress={addEvent}>
						<Text style={styles.addButtonText}>Adicionar</Text>
					</TouchableOpacity>
				</View>
			)}

			{selectedDate && events[selectedDate]?.length > 0 && (
				<View style={styles.eventList}>
					<Text style={styles.eventTitle}>Compromissos:</Text>
					{events[selectedDate].map((item, index) => (
						<View key={index} style={[styles.eventItem, getPriorityStyle(item.prioridade)]}>
							<Text style={{ fontWeight: "bold" }}>{item.titulo}</Text>
							<Text>Descrição: {item.descricao}</Text>
							<Text>Prioridade: {item.prioridade}</Text>
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
});
