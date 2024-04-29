import {FlatList, Platform, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {useCart} from "@/src/providers/CartProvider";
import {CartListItem} from "@/src/components/CartListItem";
import { Button } from "@/src/components/Button";

interface cartProps {
    className?: string
}

const CartScreen = ({ className }: cartProps) => {
    const {items, total} = useCart()

    return (
        <View style={{ padding: 10}}>
            <FlatList
                data={items}
                renderItem={({item}) => <CartListItem cartItem={item} />}
                contentContainerStyle={{ gap: 10}}
            />

            <Text style={{marginTop: 20, fontSize: 20, fontWeight: '500'}}>Total: ${total}</Text>

            <Button text="Checkout" />

            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
};

export default CartScreen;