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
import {getJWTFromLS, getUserIdFromLS} from "../../utils/jwtUtils";

const KickStudentFromCourse = () => {
    // variables
    const [courseRecords, setCourseRecords] = useState([]);
    const [selectedCourseId, setCourseId] = useState([]);
    const [selectedStudentId, setStudentId] = useState([]);
    // modal visibility
    const [visible_detail, setVisibleDetail] = useState(false);
    // toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()

    useEffect(() => {
        fetchCourseRecords();
    }, []);

    const resultToast = ({toastColor, toastHeader, toastMessage}) => (
        <CToast autohide={true} color={toastColor}>
            <CToastHeader closeButton>
                <div className="fw-bold me-auto">{toastHeader}</div>
                <small>now</small>
            </CToastHeader>
            <CToastBody>Your operation is {toastMessage}</CToastBody>
        </CToast>
    )

    const fetchCourseRecords = async () => {
        fetch(config.getAllStudentOngoingCourseList, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const courseRecordData = data.data;
            console.log(courseRecordData);
            courseRecordData.map(item => {
                // status
                if (item.courseStudentStatus === 0) {
                    item.courseStudentStatus = "Enrolled";
                    item.badgeColor = "info";
                } else if (item.courseStudentStatus === 1) {
                    item.courseStudentStatus = "In Progress";
                    item.badgeColor = "info";
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

    const handleKick = async (courseId, studentId) => {
        console.log("selected courseId: " + courseId)
        console.log("selected studentId: " + studentId)
        setCourseId(courseId);
        setStudentId(studentId);
    };

    const handleExecuteKick = async () => {
        try {
            const params = new URLSearchParams();
            params.append('studentId', selectedStudentId);
            params.append('courseId', selectedCourseId);
            const response = await fetch(config.removeStudentFromCourse + `?${params.toString()}`, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Student kicked');
                    setVisibleDetail(false);
                    addToast(resultToast({
                        toastHeader: "Successful kicked",
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchCourseRecords();
                } else {
                    console.error('Failed to kick: ', responseData.msg);
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
                        <h3 style={{marginTop: 10 + 'px'}}>Ongoing Course List</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Choose a student to kick.
                        </p>
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Course Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {courseRecords.map(item => (
                                    <CTableRow key={item.courseId + "-" + item.studentId}>
                                        <CTableHeaderCell scope="row">{item.courseName}</CTableHeaderCell>
                                        <CTableDataCell>{item.firstMidName + " " + item.lastName}</CTableDataCell>
                                        <CTableDataCell><CBadge
                                            color={item.badgeColor}>{item.courseStudentStatus}</CBadge></CTableDataCell>
                                        <CTableDataCell>
                                            <CButton color="warning"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         setVisibleDetail(!visible_detail);
                                                         handleKick(item.courseId, item.studentId)
                                                     }}>Kick</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
                <CModal alignment="center" size="lg" visible={visible_detail} onClose={() => setVisibleDetail(false)}>
                    <CModalHeader>
                        <CModalTitle>Are you sure?</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CAlert color={"danger"}>This action can not be reversed.</CAlert>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisibleDetail(false)}>
                            Close
                        </CButton>
                        <CButton color="danger" onClick={handleExecuteKick}>
                            Kick
                        </CButton>
                    </CModalFooter>
                </CModal>
                <CToaster ref={toaster} push={toast} placement="top-end"/>
            </CCol>
        </CRow>
    )
}

export default KickStudentFromCourse
