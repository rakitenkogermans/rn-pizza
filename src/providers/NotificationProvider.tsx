import { ExpoPushToken } from 'expo-notifications';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import {registerForPushNotificationsAsync} from "@/src/lib/notifications";
import {supabase} from "@/src/lib/supabase";
import {useAuth} from "@/src/providers/AuthProvider";

const NotificationProvider = ({ children }: PropsWithChildren) => {
    const [expoPushToken, setExpoPushToken] = useState<ExpoPushToken | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification>();
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const {profile} = useAuth();

    const savePushToken = async (newToken: ExpoPushToken | undefined) => {
        setExpoPushToken(newToken);

        if (!newToken) {
            return;
        }

        await supabase
            .from('profiles')
            .update({ expo_push_token: newToken })
            .eq('id', profile.id);
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) =>
            savePushToken(token)
        );

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(response);
            });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    console.log(notification);
    console.log(expoPushToken);

    return <>{children}</>;
};

export {NotificationProvider};
