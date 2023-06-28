import React, {useEffect, useRef, useState} from 'react'
import {
    CAlert,
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
import {getJWTFromLS} from "../../utils/jwtUtils";

const CourseEnrolment = () => {
    // variables
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [name, setName] = useState('');
    // modal visibility
    const [visible, setVisible] = useState(false);
    const [visible_upd, setVisibleUpd] = useState(false);
    const [visible_Del, setVisibleDel] = useState(false);
    // form
    const formRef = useRef(null);
    // toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        fetch(config.getAllCourses, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const coursesData = data.data;
            setCourses(coursesData);
        }).catch(error => {
            console.error('Error fetching course data:', error);
        });
    };

    const resultToast = ({toastColor, toastMessage}) => (
        <CToast autohide={true} color={toastColor}>
            <CToastHeader closeButton>
                <div className="fw-bold me-auto">{toastMessage}</div>
                <small>now</small>
            </CToastHeader>
            <CToastBody>Your operation is {toastMessage}</CToastBody>
        </CToast>
    )

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(formRef.current);
        const formDataObject = Object.fromEntries(formData.entries());
        try {
            const params = new URLSearchParams();
            params.append('courseName', formDataObject["courseName"].trim());
            const response = await fetch(config.createCourse + `?${params.toString()}`, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Course created');
                    setVisible(false);
                    addToast(resultToast({
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchCourses();
                } else {
                    console.error('Failed to create faculty: ', responseData.msg);
                    addToast(resultToast({
                        toastColor: config.TOAST_FAILED_COLOR,
                        toastMessage: config.TOAST_FAILED_MSG
                    }));
                }
            } else {
                console.error('Failed to submit form data, request failed');
                addToast(resultToast({
                    toastColor: config.TOAST_FAILED_COLOR,
                    toastMessage: config.TOAST_FAILED_MSG
                }));
            }
        } catch (error) {
            console.error('Error while submitting form data:', error);
            addToast(resultToast({
                toastColor: config.TOAST_FAILED_COLOR,
                toastMessage: config.TOAST_FAILED_MSG
            }));
        }
    };

    const handleCourseSelection = (courseId) => {
        console.log("selected id: " + courseId)
        setSelectedCourseId(courseId);
        const selectedCourse = courses.find((faculty) => course.courseId === courseId);
        setName(selectedCourse.courseName);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append('studentId', selectedCourseId);
            params.append('newCourseName', name.trim());
            const response = await fetch(config.updateCourse + `?${params.toString()}`, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Faculty updated');
                    setVisibleUpd(false);
                    addToast(resultToast({
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchCourses();
                } else {
                    console.error('Failed to update course: ', responseData.msg);
                    addToast(resultToast({
                        toastColor: config.TOAST_FAILED_COLOR,
                        toastMessage: config.TOAST_FAILED_MSG
                    }));
                }
            } else {
                console.error('Failed to submit form data, request failed');
                addToast(resultToast({
                    toastColor: config.TOAST_FAILED_COLOR,
                    toastMessage: config.TOAST_FAILED_MSG
                }));
            }
        } catch (error) {
            console.error('Error while submitting form data:', error);
            addToast(resultToast({
                toastColor: config.TOAST_FAILED_COLOR,
                toastMessage: config.TOAST_FAILED_MSG
            }));
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append('courseId', selectedCourseId);
            const response = await fetch(config.deleteCourse + `?${params.toString()}`, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Course deleted');
                    setVisibleDel(false);
                    addToast(resultToast({
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchCourses();
                } else {
                    console.error('Failed to delete course: ', responseData.msg);
                    addToast(resultToast({
                        toastColor: config.TOAST_FAILED_COLOR,
                        toastMessage: config.TOAST_FAILED_MSG
                    }));
                }
            } else {
                console.error('Failed to submit form data, request failed');
                addToast(resultToast({
                    toastColor: config.TOAST_FAILED_COLOR,
                    toastMessage: config.TOAST_FAILED_MSG
                }));
            }
        } catch (error) {
            console.error('Error while submitting form data:', error);
            addToast(resultToast({
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
                        <h3 style={{marginTop: 10 + 'px'}}>Course List</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Course list within CAPS.
                        </p>
                        <CButton color="success"
                                 style={{marginRight: 10 + 'px', marginBottom: 20 + 'px'}}
                                 onClick={() => setVisible(!visible)}>Create</CButton>
                        {/*<CButton color="danger" style={{marginRight: 10 + 'px', marginBottom: 20 + 'px'}}>Batch*/}
                        {/*    Delete (under development)</CButton>*/}
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Course Id</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Course Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {courses.map(item => (
                                    <CTableRow key={item.courseId}>
                                        <CTableHeaderCell scope="row">{item.courseId}</CTableHeaderCell>
                                        <CTableDataCell>{item.courseName}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton color="info"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         setVisibleUpd(!visible_upd);
                                                         handleCourseSelection(item.courseId)
                                                     }}>Update</CButton>
                                            <CButton color="danger"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         setVisibleDel(!visible_Del);
                                                         handleCourseSelection(item.courseId)
                                                     }}>Delete</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
                <CModal alignment="center" size="lg" visible={visible} onClose={() => setVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Create a course</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm ref={formRef}>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Course Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="courseName"/>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                        <CButton color="success" onClick={handleSubmit}>Save</CButton>
                    </CModalFooter>
                </CModal>
                <CModal alignment="center" size="lg" visible={visible_upd} onClose={() => setVisibleUpd(false)}>
                    <CModalHeader>
                        <CModalTitle>Update a course</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Course Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={name}
                                                onChange={(event) => setName(event.target.value)}/>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisibleUpd(false)}>
                            Close
                        </CButton>
                        <CButton color="info" onClick={handleUpdate}>Update</CButton>
                    </CModalFooter>
                </CModal>
                <CModal alignment="center" size="lg" visible={visible_Del} onClose={() => setVisibleDel(false)}>
                    <CModalHeader>
                        <CModalTitle>Delete a course</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CAlert color="danger">
                            WARNING: This is an irreversible and destructive operation
                        </CAlert>
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Course Id</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={selectedCourseId}
                                                disabled={true}/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Course Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={name}
                                                disabled={true}/>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisibleDel(false)}>
                            Close
                        </CButton>
                        <CButton color="danger" onClick={handleDelete}>Delete</CButton>
                    </CModalFooter>
                </CModal>
                <CToaster ref={toaster} push={toast} placement="top-end"/>
            </CCol>
        </CRow>
    )
}

export default CourseEnrolment;
