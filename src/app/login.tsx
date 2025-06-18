import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { usePessoasDataBase } from '../database/usePessoasDataBase';

export default function Login() {
  const rota = useRouter();
  const pessoasDataBase = usePessoasDataBase();

  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getLogin() {
    const emailLimpo = email.trim();

    if (!emailLimpo) {
      return Alert.alert('Atenção', 'Preencha o campo email!');
    }

    if (!senha) {
      return Alert.alert('Atenção', 'Preencha o campo senha!');
    }

    if (!emailLimpo.includes('@') || !emailLimpo.includes('.')) {
      return Alert.alert('Atenção', 'Digite um e-mail válido!');
    }

    if (senha.length < 4) {
      return Alert.alert('Atenção', 'A senha deve ter pelo menos 4 caracteres!');
    }

    try {
      setLoading(true);

      const usuario = await pessoasDataBase.findByEmail(emailLimpo);

      if (!usuario) {
        Alert.alert('Erro', 'Usuário não encontrado!');
        setLoading(false);
        return;
      }

      if (usuario.senha !== senha) {
        Alert.alert('Erro', 'Senha incorreta!');
        setLoading(false);
        return;
      }

      setLoading(false);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');

      // 🚩 AQUI: Agora passando o email como usuarioAtual
      rota.push({
        pathname: '/menu',
        params: { usuarioAtual: emailLimpo },
      });

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao tentar fazer login.');
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder='Informe seu email institucional'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
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

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={getLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Acessar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => rota.push('/nomeSocial')}>
        <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => rota.push('/')}>
        <Text style={styles.link}>Voltar</Text>
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
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0CFFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: 'blue',
    marginBottom: 12,
    textAlign: 'center',
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
