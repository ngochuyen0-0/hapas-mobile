import { StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { getTabBarHeight } from '@/components/CustomTabBar';
import { useLocalSearchParams } from 'expo-router';

export default function OrderConfirmationScreen() {
 const params = useLocalSearchParams();
 const { orderId, orderDate, totalAmount, paymentMethod, shippingInfo } = params;
 
 // Helper function to get string value from params (which can be string or string[])
 const getStringParam = (param: string | string[] | undefined): string | undefined => {
   if (Array.isArray(param)) {
     return param[0];
   }
   return param;
 };
 
 // Parse shipping info if it's a JSON string
 const parsedShippingInfo = typeof getStringParam(shippingInfo) === 'string' ? JSON.parse(getStringParam(shippingInfo)!) : shippingInfo;

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Đặt Hàng Thành Công!
        </ThemedText>
        <ThemedText style={styles.message}>
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được nhận và đang được xử
          lý.
        </ThemedText>

        <ThemedView style={styles.orderDetails}>
          <ThemedText style={styles.detailLabel}>Số Đơn Hàng:</ThemedText>
          <ThemedText style={styles.detailValue}>
            #{getStringParam(orderId) || 'ORD-' + Date.now()}
          </ThemedText>

          <ThemedText style={styles.detailLabel}>Ngày Đặt Hàng:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {getStringParam(orderDate) ? new Date(getStringParam(orderDate)!).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')}
          </ThemedText>

          <ThemedText style={styles.detailLabel}>Tổng Cộng:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {getStringParam(totalAmount) ? Number(getStringParam(totalAmount)!).toLocaleString('vi-VN') + '₫' : '0₫'}
          </ThemedText>
          
          {getStringParam(paymentMethod) && (
            <>
              <ThemedText style={styles.detailLabel}>Phương Thức Thanh Toán:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {getStringParam(paymentMethod)}
              </ThemedText>
            </>
          )}
          
          {parsedShippingInfo && (
            <>
              <ThemedText style={styles.detailLabel}>Thông Tin Giao Hàng:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {parsedShippingInfo.fullName}, {parsedShippingInfo.phoneNumber}, {parsedShippingInfo.address}, {parsedShippingInfo.province}, {parsedShippingInfo.district}, {parsedShippingInfo.commune}
              </ThemedText>
            </>
          )}
        </ThemedView>

        <Button
          title="Tiếp Tục Mua Sắm"
          href="/"
          style={[styles.button, { marginBottom: getTabBarHeight() + 20 }]}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
 },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  orderDetails: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    marginBottom: 30,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailValue: {
    marginTop: 5,
  },
  button: {
    width: '100%',
  },
});
