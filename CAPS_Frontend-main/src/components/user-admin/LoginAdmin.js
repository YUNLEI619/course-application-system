import React from 'react'
import { Link } from 'react-router-dom'
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
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

function LoginAdmin() {
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [loginStatus, setLoginStatus] = useState("");
  //
  // const login = (e) => {
  //   e.preventDefault();
  //   Axios.post("http://localhost:8080/login", {
  //     username: username,
  //     password: password,
  //   }).then((response) => {
  //     if(response.data.message){
  //       setLoginStatus(response.data.message);
  //     }
  //     else{
  //       currently displaying email if login successful, change to something else
  //       setLoginStatus(response.data.[0].email)
  //     }
  //   })
  // }
  return (
    <div className="bg-light min-vh-70 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4" style={{ minWidth: '280px', maxWidth: '400px' }}>
                <CCardBody>
                  <CForm>
                    <h1>Administrators</h1>
                    <p className="text-medium-emphasis">Please ensure you are using the correct login</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      {/*add  onChange={(e) => {setUsername(e.target.value)}} when input login function*/}
                      <CFormInput placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        // onChange={(e) => {setPassword(e.target.value)}}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        {/*add onClick={login} when input login function*/}
                        <CButton color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default LoginAdmin
