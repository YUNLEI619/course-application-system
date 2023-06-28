import React, {useEffect, useState} from 'react'
import {
    CBadge,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol, CForm, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import config from 'src/config.js';
import {getJWTFromLS, getUserIdFromLS} from "../../utils/jwtUtils";

const ViewCourses = () => {
    // variables
    const [courseRecords, setCourseRecords] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);
    const [courseLecturers, setCourseLecturers] = useState([]);
    const [courseSchedules, setCourseSchedules] = useState([]);
    const [facultyName, setFacultyName] = useState([]);
    // modal visibility
    const [visible_detail, setVisibleDetail] = useState(false);

    useEffect(() => {
        fetchCourseRecords();
    }, []);

    const fetchCourseRecords = async () => {
        const params = new URLSearchParams();
        params.append('studentId', getUserIdFromLS("studentId"));
        fetch(config.getAllCoursesByStudentId + `?${params.toString()}`, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const courseRecordData = data.data;
            console.log(courseRecordData);
            courseRecordData.map(item => {
                // grade
                if (item.courseStudentGrade == null) {
                    item.courseStudentGrade = "Not graded yet";
                }
                // status
                if (item.courseStudentStatus === 0) {
                    item.courseStudentStatus = "Enrolled";
                    item.badgeColor = "info";
                } else if (item.courseStudentStatus === -1) {
                    item.courseStudentStatus = "Banned";
                    item.courseStudentGrade = "Grade cancelled";
                    item.badgeColor = "danger";
                } else if (item.courseStudentStatus === 1) {
                    item.courseStudentStatus = "In Progress";
                    item.badgeColor = "info";
                } else if (item.courseStudentStatus === 2) {
                    item.courseStudentStatus = "Completed";
                    item.badgeColor = "success";
                } else if (item.courseStudentStatus === 3) {
                    item.courseStudentStatus = "Failed";
                    item.badgeColor = "danger";
                } else {
                    item.courseStudentStatus = "Deviant";
                    item.badgeColor = "primary";
                }
            })
            setCourseRecords(courseRecordData);
        }).catch(error => {
            console.error('Error fetching course data:', error);
        });
    };

    const fetchCourseDetails = async (courseId) => {
        const params = new URLSearchParams();
        params.append('courseId', courseId);
        await fetch(config.getCourseById + `?${params.toString()}`, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const courseDetailsData = data.data;
            console.log(courseDetailsData);
            if (courseDetailsData.courseStatus === 0) {
                courseDetailsData.courseStatus = "Enrolling";
            } else if (courseDetailsData.courseStatus === 1) {
                courseDetailsData.courseStatus = "In Progress";
            } else if (courseDetailsData.courseStatus === 2) {
                courseDetailsData.courseStatus = "Completed";
            }
            if (courseDetailsData.courseEnrollmentStatus === 0) {
                courseDetailsData.courseEnrollmentStatus = "Enrolling";
            } else if (courseDetailsData.courseEnrollmentStatus === -1) {
                courseDetailsData.courseEnrollmentStatus = "Not Enrolling";
            }
            setCourseDetails(courseDetailsData);
            setFacultyName(courseDetailsData.faculty.facultyName)
        }).catch(error => {
            console.error('Error fetching course detail data:', error);
        });
    };

    const fetchCourseLecturerSchedule = async (courseId) => {
        const params = new URLSearchParams();
        params.append('courseId', courseId);
        await fetch(config.getCourseLecturerSchedule + `?${params.toString()}`, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const courseLecturersData = data.data.lecturers;
            const courseSchedulesData = data.data.schedules;
            console.log(courseLecturersData);
            console.log(courseSchedulesData);
            setCourseLecturers(courseLecturersData);
            setCourseSchedules(courseSchedulesData);
        }).catch(error => {
            console.error('Error fetching cls data:', error);
        });
    };

    const handleCourseDetails = async (courseId) => {
        console.log("selected id: " + courseId)
        await fetchCourseDetails(courseId);
        await fetchCourseLecturerSchedule(courseId);
    };

    const dowToString = (dow) => {
        let res = "-";
        switch (dow) {
            case 1:
                res = "Monday";
                break;
            case 2:
                res = "Tuesday";
                break;
            case 3:
                res = "Wednesday";
                break;
            case 4:
                res = "Thursday";
                break;
            case 5:
                res = "Friday";
                break;
        }
        return res;
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <h3 style={{marginTop: 10 + 'px'}}>Enrolled Course List</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            All courses you currently enrolled/completed.
                        </p>
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Course Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Grade</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {courseRecords.map(item => (
                                    <CTableRow key={item.courseId}>
                                        <CTableHeaderCell scope="row">{item.courseName}</CTableHeaderCell>
                                        <CTableDataCell>{item.courseStudentGrade}</CTableDataCell>
                                        <CTableDataCell><CBadge
                                            color={item.badgeColor}>{item.courseStudentStatus}</CBadge></CTableDataCell>
                                        <CTableDataCell>
                                            <CButton color="info"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         setVisibleDetail(!visible_detail);
                                                         handleCourseDetails(item.courseId)
                                                     }}>Details</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
                <CModal alignment="center" size="lg" visible={visible_detail} onClose={() => setVisibleDetail(false)}>
                    <CModalHeader>
                        <CModalTitle>Course details</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <h3 style={{marginTop: 10 + 'px'}}>Course Info</h3>
                            </CCardHeader>
                            <CCardBody>
                                <CForm>
                                    <CRow className="mb-3">
                                        <CFormLabel className="col-sm-5 col-form-label">Course Code</CFormLabel>
                                        <CCol sm={5} className="mb-3">
                                            <CFormInput type="text" value={courseDetails.courseCode} readOnly/>
                                        </CCol>
                                        <CFormLabel className="col-sm-5 col-form-label">Course Name</CFormLabel>
                                        <CCol sm={5} className="mb-3">
                                            <CFormInput type="text" value={courseDetails.courseName} readOnly/>
                                        </CCol>
                                        <CFormLabel className="col-sm-5 col-form-label">Course Faculty Name</CFormLabel>
                                        <CCol sm={5} className="mb-3">
                                            <CFormInput type="text" value={facultyName} readOnly/>
                                        </CCol>
                                        <CFormLabel className="col-sm-5 col-form-label">Course Credits</CFormLabel>
                                        <CCol sm={5} className="mb-3">
                                            <CFormInput type="text" value={courseDetails.courseCredits} readOnly/>
                                        </CCol>
                                        <CFormLabel className="col-sm-5 col-form-label">Course Capacity</CFormLabel>
                                        <CCol sm={5} className="mb-3">
                                            <CFormInput type="text" value={courseDetails.courseCapacity} readOnly/>
                                        </CCol>
                                        <CFormLabel className="col-sm-5 col-form-label">Course Enrollment
                                            Status</CFormLabel>
                                        <CCol sm={5} className="mb-3">
                                            <CFormInput type="text" value={courseDetails.courseEnrollmentStatus}
                                                        readOnly/>
                                        </CCol>
                                        <CFormLabel className="col-sm-5 col-form-label">Course Status</CFormLabel>
                                        <CCol sm={5} className="mb-3">
                                            <CFormInput type="text" value={courseDetails.courseStatus} readOnly/>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <h3 style={{marginTop: 10 + 'px'}}>Lecturer Info</h3>
                            </CCardHeader>
                            <CCardBody>
                                <CTable hover>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">Lecturer Name</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {courseLecturers.map(item => (
                                            <CTableRow key={item.lecturerId}>
                                                <CTableHeaderCell>{item.firstMidName + " " + item.lastName}</CTableHeaderCell>
                                                <CTableDataCell>{item.gender}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CCardBody>
                        </CCard>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <h3 style={{marginTop: 10 + 'px'}}>Schedule Info</h3>
                            </CCardHeader>
                            <CCardBody>
                                {
                                    courseSchedules.length === 0 ? (
                                        <p>No schedules yet</p>
                                    ) : (
                                        <CTable hover>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">Schedule Day of
                                                        Week</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Schedule Start Time</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Schedule End Time</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {courseSchedules.map(item => (
                                                    <CTableRow key={item.scheduleId}>
                                                        <CTableHeaderCell>{dowToString(item.scheduleDayOfWeek)}</CTableHeaderCell>
                                                        <CTableDataCell>{item.scheduleStartTime.substr(0, 5)}</CTableDataCell>
                                                        <CTableDataCell>{item.scheduleEndTime.substr(0, 5)}</CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    )
                                }
                            </CCardBody>
                        </CCard>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisibleDetail(false)}>
                            Close
                        </CButton>
                    </CModalFooter>
                </CModal>
            </CCol>
        </CRow>
    )
}

export default ViewCourses
