import React from 'react'
import { NavLink } from 'react-router-dom';
import {
    CAvatar,
    CButton,
    CBadge,
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

const AppHeaderLogout = () => {
    return (
        <CButton color="secondary" size="lg" to="/logout" component={NavLink}>
            <CIcon icon={cilUser} className="me-2" />Log Out
        </CButton>
    )
}

export default AppHeaderLogout
