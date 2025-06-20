import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Toast } from "@/components/Toast";
import { useUIStore } from "@/store/uiStore";

export const unstable_settings = {
    initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        ...FontAwesome.font,
    });
    const { isLoading, loadingMessage } = useUIStore();
    const { toast, hideToast } = useUIStore();

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ErrorBoundary>
            <View style={styles.container}>
                <RootLayoutNav />
                <LoadingOverlay visible={isLoading} message={loadingMessage} />
                <Toast
                    visible={toast.visible}
                    message={toast.message}
                    type={toast.type}
                    onHide={hideToast}
                />
            </View>
        </ErrorBoundary>
    );
}

function RootLayoutNav() {
    const { isAuthenticated } = useAuthStore();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            ) : (
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            )}
        </Stack>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});