import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api, { SVR_URL } from "../../api/axios";
import Layout from "../../components/Layout";
import { useToast } from "../../context/ToastContext";

function ApplicantProfile() {
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
            showToast("Profile updated successfully!", "success");
        } catch (err) {
            showToast("Failed to update profile.", "error");
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
            showToast(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully!`, "success");
        } catch (err) {
            showToast(`Failed to upload ${fieldName}.`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="My Profile" description="Manage your personal information, resume, and profile image.">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">My Profile</h1>
                    <p className="text-gray-400 font-medium">Manage your professional identity and credentials.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Image Section */}
                    <div className="md:col-span-1 border border-gray-100 bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/5 h-fit">
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 bg-gray-50 flex items-center justify-center">
                                    {user?.profileImage ? (
                                        <img
                                            src={`${SVR_URL}/${user.profileImage}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 font-black text-4xl">
                                            {user?.name?.[0] || "?"}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full text-white cursor-pointer shadow-lg hover:bg-blue-700 hover:scale-110 transition-all active:scale-95">
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "profile-image", "profileImage")} accept="image/*" />
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </label>
                            </div>
                            <h2 className="mt-4 font-black text-gray-900 tracking-tight">{user?.name}</h2>
                            <p className="text-[10px] text-blue-600 uppercase tracking-[0.2em] font-black mt-1">Job Seeker</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
                            <label className="flex items-center justify-center w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black cursor-pointer hover:bg-blue-100 transition-all active:scale-[0.98]">
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "resume", "resume")} accept=".pdf" />
                                {user?.resumePath ? "UPDATE RESUME" : "UPLOAD RESUME"}
                            </label>
                            {user?.resumePath && (
                                <a
                                    href={`${SVR_URL}/${user.resumePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-50 text-gray-400 rounded-2xl text-[10px] font-black hover:bg-gray-50 hover:text-gray-600 transition-all uppercase tracking-widest"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    View Resume
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="md:col-span-2 border border-gray-100 bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-900/5">
                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-bold text-gray-900"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 text-gray-400 cursor-not-allowed outline-none font-bold italic"
                                    />
                                    <p className="mt-2 text-[10px] text-gray-400 font-medium italic">Email cannot be changed for security reasons.</p>
                                </div>
                            </div>


                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-12 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 hover:shadow-blue-200 disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? "SAVING..." : "SAVE CHANGES"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ApplicantProfile;
