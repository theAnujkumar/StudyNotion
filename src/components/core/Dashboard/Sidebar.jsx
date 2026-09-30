import React, { useState } from "react";

import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "../Dashboard/SidebarLink"
import {logout} from "../../../services/operations/authAPI";
import {VscSignOut } from "react-icons/vsc";
//import { VscSettingsGear } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ConfirmationModal from "../../common/ConfirmationModal"
import { useSelector } from "react-redux";
import { VscChromeClose } from "react-icons/vsc";

const Sidebar = ({ isOpen, onClose }) => {

    const {loading : authLoading} = useSelector((state) => state.auth);
    const {loading : profileLoading} = useSelector((state) => state.profile);
    const {user} = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [confirmationModal , setConfirmationModal] = useState(null);

    if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }
    return (
        <>
            <div className={`fixed left-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-[222px] flex-col overflow-y-auto border-r-[1px] border-r-richblack-700 bg-richblack-800 py-6 transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:min-h-[calc(100vh-3.5rem)] lg:h-auto lg:shrink-0 lg:translate-x-0 lg:overflow-visible lg:py-10`}>
                <div className="mb-4 flex justify-end px-4 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close sidebar"
                        onClick={onClose}
                        className="rounded p-2 text-richblack-25 hover:bg-richblack-700"
                    >
                        <VscChromeClose className="text-xl" />
                    </button>
                </div>
                <div className="flex flex-col ">
                    {
                        sidebarLinks.map( (link) => {
                            if(link.type && user?.accountType !== link.type) return null;
                            return(
                                <SidebarLink key={link.id} link={link} iconName={link.icon} onNavigate={onClose}/>
                            )
                        })
                    }
                </div>

                <div className="mx-auto mt-5 mb-5 h-[1px] w-10/12 bg-richblack-600"> </div>
                <div className="flex flex-col">
                    <SidebarLink
                        link={{name:"Settings" , path:"/dashboard/settings"}}
                        iconName="VscSettingsGear"
                        onNavigate={onClose}
                    />

                    <button 
                        onClick={ () => setConfirmationModal({
                            text1 : "Are You Sure",
                            text2 : "you will be logged out",
                            btn1Text : "Logout",
                            btn2Text : "Cancel",
                            btn1Handler : () => {
                                onClose();
                                dispatch(logout(navigate));
                            },
                            btn2Handler : () => setConfirmationModal(null),
                        })}
                        className="px-8 py-2 text-sm font-medium text-richblack-300">

                            <div className="flex items-center gap-x-2">
                                <VscSignOut className="text-lg" />
                                <span>Logout</span>
                            </div>

                    </button>

                    
                </div>

            </div>
            {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
        </>
    )
}

export default Sidebar