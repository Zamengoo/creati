import { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import api, { setAuthToken } from '../lib/api';
import { global } from '../styles/global';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const entrar = async () => {
    try {
      if (!email || !senha) {
        Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha.');
        return;
      }
      const { data } = await api.post('/usuarios/login', { email, senha });
      if (!data?.token) throw new Error('Token não retornado');
      
      await setAuthToken(data.token);
      router.push('/contatos');
    } catch (err: any) {
      const msg = err?.response?.data?.mensagem || err?.message || 'Falha ao autenticar.';
      Alert.alert('Erro ao entrar', msg);
    }
  };

  return (
    <View style={global.container}>
      <Text style={global.title}>Faça seu Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={global.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={global.input} />
      
      <Button title="Entrar" onPress={entrar} />
      <Button title="Criar nova conta" onPress={() => router.push('/cadastro')} color="#6c757d" />
    </View>
  );
}