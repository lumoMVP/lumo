import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { ProductsScreen } from "./components/ProductsScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <ProductsScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
