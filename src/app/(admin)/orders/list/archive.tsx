import { FlatList } from 'react-native';
import { Stack } from 'expo-router';
import {OrderListItem} from "@/src/components/OrderListItem";
import {orders} from "@/assets/data/orders";

export default function ArchiveOrdersScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Archive' }} />
            <FlatList
                data={orders}
                contentContainerStyle={{ gap: 10, padding: 10 }}
                renderItem={({ item }) => <OrderListItem order={item} />}
            />
        </>
    );
}
