import React, {useEffect, useRef, useState} from 'react'
import {
    CAlert,
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
    CTableRow, CToast, CToastBody, CToaster, CToastHeader,
} from '@coreui/react'
import config from 'src/config.js';
import {useLocation} from "react-router-dom";
import {getJWTFromLS, getUserIdFromLS} from "../../utils/jwtUtils";

const ViewCoursesDetails = () => {
    // variables
    const [courseDetails, setCourseDetails] = useState([]);
    const [courseStudents, setCourseStudents] = useState([]);
    const [facultyName, setFacultyName] = useState([]);
    const [courseLecturers, setCourseLecturers] = useState([]);
    const [courseSchedules, setCourseSchedules] = useState([]);
    // form
    const [selectedCourseId, setSelectedCourseId] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState([]);
    const [selectedStudentGrade, setSelectedStudentGrade] = useState([]);
    const [selectedStudentGP, setSelectedStudentGP] = useState([]);
    const [selectedCStudentDetails, setSelectedCStudentDetails] = useState([]);
    // params
    const location = useLocation();
    const locationSearchParams = new URLSearchParams(location.search);
    const courseId = locationSearchParams.get('courseId');
    // modal visibility
    const [visible_detail, setVisibleDetail] = useState(false);
    // toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()

    useEffect(() => {
        fetchCourseDetails();
        fetchCourseRecords();
    }, []);

    const fetchCourseDetails = async () => {
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
            fetchCourseLecturerSchedule(courseId);
            setCourseDetails(courseDetailsData);
            setFacultyName(courseDetailsData.faculty.facultyName)
        }).catch(error => {
            console.error('Error fetching course detail data:', error);
        });
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

    const fetchCourseRecords = async () => {
        const params = new URLSearchParams();
        params.append('courseId', courseId);
        fetch(config.getStudentsByCourseId + `?${params.toString()}`, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const courseStudentsData = data.data;
            console.log(courseStudentsData);
            courseStudentsData.map(item => {
                if (item.courseStudentStatus === 0) {
                    item.courseStudentStatus = "Enrolled";
                    item.statusBadgeColor = "info";
                } else if (item.courseStudentStatus === -1) {
                    item.courseStudentStatus = "Banned";
                    item.statusBadgeColor = "danger";
                } else if (item.courseStudentStatus === 1) {
                    item.courseStudentStatus = "In Progress";
                    item.statusBadgeColor = "warning";
                } else if (item.courseStudentStatus === 2) {
                    item.courseStudentStatus = "Completed";
                    item.statusBadgeColor = "success";
                } else if (item.courseStudentStatus === 3) {
                    item.courseStudentStatus = "Failed";
                    item.statusBadgeColor = "danger";
                } else {
                    item.statusBadgeColor = "primary";
                }
            })
            setCourseStudents(courseStudentsData);
        }).catch(error => {
            console.error('Error fetching course student data:', error);
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

    const convertGradeToGp = (grade) => {
        const fullGrade = 100;
        const fullGp = 5;
        const gradeToGpScale = fullGp / fullGrade;

        const numericGrade = parseFloat(grade);
        if (!isNaN(numericGrade)) {
            return (numericGrade * gradeToGpScale).toFixed(2);
        } else {
            return "-";
        }
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

    const handleCourseStudentDetails = async (courseId, studentId) => {
        console.log("selected courseId: " + courseId + ", selected studentId: " + studentId)
        await setSelectedCourseId(courseId);
        await setSelectedStudentId(studentId);
        const selectedCS = courseStudents.find((record) => record.courseId === courseId && record.studentId === studentId);
        setSelectedCStudentDetails(selectedCS);
        setSelectedStudentGrade(selectedCS.courseStudentGrade);
        setSelectedStudentGP(convertGradeToGp(selectedCS.courseStudentGrade));
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const passed = (selectedStudentGrade >= 60) ? 2 : 3;
        try {
            const params = new URLSearchParams();
            params.append('courseId', selectedCourseId);
            params.append('lecturerId', getUserIdFromLS("lecturerId"));
            params.append('studentId', selectedStudentId);
            params.append('courseStudentGrade', selectedStudentGrade);
            params.append('courseStudentStatus', passed);
            const response = await fetch(config.gradeStudentForCourse + `?${params.toString()}`, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Grade updated');
                    setVisibleDetail(false);
                    addToast(resultToast({
                        toastHeader: config.TOAST_SUCCESS_MSG,
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: "Update grade successful."
                    }));
                    await fetchCourseRecords();
                } else {
                    console.error('Failed to update grade: ', responseData.msg);
                    addToast(resultToast({
                        toastHeader: config.TOAST_FAILED_MSG,
                        toastColor: config.TOAST_FAILED_COLOR,
                        toastMessage: responseData.msg
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
                        <h3 style={{marginTop: 10 + 'px'}}>Course Details</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Course details of your selected course.
                        </p>
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
                                <CFormLabel className="col-sm-5 col-form-label">Course Enrollment Status</CFormLabel>
                                <CCol sm={5} className="mb-3">
                                    <CFormInput type="text" value={courseDetails.courseEnrollmentStatus} readOnly/>
                                </CCol>
                                <CFormLabel className="col-sm-5 col-form-label">Course Status</CFormLabel>
                                <CCol sm={5} className="mb-3">
                                    <CFormInput type="text" value={courseDetails.courseStatus} readOnly/>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={6}>
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
            </CCol>
            <CCol xs={6}>
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
            </CCol>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <h3 style={{marginTop: 10 + 'px'}}>Enrolled Students</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            All students enrolled your current course.
                        </p>
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student Gender</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student GPA</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student Course Grade</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student Course GP</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student Status</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {courseStudents.map(item => (
                                    <CTableRow key={item.studentId}>
                                        <CTableHeaderCell
                                            scope="row">{item.firstMidName + " " + item.lastName}</CTableHeaderCell>
                                        <CTableDataCell>{item.gender}</CTableDataCell>
                                        <CTableDataCell>{item.gpa}</CTableDataCell>
                                        <CTableDataCell>{item.courseStudentGrade}</CTableDataCell>
                                        <CTableDataCell>{convertGradeToGp(item.courseStudentGrade)}</CTableDataCell>
                                        <CTableDataCell><CBadge
                                            color={item.statusBadgeColor}>{item.courseStudentStatus}</CBadge></CTableDataCell>
                                        <CTableDataCell>
                                            <CButton color="info"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         setVisibleDetail(true);
                                                         handleCourseStudentDetails(item.courseId, item.studentId)
                                                     }}>Grade</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
                <CModal alignment="center" size="lg" visible={visible_detail} onClose={() => setVisibleDetail(false)}>
                    <CModalHeader>
                        <CModalTitle>Grade Course for Student</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CAlert color="info">
                            This info is provided for you to double check
                        </CAlert>
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-5 col-form-label">Course Name</CFormLabel>
                                <CCol sm={5}>
                                    <CFormInput type="text" value={selectedCStudentDetails.courseName} readOnly/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-5 col-form-label">Student Name</CFormLabel>
                                <CCol sm={5}>
                                    <CFormInput type="text"
                                                value={selectedCStudentDetails.firstMidName + " " + selectedCStudentDetails.lastName}
                                                readOnly/>
                                </CCol>
                            </CRow>
                            <CAlert color="danger">
                                WARNING: Think twice before re-grading a student
                            </CAlert>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-5 col-form-label">Student New Grade</CFormLabel>
                                <CCol sm={5}>
                                    <CFormInput type="text"
                                                value={selectedStudentGrade}
                                                onChange={(event) => {
                                                    setSelectedStudentGrade(event.target.value);
                                                    setSelectedStudentGP(convertGradeToGp(event.target.value));
                                                }
                                                }/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-5 col-form-label">Student New GP</CFormLabel>
                                <CCol sm={5}>
                                    <CFormInput type="text"
                                                value={selectedStudentGP}
                                                onChange={(event) => setSelectedStudentGrade(event.target.value)}
                                                readOnly/>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisibleDetail(false)}>
                            Close
                        </CButton>
                        <CButton color="info" onClick={handleUpdate}>Update</CButton>
                    </CModalFooter>
                </CModal>
                <CToaster ref={toaster} push={toast} placement="top-end"/>
            </CCol>
        </CRow>
    )
}

export default ViewCoursesDetails
