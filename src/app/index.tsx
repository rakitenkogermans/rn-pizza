import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {Link, Redirect} from 'expo-router';
import { Button } from '../components/Button';
import {useAuth} from "@/src/providers/AuthProvider";
import {supabase} from "@/src/lib/supabase";

const index = () => {
    const { loading, session, profile, isAdmin } = useAuth();

    if (loading) {
        return <ActivityIndicator />;
    }

    if (!session) {
        return <Redirect href="/sign-in" />;
    }

    if (isAdmin) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
                <Link href={'/(user)'} asChild>
                    <Button text="User" />
                </Link>
                <Link href={'/(admin)'} asChild>
                    <Button text="Admin" />
                </Link>
                <Button text="Sign out" onPress={() => {supabase.auth.signOut()}} />
            </View>
        );
    }

    return <Redirect href="/(user)" />;
};

export default index;
