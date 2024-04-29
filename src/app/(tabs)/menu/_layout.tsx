import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, Stack, Tabs} from 'expo-router';
import { Pressable } from 'react-native';

import { Colors } from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';

export default function MenuStack() {

  return (
      <Stack>
        <Stack.Screen name='index' options={{title: 'Menu'}} />
      </Stack>
  );
}
