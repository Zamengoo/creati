import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { loadAuthToken } from '../lib/api';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await loadAuthToken();
      const isAuthPage = pathname === '/' || pathname === '/cadastro';
      if (!token && !isAuthPage) router.replace('/');
      setLoading(false);
    })();
  }, [pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: true, title: 'Agenda' }} />;
}