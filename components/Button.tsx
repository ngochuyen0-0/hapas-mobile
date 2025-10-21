import { StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'light';
  style?: object;
}

export function Button({
  title,
  onPress,
  href,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}: ButtonProps) {
  const buttonStyle = StyleSheet.flatten([
    styles.button,
    { backgroundColor: getVariantColor(variant, 'background') },
    disabled && styles.disabled,
    style,
  ]);

  const textStyle = StyleSheet.flatten([
    styles.text,
    { color: getVariantColor(variant, 'text') },
  ]);

  const content = loading ? (
    <ActivityIndicator color={getVariantColor(variant, 'text')} />
  ) : (
    <Text style={textStyle}>{title}</Text>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable style={buttonStyle} disabled={disabled || loading}>
          {content}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {content}
    </Pressable>
  );
}

const getVariantColor = (variant: string, type: 'background' | 'text') => {
  const colors = {
    primary: { background: '#000', text: '#fff' },
    secondary: { background: '#666', text: '#fff' },
    danger: { background: '#ff4444', text: '#fff' },
    light: { background: '#fff0f5', text: '#000000' }, // nền hồng nhạt, chữ đen
  };

  return colors[variant as keyof typeof colors]?.[type] || colors.primary[type];
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});
