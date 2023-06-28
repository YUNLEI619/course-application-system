
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilBell,
    cilCalculator,
    cilChartPie,
    cilCursor,
    cilDescription,
    cilDrop,
    cilNotes,
    cilPencil,
    cilPuzzle,
    cilSpeedometer,
    cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _navhome = [
    {
        component: CNavTitle,
        name: 'Navigation',
    },
    {
        component: CNavItem,
        name: 'What\'s New',
        to: '/home/whats-new',
        icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    },
]

export default _navhome
