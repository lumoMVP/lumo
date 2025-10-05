import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';

type SellerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Seller'>;

export const SellerScreen: React.FC = () => {
  const navigation = useNavigation<SellerScreenNavigationProp>();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [parsedPayload, setParsedPayload] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const handleProductsPress = () => {
    navigation.navigate('Products');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleCallApi = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setParsedPayload(null);
    const startTimeMs = Date.now();
    try {
      const url = `https://api.upcitemdb.com/prod/trial/search?s=${encodeURIComponent(query.trim())}`;
      console.log('[SellerScreen] Request URL:', url);
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      const data = await response.json();

      // Parse only the first result and map to Products schema-esque fields
      const items = Array.isArray(data?.items) ? data.items : [];
      if (items.length === 0) {
        const totalLatencyMs = Date.now() - startTimeMs;
        const payload = { message: 'No results found', latencyMs: totalLatencyMs };
        const json = JSON.stringify(payload, null, 2);
        console.log('[SellerScreen] Summary JSON:', payload);
        setResult(json);
        setParsedPayload(payload);
        return;
      }

      const first = items[0] ?? {};
      const name = first?.title ?? first?.description ?? 'Untitled';
      const description = first?.description ?? null;
      const images = Array.isArray(first?.images) ? first.images : [];
      let imageUrl = images.length > 0 ? images[0] : null;
      const category = first?.category ?? null;
      const brand = first?.brand ?? null;
      const upc = first?.upc ?? null;
      // price removed per requirements
      // availability/available removed per requirements

      // Optional: Enrich with OpenFoodFacts nutriments if UPC exists
      let nutrimentsData: any = null;
      if (upc) {
        try {
          const offUrl = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(upc)}`;
          console.log('[SellerScreen] OFF Request URL:', offUrl);
          const offResp = await fetch(offUrl, { method: 'GET' });
          if (offResp.ok) {
            const offData = await offResp.json();
            const offProduct = offData?.product ?? null;
            const n = offProduct?.nutriments ?? null;
            if (!imageUrl && offProduct?.image_url) imageUrl = offProduct.image_url;
            nutrimentsData = n;
          } else {
            console.log('[SellerScreen] OFF non-OK:', offResp.status);
          }
        } catch (e) {
          console.log('[SellerScreen] OFF fetch error:', e);
        }
      }

      // Build structured JSON payload
      const totalLatencyMs = Date.now() - startTimeMs;
      let nutriments: any | undefined;
      if (nutrimentsData) {
        try {
          const n = nutrimentsData as any;
          nutriments = {
            caloriesKcal: n['energy-kcal'] ?? n['energy-kcal_100g'] ?? n['energy-kcal_serving'] ?? n.energy_kcal ?? null,
            fatG: n.fat ?? n['fat_100g'] ?? n['fat_serving'] ?? null,
            sugarsG: n.sugars ?? n['sugars_100g'] ?? n['sugars_serving'] ?? null,
            proteinG: n.proteins ?? n['proteins_100g'] ?? n['proteins_serving'] ?? null,
            carbsG: n.carbohydrates ?? n['carbohydrates_100g'] ?? n['carbohydrates_serving'] ?? null,
            sodiumG: n.sodium ?? n['sodium_100g'] ?? n['sodium_serving'] ?? null,
          };
        } catch {
          // ignore
        }
      }

      const payload = {
        name,
        description,
        image_url: imageUrl,
        category,
        brand,
        upc,
        nutriments,
        latencyMs: totalLatencyMs,
      };
      const json = JSON.stringify(payload, null, 2);
      console.log('[SellerScreen] First Item Mapped JSON:', payload);
      setResult(json);
      setParsedPayload(payload);
    } catch (e: any) {
      console.error('[SellerScreen] Error:', e);
      const errMsg = e?.message ? `Error: ${e.message}` : 'Failed to fetch data.';
      // Try to include latency if available
      try {
        const totalLatencyMs = Date.now() - startTimeMs;
        const errWithLatency = `${errMsg}\nLatency: ${totalLatencyMs} ms`;
        setResult(errWithLatency);
      } catch {
        setResult(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCatalog = async () => {
    if (!parsedPayload || !parsedPayload.upc) return;
    try {
      setSaving(true);
      const insertData: any = {
        upc: String(parsedPayload.upc),
        name: String(parsedPayload.name ?? ''),
        description: parsedPayload.description ?? null,
        image_url: parsedPayload.image_url ?? null,
        category: parsedPayload.category ?? null,
        brand: parsedPayload.brand ?? null,
        nutriments: parsedPayload.nutriments ?? null,
      };

      const { error } = await supabase
        .from('catalog')
        .upsert(insertData, { onConflict: 'upc' });

      if (error) {
        console.error('[SellerScreen] Save to Catalog error:', error);
        Alert.alert('Save Failed', error.message);
        return;
      }
      Alert.alert('Saved', 'Product saved to catalog.');
    } catch (e: any) {
      console.error('[SellerScreen] Save to Catalog exception:', e);
      Alert.alert('Save Failed', e?.message ?? 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Seller Tools</Text>
        <Text style={styles.subtitle}>Enter a string to query the API</Text>

        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Type query..."
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleCallApi}
        />

        <TouchableOpacity 
          style={[styles.button, !query.trim() && styles.buttonDisabled]} 
          onPress={handleCallApi}
          disabled={!query.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Call API</Text>
          )}
        </TouchableOpacity>

        {result !== null && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Result</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}

        {parsedPayload?.upc && (
          <TouchableOpacity 
            style={[styles.button, saving && styles.buttonDisabled, { marginTop: 12 }]}
            onPress={handleSaveToCatalog}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save to Catalog</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleProductsPress}>
          <Text style={styles.navIcon}>🛍️</Text>
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>

        <View style={[styles.navItem, styles.activeNavItem]}>
          <Text style={styles.navIcon}>🧑‍💼</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Seller</Text>
        </View>

        <TouchableOpacity style={styles.navItem} onPress={handleSettingsPress}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 16,
    backgroundColor: '#F8F9FB',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  resultLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#999',
  },
  activeNavText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});


