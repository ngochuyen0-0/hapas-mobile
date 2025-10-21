import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { getTabBarHeight } from '@/components/CustomTabBar';

// Hàm định dạng tiền Việt Nam
const formatVND = (amount: number): string => {
  return amount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });
};

export default function CartScreen() {
  const router = useRouter();
  const { state: cartState, updateQuantity, removeFromCart } = useCart();

  const subtotal = cartState.total;
  const shipping = 0; // Free shipping
 const total = subtotal + shipping;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Giỏ Hàng
      </ThemedText>

      {cartState.items.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText>Giỏ hàng của bạn trống</ThemedText>
        </ThemedView>
      ) : (
        <>
          <ThemedView style={styles.itemsContainer}>
            {cartState.items.map((item) => (
              <ThemedView key={item.id} style={styles.cartItem}>
                <View style={styles.itemImageContainer}>
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.itemImagePlaceholder}>No Image</Text>
                  )}
                </View>
                <ThemedView style={styles.itemDetails}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <ThemedText style={styles.itemPrice}>
                    {formatVND(
                      typeof item.price === 'number'
                        ? item.price
                        : parseFloat(item.price),
                    )}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.quantityContainer}>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </ThemedView>
                <ThemedView style={styles.itemActions}>
                  <ThemedText style={styles.itemTotal}>
                    {formatVND(
                      (typeof item.price === 'number'
                        ? item.price
                        : parseFloat(item.price)) * item.quantity,
                    )}
                  </ThemedText>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.removeButtonText}>Xóa</Text>
                  </Pressable>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>

          <ThemedView
            style={[
              styles.summaryContainer,
              { paddingBottom: getTabBarHeight() + 20 },
            ]}
          >
            <ThemedView style={styles.summaryRow}>
              <ThemedText>Tạm tính</ThemedText>
              <ThemedText>{formatVND(subtotal)}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.summaryRow}>
              <ThemedText>Phí vận chuyển</ThemedText>
              <ThemedText>Miễn Phí</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.summaryRow, styles.totalRow]}>
              <ThemedText type="defaultSemiBold">Tổng cộng</ThemedText>
              <ThemedText type="defaultSemiBold">{formatVND(total)}</ThemedText>
            </ThemedView>

            <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>
                Tiến hành thanh toán
              </Text>
            </Pressable>
          </ThemedView>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff0f5', // Light pink background
  },
  title: {
    marginBottom: 20,
    color: '#000000', // Black color for title
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff0f5', // Light pink background
  },
  itemsContainer: {
    flex: 1,
    backgroundColor: '#fff0f5', // Light pink background
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ffc0cb', // Light pink border
    backgroundColor: '#ffffff', // White background for items
    borderRadius: 8,
    marginVertical: 5,
    elevation: 2,
    shadowColor: '#00',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f8c6d0', // Light pink shade for image container
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  itemImagePlaceholder: {
    fontSize: 10,
    color: '#000000', // Black color
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemPrice: {
    marginTop: 4,
    color: '#000000', // Black color for price
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc0cb', // Light pink button
    borderRadius: 15,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black color for button text
  },
  quantity: {
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
    color: '#000000', // Black color for quantity text
    fontWeight: 'bold',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontWeight: 'bold',
    minWidth: 60,
    textAlign: 'right',
    color: '#000000', // Black color for total
  },
  removeButton: {
    marginTop: 5,
  },
  removeButtonText: {
    color: '#000000', // Black for remove button
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ffc0cb', // Light pink border
    paddingTop: 20,
    backgroundColor: '#fff0f5', // Light pink background
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ffc0cb', // Light pink border
    backgroundColor: '#ffe0e6', // Slightly darker pink for total row
    borderRadius: 5,
  },
  checkoutButton: {
    backgroundColor: '#ffc0cb', // Light pink background for checkout button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkoutButtonText: {
    color: '#000000', // Black text
    fontWeight: 'bold',
    fontSize: 16,
  },
});
