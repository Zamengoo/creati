import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, ActivityIndicator, Alert } from 'react-native';
import FormContato from '../../components/FormContato';
import api, { loadAuthToken } from '../../lib/api';
import { global } from '../../styles/global';
import { Contato } from '../../types/Contato';

export default function EditarContato() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [contato, setContato] = useState<Contato | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await loadAuthToken();
        const { data } = await api.get(`/contatos/${id}`);
        setContato(data);
      } catch {
        Alert.alert('Erro', 'Falha ao carregar contato');
      }
    })();
  }, [id]);

  const atualizar = async (dados: Partial<Contato>) => {
    try {
      await api.put(`/contatos/${id}`, dados);
      router.back();
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.mensagem || 'Falha ao atualizar');
    }
  };

  if (!contato) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={global.container}>
      <FormContato valores={contato} onSubmit={atualizar} />
    </View>
  );
}