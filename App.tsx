import './global.css';

import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { StatusBar } from 'expo-status-bar';
import RootNavigation from '~/screens/navigation/RootNavigation';
import useCachedResources from 'hooks/useCachedResources';
import { useUserStore } from 'store/useUserStore';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query';

export default function App() {

  const isLoadingComplete = useCachedResources();
  const queryClient = new QueryClient();
  const {session, user} = useUserStore();

  useEffect(() => {console.log(user,session)}, [user, session]);

  if(!isLoadingComplete){
    return null;
  }
  return (
    <Container>
      <Text>App</Text>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
    </Container>
  ) 
}

const Container = styled(View)`
  flex: 1;`;