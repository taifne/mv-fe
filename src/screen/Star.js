// StarRating.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Star = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
      {stars.map((star) => (

        <Text key={star} style={{ color: 'yellow' }}>{star <= rating ? '★' : '☆'}</Text>

      ))}
    </View>
  );
};

export default Star;
