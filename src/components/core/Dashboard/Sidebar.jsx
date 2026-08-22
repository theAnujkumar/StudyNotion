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

const Sidebar = () => {

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
            <div className="flex flex-col min-w-[222px] border-r-[1px] border-r-richblack-700
            bg-richblack-800 py-10 h-[calc(100vh-3.5rem)]">
                <div className="flex flex-col ">
                    {
                        sidebarLinks.map( (link) => {
                            if(link.type && user?.accountType !== link.type) return null;
                            return(
                                <SidebarLink key={link.id} link={link} iconName={link.icon}/>
                            )
                        })
                    }
                </div>

                <div className="mx-auto h-[1px] w-10/12 mt-5 mb-5 bg-richblack-600"> </div>
                <div className="flex flex-col">
                    <SidebarLink
                        link={{name:"Settings" , path:"/dashboard/settings"}}
                        iconName="VscSettingsGear"
                    />

                    <button 
                        onClick={ () => setConfirmationModal({
                            text1 : "Are You Sure",
                            text2 : "you will be logged out",
                            btn1Text : "Logout",
                            btn2Text : "Cancel",
                            btn1Handler : () => dispatch(logout(navigate)),
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