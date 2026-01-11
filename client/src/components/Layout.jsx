import React from "react";
import Navbar from "./Navbar";
import useDocumentMetadata from "../hooks/useDocumentMetadata";

/**
 * Global Layout Wrapper
 * @param {string} title - Page title (passed to useDocumentMetadata)
 * @param {string} description - Page meta description (passed to useDocumentMetadata)
 * @param {React.ReactNode} children - Page content
 * @param {boolean} showNavbar - Whether to display the navigation bar (default: true)
 */
const Layout = ({ title, description, children, showNavbar = true }) => {
    useDocumentMetadata(title, description);

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans antialiased text-gray-900">
            {showNavbar && <Navbar />}
            <main className="flex-grow">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                    {children}
                </div>
            </main>
            <footer className="py-10 border-t border-gray-100 bg-white mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-xl font-black text-blue-600">
                            NetTech<span className="text-gray-900">Hire</span>
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                            &copy; {new Date().getFullYear()} NetTech Hire. Built for tech excellence.
                        </div>
                        <div className="flex space-x-6 text-sm font-bold text-gray-500">
                            <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-blue-600 cursor-pointer transition-colors">Terms</span>
                            <span className="hover:text-blue-600 cursor-pointer transition-colors">Contact</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
