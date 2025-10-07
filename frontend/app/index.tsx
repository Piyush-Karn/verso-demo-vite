import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function RootIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the explore tab which contains our collections view
    router.replace('/(tabs)/explore');
  }, []);

  return null;
}