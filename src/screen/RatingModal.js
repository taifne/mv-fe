// RatingModal.js
import React, { useState } from 'react';
import { Modal, View, Button, Text } from 'react-native';
import StarRating from './StarRating';

const RatingModal = ({ visible, onClose, point }) => {
  const [rating, setRating] = useState(point);

  const handleRating = (rated) => {
    // Handle the rating logic, e.g., send the rating to a server
    console.log('Rated:', rated);
    setRating(rated);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20 }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Rate this movie</Text>
          <StarRating rating={rating} onRating={handleRating} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;
