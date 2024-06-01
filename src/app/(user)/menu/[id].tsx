import {Image, Text, View, StyleSheet, Pressable, ActivityIndicator} from "react-native";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useState} from "react";
import {defaultPizzaImg} from "@/src/components/ProductListItem";
import { Button } from "@/src/components/Button";
import {useCart} from "@/src/providers/CartProvider";
import {PizzaSize} from "@/src/types";
import {useProduct} from "@/src/api/products";
import {RemoteImage} from "@/src/components/RemoteImage";

interface ProductDetailsScreenProps {
    className?: string
}

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailsScreen = ({ className }: ProductDetailsScreenProps) => {
    const { id } = useLocalSearchParams();

    const {
        data: product,
        isLoading,
        error,
    } = useProduct(parseInt(typeof id === 'string' ? id : id[0]));

    const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
    const {addItem} = useCart();
    const router = useRouter();

    const onSelectedSizeChange = useCallback((newSize: PizzaSize) => () => setSelectedSize(newSize), []);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error || !product) {
        return <Text>Failed to fetch product</Text>;
    }

    const addToCart = () => {
        addItem(product, selectedSize);
        router.push('/cart');
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: product.name}} />
            <RemoteImage
                fallback={defaultPizzaImg}
                path={product.image}
                style={styles.image}
            />
            <Text>Select size</Text>

            <View style={styles.sizes}>
                {sizes.map((size) => (
                    <Pressable onPress={onSelectedSizeChange(size)} key={size} style={[styles.size, { backgroundColor: selectedSize === size ? "gainsboro" : "white",}]}>
                        <Text style={[styles.sizeText, { color: selectedSize === size ? 'black' : 'gray'}]}>{size}</Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.price}>${product.price}</Text>
            <Button text="Add to cart" onPress={addToCart} />
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
        marginTop: 'auto',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sizes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10
    },
    size: {
        width: 50,
        aspectRatio: 1,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    sizeText: {
        fontSize: 20,
        fontWeight: '500',
    }
})

export default ProductDetailsScreen;
