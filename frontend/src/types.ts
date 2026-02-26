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

export interface Restaurant {
    name: string;
    description: string;
    image: string;
    phone: string;
    isVerified: boolean;
    autoLocation: {
        type: "Point",
        coordinates: [number, number];  //longitude latitude
        formattedAddress: string;
    };
    isOpen: boolean,
}