import React, {useRef, useState} from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow, CToast, CToastBody, CToaster, CToastHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilLockLocked, cilUser} from '@coreui/icons'
import config from "../../config";

const Login = () => {
    // form values
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    // toast
    const [toast, addToast] = useState(0)
    const toaster = useRef()

    /**
     * Process jwt to safe storage
     * @param jwt
     * @returns {Promise<void>}
     */
    const processJwt = async (jwt) => {
        const payloadObj = JSON.parse(atob(jwt.split('.')[1]));
        await setJWTToLS(jwt, payloadObj.sub, payloadObj.a[0], payloadObj.u);
    }

    /**
     * Storage jwt and userId
     * @param jwt
     */
    function setJWTToLS(jwt, userId, userRole, userNbr) {
        localStorage.setItem('jwt', jwt)
        let userIdKey = "";
        switch (userRole) {
            case config.USER_ROLE_ADMIN:
                userIdKey = "adminId";
                break;
            case config.USER_ROLE_STUDENT:
                userIdKey = "studentId";
                break;
            case config.USER_ROLE_LECTURER:
                userIdKey = "lecturerId";
                break;
        }
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(userIdKey, userId);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userNbr", userNbr);
    }

    /**
     * UIA Login
     * @param event
     * @returns {Promise<void>}
     */
    const handleLogin = async (event) => {
        event.preventDefault();
        console.log(JSON.stringify({"username": username, "password": password}))
        try {
            const response = await fetch(config.loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"username": username, "password": password})
            });
            if (response.ok) {
                const loginResult = await response.json();
                // login success, retrieve and save jwt
                if (loginResult.code === config.REQUEST_SUCCESS) {
                    console.log('User: ' + username + " log in successful.");
                    const jwt = loginResult.data.accessToken;
                    await processJwt(jwt);
                    // redirect to home page
                    window.location.href = "/#/home";
                    window.location.reload();
                }
                // else, login failed because bad credentials
                else {
                    console.error('Failed to log in: ', loginResult.msg);
                    addToast(resultToast({
                        toastHeader: config.TOAST_FAILED_MSG,
                        toastColor: config.TOAST_FAILED_COLOR,
                        toastMessage: "failed, cause: " + loginResult.msg
                    }));
                }
            } else {
                console.error('Error while logging in.');
                addToast(resultToast({
                    toastHeader: config.TOAST_FAILED_MSG,
                    toastColor: config.TOAST_FAILED_COLOR,
                    toastMessage: config.TOAST_FAILED_MSG
                }));
            }
        } catch (error) {
            console.error('Error while logging in:', error);
            addToast(resultToast({
                toastHeader: config.TOAST_FAILED_MSG,
                toastColor: config.TOAST_FAILED_COLOR,
                toastMessage: config.TOAST_FAILED_MSG
            }));
        }
    }

    /**
     * Pop toast if login failed
     * @param toastColor
     * @param toastHeader
     * @param toastMessage
     * @returns {JSX.Element}
     */
    const resultToast = ({toastColor, toastHeader, toastMessage}) => (
        <CToast autohide={true} color={toastColor}>
            <CToastHeader closeButton>
                <div className="fw-bold me-auto">{toastHeader}</div>
                <small>now</small>
            </CToastHeader>
            <CToastBody>Your login attempt is {toastMessage}</CToastBody>
        </CToast>
    )

    return (
        <div className="bg-light min-vh-70 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6}>
                        <CCardGroup>
                            <CCard className="p-4" style={{ minWidth: '280px', maxWidth: '400px' }}>
                                <CCardBody>
                                    <CForm>
                                        <h1>CAPS Login</h1>
                                        <p className="text-medium-emphasis">Use our unified identity authentication to
                                            sign in to your account</p>
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser}/>
                                            </CInputGroupText>
                                            <CFormInput
                                                type="text"
                                                placeholder="Username / Matriculation Number"
                                                autoComplete="username"
                                                value={username ? username : ''}
                                                onChange={(event) => {
                                                    setUsername(event.target.value)
                                                }}
                                            />
                                        </CInputGroup>
                                        <CInputGroup className="mb-4">
                                            <CInputGroupText>
                                                <CIcon icon={cilLockLocked}/>
                                            </CInputGroupText>
                                            <CFormInput
                                                type="password"
                                                placeholder="Password"
                                                autoComplete="current-password"
                                                value={password ? password : ''}
                                                onChange={(event) => {
                                                    setPassword(event.target.value)
                                                }}
                                            />
                                        </CInputGroup>
                                        <CRow>
                                            <CCol xs={3}>
                                                <CButton color="primary" className="px-4" onClick={handleLogin}>
                                                    Login
                                                </CButton>
                                            </CCol>
                                            {/*<CCol xs={6} className="text-right">*/}
                                            {/*    <CButton color="link" className="px-0; text-right">*/}
                                            {/*        Forgot password?*/}
                                            {/*    </CButton>*/}
                                            {/*</CCol>*/}
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                        <CToaster ref={toaster} push={toast} placement="top-end"/>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Login
