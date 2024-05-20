import {Image, Text, View, StyleSheet, Pressable} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useState} from "react";
import {products} from "@/assets/data/products";
import {defaultPizzaImg} from "@/src/components/ProductListItem";
import { Button } from "@/src/components/Button";
import {useCart} from "@/src/providers/CartProvider";
import {PizzaSize} from "@/src/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Colors} from "@/src/constants/Colors";

interface ProductDetailsScreenProps {
    className?: string
}

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailsScreen = ({ className }: ProductDetailsScreenProps) => {
    const { id } = useLocalSearchParams();
    const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
    const {addItem} = useCart();
    const router = useRouter();

    const product = products.find((p) => p.id.toString() === id);

    if (!product) {
        return <Text>Product not found</Text>
    }

    const onSelectedSizeChange = useCallback((newSize: PizzaSize) => () => setSelectedSize(newSize), []);

    const addToCart = () => {
        addItem(product, selectedSize);
        router.push('/cart');
    }

    return (
        <View style={styles.container}>

            <Stack.Screen
                options={{
                    title: 'Menu',
                    headerRight: () => (
                        <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome
                                        name="edit"
                                        size={25}
                                        color={Colors.light.tint}
                                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />

            <Stack.Screen options={{title: product.name}} />
            <Image source={{uri: product.image ?? defaultPizzaImg}} style={styles.image} />

            <Text style={styles.title}>${product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 10
    },
    image: {
        width: '100%',
        aspectRatio: 1
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
    }
})

export default ProductDetailsScreen;
