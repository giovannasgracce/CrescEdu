import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NomeSocialInfo() {
  const rota = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>O que é Nome Social?</Text>
      <Text style={styles.description}>
        Nome social é o nome pelo qual uma pessoa deseja ser chamada, 
        respeitando sua identidade de gênero e individualidade, mesmo que seja diferente do nome registrado oficialmente.
      </Text>

      <TouchableOpacity 
        style={[styles.button, styles.softBlue]} 
        onPress={() => rota.push('/cadastrar')}
      >
        <Text style={styles.buttonText}>Já tenho nome social</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.softGray]} 
        onPress={() => rota.push('/cadastrx')}
      >
        <Text style={[styles.buttonText, { color: '#333' }]}>Não tenho nome social</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => rota.push('/')} style={styles.softGray}>
        <Text style={{ color: 'blue', marginTop: 15 }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 30, // deixa bem arredondado
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // sombra android
  },
  softBlue: {
    backgroundColor: '#a3cef1',
  },
  softGray: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
