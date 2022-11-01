import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { IdentityProvider } from '@ourodemi/identity-react-native';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <IdentityProvider
          domain='auth.ourodemi.com'
        >
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </IdentityProvider>
      </SafeAreaProvider>
    );
  }
}
