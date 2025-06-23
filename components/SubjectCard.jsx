import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SubjectCard = ({ subject }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{subject.Name}</Text>
      <Text style={styles.description}>{subject.Description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default SubjectCard;
