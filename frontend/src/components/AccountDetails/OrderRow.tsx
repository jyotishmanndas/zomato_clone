import type { IOrder } from '../../types'
import { Package } from 'lucide-react'
import { useNavigate } from 'react-router'
import { statusColor } from '../../utils/orderflow'

const OrderRow = ({ order }: { order: IOrder }) => {
    const navigate = useNavigate();

    const formattedDate = (date: Date) =>{
        return new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit"
        }).format(date)
    };

    return (
        <div onClick={() => navigate(`/order/${order._id}`)} className="flex flex-col justify-between gap-3 rounded-3xl border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] p-4 text-xs shadow-sm transition hover:border-[color:var(--color-brand-red)]/40 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg-blush)] text-[color:var(--color-text-secondary)]">
                    <Package size={20} />
                </div>
                <div>
                    <p className="text-[13px] font-semibold text-[color:var(--color-charcoal)]">Order #{order._id.slice(-6)}</p>
                    <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">{formattedDate(new Date(order.createdAt))}</p>
                </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-8 mt-4 md:mt-0">
                <div className="text-right">
                    <p className="font-price text-sm font-bold text-[color:var(--color-charcoal)]">₹{order.total}</p>
                    <span className={`mt-1 inline-flex items-center justify-end rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(order.status)}`}>{order.status.replaceAll("_", " ")}</span>
                </div>
            </div>
        </div>
    )
}

export default OrderRow