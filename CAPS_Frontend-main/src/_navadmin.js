import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilPencil,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _navadmin = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilHome} customClassName="nav-icon"/>,
  },
  {
    component: CNavTitle,
    name: 'Record Management',
  },
  {
    component: CNavGroup,
    name: 'Courses',
    to: '/admin',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Course Records',
        to: '/admin/course-records',
      },
      {
        component: CNavItem,
        name: 'Kick Student From Course',
        to: '/admin/kick-student',
        // icon: <CIcon icon={cilSchool} customClassName="nav-icon"/>,
      }
    ]
  },
  {
    component: CNavGroup,
    name: 'Lecturers',
    to: '/buttons',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lecturer Records',
        to: '/admin/lecturer-records',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Students',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Student Records',
        to: '/admin/student-records',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Faculties',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Faculty Records',
        to: '/admin/faculty-records',
      },
    ],
  },
]

export default _navadmin
