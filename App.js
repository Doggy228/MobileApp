import React from 'react';
import Navigator from "./navigation/Navigator";
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, SafeAreaView } from 'react-native';


export default function App() {
  return (
    <NavigationContainer>
      
      <SafeAreaView>
        <StatusBar barStyle={'dark-content'} />
      </SafeAreaView>

      <Navigator />

    </NavigationContainer>
  );
}
