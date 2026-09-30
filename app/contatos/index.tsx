import { useState } from 'react';
import { View, Text, Button, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import api, { loadAuthToken, getImageUrl, clearAuthToken } from '../../lib/api';
import { global } from '../../styles/global';
import { Contato } from '../../types/Contato';

export default function ListaContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const router = useRouter();

  const carregar = async () => {
    try {
      await loadAuthToken();
      const { data } = await api.get('/contatos');
      setContatos(data);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao carregar contatos. Verifique login e API.');
    }
  };

  const excluir = async (id: string) => {
    try {
      await api.delete(`/contatos/${id}`);
      carregar();
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir.');
    }
  };

  const sair = async () => {
    await clearAuthToken();
    router.replace('/');
  }

  useFocusEffect(() => {
    carregar();
  });

  return (
    <View style={global.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={global.title}>Seus contatos</Text>
        <Button title="Sair" onPress={sair} color="#dc3545" />
      </View>
      
      <Button title="Novo contato" onPress={() => router.push('/contatos/novo')} />
      
      <FlatList
        data={contatos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push(`/contatos/${item._id}`)}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.nome}</Text>
              {item.telefone && <Text>{item.telefone}</Text>}
            </View>

            {item.fotoId && (
              <Image source={{ uri: getImageUrl(item.fotoId) }} style={{ width: 50, height: 50, borderRadius: 25, marginHorizontal: 10 }} />
            )}
            
            <Button title="Excluir" onPress={() => excluir(item._id)} color="#dc3545" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum contato encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between'
  }
});