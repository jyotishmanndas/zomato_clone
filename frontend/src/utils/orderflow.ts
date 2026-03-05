export const ORDER_ACTIONS: Record<string, string[]> = {
    confirmed: ["accepted"],
    accepted: ["preparing"],
    preparing: ["ready_for_rider"]
};

export const statusColor = (status: string) => {
    switch (status) {
        case "confirmed":
            return "bg-yellow-100 text-yellow-700";
        case "accepted":
            return "bg-orange-100 text-orange-700"
        case "preparing":
            return "bg-blue-100 text-blue-700"
        case "ready_for_rider":
            return "bg-indigo-100 text-indigo-700"
        case "picked_up":
            return "bg-yellow-100 text-yellow-700"
        case "delivered":
            return "bg-green-100 text-green-700"
        default:
            return "bg-gray-100 text-gray-700"
    }
}