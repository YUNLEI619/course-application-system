import React, {useEffect, useState} from 'react'
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol, CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import config from 'src/config.js';
import {Link} from "react-router-dom";
import {getJWTFromLS, getUserIdFromLS} from "../../utils/jwtUtils";

const ViewCoursesTaught = () => {
    // variables
    const [courseRecords, setCourseRecords] = useState([]);
    // modal visibility
    useEffect(() => {
        fetchCourseRecords();
    }, []);

    const fetchCourseRecords = async () => {
        const params = new URLSearchParams();
        params.append('lecturerId', getUserIdFromLS("lecturerId"));
        fetch(config.getCourseByLecturerId + `?${params.toString()}`, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const courseRecordData = data.data;
            console.log(courseRecordData);
            courseRecordData.map(item => {
                if (item.courseEnrollmentStatus === 0) {
                    item.courseEnrollmentStatus = "Enrolling";
                    item.enrollmentBadgeColor = "info";
                } else if (item.courseEnrollmentStatus === -1) {
                    item.courseEnrollmentStatus = "Not Enrolling";
                    item.enrollmentBadgeColor = "danger";
                } else {
                    item.enrollmentBadgeColor = "primary";
                }
                if (item.courseStatus === 0) {
                    item.courseStatus = "Enrolling";
                    item.statusBadgeColor = "info";
                } else if (item.courseStatus === 1) {
                    item.courseStatus = "Teaching in progress";
                    item.statusBadgeColor = "success";
                } else if (item.courseStatus === 2) {
                    item.courseStatus = "Completed";
                    item.statusBadgeColor = "success";
                } else {
                    item.statusBadgeColor = "primary";
                }
            })
            setCourseRecords(courseRecordData);
        }).catch(error => {
            console.error('Error fetching course data:', error);
        });
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <h3 style={{marginTop: 10 + 'px'}}>List of Courses Taught</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            All courses you are currently teaching:
                        </p>
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Course Code</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Faculty Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Capacity</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Vacancy</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Credits</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course EnrollmentStatus</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Status</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {courseRecords.map(item => (
                                    <CTableRow key={item.courseId}>
                                        <CTableHeaderCell scope="row">{item.courseCode}</CTableHeaderCell>
                                        <CTableDataCell>{item.courseName}</CTableDataCell>
                                        <CTableDataCell>{item.faculty.facultyName}</CTableDataCell>
                                        <CTableDataCell>{item.courseCapacity}</CTableDataCell>
                                        <CTableDataCell>{item.courseVacancy}</CTableDataCell>
                                        <CTableDataCell>{item.courseCredits}</CTableDataCell>
                                        <CTableDataCell><CBadge
                                            color={item.enrollmentBadgeColor}>{item.courseEnrollmentStatus}</CBadge></CTableDataCell>
                                        <CTableDataCell><CBadge
                                            color={item.statusBadgeColor}>{item.courseStatus}</CBadge></CTableDataCell>
                                        <CTableDataCell>
                                            <CButton color="info" style={{marginRight: 10 + 'px'}}>
                                                <Link to={{ pathname: "/lecturer/view-courses-taught/view-course-details",
                                                search: `?courseId=${item.courseId}`}}
                                                >Details</Link>
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default ViewCoursesTaught
