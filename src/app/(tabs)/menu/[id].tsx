import {Image, Text, View, StyleSheet, Pressable} from "react-native";
import {Stack, useLocalSearchParams} from "expo-router";
import React, {useCallback, useState} from "react";
import {products} from "@/assets/data/products";
import {defaultPizzaImg} from "@/src/components/ProductListItem";
import { Button } from "@/src/components/Button";

interface ProductDetailsScreenProps {
    className?: string
}

const sizes = ['S', 'M', 'L', 'XL'];

const ProductDetailsScreen = ({ className }: ProductDetailsScreenProps) => {
    const { id } = useLocalSearchParams();
    const [selectedSize, setSelectedSize] = useState('M');

    const product = products.find((p) => p.id.toString() === id);

    if (!product) {
        return <Text>Product not found</Text>
    }

    const onSelectedSizeChange = useCallback((newSize: string) => () => setSelectedSize(newSize), []);

    const addToCart = ()=>{}

    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: product.name}} />
            <Image source={{uri: product.image ?? defaultPizzaImg}} style={styles.image} />
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
