import {ActivityIndicator, FlatList, Text} from 'react-native';
import {OrderListItem} from "@/src/components/OrderListItem";
import {useAdminOrderList} from "@/src/api/orders";
import {supabase} from "@/src/lib/supabase";
import {useEffect} from "react";
import {useQueryClient} from "@tanstack/react-query";

export default function OrdersScreen() {
    const { data: orders, isLoading, error, refetch } = useAdminOrderList({ archived: false });

    const queryClient = useQueryClient();

    useEffect(() => {
        const orders = supabase
            .channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                () => {
                    queryClient.invalidateQueries({queryKey:['orders']})                }
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

    return (
        <>
            <FlatList
                data={orders}
                contentContainerStyle={{ gap: 10, padding: 10 }}
                renderItem={({ item }) => <OrderListItem order={item} />}
            />
        </>
    );
}
