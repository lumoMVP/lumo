import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Welcome from "./components/Welcome";

export default function App() {
  return (
    <View style={styles.container}>
      <Welcome />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" }
});
