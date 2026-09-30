import { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../lib/api';
import { global } from '../styles/global';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const registrar = async () => {
    try {
      if (!nome || !email || !senha) {
        Alert.alert('Campos obrigatórios', 'Preencha nome, e-mail e senha.');
        return;
      }
      await api.post('/usuarios/registrar', { nome, email, senha });
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      router.replace('/');
    } catch (err: any) {
      const msg = err?.response?.data?.mensagem || 'Tente novamente.';
      Alert.alert('Erro ao cadastrar', msg);
    }
  };

  return (
    <View style={global.container}>
      <Text style={global.title}>Crie sua Conta</Text>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={global.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={global.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={global.input} />
      <Button title="Registrar" onPress={registrar} />
    </View>
  );
}