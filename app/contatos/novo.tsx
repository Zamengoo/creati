import { View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FormContato from '../../components/FormContato';
import api, { loadAuthToken } from '../../lib/api';
import { global } from '../../styles/global';

export default function NovoContato() {
  const router = useRouter();

  const salvar = async (dados: any) => {
    try {
      await loadAuthToken();
      await api.post('/contatos', dados);
      router.back();
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.mensagem || 'Falha ao criar contato');
    }
  };

  return (
    <View style={global.container}>
      <FormContato onSubmit={salvar} />
    </View>
  );
}