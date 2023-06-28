import React, {useEffect, useState} from 'react'
import {
    CBadge,
    CButton,
    CCallout,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow
} from '@coreui/react'
import {CChartBar, CChartPie, CChartPolarArea} from '@coreui/react-chartjs'
import config from "../../config";
import {getJWTFromLS, getUserIdFromLS} from "../../utils/jwtUtils";

const ViewStudentPerformance = () => {
    // variables
    const [studentPerformance, setStudentPerformance] = useState([]);
    const [courseDetails, setCourseDetails] = useState([]);
    const [facultyName, setFacultyName] = useState([]);
    const [courseLecturers, setCourseLecturers] = useState([]);
    const [courseSchedules, setCourseSchedules] = useState([]);
    // modal visibility
    const [visible_detail, setVisibleDetail] = useState(false);
    // pie chart
    const statusCounts = [0, 0, 0, 0, 0];

    useEffect(() => {
        fetchStudentPerformance();
    }, []);

    const convertGradeToGp = (grade) => {
        const fullGrade = 100;
        const fullGp = 5;
        const gradeToGpScale = fullGp / fullGrade;

        const numericGrade = parseFloat(grade);
        if (!isNaN(numericGrade)) {
            return (numericGrade * gradeToGpScale).toFixed(2);
        } else {
            console.log('nan')
            return 0;
        }
    };

    const getUniqueStudentCount = () => {
        const studentIds = studentPerformance.map(info => info.studentId);
        const uniqueStudentIds = [...new Set(studentIds)];
        return uniqueStudentIds.length;
    };

    const getCourseStudentNumber = (records) => {
        const courseNames = [...new Set(records.map((record) => record.courseName))];
        const courseCount = new Map();
        courseNames.forEach((cName) => {
            courseCount.set(cName, 0);
        })
        records.forEach((record) => {
            courseCount.set(record.courseName, courseCount.get(record.courseName) + 1);
        })
        const res = new Array(courseNames.length);
        for (let i = 0; i < courseNames.length; ++i) {
            res[i] = courseCount.get(courseNames[i]);
        }
        return res;
    }

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

    const setPieChartData = (records) => {
        records.forEach((record) => {
            const status = record.courseStudentStatus;
            if (status === -1 || status === "Banned") {
                statusCounts[0]++;
            } else if (status === 0 || status === "Enrolled") {
                statusCounts[1]++;
            } else if (status === 1 || status === "In Progress") {
                statusCounts[2]++;
            } else if (status === 2 || status === "Completed") {
                statusCounts[3]++;
            } else if (status === 3 || status === "Failed") {
                statusCounts[4]++;
            }
        });
        return statusCounts;
    }

    const countStudentsByGPA = (records) => {
        const countMap = {
            '0.0+': new Set(),
            '1.0+': new Set(),
            '2.0+': new Set(),
            '3.0+': new Set(),
            '4.0+': new Set(),
            '5.0': new Set(),
        };
        records.forEach((info) => {
            const studentId = info.studentId;
            const gpa = parseFloat(info.gpa);
            if (gpa >= 0 && gpa < 1.0) {
                countMap['0.0+'].add(studentId);
            } else if (gpa >= 1.0 && gpa < 2.0) {
                countMap['1.0+'].add(studentId);
            } else if (gpa >= 2.0 && gpa < 3.0) {
                countMap['2.0+'].add(studentId);
            } else if (gpa >= 3.0 && gpa < 4.0) {
                countMap['3.0+'].add(studentId);
            } else if (gpa >= 4.0 && gpa < 5.0) {
                countMap['4.0+'].add(studentId);
            } else if (gpa === 5.0) {
                countMap['5.0'].add(studentId);
            }
        });
        const res = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            res[i] = countMap[i + '.0+'].size;
        }
        res[5] = countMap['5.0'].size;
        return res;
    };

    const fetchStudentPerformance = async () => {
        const params = new URLSearchParams();
        params.append('lecturerId', getUserIdFromLS("lecturerId"));
        await fetch(config.getStudentPerformance + `?${params.toString()}`, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const studentRecordData = data.data;
            studentRecordData.map(item => {
                // grade
                if (item.courseStudentGrade == null) {
                    item.courseStudentGrade = "Not graded yet";
                }
                // status
                if (item.courseStudentStatus === 0) {
                    item.courseStudentStatus = "Enrolled";
                    item.statusBadgeColor = "info";
                } else if (item.courseStudentStatus === -1) {
                    item.courseStudentStatus = "Banned";
                    item.statusBadgeColor = "danger";
                } else if (item.courseStudentStatus === 1) {
                    item.courseStudentStatus = "In Progress";
                    item.statusBadgeColor = "info";
                } else if (item.courseStudentStatus === 2) {
                    item.courseStudentStatus = "Completed";
                    item.statusBadgeColor = "success";
                } else if (item.courseStudentStatus === 3) {
                    item.courseStudentStatus = "Failed";
                    item.statusBadgeColor = "danger";
                } else {
                    item.courseStudentStatus = "Deviant";
                    item.statusBadgeColor = "primary";
                }
            })
            console.log(studentRecordData);
            setStudentPerformance(studentRecordData);
        }).catch(error => {
            console.error('Error fetching student data:', error);
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
                <CCallout color="info">Currently there are <CBadge color="info"
                                                                   style={{marginRight: 5 + 'px'}}>{getUniqueStudentCount() + " "}</CBadge>
                    student(s) enrolled your courses.</CCallout>
            </CCol>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>Student Performance</CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Student Performance from courses you currently teach.
                        </p>
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Course Code</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student Gender</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student GPA</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Grade</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course GP</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Credits</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student Status</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {studentPerformance.map(item => (
                                    <CTableRow key={`${item.courseId}-${item.studentId}`}>
                                        <CTableHeaderCell scope="row">{item.courseCode}</CTableHeaderCell>
                                        <CTableDataCell>{item.courseName}</CTableDataCell>
                                        <CTableHeaderCell>{item.firstMidName + " " + item.lastName}</CTableHeaderCell>
                                        <CTableDataCell>{item.gender}</CTableDataCell>
                                        <CTableDataCell>{item.gpa}</CTableDataCell>
                                        <CTableDataCell>{item.courseStudentGrade}</CTableDataCell>
                                        <CTableDataCell>{convertGradeToGp(item.courseStudentGrade)}</CTableDataCell>
                                        <CTableDataCell>{item.courseCredits}</CTableDataCell>
                                        <CTableDataCell><CBadge
                                            color={item.statusBadgeColor}>{item.courseStudentStatus}</CBadge></CTableDataCell>
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
            </CCol>
            <CModal alignment="center" size="lg" visible={visible_detail} onClose={() => setVisibleDetail(false)}>
                <CModalHeader>
                    <CModalTitle>Completed Course details</CModalTitle>
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
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>Courses People Chart</CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Bar Chart of the number of people select your courses.
                        </p>
                        <CChartBar
                            data={{
                                labels: [...new Set(studentPerformance.map((record) => record.courseName))],
                                datasets: [
                                    {
                                        label: 'Number of people',
                                        backgroundColor: '#f87979',
                                        data: getCourseStudentNumber(studentPerformance),
                                    },
                                ],
                            }}
                            labels="months"
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={6}>
                <CCard className="mb-4">
                    <CCardHeader>Student Course Status</CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Pie Chart of your students' course status.
                        </p>
                        <CChartPie
                            data={{
                                labels: ['Banned', 'Enrolled', 'In Progress', 'Completed', 'Failed'],
                                datasets: [
                                    {
                                        data: setPieChartData(studentPerformance),
                                        backgroundColor: ['#DD1B16', '#36A2EB', '#00D8FF', '#41B883', '#FF6384'],
                                        hoverBackgroundColor: ['#DD1B16', '#36A2EB', '#00D8FF', '#41B883', '#FF6384'],
                                    },
                                ],
                            }}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={6}>
                <CCard className="mb-4">
                    <CCardHeader>Student GPA status</CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Polar Area Chart of Your Student GPA status
                        </p>
                        <CChartPolarArea
                            data={{
                                labels: ['0.0+', '1.0+', '2.0+', '3.0+', '4.0+', '5.0'],
                                datasets: [
                                    {
                                        data: countStudentsByGPA(studentPerformance),
                                        backgroundColor: ['#DD1B16', '#FF6384', '#FFCE56', '#36A2EB', '#00D8FF', '#41B883'],
                                    },
                                ],
                            }}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default ViewStudentPerformance
