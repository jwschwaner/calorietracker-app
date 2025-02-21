import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Ingredient } from '../utils/interfaces/Ingredient';
import { IngredientsService } from '../utils/services/IngredientsService';

type Props = {
    onSelectIngredient: (ingredient: Ingredient) => void;
};

export const IngredientSearchAutoComplete: React.FC<Props> = ({ onSelectIngredient }) => {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState<Ingredient[]>([]);

    const handleChangeText = (text: string) => {
        setSearchText(text);

        // Query the service for partial matches
        const matches = IngredientsService.searchIngredients(text);
        setResults(matches);
    };

    const handleSelect = (ingredient: Ingredient) => {
        // Fill input with the exact name
        setSearchText(ingredient.name);
        // Clear results
        setResults([]);
        // Notify parent
        onSelectIngredient(ingredient);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                value={searchText}
                placeholder="Search ingredient..."
                onChangeText={handleChangeText}
            />

            {/* Show suggestions if there's any results and user has typed something */}
            {searchText.length > 0 && results.length > 0 && (
                <FlatList
                    style={styles.suggestionsList}
                    nestedScrollEnabled={true}
                    data={results}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => handleSelect(item)}
                        >
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 4,
    },
    suggestionsList: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 4,
        backgroundColor: '#fff',
        maxHeight: 200, // so the list doesn't grow infinitely
    },
    suggestionItem: {
        padding: 8,
    },
});
