import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api, { SVR_URL } from "../../api/axios";
import Layout from "../../components/Layout";
import { useToast } from "../../context/ToastContext";

function CompanyProfile() {
    const { user, setUser } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put("/auth/profile", formData);
            setUser({ ...user, ...res.data });
            showToast("Details updated successfully!", "success");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to update profile.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, endpoint, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append(fieldName, file);

        setLoading(true);
        try {
            const res = await api.put(`/auth/${endpoint}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUser(res.data.user);
            showToast("Logo updated successfully!", "success");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to upload logo.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Company Identity" description="Manage your organization's public profile and contact information.">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Company Identity</h1>
                    <p className="text-gray-400 font-medium">Manage how your organization appears to candidates.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo Section */}
                    <div className="md:col-span-1 border border-gray-100 bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 h-fit">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Brand Assets</h3>
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center p-4">
                                    {user?.profileImage ? (
                                        <img
                                            src={`${SVR_URL}/${user.profileImage}`}
                                            alt="Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <svg className="h-10 w-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" /></svg>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-blue-600 p-2.5 rounded-xl text-white cursor-pointer shadow-lg hover:bg-blue-700 hover:scale-110 transition-all active:scale-95">
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "profile-image", "profileImage")} accept="image/*" />
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </label>
                            </div>
                            <h2 className="mt-6 font-black text-gray-900 tracking-tight">{user?.name}</h2>
                            <p className="text-[10px] text-blue-600 uppercase tracking-[0.2em] font-black mt-1">Employer Partner</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="md:col-span-2 border border-gray-100 bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-900/5">
                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Organization Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
                                        placeholder="Enter company name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 text-gray-400 cursor-not-allowed outline-none font-bold italic"
                                    />
                                    <p className="mt-2 text-[10px] text-gray-400 font-medium italic">Contact email is fixed for verification integrity.</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-12 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 hover:shadow-blue-200 disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? "SAVING..." : "UPDATE IDENTITY"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// export default CompanyProfile;
//     );
// }

export default CompanyProfile;
