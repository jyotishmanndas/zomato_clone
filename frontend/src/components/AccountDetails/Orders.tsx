import { Clock, ExternalLink, Package } from 'lucide-react'

const Orders = () => {
    // Dummy Data for Preview
    const recentOrders = [
        { id: '#ORD-7721', date: 'Oct 24, 2025', status: 'Delivered', amount: '₹1,240.00' },
        { id: '#ORD-7718', date: 'Oct 22, 2025', status: 'Processing', amount: '₹850.00' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900">Your Orders</h3>
                <Clock size={20} className="text-slate-300" />
            </div>

            <div className="space-y-4">
                {recentOrders.map((order) => (
                    <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-slate-200 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                                <Package size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{order.id}</p>
                                <p className="text-xs text-slate-500 font-medium">{order.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-8 mt-4 md:mt-0">
                            <div className="text-right">
                                <p className="font-black text-slate-900">{order.amount}</p>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${order.status === 'Delivered' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                    }`}>{order.status}</span>
                            </div>
                            <button className="p-2 hover:bg-white rounded-xl transition-colors">
                                <ExternalLink size={18} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders