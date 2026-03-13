import { MapPin, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useAddressApi } from "../../hooks/useAddressApi";
import { axiosInstance } from "../../config/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Address = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useAddressApi();
    const queryClient = useQueryClient();

    const deleteAddress = async (id: string) => {
        if (!window.confirm("Delete this address?")) return;

        try {
            await axiosInstance.delete(`/api/v1/address/delete/${id}`);
            queryClient.invalidateQueries({
                queryKey: ["address"],
            });
            toast.success("Address deleted");
        } catch {
            toast.error("Failed to delete address");
        }
    };

    if (isLoading) {
        return (
            <p className="text-sm text-[color:var(--color-text-secondary)]">
                Loading addresses...
            </p>
        );
    }

    const isEmpty = !data || data.length === 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[color:var(--color-charcoal)]">
                    Saved addresses
                </h3>

                {!isEmpty && (
                    <button
                        onClick={() => navigate("/address")}
                        className="flex items-center gap-2 text-xs font-semibold text-[color:var(--color-brand-red)] hover:underline"
                    >
                        <Plus size={14} /> Add new
                    </button>
                )}
            </div>
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-8 text-center">
                    <MapPin
                        size={36}
                        className="mb-3 text-[color:var(--color-text-secondary)]"
                    />

                    <p className="text-sm font-semibold text-[color:var(--color-charcoal)]">
                        No address found
                    </p>

                    <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                        Add an address to continue with your order.
                    </p>

                    <button
                        onClick={() => navigate("/address")}
                        className="btn-primary mt-4 w-auto px-6"
                    >
                        <Plus size={16} />
                        Add address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {data.map((address: any) => (
                        <div
                            key={address._id}
                            className="relative rounded-3xl border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-4"
                        >
                            <button
                                onClick={() => deleteAddress(address._id)}
                                className="absolute right-3 top-3 text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-red)]"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex items-start gap-2">
                                <MapPin
                                    size={16}
                                    className="mt-0.5 text-[color:var(--color-brand-red)]"
                                />

                                <div>
                                    <p className="text-xs font-medium leading-relaxed text-[color:var(--color-text-secondary)]">
                                        {address.formattedAddress.split(",").slice(0, 3).join(",")}
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-[color:var(--color-charcoal)]">
                                        {address.mobile}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Address;