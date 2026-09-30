import { useState } from 'react';
import { View, TextInput, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api, { getImageUrl } from '../lib/api';
import { global } from '../styles/global';
import { Contato } from '../types/Contato';

interface Props {
  valores?: Partial<Contato>;
  onSubmit: (dados: Partial<Contato>) => void;
}

export default function FormContato({ valores, onSubmit }: Props) {
  const [nome, setNome] = useState(valores?.nome || '');
  const [email, setEmail] = useState(valores?.email || '');
  const [telefone, setTelefone] = useState(valores?.telefone || '');
  const [endereco, setEndereco] = useState(valores?.endereco || '');
  const [fotoId, setFotoId] = useState<string | undefined>(valores?.fotoId);

  const escolherImagem = async () => {
    const permissoes = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissoes.status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita acesso à galeria para escolher uma imagem.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      const file = resultado.assets[0];

      const form = new FormData();
      form.append('foto', {
        uri: file.uri,
        name: file.fileName || 'imagem.jpg',
        type: file.mimeType || 'image/jpeg'
      } as any);

      try {
        const { data } = await api.post('/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (!data?.fileId) throw new Error('Upload inválido');
        setFotoId(data.fileId);
      } catch (err: any) {
        Alert.alert('Erro no upload', err?.response?.data?.erro || 'Tente outra imagem (.jpg/.png/.webp)');
      }
    }
  };

  const enviar = () => {
    if (!nome) { Alert.alert('Validação', 'Nome é obrigatório.'); return; }
    onSubmit({ nome, email, telefone, endereco, fotoId });
  };

  return (
    <View>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={global.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={global.input} autoCapitalize="none" />
      <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={global.input} />
      <TextInput placeholder="Endereço" value={endereco} onChangeText={setEndereco} style={global.input} />

      <Button title="Selecionar imagem" onPress={escolherImagem} />
      {fotoId && (
        <Image source={{ uri: getImageUrl(fotoId) }} style={{ width: 120, height: 120, marginVertical: 8, alignSelf: 'center' }} />
      )}

      <Button title="Salvar" onPress={enviar} />
    </View>
  );
}