import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: (text: string) => void;
  isSearching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onSearch, isSearching }) => {
  
  const handleSearch = () => {
    onSearch(value);
 };

  const clearText = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      {/* Unified Search Input */}
      <View style={styles.searchContainer}>
        {/* Search Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
            placeholderTextColor="#A0A0A0"
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={handleSearch}
          />
          {value.length > 0 && (
            <TouchableOpacity onPress={clearText} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          {isSearching ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Tìm</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 15,
    margin: 5,
  },
 searchIcon: {
    marginRight: 10,
  },
 searchInput: {
    flex: 1,
    height: 45,
    fontSize: 15,
    color: '#333333',
  },
  clearButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#CCCCCC',
  },
 searchButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 5,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SearchBar;