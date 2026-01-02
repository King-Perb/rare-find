import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

export default function SearchScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Search Recommendations</Text>
            <Button mode="contained" onPress={() => console.log('Search pressed')}>
                Explore Deals
            </Button>
        </View>
    );
}
