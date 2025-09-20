import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductsScreen } from "./components/ProductsScreen";
import { CartScreen } from "./components/CartScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { CustomHeader } from "./components/CustomHeader";
import { MockAuthService, UserService } from "./lib";
import { CartProvider } from "./contexts/CartContext";
import { useEffect, useState } from "react";
import { MOCK_CUSTOMER_EMAIL } from '@env';

export type RootStackParamList = {
  Products: undefined;
  Cart: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    initializeMockAuth();
  }, []);

  const initializeMockAuth = async () => {
    try {
      console.log('🚀 App starting up...');
      
      // Initialize MockAuthService
      const success = await MockAuthService.initializeMockAuth();
      
      if (success) {
        // Also initialize UserService with MockAuth for backward compatibility
        await UserService.initializeWithMockAuth();
        
        // Test the authentication
        await MockAuthService.testAuth();
        
        setIsInitialized(true);
        console.log('✅ App ready with mock authentication');
        console.log('📱 You can now test cart functionality!');
        
        // Log authentication status
        const customer = MockAuthService.getCurrentCustomer();
        if (customer) {
          console.log('🎯 Authenticated as:', customer.name, `(${customer.email})`);
        }
      } else {
        setInitError('Failed to initialize mock authentication. Check that taaha-customer and taaha-seller exist in your database.');
      }
    } catch (error) {
      console.error('💥 App initialization error:', error);
      setInitError(`App initialization failed: ${error}`);
    }
  };

  if (initError) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>❌ Error</Text>
        <Text style={styles.errorDetails}>{initError}</Text>
        <Text style={styles.helpText}>Check console for details</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>🔧 Initializing mock authentication...</Text>
        <Text style={styles.subText}>Setting up test user: {MOCK_CUSTOMER_EMAIL}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Products"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Products" 
            component={ProductsScreen}
            options={{
              header: () => <CustomHeader title="Products" showCart={true} />
            }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
            options={{ title: 'Shopping Cart' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { 
    marginTop: 16, 
    fontSize: 18, 
    color: '#333',
    fontWeight: '600',
    textAlign: 'center'
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  errorText: { 
    fontSize: 20, 
    color: '#FF3B30', 
    fontWeight: 'bold',
    marginBottom: 8
  },
  errorDetails: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 8
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center'
  }
});
