import { StyleSheet, View, Text, Image, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { formatCurrency } from '@/lib/utils';
import { FavoriteButton } from './FavoriteButton';
import { useFavorites } from '@/context/FavoritesContext';
import { Product } from '@/types/api';

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const currentIsFavorite = isFavorite(product.id);

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const toggleFavorite = () => {
    if (currentIsFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_urls
          ? typeof product.image_urls === 'string'
            ? product.image_urls.split(',')[0]
            : product.image_urls[0]
          : product.image || '',
      });
    }
  };

  // Handle category display (could be string or object)
  const categoryName =
    typeof product.category === 'string'
      ? product.category
      : typeof product.category === 'object' && product.category?.name
        ? product.category.name
        : 'Không phân loại';

  // Handle image display - prefer image_urls over image
  const getImageSource = () => {
    // Check if image_urls exists and is not empty
    if (product.image_urls) {
      const urls = product.image_urls.startsWith('data:image')
        ? [product.image_urls]
        : product.image_urls.split(',');
      const firstUrl = urls[0].trim();
      if (firstUrl) {
        return { uri: firstUrl };
      }
    }
    // Fallback to image if image_urls is not available
    if (product.image) {
      return { uri: product.image };
    }
    // No image available
    return null;
  };

  const imageSource = getImageSource();

  return (
    <Pressable onPress={handlePress} style={styles.card}>
      <View style={styles.imageContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        <FavoriteButton
          isFavorite={currentIsFavorite}
          onPress={toggleFavorite}
        />
      </View>
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {product.name}
        </ThemedText>
        <ThemedText style={styles.category}>{categoryName}</ThemedText>
        <ThemedText style={styles.price}>
          {formatCurrency(product.price)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: '47%',
  },
  imageContainer: {
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  content: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
});
