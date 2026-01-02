import { Card, Text, Badge, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { Recommendation, Listing } from '../../types/database';

interface RecommendationCardProps {
    recommendation: Recommendation;
    listing: Listing;
    onPress: () => void;
}

export const RecommendationCard = ({ recommendation, listing, onPress }: RecommendationCardProps) => {
    const discount = Math.round(((listing.price - 100) / listing.price) * 100); // Mock logic for display

    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Cover source={{ uri: listing.images?.[0] || 'https://via.placeholder.com/400x200' }} />
            <Card.Content style={styles.content}>
                <View style={styles.header}>
                    <Text variant="titleLarge" numberOfLines={1} style={styles.title}>
                        {listing.title}
                    </Text>
                    <Badge style={styles.badge}>{recommendation.priority === 1 ? 'High' : 'Normal'}</Badge>
                </View>
                <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                    {listing.description || 'No description available.'}
                </Text>
                <View style={styles.footer}>
                    <Text variant="headlineSmall" style={styles.price}>
                        ${listing.price}
                    </Text>
                    {discount > 0 && (
                        <Text variant="bodySmall" style={styles.discount}>
                            -{discount}%
                        </Text>
                    )}
                </View>
            </Card.Content>
            <Card.Actions>
                <Button mode="text">Dismiss</Button>
                <Button mode="contained" onPress={onPress}>View Details</Button>
            </Card.Actions>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 2,
    },
    content: {
        paddingTop: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        flex: 1,
        marginRight: 8,
    },
    badge: {
        backgroundColor: '#ff4444',
    },
    description: {
        color: '#666',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontWeight: 'bold',
        color: '#007bff',
    },
    discount: {
        marginLeft: 8,
        color: '#28a745',
        fontWeight: 'bold',
    },
});
