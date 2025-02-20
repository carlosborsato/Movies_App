import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const API_KEY = 'e7587f2592dd33e40709fa8d98832a81';
const BASE_URL = 'https://api.themoviedb.org/3/search';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

type SearchResult = {
  id: number;
  poster_path: string | null;
  title?: string;
  name?: string;
  popularity: number;
  release_date?: string;
  first_air_date?: string;
  overview: string;
};

const SearchResultsPage = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'movie' | 'tv' | 'multi'>('movie');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!query) {
      setInputError('Movie/TV show name is required');
      return;
    }
    setInputError(null);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ results: SearchResult[] }>(
        `${BASE_URL}/${searchType}`,
        { params: { api_key: API_KEY, query } }
      );
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showDetails = (result: SearchResult) => {
    setSelectedResult(result);
    setModalVisible(true);
  };

  const closeDetails = () => {
    setModalVisible(false);
    setSelectedResult(null);
  };

  return (
    <View style={styles.container}>
      <Text>Search Movie / TV Show Name</Text>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="i.e. James Bond"
          value={query}
          onChangeText={setQuery}
        />
      </View>


      <Text>Choose Search Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={searchType}
          onValueChange={(itemValue) => setSearchType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Movie" value="movie" />
          <Picker.Item label="TV" value="tv" />
          <Picker.Item label="Multi" value="multi" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      {inputError && <Text style={styles.errorText}>{inputError}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {results.map((result) => (
            <View key={result.id} style={styles.resultContainer}>
              {result.poster_path ? (
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${result.poster_path}` }}
                  style={styles.resultImage}
                />
              ) : (
                <View><Text>No Image</Text></View>
              )}
              <View style={styles.resultDetails}>
                <Text style={styles.resultTitle}>{result.title || result.name}</Text>
                <Text>Popularity: {result.popularity}</Text>
                <Text>Release Date: {result.release_date || result.first_air_date}</Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => showDetails(result)}
                >
                  <Text style={styles.detailsButtonText}>More Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeDetails}
      >
        {selectedResult && (
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={closeDetails}>
              <Text style={styles.backButton}>⬅ Back to list</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedResult.title || selectedResult.name}</Text>
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${selectedResult.poster_path}` }}
              style={styles.modalImage}
            />
            <Text style={styles.modalDescription}>{selectedResult.overview}</Text>
            <Text style={styles.modalText}>Popularity: {selectedResult.popularity}</Text>
            <Text style={styles.modalText}>Release Date: {selectedResult.release_date || selectedResult.first_air_date}</Text>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, width: '90%', padding: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  icon: { marginRight: 5 },
  input: { flex: 1, height: 40, paddingLeft: 10 },
  searchButton: { backgroundColor: 'blue', padding: 10, borderRadius: 5, marginTop: 10 },
  searchButtonText: { color: 'white', textAlign: 'center' },
  picker: { height: 50, width: '60%'},
  pickerContainer: { borderWidth: 1, borderColor: 'black', borderStyle: 'solid' },
  scrollView: { paddingBottom: 20 },
  resultContainer: { flexDirection: 'row', marginBottom: 15, padding: 10, backgroundColor: '#f8f8f8', borderRadius: 8 },
  resultImage: { width: 100, height: 150, marginRight: 10, borderRadius: 8 },
  resultDetails: { flex: 1 },
  resultTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  detailsButton: { backgroundColor: 'blue', padding: 8, borderRadius: 5, marginTop: 5 },
  detailsButtonText: { color: 'white', fontWeight: 'bold' },
  modalContainer: { flex: 1, padding: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  backButton: { fontSize: 18, color: 'blue', marginBottom: 20 },
  modalImage: { width: 300, height: 450, borderRadius: 10 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  modalText: { fontSize: 16, marginBottom: 5},
  modalDescription: { fontSize: 14, textAlign: 'center', paddingHorizontal: 10},
  errorText: { color: 'red', marginTop: 5 },
});

export default SearchResultsPage;
