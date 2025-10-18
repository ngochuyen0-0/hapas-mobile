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
  const tax = Math.round(subtotal * 0.08); // Round tax to whole number
  const total = subtotal + shipping + tax;

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
            <ThemedView style={styles.summaryRow}>
              <ThemedText>Thuế</ThemedText>
              <ThemedText>{formatVND(tax)}</ThemedText>
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
  },
  title: {
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemsContainer: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f0f0',
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
    color: '#999',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemPrice: {
    marginTop: 4,
    color: '#666',
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
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontWeight: 'bold',
    minWidth: 60,
    textAlign: 'right',
  },
  removeButton: {
    marginTop: 5,
  },
  removeButtonText: {
    color: '#ff4444',
    fontSize: 12,
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkoutButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
