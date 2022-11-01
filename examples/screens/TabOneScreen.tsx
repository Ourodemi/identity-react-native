import React, { useState } from 'react';

import { StyleSheet } from 'react-native';

import { Button, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as Clipboard from 'expo-clipboard';

import useIdentity from '@ourodemi/identity-react-native';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const { isAuthenticated, identityAPI } = useIdentity();

  const [infoText, setInfoText] = useState('');

  return (
    <View style={styles.container}>
      { !isAuthenticated && (<Text darkColor='red' style={{fontSize: 24}}>You are not authenticated!</Text>) }
      <Button 
        title="Show Refresh Token"
        disabled={!isAuthenticated}
        onPress={() => setInfoText(identityAPI.identity.getRefreshToken()!)}
      />
      
      <Button 
        title="Show Access Token"
        disabled={!isAuthenticated}
        onPress={async () => {
          setInfoText((await identityAPI.identity.getAccessToken())!)
        }}
      />

      <Button 
        title="Refresh Access Token"
        disabled={!isAuthenticated}
        onPress={async () => {
          identityAPI.identity.tokens.access_token_expiry = 0;
          setInfoText((await identityAPI.identity.getAccessToken())!)
        }}
      />

      <Button 
        title="Show User Data"
        disabled={!isAuthenticated}
        onPress={() => {
          setInfoText(JSON.stringify(identityAPI.identity.props))
        }}
      />

      <TextInput 
        value={infoText}
        style={{color:'white'}}
        multiline={true}
        numberOfLines={5}
        editable={false}
      />

      <Button 
        title="Copy Text"
        disabled={!isAuthenticated}
        color={'green'}
        onPress={async () => {
          await Clipboard.setStringAsync(infoText);
          alert('Text Copied!');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
