import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar pantallas
import HomeScreen from './screens/HomeScreen';
import EscobaScreen from './screens/EscobaScreen';
import TrucoScreen from './screens/TrucoScreen';
import ChinchonScreen from './screens/ChinchonScreen';

const Stack = createStackNavigator();

const theme = {
  dark: true,
  colors: {
    primary: '#00FF01', // Verde neón
    background: '#302f2c', // Gris oscuro cálido
    card: '#302f2c', // Gris oscuro cálido
    text: '#FFFFFF', // Blanco
    border: '#00FF00', // Verde neón
    notification: '#FF0000', // Rojo neón
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#181818', // Azul grisáceo sobrio
              elevation: 0, // Quita la sombra en Android
              shadowOpacity: 0, // Quita la sombra en iOS
              borderBottomWidth: 0, // Quita la línea blanca
            },
            headerTintColor: '#bbff01', // Gris claro elegante
            headerTitleStyle: {
              color: '#ECF0F1',
              fontWeight: '900',
              textShadowColor: '#000000',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 0,
            },
            cardStyle: { backgroundColor: '#2C3E50' },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
            options={{ title: '', headerShown: false }}
          />
          <Stack.Screen
            name="Chinchon"
            component={ChinchonScreen}
            options={{ title: '', headerShown: false }}
          />
          <Stack.Screen
            name="Escoba"
            component={EscobaScreen}
            options={{ title: '', headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 