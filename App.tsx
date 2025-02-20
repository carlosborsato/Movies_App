import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MoviesPage from './src/MoviesPage';
import SearchResultsPage from './src/SearchResultsPage';
import TVShowsPage from './src/TVShowsPage';

const App = () => {
  const [activeTab, setActiveTab] = useState('Movies');

  const renderPage = () => {
    switch (activeTab) {
      case 'Movies':
        return <MoviesPage />;
      case 'Search Results':
        return <SearchResultsPage />;
      case 'TV Shows':
        return <TVShowsPage />;
      default:
        return <MoviesPage />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Movies App</Text>

      <View style={styles.tabsContainer}>
        {['Movies', 'Search Results', 'TV Shows'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab ? styles.activeTabText : styles.inactiveTabText,
                activeTab === tab && styles.activeTabUnderline,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.pageContainer}>{renderPage()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
    backgroundColor: 'black',
    padding: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 0,
    borderBottomWidth:1,
    borderBottomColor: 'lightgrey'
  },
  tab: {
    paddingHorizontal: 10,
  },
  tabText: {
    fontSize: 16,
    paddingBottom: 10,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: 'black',
  },
  inactiveTabText: {
    color: 'grey',
  },
  activeTabUnderline: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    fontSize: 20,
  },
});


export default App;
