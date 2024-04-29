import {Text, View} from "@/src/components/Themed";
import {Image, Pressable, StyleSheet} from "react-native";
import {Colors} from "@/src/constants/Colors";
import {Product} from "@/src/types";
import {Link} from "expo-router";

export const defaultPizzaImg = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
    product: Product;
}

export const ProductListItem = (props: ProductListItemProps) => {
    return (
        <Link href={`/menu/${props.product.id}`} asChild>
            <Pressable style={styles.container}>
                <Image
                    source={{uri: props.product.image ?? defaultPizzaImg}}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>{props.product.name}</Text>
                <Text style={styles.price}>${props.product.price}</Text>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: '50%',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20
    },
    image:{
        width: '100%',
        aspectRatio: 1
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
    },
    price: {
        color: Colors.light.tint
    }

});
