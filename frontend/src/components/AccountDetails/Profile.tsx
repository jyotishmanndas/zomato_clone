import { useAppSelector } from "../../hooks/useRedux";

const Profile = () => {
    const { user } = useAppSelector((state) => state.auth);
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[color:var(--color-charcoal)]">Profile settings</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">Full name</label>
                    <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full rounded-2xl border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[color:var(--color-brand-red)]"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">Email</label>
                    <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full rounded-2xl border border-[color:var(--color-divider)] bg-[color:var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[color:var(--color-brand-red)]"
                    />
                </div>
            </div>
            {/* <button className="btn-primary w-max px-10">
                Update profile
            </button> */}
        </div>
    )
}

export default Profile