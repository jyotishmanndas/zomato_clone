import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
    useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { BiLoader, BiPlus, BiTrash } from "react-icons/bi";
import { axiosInstance } from "../config/axiosInstance";

// 🔧 Fix leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Address {
    _id: string;
    formattedAddress: string;
    mobile: number;
}

const LocationPicker = ({ setLocation }: { setLocation: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            setLocation(e.latlng.lat, e.latlng.lng);
        },

    });
    return null;
};
// 🎯 Locate me button
const LocateMeButton = ({
    onLocate,
}: {
    onLocate: (lat: number, lng: number) => void;
}) => {
    const map = useMap();
    const locateUser = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                map.flyTo([latitude, longitude], 16, { animate: true });
                onLocate(latitude, longitude);
            },
            () => toast.error("Location permission denied"),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };
    return (
        <button
            onClick={locateUser}
            className="absolute right-3 top-3 z-1000 flex items-center gap-2
    rounded-lg bg-white px-3 py-2 text-sm shadow hover:bg-gray-100"
        >
            <LocateFixed size={16} />
            Use current location
        </button>
    );
};
const Address = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    // 📋 Form state
    const [mobile, setMobile] = useState("");
    const [formattedAddress, setFormattedAddress] = useState("");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    // 🌍 Reverse geocoding
    const fetchFormattedAddress = async (lat: number, lng: number) => {
        try {
            const { data } = await axiosInstance.get(
                `/api/v1/location/reverse`,
                {
                    params: { lat, lng },
                }
            );
            setFormattedAddress(data.display_name || "");
        } catch {
            toast.error("Failed to fetch address");
        }
    };
    const setLocation = (lat: number, lng: number) => {
        setLatitude(lat);
        setLongitude(lng);
        fetchFormattedAddress(lat, lng);
    };
    // 📡 Fetch addresses
    const fetchAddresses = async () => {
        try {
            const { data } = await
                axiosInstance.get(`/api/v1/address/getAddress`);
            setAddresses(data.address || []);
        } catch {
            toast.error("Failed to load addresses");

        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAddresses();
    }, []);
    // ➕ Add address
    const addAddress = async () => {
        if (
            !mobile ||
            !formattedAddress ||
            latitude === null ||
            longitude === null
        ) {
            toast.error("Please select location on map");
            return;
        }
        try {
            setAdding(true);
            await axiosInstance.post(
                `/api/v1/address/create`,
                {
                    formattedAddress,
                    mobile,
                    location: {
                        type: "Point",
                        // coordinates: [latitude, longitude]
                        coordinates: [longitude, latitude]
                    }
                },
            );
            toast.success("Address added");
            setMobile("");
            setFormattedAddress("");

            setLatitude(null);
            setLongitude(null);
            fetchAddresses();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed");
        } finally {
            setAdding(false);
        }
    };

    const deleteAddress = async (id: string) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            setDeletingId(id);
            await axiosInstance.delete(`/api/v1/address/delete/${id}`);
            toast.success("Address deleted");
            fetchAddresses();
        } catch {
            toast.error("Failed to delete address");
        } finally {
            setDeletingId(null);
        }
    };
    return (
        <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
            <h1 className="font-display text-[22px] font-extrabold text-[color:var(--color-charcoal)]">Select delivery address</h1>
            {/* 🗺 Map */}
            <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] shadow-sm">
                <MapContainer
                    center={[latitude || 28.6139, longitude || 77.209]}
                    zoom={13}

                    className="h-full w-full"
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a
    href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <LocationPicker setLocation={setLocation} />
                    <LocateMeButton onLocate={setLocation} />
                    {latitude !== null && longitude !== null && (
                        <Marker position={[latitude, longitude]} />
                    )}
                </MapContainer>
            </div>
            {/* 📍 Selected address */}
            {formattedAddress && (
                <div className="rounded-2xl border border-green-100 bg-green-50 p-3 text-xs">
                    📍 {formattedAddress}
                </div>
            )}
            {/* 📱 Mobile */}
            <input
                type="number"
                placeholder="Mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-2xl border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[color:var(--color-brand-red)]"
            />
            {/* ➕ Save */}
            <button
                disabled={adding}
                onClick={addAddress}
                className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-50"

            >
                {adding ? <BiLoader className="animate-spin" /> : <BiPlus />}
                Save Address
            </button>

            {/* 📋 Saved Addresses */}
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-[color:var(--color-charcoal)]">Saved addresses</h2>
                {loading ? (
                    <p className="text-xs text-[color:var(--color-text-secondary)]">Loading...</p>
                ) : addresses.length === 0 ? (
                    <p className="text-xs text-[color:var(--color-text-secondary)]">No addresses saved</p>
                ) : (
                    addresses.map((addr) => (
                        <div
                            key={addr._id}
                            className="flex items-center justify-between rounded-2xl border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-3 text-xs shadow-sm"
                        >
                            <div>

                                <p className="text-[13px] font-medium text-[color:var(--color-charcoal)]">
                                    {addr.formattedAddress}
                                </p>

                                <p className="mt-1 text-[11px] text-[color:var(--color-text-secondary)]">
                                    📞 {addr.mobile}
                                </p>
                            </div>
                            <button
                                onClick={() => deleteAddress(addr._id)}
                                disabled={deletingId === addr._id}
                                className="rounded-full p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                            >
                                {deletingId === addr._id ? (
                                    <BiLoader size={16} className="animate-spin" />
                                ) : (
                                    <BiTrash size={16} />
                                )}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Address;