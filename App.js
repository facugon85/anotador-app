import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar pantallas
import HomeScreen from './screens/HomeScreen';
import EscobaScreen from './screens/EscobaScreen';
import TrucoScreen from './screens/TrucoScreen';
import ChinchonScreen from './screens/ChinchonScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#171717',
              borderBottomWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: '#84cc16',
            headerTitleStyle: {
              color: '#ffffff',
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Truco"
            component={TrucoScreen}
            options={{ title: '' }}
          />
          <Stack.Screen
            name="Chinchon"
            component={ChinchonScreen}
            options={{ title: '' }}
          />
          <Stack.Screen
            name="Escoba"
            component={EscobaScreen}
            options={{ title: '' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 