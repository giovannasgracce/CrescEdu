import { View, Pressable, PressableProps, Text, ScrollView, StyleSheet,TouchableOpacity } from "react-native";
import { CalendarioDataBase } from "../database/useCalendarioDataBase"; // ajuste o caminho
import { MaterialIcons } from "@expo/vector-icons"


type Props = PressableProps & {
    data: {
        id: number
        data: string
        titulo: string
        descricao: string
        prioridade: string
    }
    onDelete: () => void
    onEditar: () => void

}

export function Calendario({ data, onDelete, onEditar, ...rest }: Props) {
  return (
        <Pressable style={styles.container}  {...rest}>
            <Text style={styles.text}>
                {data.id} - {data.data} - {data.titulo} - {data.descricao} - {data.prioridade} 
            </Text>

            <View style={styles.actions}>
                <TouchableOpacity onPress={onEditar}>
                    <MaterialIcons name="edit" size={24} color="#0284c7" />
                </TouchableOpacity>

                <TouchableOpacity onPress={onDelete}>
                    <MaterialIcons name="delete" size={24} color="#dc2626" />
                </TouchableOpacity>
            </View>
        </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#EEE",
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
}
});
