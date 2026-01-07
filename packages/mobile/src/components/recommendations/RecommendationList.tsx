import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { RecommendationCard } from './RecommendationCard';
import { Recommendation, Listing } from '../../types/database';
import { useState } from 'react';

interface RecommendationListProps {
    data: { recommendation: Recommendation; listing: Listing }[];
    onRecommendationPress: (id: string) => void;
    onRefresh?: () => void | Promise<void>;
}

export const RecommendationList = ({ data, onRecommendationPress, onRefresh }: RecommendationListProps) => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (onRefresh) {
            setRefreshing(true);
            try {
                const result = onRefresh();
                // Only await if result is actually a Promise
                if (result && typeof result === 'object' && 'then' in result && typeof result.then === 'function') {
                    await result;
                }
            } finally {
                setRefreshing(false);
            }
        }
    };

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.recommendation.id}
            renderItem={({ item }) => (
                <RecommendationCard
                    recommendation={item.recommendation}
                    listing={item.listing}
                    onPress={() => onRecommendationPress(item.recommendation.id)}
                />
            )}
            contentContainerStyle={styles.list}
            refreshControl={
                onRefresh ? (
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                ) : undefined
            }
        />
    );
};

const styles = StyleSheet.create({
    list: {
        paddingBottom: 20,
    },
});
