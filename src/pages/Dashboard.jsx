import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";
import { VscMenu } from "react-icons/vsc";

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {loading : authLoading} = useSelector((state) => state.auth);
    const {loading : profileLoading} = useSelector((state) => state.profile);

    if(profileLoading || authLoading)
    {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner">...spinner</div>
            </div>
        )
    }
    return(
        <div className="flex min-h-[calc(100vh-3.5rem)] items-stretch bg-richblack-900">
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-x-0 bottom-0 top-14 z-40 bg-black/60 lg:hidden"
                />
            )}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="min-w-0 flex-1 overflow-y-auto bg-richblack-900">
                <div className="mx-auto w-11/12 max-w-[1000px] pt-4 lg:hidden">
                    <button
                        type="button"
                        aria-label="Open sidebar"
                        aria-expanded={isSidebarOpen}
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex items-center gap-2 rounded-md border border-richblack-700 bg-richblack-800 px-3 py-2 text-sm text-richblack-25"
                    >
                        <VscMenu className="text-lg" />
                        <span>Menu</span>
                    </button>
                </div>
                <div className="mx-auto w-11/12 max-w-[1000px] py-6">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard