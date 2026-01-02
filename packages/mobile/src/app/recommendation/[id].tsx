import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Button, Card, Divider, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Mock fetching logic for now
const getMockDetail = (id: string) => ({
    recommendation: { id, priority: 1, reasoning: 'This vintage item is priced 30% below market average for this condition.' },
    listing: {
        title: 'Vintage Record Player',
        price: 150,
        description: 'A beautiful piece of history. This record player has been meticulously maintained and sounds as good as it looks. Perfect for any audiophile or collector.',
        images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=600'],
        marketplace: 'eBay',
        condition: 'Excellent',
    }
});

export default function RecommendationDetail() {
    const { id } = useLocalSearchParams();
    const theme = useTheme();
    const router = useRouter();
    const data = getMockDetail(id as string);

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: data.listing.images[0] }} style={styles.image} />

            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>{data.listing.title}</Text>

                <View style={styles.priceRow}>
                    <Text variant="displaySmall" style={{ color: theme.colors.primary }}>${data.listing.price}</Text>
                    <Text variant="labelLarge" style={styles.marketplace}>{data.listing.marketplace}</Text>
                </View>

                <Divider style={styles.divider} />

                <Text variant="titleMedium" style={styles.sectionTitle}>AI Analytics</Text>
                <Card style={styles.reasoningCard}>
                    <Card.Content>
                        <Text variant="bodyMedium">{data.recommendation.reasoning}</Text>
                    </Card.Content>
                </Card>

                <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
                <Text variant="bodyMedium" style={styles.description}>{data.listing.description}</Text>

                <View style={styles.infoRow}>
                    <Text variant="labelLarge">Condition: <Text variant="bodyMedium">{data.listing.condition}</Text></Text>
                </View>
            </View>

            <View style={styles.actions}>
                <Button mode="outlined" style={styles.button} onPress={() => router.back()}>Back</Button>
                <Button mode="contained" style={styles.button} onPress={() => console.log('Buy pressed')}>Buy Now</Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
    },
    content: {
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    marketplace: {
        backgroundColor: '#eee',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    divider: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },
    reasoningCard: {
        backgroundColor: '#f0f7ff',
        marginBottom: 20,
    },
    description: {
        lineHeight: 22,
        color: '#444',
    },
    infoRow: {
        marginTop: 20,
        marginBottom: 40,
    },
    actions: {
        flexDirection: 'row',
        padding: 20,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    button: {
        flex: 1,
    },
});
