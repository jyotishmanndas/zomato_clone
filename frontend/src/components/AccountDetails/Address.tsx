import { MapPin, Plus, Trash2 } from 'lucide-react'

const Address = () => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900">Saved Addresses</h3>
                <button className="flex items-center gap-2 text-sm font-bold text-[#E23744] hover:underline">
                    <Plus size={16} /> Add New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white border-2 border-slate-900 rounded-3xl relative">
                    <div className="absolute top-6 right-6 px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase rounded">Default</div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <MapPin size={16} className="text-[#E23744]" /> Home
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        123 Business Park, Sector 44, <br /> Gurgaon, Haryana, 122003
                    </p>
                </div>

                <div className="p-6 bg-slate-50 border-2 border-transparent rounded-3xl group hover:border-slate-200 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" /> Office
                        </h4>
                        <button className="text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Cyber City, Building 10C, <br /> DLF Phase 2, Gurgaon
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Address