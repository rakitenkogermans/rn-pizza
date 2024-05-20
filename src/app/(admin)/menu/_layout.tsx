import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Link, Stack, Tabs} from 'expo-router';
import { Pressable } from 'react-native';

import { Colors } from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';

export default function MenuStack() {
    const colorScheme = useColorScheme();

  return (
      <Stack>
        <Stack.Screen name='index' options={{
            title: 'Menu',
            headerRight: () => (
                <Link href="/" asChild>
                    <Pressable>
                        {({ pressed }) => (
                            <FontAwesome
                                name="plus-square-o"
                                size={25}
                                color={Colors[colorScheme ?? 'light'].tint}
                                style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                            />
                        )}
                    </Pressable>
                </Link>
            ),
        }}
        />
          <Stack.Screen name='[id]' options={{
              title: 'Menu',
              headerRight: () => (
                  <Link href="/" asChild>
                      <Pressable>
                          {({ pressed }) => (
                              <FontAwesome
                                  name="edit"
                                  size={25}
                                  color={Colors[colorScheme ?? 'light'].tint}
                                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                              />
                          )}
                      </Pressable>
                  </Link>
              ),
          }}
          />
      </Stack>
  );
}
