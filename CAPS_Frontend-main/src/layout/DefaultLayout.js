import React, {useEffect, useState} from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

// for our API                       
import {getUserRoleFromLS} from "../utils/jwtUtils";

const DefaultLayout = () => {
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        fetchUserType();
    }, []);

    const fetchUserType = async () => {
        await setUserType(getUserRoleFromLS())
    };


    return (
    <div>
      <AppSidebar userType={userType}/>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader userType={userType}/>
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
