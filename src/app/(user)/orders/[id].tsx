import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import {OrderItemListItem} from '@/src/components/OrderItemListItem';
import {OrderListItem} from '@/src/components/OrderListItem';
import {useOrderDetails} from "@/src/api/orders";

const OrderDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const { data: order, isLoading, error } = useOrderDetails(parseInt(typeof id === 'string' ? id : id[0]));

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Failed to fetch</Text>;
    }

    if (!order) {
        return <Text>Not found</Text>;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: `Order #${order.id}` }} />

            <FlatList
                data={order.order_items}
                renderItem={({ item }) => <OrderItemListItem item={item} />}
                contentContainerStyle={{ gap: 10 }}
                ListHeaderComponent={() => <OrderListItem order={order} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        gap: 10,
    },
});

export default OrderDetailScreen;
