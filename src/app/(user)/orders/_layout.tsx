import React from 'react';
import {Stack} from 'expo-router';
import { useColorScheme } from '@/src/components/useColorScheme';

export default function OrdersStack() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen name='index' options={{title: 'Orders'}} />
        </Stack>
    );
}
