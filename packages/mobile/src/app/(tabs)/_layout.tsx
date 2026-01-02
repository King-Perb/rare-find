import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const SearchIcon = ({ color }: { color: string }) => (
    <MaterialCommunityIcons name="magnify" size={28} color={color} />
);

const PreferencesIcon = ({ color }: { color: string }) => (
    <MaterialCommunityIcons name="cog" size={28} color={color} />
);

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: theme.colors.primary,
            headerShown: true,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Search',
                    tabBarIcon: SearchIcon,
                }}
            />
            <Tabs.Screen
                name="preferences"
                options={{
                    title: 'Preferences',
                    tabBarIcon: PreferencesIcon,
                }}
            />
        </Tabs>
    );
}
