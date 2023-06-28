import React, {useEffect, useRef, useState} from 'react';
import { parseISO, format } from 'date-fns';

import "react-datepicker/dist/react-datepicker.css";
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol, CForm, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
    CRow,
    CFormSelect,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow, CToast, CToastBody, CToaster, CToastHeader,
} from '@coreui/react'
import config from 'src/config.js';
import {getJWTFromLS} from "../../utils/jwtUtils";

const LecturerRecords = () => {
    // variables
    const [faculties, setFaculties] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [selectedLecturerId, setSelectedLecturerId] = useState(null);
    const [matricNo, setMatricNo] = useState('');
    const [password, setPassword] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstMidName, setFirstMidName] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDob] = useState('');
    const [lecturerFacultyId, setLecturerFacultyId] = useState({ facultyId: '' });
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
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        fetch(config.getAllLecturers, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const lecturersData = data.data;
            setLecturers(lecturersData);
        }).catch(error => {
            console.error('Error fetching lecturer data:', error);
        });
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    const fetchFaculties = async () => {
        fetch(config.getAllFaculties, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const facultiesData = data.data;
            setFaculties(facultiesData);
        }).catch(error => {
            console.error('Error fetching faculty data:', error);
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
        const rawDateOfBirth = formDataObject["lecturerDob"].trim();
        const formattedDateOfBirth = rawDateOfBirth.replace(/\//g, '-');
        const parsedDateOfBirth = parseISO(formattedDateOfBirth);

        console.log(formDataObject);

        try {
            const response = await fetch(config.createLecturer, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    matriculationNumber: formDataObject["lecturerMatriculationNumber"].trim(),
                    password: formDataObject["lecturerPassword"].trim(),
                    lastName: formDataObject["lecturerLastName"].trim(),
                    firstMidName: formDataObject["lecturerFirstMidName"].trim(),
                    gender: formDataObject["lecturerGender"].trim(),
                    dateOfBirth: parsedDateOfBirth,
                    faculty: {
                        facultyId: formDataObject["faculty.facultyId"].trim()
                    },
                }),
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Lecturer created');
                    setVisible(false);
                    addToast(resultToast({
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchLecturers();
                } else {
                    console.error('Failed to create lecturer: ', responseData.msg);
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

    const handleLecturerSelection = (lecturerId) => {
        console.log("selected id: " + lecturerId)
        setSelectedLecturerId(lecturerId);
        const selectedLecturer = lecturers.find((lecturer) => lecturer.lecturerId === lecturerId);
        setMatricNo(selectedLecturer.matriculationNumber);
        setLastName(selectedLecturer.lastName);
        setFirstMidName(selectedLecturer.firstMidName);
        setGender(selectedLecturer.gender);
        setDob(selectedLecturer.dateOfBirth);
        setLecturerFacultyId(selectedLecturer.faculty.facultyId);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const rawDateOfBirth = dateOfBirth.trim();
        const formattedDateOfBirth = rawDateOfBirth.replace(/\//g, '-');
        const parsedDateOfBirth = parseISO(formattedDateOfBirth);
        // to check JSON content in console'
        console.log('Request Body:', JSON.stringify({
            lecturerId: selectedLecturerId,
            matriculationNumber: matricNo.trim(),
            password: password.trim(),
            lastName: lastName.trim(),
            firstMidName: firstMidName.trim(),
            gender: gender.trim(),
            dateOfBirth: parsedDateOfBirth,
            faculty: {
                facultyId: lecturerFacultyId
            }
        }));
        try {
            const response = await fetch(config.updateLecturer, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lecturerId: selectedLecturerId,
                    matriculationNumber: matricNo.trim(),
                    password: password.trim(),
                    lastName: lastName.trim(),
                    firstMidName: firstMidName.trim(),
                    gender: gender.trim(),
                    dateOfBirth: formattedDateOfBirth,
                    faculty: {
                        facultyId: lecturerFacultyId
                    },
                }),
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Lecturer updated');
                    setVisibleUpd(false);
                    addToast(resultToast({
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchLecturers();
                } else {
                    console.error('Failed to update faculty: ', responseData.msg);
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
            params.append('lecturerId', selectedLecturerId);
            const response = await fetch(config.deleteLecturer + `?${params.toString()}`, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Lecturer deleted');
                    setVisibleDel(false);
                    addToast(resultToast({
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchLecturers();
                } else {
                    console.error('Failed to delete faculty: ', responseData.msg);
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
                        <h3 style={{marginTop: 10 + 'px'}}>Lecturer List</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Lecturer list within CAPS.
                        </p>
                        <CButton color="success"
                                 style={{marginRight: 10 + 'px', marginBottom: 20 + 'px'}}
                                 onClick={() => setVisible(!visible)}>Create</CButton>
                        {/*<CButton color="danger" style={{marginRight: 10 + 'px', marginBottom: 20 + 'px'}}>Batch*/}
                        {/*    Delete (under development)</CButton>*/}
                        <CTable hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Staff Id</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Last Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">First Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Birthdate<br/>YYYY/MM/DD</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Faculty</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {lecturers.map(item => (
                                    <CTableRow key={item.lecturerId}>
                                        <CTableHeaderCell scope="row">{item.lecturerId}</CTableHeaderCell>
                                        <CTableDataCell>{item.matriculationNumber}</CTableDataCell>
                                        <CTableDataCell>{item.lastName}</CTableDataCell>
                                        <CTableDataCell>{item.firstMidName}</CTableDataCell>
                                        <CTableDataCell>{item.gender}</CTableDataCell>
                                        <CTableDataCell>{item.dateOfBirth}</CTableDataCell>
                                        <CTableDataCell>{item.faculty.facultyName}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton color="info"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         setVisibleUpd(!visible_upd);
                                                         handleLecturerSelection(item.lecturerId)
                                                     }}>Update</CButton>
                                            <CButton color="danger"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         setVisibleDel(!visible_Del);
                                                         handleLecturerSelection(item.lecturerId)
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
                        <CModalTitle>Create a lecturer</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm ref={formRef}>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Staff ID</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="lecturerMatriculationNumber"/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Password</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="lecturerPassword"/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Last Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="lecturerLastName"/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">First Middle Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="lecturerFirstMidName"/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Gender</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect name="lecturerGender">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Date of Birth</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="lecturerDob"/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Faculty</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect name="faculty.facultyId">
                                        <option value="">Select Faculty</option>
                                        {faculties.map(faculty => (
                                            <option key={faculty.facultyId} value={faculty.facultyId}>
                                                {faculty.facultyName}
                                            </option>
                                        ))}
                                    </CFormSelect>
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
                        <CModalTitle>Update a faculty</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Staff ID</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={matricNo}
                                                onChange={(event) => setMatricNo(event.target.value)}/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Password</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={password}
                                                onChange={(event) => setPassword(event.target.value)}/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Last Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={lastName}
                                                onChange={(event) => setLastName(event.target.value)}/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">First Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={firstMidName}
                                                onChange={(event) => setFirstMidName(event.target.value)}/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Gender</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect
                                        name="lecturerGender"
                                        value={gender}
                                        onChange={(event) => setGender(event.target.value)}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Date of Birth</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={dateOfBirth}
                                                onChange={(event) => setDob(event.target.value)}/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Faculty</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect
                                        name="lecturerFacultyId"
                                        value={lecturerFacultyId}
                                        onChange={(event) => setLecturerFacultyId(event.target.value)}
                                    >
                                        <option value="">Select Faculty</option>
                                        {faculties.map(faculty => (
                                            <option key={faculty.facultyId} value={faculty.facultyId}>
                                                {faculty.facultyName}
                                            </option>
                                        ))}
                                    </CFormSelect>
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
                        <CModalTitle>Delete a lecturer</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CAlert color="danger">
                            WARNING: This is an irreversible and destructive operation
                        </CAlert>
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Lecturer Id</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={selectedLecturerId}
                                                disabled={true}/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Last Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={lastName}
                                                disabled={true}/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">First Middle Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={firstMidName}
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

export default LecturerRecords
