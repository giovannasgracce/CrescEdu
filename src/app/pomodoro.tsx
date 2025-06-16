
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function Pomodoro() {
  const rota = useRouter()
  const [duracaoTotal, setDuracaoTotal] = useState(1500); // 25 min
  const [segundosRestantes, setSegundosRestantes] = useState(1500);
  const [rodando, setRodando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const somAlarme = useRef(new Audio.Sound());

  useEffect(() => {
    const carregarSom = async () => {
      await somAlarme.current.loadAsync(require('../../assets/alarme.wav'));
    };
    carregarSom();

    return () => {
      somAlarme.current.unloadAsync();
    };
  }, []);

  useEffect(() => {
    let intervalo;

    if (rodando && segundosRestantes > 0) {
      intervalo = setInterval(() => {
        setSegundosRestantes((prev) => prev - 1);
        setProgresso(((duracaoTotal - segundosRestantes + 1) / duracaoTotal) * 100);
      }, 1000);
    } else if (segundosRestantes === 0) {
      tocarAlarme();
      setRodando(false);
    }

    return () => clearInterval(intervalo);
  }, [rodando, segundosRestantes]);

  const formatarTempo = () => {
    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = segundosRestantes % 60;
    return `${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
  };

  const reiniciarTimer = () => {
    setSegundosRestantes(duracaoTotal);
    setRodando(false);
    setProgresso(0);
  };

  const aumentarTempo = () => {
    if (!rodando && duracaoTotal < 3600) {
      setDuracaoTotal(duracaoTotal + 300);
      setSegundosRestantes(duracaoTotal + 300);
    }
  };

  const diminuirTempo = () => {
    if (!rodando && duracaoTotal > 300) {
      setDuracaoTotal(duracaoTotal - 300);
      setSegundosRestantes(duracaoTotal - 300);
    }
  };

  const tocarAlarme = async () => {
    try {
      await somAlarme.current.replayAsync();
    } catch (error) {
      console.log('Erro ao tocar alarme:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>POMODOR🍅</Text>

      <AnimatedCircularProgress
        size={300}
        width={15}
        fill={progresso}
        tintColor="#fff"
        backgroundColor="#c15c5c"
        rotation={0}
        style={styles.circularProgress}
      >
        {() => (
          <View style={styles.centro}>
            <Text style={styles.tempo}>{formatarTempo()}</Text>
          </View>
        )}
      </AnimatedCircularProgress>

      <TouchableOpacity style={styles.botao} onPress={() => setRodando(!rodando)}>
        <Text style={styles.textoBotao}>{rodando ? 'Pausar' : 'Iniciar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={reiniciarTimer}>
        <Text style={styles.textoBotao}>Reiniciar</Text>
      </TouchableOpacity>

      <View style={styles.linhaBotoes}>
        <TouchableOpacity style={styles.botaoMenor} onPress={diminuirTempo}>
          <Text style={styles.textoBotao}>-5 min</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoMenor} onPress={aumentarTempo}>
          <Text style={styles.textoBotao}>+5 min</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => rota.push('/menu')}><Text>Voltar</Text></TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'tomato',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20
  },
  circularProgress: {
    marginBottom: 30
  },
  centro: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tempo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff'
  },
  botao: {
    backgroundColor: 'white',
    paddingVertical: 12,
    width: 150,
    borderRadius: 8,
    marginBottom: 10
  },
  textoBotao: {
    color: 'tomato',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  linhaBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 10
  },
  botaoMenor: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8
  }
});
