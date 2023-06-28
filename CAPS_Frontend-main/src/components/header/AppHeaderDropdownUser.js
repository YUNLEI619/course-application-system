import React from 'react'
import {
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNavItem,
} from '@coreui/react'
import {
  cilLockLocked,
} from '@coreui/icons'

import {clearJWTFromLS, getUserNbrFromLS} from "../../utils/jwtUtils";

const AppHeaderDropdown = () => {

  const handleLogout = async () => {
    await clearJWTFromLS();
    console.log("login info cleared")
    window.location.href = "/#/logout"
  }

  // const
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CNavItem>{getUserNbrFromLS()}</CNavItem>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Logout</CDropdownHeader>
        <CDropdownDivider />
        <CDropdownItem>
          <CButton icon={cilLockLocked} className="me-2" onClick={handleLogout}>Logout</CButton>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
