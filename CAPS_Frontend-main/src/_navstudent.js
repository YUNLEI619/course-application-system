import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    cilBarChart, cilHome, cilListRich,
    cilSchool,
} from '@coreui/icons'
import {CNavItem} from '@coreui/react'

const _navstudent = [
    {
        component: CNavItem,
        name: 'Home',
        to: '/home',
        icon: <CIcon icon={cilHome} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Grades and GPA',
        to: '/student/grades-gpa',
        icon: <CIcon icon={cilBarChart} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'View Courses',
        to: '/student/view-courses',
        icon: <CIcon icon={cilListRich} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Enroll for a Course',
        to: '/student/enroll-course',
        icon: <CIcon icon={cilSchool} customClassName="nav-icon"/>,
    },
    // {
    //     component: CNavItem,
    //     name: 'Kick Student From Course',
    //     to: '/admin/kick-student',
    //     icon: <CIcon icon={cilSchool} customClassName="nav-icon"/>,
    // }
]

export default _navstudent
