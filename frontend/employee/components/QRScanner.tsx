import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { colors } from '@/constants/colors';
import { Camera, X } from 'lucide-react-native';

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        onScan(data);
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>We need your permission to use the camera</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                <View style={styles.overlay}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <X size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Scan QR Code</Text>
                        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                            <Camera size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.scanArea}>
                        <View style={styles.scanFrame} />
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.instructions}>
                            Arahkan kamera ke QR Code untuk absensi
                        </Text>
                        {scanned && (
                            <TouchableOpacity
                                style={styles.scanAgainButton}
                                onPress={() => setScanned(false)}
                            >
                                <Text style={styles.scanAgainText}>Scan Lagi</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </CameraView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 16,
    },
    closeButton: {
        padding: 8,
    },
    flipButton: {
        padding: 8,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scanArea: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
    },
    scanFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: 'transparent',
        borderRadius: 16,
    },
    footer: {
        padding: 24,
        alignItems: 'center',
    },
    instructions: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 16,
    },
    scanAgainButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    scanAgainText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    text: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        margin: 24,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 8,
        margin: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});