import { Stack } from "expo-router";
import { colors } from "@/constants/colors";

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="login"
                options={{
                    title: "Login",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="forgot-password"
                options={{
                    title: "Lupa Password",
                }}
            />
        </Stack>
    );
}