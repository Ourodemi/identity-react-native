import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native';

import { View } from '../components/Themed';
import useIdentity from '@ourodemi/identity-react-native';

export default function TabTwoScreen() {
  const { isAuthenticated, identityAPI } = useIdentity();

  const [loginID, setLoginID] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    let res = await identityAPI.auth({email: loginID}, password);
    console.log(res)
    if ( res.status != 200 && res.status != 201 ){
      alert("Invalid login ID or password")
    }
  }

  if ( !isAuthenticated ){
    return (
      <View style={styles.container}>
        <TextInput
          placeholder='Login ID'
          onChangeText={(text) => setLoginID(text)}
          style={{fontSize: 24, color: 'white'}}
          value={loginID}
        />

        <TextInput
          placeholder='Password'
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          style={{marginTop: 15, fontSize: 24, color: 'white'}}
          value={password}
        />

        <Button
          title='Sign In'
          onPress={login}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={{color:'green', fontSize: 24}}>You are logged in!</Text>

      <Button 
        title='Change User'
      />

      <Button 
        title='Add User'
        onPress={identityAPI.deauth}
      />

      <Button 
        title='Logout'
        color='red'
        onPress={identityAPI.deauth}
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
