import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

// API Configuration
const API_KEY = 'e7587f2592dd33e40709fa8d98832a81';
const BASE_URL = 'https://api.themoviedb.org/3/tv';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Define TV Show Type
type TVShow = {
  id: number;
  poster_path: string | null;
  name: string;
  popularity: number;
  first_air_date: string;
  overview: string;
};

const TVShowsPage = () => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('popular');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTVShow, setSelectedTVShow] = useState<TVShow | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // TV Show Categories
  const categories: Record<string, string> = {
    airing_today: 'Airing Today',
    on_the_air: 'On The Air',
    popular: 'Popular',
    top_rated: 'Top Rated',
  };

  useEffect(() => {
    fetchTVShows();
  }, [selectedCategory]);

  // Fetch TV Shows Function
  const fetchTVShows = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ results: TVShow[] }>(
        `${BASE_URL}/${selectedCategory}`,
        { params: { api_key: API_KEY } }
      );

      setTVShows(response.data.results || []);
    } catch (error) {
      console.error('Error fetching TV shows:', error);
      setError('Failed to fetch TV shows. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Category Change
  const handleCategoryChange = (itemValue: string) => {
    setSelectedCategory(itemValue);
  };

  // Show TV Show Details
  const showTVShowDetails = (tvShow: TVShow) => {
    setSelectedTVShow(tvShow);
    setModalVisible(true);
  };

  // Close TV Show Details
  const closeTVShowDetails = () => {
    setModalVisible(false);
    setSelectedTVShow(null);
  };

  return (
    <View style={styles.container}>
      {/* Picker Dropdown */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={handleCategoryChange}
          style={styles.picker}
        >
          {Object.entries(categories).map(([key, value]) => (
            <Picker.Item key={key} label={value} value={key} />
          ))}
        </Picker>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {tvShows.map((tvShow) => (
            <View key={tvShow.id} style={styles.tvShowContainer}>
              {tvShow.poster_path ? (
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${tvShow.poster_path}` }}
                  style={styles.tvShowImage}
                />
              ) : (
                <View>
                  <Text>No Image</Text>
                </View>
              )}
              <View style={styles.tvShowDetails}>
                <Text style={styles.tvShowTitle}>{tvShow.name}</Text>
                <Text>Popularity: {tvShow.popularity}</Text>
                <Text>First Air Date: {tvShow.first_air_date}</Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => showTVShowDetails(tvShow)}
                >
                  <Text style={styles.detailsButtonText}>More Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* TV Show Details Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeTVShowDetails}
      >
        {selectedTVShow && (
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={closeTVShowDetails}>
              <Text style={styles.backButton}>⬅ Back to list</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedTVShow.name}</Text>
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${selectedTVShow.poster_path}` }}
              style={styles.modalImage}
            />

            <Text style={styles.modalDescription}>{selectedTVShow.overview}</Text>
            <Text style={styles.modalText}>Popularity: {selectedTVShow.popularity}</Text>
            <Text style={styles.modalText}>First Air Date: {selectedTVShow.first_air_date}</Text>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    padding: 10,
  },
  pickerContainer: {
    width: '60%',
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  picker: {
    width: '80%',
    height: 50,
  },
  scrollView: {
    paddingBottom: 20,
  },
  tvShowContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
  },
  tvShowImage: {
    width: 100,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
  },
  tvShowDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  tvShowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailsButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 18,
    color: 'blue',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  modalImage: {
    width: 300,
    height: 450,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default TVShowsPage;
