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
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
	const [selectedDate, setSelectedDate] = useState("");
	const [events, setEvents] = useState({});
	const [newEvent, setNewEvent] = useState("");
	const rota = useRouter();

	const addEvent = () => {
		if (selectedDate && newEvent.trim() !== "") {
			setEvents((prev) => {
				const updated = { ...prev };
				if (!updated[selectedDate]) updated[selectedDate] = [];
				updated[selectedDate].push(newEvent.trim());
				return updated;
			});
			setNewEvent("");
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
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						placeholder="Digite um compromisso"
						value={newEvent}
						onChangeText={setNewEvent}
					/>
					<TouchableOpacity
						style={styles.addButton}
						onPress={addEvent}
					>
						<Text style={styles.addButtonText}>Adicionar</Text>
					</TouchableOpacity>
				</View>
			)}

			{selectedDate && events[selectedDate]?.length > 0 && (
				<View style={styles.eventList}>
					<Text style={styles.eventTitle}>Compromissos:</Text>
					{events[selectedDate].map((item, index) => (
						<Text key={index} style={styles.eventItem}>
							• {item}
						</Text>
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
	inputContainer: {
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 10,
		marginRight: 10,
	},
	addButton: {
		backgroundColor: "#00adf5",
		padding: 10,
		borderRadius: 8,
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
		marginLeft: 10,
		marginBottom: 5,
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
});
