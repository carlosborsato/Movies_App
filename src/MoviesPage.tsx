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
const BASE_URL = 'https://api.themoviedb.org/3/movie';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Define Movie Type
type Movie = {
  id: number;
  poster_path: string | null;
  title: string;
  popularity: number;
  release_date: string;
  overview: string;
};

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('popular');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Movie Categories
  const categories: Record<string, string> = {
    popular: 'Popular',
    now_playing: 'Now Playing',
    upcoming: 'Upcoming',
    top_rated: 'Top Rated',
  };

  useEffect(() => {
    fetchMovies();
  }, [selectedCategory]);

  // Fetch Movies Function
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ results: Movie[] }>(
        `${BASE_URL}/${selectedCategory}`,
        { params: { api_key: API_KEY } }
      );

      setMovies(response.data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Category Change
  const handleCategoryChange = (itemValue: string) => {
    setSelectedCategory(itemValue);
  };

  // Show Movie Details
  const showMovieDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  // Close Movie Details
  const closeMovieDetails = () => {
    setModalVisible(false);
    setSelectedMovie(null);
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
          {movies.map((movie) => (
            <View key={movie.id} style={styles.movieContainer}>
              {movie.poster_path ? (
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
                  style={styles.movieImage}
                />
              ) : (
                <View>
                  <Text>No Image</Text>
                </View>
              )}
              <View style={styles.movieDetails}>
                <Text style={styles.movieTitle}>{movie.title}</Text>
                <Text>Popularity: {movie.popularity}</Text>
                <Text>Release Date: {movie.release_date}</Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => showMovieDetails(movie)}
                >
                  <Text style={styles.detailsButtonText}>More Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Movie Details Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeMovieDetails}
      >
        {selectedMovie && (
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={closeMovieDetails}>
              <Text style={styles.backButton}>⬅ Back to list</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${selectedMovie.poster_path}` }}
              style={styles.modalImage}
            />

            <Text style={styles.modalDescription}>{selectedMovie.overview}</Text>
            <Text style={styles.modalText}>Popularity: {selectedMovie.popularity}</Text>
            <Text style={styles.modalText}>Release Date: {selectedMovie.release_date}</Text>
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
  movieContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
  },
  movieImage: {
    width: 100,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
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

export default MoviesPage;


