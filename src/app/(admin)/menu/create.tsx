import {View, Text, StyleSheet, Image, TextInput, Alert} from 'react-native';
import React, { useState } from 'react';
import { Colors } from '@/src/constants/Colors';
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import {defaultPizzaImg} from "@/src/components/ProductListItem";
import { Button } from '@/src/components/Button';
import {is} from "@babel/types";

const CreateScreen = () => {
    const [image, setImage] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState('');

    const router = useRouter();
    const { id } = useLocalSearchParams()
    const isUpdating = !!id

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

    const onCreate = () => {
        if (!validateInput()) {
            return;
        }

        console.warn('Creating dish');
        setName('');
        setPrice('');
        setImage('');
        router.back();
    };

    const onUpdate = () => {
        if (!validateInput()) {
            return;
        }

        console.warn('Updating dish');
        setName('');
        setPrice('');
        setImage('');
        router.back();
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

    const onDelete = () => {
        console.log('DELETE')
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
            <Button onPress={onCreate} text={isUpdating ? "Update" : "Create"} />
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