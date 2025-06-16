import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { usePessoasDataBase } from '../database/usePessoasDataBase';

export default function Cadastrar() {
  const rota = useRouter();
  const pessoasDataBase = usePessoasDataBase();

  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [nomeSocial, setNomeSocial] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== Number(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === Number(cpf.charAt(10));
  }

  function formatarCPF(valor: string): string {
    valor = valor.replace(/\D/g, '');

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return valor;
  }

  function onChangeDate(event: any, selectedDate?: Date) {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const formato = selectedDate.toISOString().split("T")[0];
      setDataNascimento(formato);
    }
  }

  async function create() {
    const cpfNumerico = cpf.replace(/\D/g, '');
    const emailLimpo = email.trim();
    const regexCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    // Validações

    if (!cpfNumerico || cpfNumerico.length !== 11 || !validarCPF(cpfNumerico)) {
      Alert.alert("Atenção", "Informe um CPF válido no formato 000.000.000-00!");
      return;
    }

    if (!nome || nome.trim().length < 4) {
      Alert.alert("Atenção", "O nome deve ter pelo menos 4 caracteres!");
      return;
    }

    if (!dataNascimento) {
      Alert.alert("Atenção", "Selecione a data de nascimento!");
      return;
    }

    if (!emailLimpo || !emailLimpo.endsWith("@senac.com")) {
      Alert.alert("Atenção", "Digite um e-mail válido do domínio @senac.com");
      return;
    }    

    if (!senha || senha.length < 4) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 4 caracteres!");
      return;
    }

    if (!regexCaractereEspecial.test(senha)) {
      Alert.alert("Atenção", "A senha deve conter pelo menos um caractere especial!");
      return;
    }

    try {
      await pessoasDataBase.create({
        cpf: cpfNumerico,
        nome,
        nomeSocial,
        dataNascimento,
        email: emailLimpo,
        senha
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");

      // Limpar os campos após cadastro
      setCpf("");
      setNome("");
      setNomeSocial("");
      setDataNascimento("");
      setEmail("");
      setSenha("");

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro ao cadastrar usuário.");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="CPF (000.000.000-00)"
        value={cpf}
        onChangeText={(text) => setCpf(formatarCPF(text))}
        maxLength={14} 
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Nome Social"
        value={nomeSocial}
        onChangeText={setNomeSocial}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
        <Text style={{ fontSize: 16, color: dataNascimento ? "#000" : "#888" }}>
          {dataNascimento || "Selecione a data de nascimento"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dataNascimento ? new Date(dataNascimento) : new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date(2014, 11, 31)}
          minimumDate={new Date(1975, 0, 1)}
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        autoCapitalize="none"
      />

      <View style={styles.senhaContainer}>
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!senhaVisivel}
          style={[styles.input, { flex: 1, borderWidth: 0 }]}
        />
        <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
          <Text style={{ color: 'blue', marginLeft: 10 }}>
            {senhaVisivel ? "Ocultar" : "Mostrar"}
          </Text>
        </TouchableOpacity>
      </View>

      <Button title="Cadastrar" onPress={create} />
      <TouchableOpacity onPress={() => rota.push('/')} style={styles.backButton}>
        <Text style={{ color: 'blue', marginTop: 15 }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  datePicker: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    marginBottom: 12,
  },
  backButton: {
    alignItems: 'center',
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
});
