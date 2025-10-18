import React from 'react';
import { View, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  image: string;
  title: string;
}

interface ImageSliderProps {
  slides: Slide[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Image
              source={{ uri: slide.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <ThemedText type="title" style={styles.slideTitle}>
                {slide.title}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 200,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  scrollContainer: {},
  slide: {
    width: width - 40,
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  slideTitle: {
    color: 'white',
    textAlign: 'center',
  },
});
