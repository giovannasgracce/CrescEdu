import { useRouter } from 'expo-router';
import { Pessoas } from "@/components/Pessoas";
import React, {useState, useEffect} from 'react';
import { View,Text,Button, StyleSheet,TouchableOpacity,Alert, FlatList} from 'react-native';
import { usePessoasDataBase, PessoasDataBase } from '../database/usePessoasDataBase';


export default function Cadastrar(){
    const rota = useRouter()
    const [pessoas, setPessoas] = useState<PessoasDataBase[]>([]);
    const pessoasDataBase = usePessoasDataBase()
    const [id, setId] = useState("")
    const [cpf, setCpf] = useState("")
    const [nome, setNome] = useState("")
    const [nomeSocial, setNomeSocial] = useState("")
    const [dataNascimento, setDataNascimento] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [busca, setBusca] = useState("")
    const [showDatePicker, setShowDatePicker] = useState(false);


    async function list(){
        try{
            const response = await pessoasDataBase.consultar(busca)
            setPessoas(response)
        }catch(error){
            console.log(error)
        }
    }

    async function details(item: PessoasDataBase) {
		setId(String(item.id));
        setCpf(item.cpf);
		setNome(item.nome);
		setNomeSocial(item.nomeSocial);
		setDataNascimento(item.dataNascimento);
        setEmail(item.email);
		setSenha(item.senha);
    
	}

    useEffect(() => {list()}, [busca] )

    return (
        <View>
			<Text>Pessoas cadastradas</Text>
            <View>
            <FlatList
            data={pessoas}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <Pessoas data={item} />}
            contentContainerStyle={{ gap: 16 }}
            />

            </View>
            <TouchableOpacity onPress={() => rota.push('/menu')}><Text>Voltar</Text></TouchableOpacity>
        </View>


    )
}