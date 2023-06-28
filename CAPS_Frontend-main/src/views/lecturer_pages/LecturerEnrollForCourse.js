import React, {useEffect, useRef, useState} from 'react'
import {
    CAlert, CBadge,
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
    CTableRow, CToast, CToastBody, CToaster, CToastHeader,
} from '@coreui/react'
import config from 'src/config.js';
import {getJWTFromLS, getUserIdFromLS} from "../../utils/jwtUtils";

const LecturerEnrollForCourse = () => {
    // variables
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [name, setName] = useState('');
    const [c_code, setCCode] = useState('');
    // modal visibility
    const [visible_Enroll, setVisibleEnroll] = useState(false);
    // toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const params = new URLSearchParams();
        params.append('lecturerId', getUserIdFromLS("lecturerId"));
        await fetch(config.getEnrollCoursesByLecturerId + `?${params.toString()}`, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const coursesData = data.data;
            console.log(coursesData);
            coursesData.map(item => {
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
                } else {
                    item.statusBadgeColor = "primary";
                }
            })
            setCourses(coursesData);
        }).catch(error => {
            console.error('Error fetching course data:', error);
        });
    };

    const resultToast = ({toastColor, toastHeader, toastMessage}) => (
        <CToast autohide={true} color={toastColor}>
            <CToastHeader closeButton>
                <div className="fw-bold me-auto">{toastHeader}</div>
                <small>now</small>
            </CToastHeader>
            <CToastBody>Your enrollment is {toastMessage}</CToastBody>
        </CToast>
    )

    const handleEnrollDetails = async (courseId) => {
        console.log("selected id: " + courseId)
        setSelectedCourseId(courseId);
        const selectedCourse = courses.find((course) => course.courseId === courseId);
        if (selectedCourse.courseEnrollmentStatus === "Not Enrolling") {
            addToast(resultToast({
                toastHeader: "Warning",
                toastColor: "warning",
                toastMessage: "pending, but be noticed that this course is not enrolling students."
            }));
        }
        setVisibleEnroll(!visible_Enroll);
        setName(selectedCourse.courseName);
        setCCode(selectedCourse.courseCode);
    };

    const handleEnroll = async (event) => {
        event.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append('courseId', selectedCourseId);
            params.append('lecturerId', getUserIdFromLS("lecturerId"));
            const response = await fetch(config.lecturerEnrollCourse + `?${params.toString()}`, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Lecturer enrolled');
                    setVisibleEnroll(false);
                    addToast(resultToast({
                        toastHeader: "Successful Enrolled",
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchCourses();
                } else {
                    console.error('Failed to enroll: ', responseData.msg);
                    addToast(resultToast({
                        toastHeader: config.TOAST_FAILED_MSG,
                        toastColor: config.TOAST_FAILED_COLOR,
                        toastMessage: responseData.msg.toString().substring(7)
                    }));
                }
            } else {
                console.error('Failed to submit form data, request failed');
                addToast(resultToast({
                    toastHeader: config.TOAST_FAILED_MSG,
                    toastColor: config.TOAST_FAILED_COLOR,
                    toastMessage: config.TOAST_FAILED_MSG
                }));
            }
        } catch (error) {
            console.error('Error while submitting form data:', error);
            addToast(resultToast({
                toastHeader: config.TOAST_FAILED_MSG,
                toastColor: config.TOAST_FAILED_COLOR,
                toastMessage: config.TOAST_FAILED_MSG
            }));
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <h3 style={{marginTop: 10 + 'px'}}>Registration to Teach Courses</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Select and join a course below to begin teaching.
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
                                    <CTableHeaderCell scope="col">Course Availability</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Status</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {courses.map(item => (
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
                                            <CButton color="info"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         handleEnrollDetails(item.courseId)
                                                     }}>Register</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
                <CModal alignment="center" size="lg" visible={visible_Enroll} onClose={() => setVisibleEnroll(false)}>
                    <CModalHeader>
                        <CModalTitle>Register to teach a course</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CAlert color="info">
                            Be advised: you cannot quit a course
                        </CAlert>
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Course Code</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" value={c_code} readOnly/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Course Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" value={name} readOnly/>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisibleEnroll(false)}>
                            Close
                        </CButton>
                        <CButton color="info" onClick={handleEnroll}>Enroll</CButton>
                    </CModalFooter>
                </CModal>
                <CToaster ref={toaster} push={toast} placement="top-end"/>
            </CCol>
        </CRow>
    )
}

export default LecturerEnrollForCourse
