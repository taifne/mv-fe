import React, { useContext } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import AppContext from '../../utils/AppContext';

const WatchList = () => {
    const { watchList, setWatchList } = useContext(AppContext);

    const handleRemoveFromWatchList = (movieId) => {
        const updatedList = watchList.filter((movie) => movie.id !== movieId);
        setWatchList(updatedList);
    };

    return (
        <View>
            <Text>Watch List</Text>
            <FlatList
                data={watchList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.title}</Text>
                        <Button
                            title="Remove from Watch List"
                            onPress={() => handleRemoveFromWatchList(item.id)}
                        />
                    </View>
                )}
            />
        </View>
    );
};

export default WatchList;