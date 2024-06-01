import {View, Text, StyleSheet, Image, TextInput, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Colors } from '@/src/constants/Colors';
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import {defaultPizzaImg} from "@/src/components/ProductListItem";
import { Button } from '@/src/components/Button';
import * as FileSystem from 'expo-file-system'

import {useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct} from "@/src/api/products";
import {randomUUID} from "expo-crypto";
import {supabase} from "@/src/lib/supabase";
import {decode} from "base64-arraybuffer";

const CreateScreen = () => {
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState('');

    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
    const isUpdating = !!id

    const { mutate: insertProduct } = useInsertProduct();
    const { data: updatedProduct, isLoading } = useProduct(id);
    const { mutate: updateProduct } = useUpdateProduct();
    const { mutate: deleteProduct } = useDeleteProduct()

    const router = useRouter();

    useEffect(() => {
        if (updatedProduct) {
            setName(updatedProduct.name);
            setPrice(updatedProduct.price.toString());
            setImage(updatedProduct.image);
        }
    }, [updatedProduct]);

    const validateInput = () => {
        setErrors('');
        if (!name) {
            setErrors('Name is required');
            return false;
        }
        if (!price) {
            setErrors('Price is required');
            return false;
        }
        if (isNaN(parseFloat(price))) {
            setErrors('Price should be a number');
            return false;
        }
        return true;
    };

    const resetFields = () => {
        setName('');
        setPrice('');
        setImage('');
    }

    const onCreate = async () => {
        if (!validateInput()) {
            return;
        }

        const imagePath = await uploadImage();

        insertProduct(
            { name, price: parseFloat(price), image: imagePath },
            {
                onSuccess: () => {
                    resetFields();
                    router.back();
                },
            }
        );
    };

    const onUpdate = async () => {
        if (!validateInput()) {
            return;
        }

        const imagePath = await uploadImage();

        updateProduct(
            { id, name, price: parseFloat(price), image: imagePath },
            {
                onSuccess: () => {
                    resetFields();
                    router.back();
                },
            }
        );
    };

    const onSubmit = () => {
        if (isUpdating) {
            onUpdate()
        } else {
            onCreate()
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!image?.startsWith('file://')) {
            return;
        }

        const base64 = await FileSystem.readAsStringAsync(image, {
            encoding: 'base64',
        });
        const filePath = `${randomUUID()}.png`;
        const contentType = 'image/png';
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, decode(base64), { contentType });

        if (data) {
            return data.path;
        }
    };

    const onDelete = () => {
        deleteProduct(id, {
            onSuccess: () => {
                resetFields();
                router.replace('/(admin)');
            }
        })
    }

    const confirmDelete = () => {
        Alert.alert("Confirm", "Are you sure want to delete this product?", [
            {
                text: 'Cancel'
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: onDelete
            }
        ])
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: isUpdating?'Update Product' : 'Create Product'}} />
            <Image
                source={{ uri: image || defaultPizzaImg }}
                style={styles.image}
                resizeMode="contain"
            />
            <Text onPress={pickImage} style={styles.textButton}>
                Select Image
            </Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Margarita..."
                style={styles.input}
            />

            <Text style={styles.label}>Price ($)</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="9.99"
                style={styles.input}
                keyboardType="numeric"
            />

            <Text style={styles.error}>{errors}</Text>
            <Button onPress={onSubmit} text={isUpdating ? "Update" : "Create"} />
            {isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Delete</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginVertical: 10,
    },
    label: {
        color: 'gray',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
});

export default CreateScreen;
