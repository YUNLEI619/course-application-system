import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilBarChart, cilHome,
    cilListRich,
    cilSchool,

} from '@coreui/icons'
import {CNavItem} from '@coreui/react'

const _navlecturer = [
    {
        component: CNavItem,
        name: 'Home',
        to: '/home',
        icon: <CIcon icon={cilHome} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'View Courses Taught',
        to: '/lecturer/view-courses-taught',
        icon: <CIcon icon={cilListRich} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'View Student Performance',
        to: '/lecturer/view-student-performance',
        icon: <CIcon icon={cilBarChart} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Course Selection',
        to: '/lecturer/lecturer-enroll-course',
        icon: <CIcon icon={cilSchool} customClassName="nav-icon"/>,
    },
]

export default _navlecturer
