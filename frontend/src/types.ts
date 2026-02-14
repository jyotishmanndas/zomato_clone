export interface AuthUser {
    id: string;
    name: string;
    email: string;
    profile: string;
    role: string | null;
}

export interface LocationData {
    latitude: number;
    longitude: number;
    formattedAddress: string
}