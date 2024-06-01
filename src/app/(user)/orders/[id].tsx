import {View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import {OrderItemListItem} from '@/src/components/OrderItemListItem';
import {OrderListItem} from '@/src/components/OrderListItem';
import {useOrderDetails} from "@/src/api/orders";
import {useEffect} from "react";
import {supabase} from "@/src/lib/supabase";
import {useQueryClient} from "@tanstack/react-query";

const OrderDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const { data: order, isLoading, error } = useOrderDetails(parseInt(typeof id === 'string' ? id : id[0]));

    const queryClient = useQueryClient();

    useEffect(() => {
        const orders = supabase
            .channel('custom-filter-channel')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${id}`,
                },
                (payload) => {
                    queryClient.invalidateQueries({queryKey: ['order', id]})
                }
            )
            .subscribe();

        return () => {
            orders.unsubscribe();
        };
    }, []);

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
