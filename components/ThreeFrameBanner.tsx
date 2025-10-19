import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface BannerItem {
  id: string;
  image: string;
  title: string;
}

interface ThreeFrameBannerProps {
 banners: BannerItem[];
  onPress?: (item: BannerItem) => void;
}

const ThreeFrameBanner: React.FC<ThreeFrameBannerProps> = ({ banners, onPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handlePress = (item: BannerItem) => {
    if (onPress) {
      onPress(item);
    }
  };

  // Group banners into sets of 3
  const groupedBanners = [];
  for (let i = 0; i < banners.length; i += 3) {
    groupedBanners.push(banners.slice(i, i + 3));
  }

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width}
        snapToAlignment="center"
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {groupedBanners.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.threeFrameContainer}>
            {group.map((banner, index) => (
              <TouchableOpacity 
                key={banner.id}
                style={[
                  styles.frame,
                  { 
                    marginRight: index === group.length - 1 ? 0 : 8,
                    width: (width - 36) / 3, // Divide width by 3 with margin
                  }
                ]}
                onPress={() => handlePress(banner)}
              >
                <Image source={{ uri: banner.image }} style={styles.image} />
                <View style={styles.overlay}>
                  <Text style={styles.title}>{banner.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      
      {/* Pagination indicators */}
      <View style={styles.pagination}>
        {groupedBanners.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.paginationDot,
              { 
                backgroundColor: index === activeIndex ? '#4A90E2' : '#E0E0E0' 
              }
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
 threeFrameContainer: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frame: {
    height: 200, // Increased height
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
    opacity: 0.7,
  },
});

export default ThreeFrameBanner;