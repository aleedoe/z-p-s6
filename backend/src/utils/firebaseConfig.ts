export interface FirebaseConfig {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
}

export function getFirebaseConfig(): FirebaseConfig {
    try {
        const config = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

        // Validate required fields
        const requiredFields = [
            'type', 'project_id', 'private_key_id', 'private_key',
            'client_email', 'client_id', 'auth_uri', 'token_uri',
            'auth_provider_x509_cert_url', 'client_x509_cert_url'
        ];

        for (const field of requiredFields) {
            if (!config[field]) {
                throw new Error(`Missing required Firebase config field: ${field}`);
            }
        }

        // Fix newlines in private key if they were escaped in the JSON
        if (config.private_key) {
            config.private_key = config.private_key.replace(/\\n/g, '\n');
        }

        return config;
    } catch (error) {
        throw new Error(`Invalid Firebase configuration: ${error instanceof Error ? error.message : String(error)}`);
    }
}