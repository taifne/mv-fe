// StarRating.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const StarRating = ({ rating, onRating }) => {
  const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={{ flexDirection: 'row', padding: 3, margin: 10 }}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={() => onRating(star)}>
          <Text style={{ fontSize: 20 }}>{star <= rating ? '★' : '☆'}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRating;
