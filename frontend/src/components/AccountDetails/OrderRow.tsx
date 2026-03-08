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
        <div onClick={() => navigate(`/order/${order._id}`)} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                    <Package size={20} />
                </div>
                <div>
                    <p className="font-bold text-slate-900">Order #{order._id.slice(-6)}</p>
                    <p className="text-xs text-slate-500 font-medium">{formattedDate(new Date(order.createdAt))}</p>
                </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-8 mt-4 md:mt-0">
                <div className="text-right">
                    <p className="font-black text-slate-900">₹{order.total}</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${statusColor(order.status)}`}>{order.status.replaceAll("_", " ")}</span>
                </div>
            </div>
        </div>
    )
}

export default OrderRow