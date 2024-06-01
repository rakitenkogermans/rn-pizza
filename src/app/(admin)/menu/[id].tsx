import {Image, Text, View, StyleSheet, Pressable, ActivityIndicator} from "react-native";
import {Link, Stack, useLocalSearchParams} from "expo-router";
import React from "react";
import {defaultPizzaImg} from "@/src/components/ProductListItem";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Colors} from "@/src/constants/Colors";
import {useProduct} from "@/src/api/products";
import {RemoteImage} from "@/src/components/RemoteImage";

interface ProductDetailsScreenProps {
    className?: string
}

const ProductDetailsScreen = ({ className }: ProductDetailsScreenProps) => {
    const { id } = useLocalSearchParams();

    const {
        data: product,
        isLoading,
        error,
    } = useProduct(parseInt(typeof id === 'string' ? id : id[0]));

    if (isLoading) {
        return <ActivityIndicator />;
    }
    if (error || !product) {
        return <Text>Failed to fetch product</Text>;
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
            <RemoteImage
                fallback={defaultPizzaImg}
                path={product.image}
                style={styles.image}
            />

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
