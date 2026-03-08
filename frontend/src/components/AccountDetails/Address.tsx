import { MapPin, Plus, Trash2 } from 'lucide-react'

const Address = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[color:var(--color-charcoal)]">Saved addresses</h3>
                <button className="flex items-center gap-2 text-xs font-semibold text-[color:var(--color-brand-red)] hover:underline">
                    <Plus size={14} /> Add new
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative rounded-3xl border border-[color:var(--color-charcoal)] bg-[color:var(--color-surface)] p-4">
                    <div className="absolute right-4 top-4 rounded-full bg-[color:var(--color-charcoal)] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-white">
                        Default
                    </div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[color:var(--color-charcoal)]">
                        <MapPin size={14} className="text-[color:var(--color-brand-red)]" /> Home
                    </h4>
                    <p className="text-xs font-medium leading-relaxed text-[color:var(--color-text-secondary)]">
                        123 Business Park, Sector 44, Gurgaon, Haryana, 122003
                    </p>
                </div>

                <div className="rounded-3xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg-blush)] p-4 transition hover:border-[color:var(--color-charcoal)]/30">
                    <div className="mb-2 flex items-start justify-between">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-[color:var(--color-charcoal)]">
                            <MapPin size={14} className="text-[color:var(--color-text-secondary)]" /> Office
                        </h4>
                        <button className="rounded-full p-1 text-[color:var(--color-text-secondary)] transition hover:bg-red-50 hover:text-red-500">
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-[color:var(--color-text-secondary)]">
                        Cyber City, Building 10C, DLF Phase 2, Gurgaon
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Address