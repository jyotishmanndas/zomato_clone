const Profile = () => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Profile Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" defaultValue="John Doe" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#E23744] focus:bg-white outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input type="email" defaultValue="john@example.com" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#E23744] focus:bg-white outline-none transition-all" />
                </div>
            </div>
            <button className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200">
                Update Profile
            </button>
        </div>
    )
}

export default Profile