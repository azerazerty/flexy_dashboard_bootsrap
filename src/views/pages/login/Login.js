import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CFooter,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibGithub, cilLockLocked, cilUser } from '@coreui/icons'
import { CFormFeedback } from '@coreui/react-pro'

import { useSelector, useDispatch } from 'react-redux'
import { getCurrentUser, setCredentials } from '../../../Redux/features/Auth/authSlice'
import { useLoginMutation } from '../../../Redux/features/Auth/authApi'

import logo from '../../../assets/logo.png'

const Login = () => {
  const navigate = useNavigate()
  const user = useSelector(getCurrentUser)
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [login, { isLoading, isSuccess }] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const data = await login({ username, password }).unwrap()
      if (data.status !== 'success') throw new Error(data.message)
      dispatch(setCredentials({ user: username, auth_token: data.auth_token, role: data.role }))
    } catch (error) {
      setError(true)
    }
  }

  useEffect(() => {
    if (user && user.auth_token && user.user) navigate('/')
  }, [user])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center text-center mb-3 ">
          <CCol md={6}>
            <CImage className="mb-1" src={logo} height={96} />
            <h3 className={`text-secondary fw-bold `}>
              ICH7EN <span className="text-primary">ADMIN PANEL</span>{' '}
              <sub className="fs-6 fw-semibold fst-italic text-primary">version 1 .0 .0</sub>
            </h3>
          </CCol>
        </CRow>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm noValidate onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        id="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        placeholder="Username"
                        autoComplete="username"
                        invalid={error}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        invalid={error}
                        feedbackInvalid="Invalid Username Or Password."
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          disabled={isLoading}
                          type="submit"
                          color="primary"
                          className="px-4"
                        >
                          {`${isLoading ? 'Logging ...' : 'Login'}`}
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
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
        <CFooter className="bg-body-tertiary mt-5 px-4">
          <div>
            <a href="https://www.ich7en.com/" target="_blank" rel="noopener noreferrer">
              Ich7en
            </a>
            <span className="ms-1">&copy; {`${new Date().getFullYear()}`}</span>
          </div>
          <div className="ms-auto">
            <span className="me-1">Powered by</span>
            <span>
              <CIcon icon={cibGithub} />
            </span>

            <a
              href="https://github.com/azerazerty"
              target="_blank"
              style={{ textDecoration: 'none' }}
            >{` @azerazerty`}</a>
          </div>
        </CFooter>
      </CContainer>
    </div>
  )
}

export default Login
