import React from 'react'
import { NavLink } from 'react-router-dom';
import {
    CAvatar,
    CBadge, CButton,
    CDropdown,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CNavItem,
} from '@coreui/react'
import {
    cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AppHeaderLogin = () => {
    return (
        <CButton color="secondary" size="lg" to="/login/" component={NavLink}>
            <CIcon icon={cilUser} className="me-2" />Log In
        </CButton>
    )
}

export default AppHeaderLogin
