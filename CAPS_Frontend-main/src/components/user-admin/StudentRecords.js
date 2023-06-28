import React, {useEffect, useRef, useState} from 'react'
import {
    CAlert,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol, CForm, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow, CToast, CToastBody, CToaster, CToastHeader,
} from '@coreui/react'
import config from 'src/config.js';
import { parseISO } from "date-fns";
import {getJWTFromLS} from "../../utils/jwtUtils";

const StudentRecords = () => {
    // variables
    const [faculties, setFaculties] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [matricNo, setMatricNo] = useState('');
    const [password, setPassword] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstMidName, setFirstMidName] = useState('');
    const [enrollmentDate, setEnrollmentDate] = useState('');
    const [gender, setGender] = useState('');
    const [dateOfBirth, setDob] = useState('');
    const [studentFacultyId, setStudentFacultyId] = useState({ facultyId: '' });
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
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        fetch(config.getAllStudents, {
            headers: {
                'Authorization': 'Bearer ' + getJWTFromLS(),
                'Content-Type': 'application/json'
            },
            method: 'GET'
        }).then(response => response.json()).then(data => {
            const studentsData = data.data;
            setStudents(studentsData);
        }).catch(error => {
            console.error('Error fetching student data:', error);
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
        const rawDateOfBirth = formDataObject["studentDob"].trim();
        const formattedDateOfBirth = rawDateOfBirth.replace(/\//g, '-');
        const parsedDateOfBirth = parseISO(formattedDateOfBirth);
        // use this if we want enrollmentDate = date of creation of object in system
        // const enrollmentDate = new Date().toISOString();

        const rawEnrollmentDate = formDataObject["studentEnrollmentDate"].trim();
        const formattedEnrollmentDate = rawEnrollmentDate.replace(/\//g, '-');
        const parsedEnrollmentDate = new Date(formattedEnrollmentDate);
        const isoEnrollmentDate = parsedEnrollmentDate.toISOString();

        console.log(formDataObject);

        try {
            const response = await fetch(config.createStudent, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    matriculationNumber: formDataObject["studentMatriculationNumber"].trim(),
                    password: formDataObject["studentPassword"].trim(),
                    lastName: formDataObject["studentLastName"].trim(),
                    firstMidName: formDataObject["studentFirstMidName"].trim(),
                    enrollmentDate: isoEnrollmentDate,
                    gender: formDataObject["studentGender"].trim(),
                    dateOfBirth: parsedDateOfBirth,
                    faculty: {
                        facultyId: formDataObject["faculty.facultyId"].trim()
                    },
                }),
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Student created');
                    setVisible(false);
                    addToast(resultToast({
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchStudents();
                } else {
                    console.error('Failed to create student: ', responseData.msg);
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

    const handleStudentSelection = (studentId) => {
        console.log("selected id: " + studentId)
        setSelectedStudentId(studentId);
        const selectedStudent = students.find((student) => student.studentId === studentId);
        setMatricNo(selectedStudent.matriculationNumber);
        setPassword(selectedStudent.password);
        setLastName(selectedStudent.lastName);
        setFirstMidName(selectedStudent.firstMidName);
        setGender(selectedStudent.gender);
        setDob(selectedStudent.dateOfBirth);
        setStudentFacultyId(selectedStudent.faculty.facultyId);
        setEnrollmentDate(selectedStudent.enrollmentDate);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        const rawDateOfBirth = dateOfBirth.trim();
        const formattedDateOfBirth = rawDateOfBirth.replace(/\//g, '-');
        const parsedDateOfBirth = parseISO(formattedDateOfBirth);

        // use this if we want enrollmentDate = date of creation of object in system
        // const enrollmentDate = new Date().toISOString();

        const rawEnrollmentDate = enrollmentDate.trim();
        const formattedEnrollmentDate = rawEnrollmentDate.replace(/\//g, '-');
        const parsedEnrollmentDate = new Date(formattedEnrollmentDate);
        const isoEnrollmentDate = parsedEnrollmentDate.toISOString();
        try {
            const response = await fetch(config.updateStudent, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    studentId: selectedStudentId,
                    matriculationNumber: matricNo.trim(),
                    password: password.trim(),
                    lastName: lastName.trim(),
                    firstMidName: firstMidName.trim(),
                    enrollmentDate: isoEnrollmentDate,
                    gender: gender.trim(),
                    dateOfBirth: parsedDateOfBirth,
                    faculty: {
                        facultyId: studentFacultyId
                    },
                }),
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Student updated');
                    setVisibleUpd(false);
                    addToast(resultToast({
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchStudents();
                } else {
                    console.error('Failed to update student: ', responseData.msg);
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
            params.append('studentId', selectedStudentId);
            const response = await fetch(config.deleteStudent + `?${params.toString()}`, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTFromLS(),
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });
            if (response.ok) {
                const responseData = await response.json();
                if (responseData.code === config.REQUEST_SUCCESS) {
                    console.log('Student deleted');
                    setVisibleDel(false);
                    addToast(resultToast({
                        toastColor: config.TOAST_SUCCESS_COLOR,
                        toastMessage: config.TOAST_SUCCESS_MSG
                    }));
                    await fetchStudents();
                } else {
                    console.error('Failed to delete student: ', responseData.msg);
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
                        <h3 style={{marginTop: 10 + 'px'}}>Student List</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p className="text-medium-emphasis small">
                            Student list within CAPS.
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
                                    <CTableHeaderCell scope="col">Matric No</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Last Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">First Mid Name</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Gender</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Birthdate<br/>YYYY/MM/DD</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Faculty</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">GPA</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Enrolment Date</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Options</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {students.map(item => (
                                    <CTableRow key={item.studentId}>
                                        <CTableHeaderCell scope="row">{item.studentId}</CTableHeaderCell>
                                        <CTableDataCell>{item.matriculationNumber}</CTableDataCell>
                                        <CTableDataCell>{item.lastName}</CTableDataCell>
                                        <CTableDataCell>{item.firstMidName}</CTableDataCell>
                                        <CTableDataCell>{item.gender}</CTableDataCell>
                                        <CTableDataCell>{item.dateOfBirth}</CTableDataCell>
                                        <CTableDataCell>{item.faculty.facultyName}</CTableDataCell>
                                        <CTableDataCell>{item.gpa}</CTableDataCell>
                                        <CTableDataCell>{item.enrollmentDate}</CTableDataCell>
                                        <CTableDataCell>
                                            <CButton color="info"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         setVisibleUpd(!visible_upd);
                                                         handleStudentSelection(item.studentId)
                                                     }}>Update</CButton>
                                            <CButton color="danger"
                                                     style={{marginRight: 10 + 'px'}}
                                                     onClick={() => {
                                                         setVisibleDel(!visible_Del);
                                                         handleStudentSelection(item.studentId)
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
                        <CModalTitle>Create a student</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm ref={formRef}>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Matriculation Number</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="studentMatriculationNumber"/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Password</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="studentPassword"/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Last Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="studentLastName"/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">First Middle Name</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="studentFirstMidName"/>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Gender</CFormLabel>
                                <CCol sm={10}>
                                    <CFormSelect name="studentGender">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Date of Birth</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="studentDob"/>
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
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Enrolment Date</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text" name="studentEnrollmentDate"/>
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
                        <CModalTitle>Update a student</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Matriculation Number</CFormLabel>
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
                                        name="studentFacultyId"
                                        value={studentFacultyId}
                                        onChange={(event) => setStudentFacultyId(event.target.value)}
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
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Enrolment Date</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={enrollmentDate}
                                                onChange={(event) => setEnrollmentDate(event.target.value)}/>
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
                        <CModalTitle>Delete a student</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CAlert color="danger">
                            WARNING: This is an irreversible and destructive operation
                        </CAlert>
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel className="col-sm-2 col-form-label">Student Id</CFormLabel>
                                <CCol sm={10}>
                                    <CFormInput type="text"
                                                value={selectedStudentId}
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

export default StudentRecords
