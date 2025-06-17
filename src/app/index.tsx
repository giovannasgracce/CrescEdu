import React from "react";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Index() {
	const rota = useRouter();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Bem-vindo</Text>

			<TouchableOpacity
				style={styles.button}
				onPress={() => rota.push("/login")}
			>
				<Text style={styles.buttonText}>Acessar</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => rota.push("/nomeSocial")}>
				<Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.button}
				onPress={() => rota.push("/consultar")}
			>
				<Text style={styles.buttonText}>Consultar</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.button}
				onPress={() => rota.push("/menu")}
			>
				<Text style={styles.buttonText}>Menu</Text>
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
		fontSize: 28,
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
	link: {
		color: "blue",
		fontSize: 16,
	},
});
