import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useLocation from '../hooks/useLocation';

export default function HomeScreen() {
  const [location, setLocation] = useState('Bharatpur-Rajasthan'); // Default Location
  const { latitude, longitude, errorMsg, readableLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Render a single product item
  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Location */}
      <View style={styles.header}>
        <Icon name="location-outline" size={24} color="#fff" />
        <Text style={styles.locationText}>
          {readableLocation?.formattedAddress || location}
        </Text>
      </View>

      {/* Search Box */}
      <TextInput
        style={styles.searchBox}
        placeholder="Search products..."
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Product List */}
      {loading ? (
        <ActivityIndicator size="large" color="#f97316" />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.productList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  searchBox: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productList: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  productDetails: {
    marginLeft: 15,
    justifyContent: 'center',
    flex: 1, // Prevents overflow of text
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    color: '#333',
    maxWidth: '100%', // बॉक्स के अंदर तक सीमित
    overflow: 'hidden', // टेक्स्ट को कट करें
    textOverflow: 'ellipsis', // अंत में '...' दिखाए
    whiteSpace: 'nowrap', // एक ही लाइन में रखें
  },
  productPrice: {
    fontSize: 16,
    color: '#f97316',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    color: '#888',
  },
});
