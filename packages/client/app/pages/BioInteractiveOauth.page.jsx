import React, { useEffect } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router'
import { useMutation } from '@apollo/client/react'
import { useCurrentUser } from '@coko/client'

import { BioInteractiveOauth } from 'ui'

import { BIOINTERACTIVE_LOGIN } from '../graphql'

const BioInteractiveLoginPage = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser()

  const params = new URLSearchParams(search)
  const authCode = params(search).get('code')
  const state = params(search).get('state')
  const oauthError = params(search).get('error')

  const [bioInteractiveLoginMutation, { error: loginError }] =
    useMutation(BIOINTERACTIVE_LOGIN)

  const err = loginError || oauthError

  if (currentUser) return <Redirect to="/dashboard" />

  if (state !== localStorage.getItem('oauthState')) {
    // after logging in redirect to stored redirect url, or to /discover
    if (localStorage.getItem('redirectTo')) {
      const redirect = localStorage.getItem('redirectTo').substring(6)
      localStorage.removeItem('redirectTo')
      return  <Navigate replace to={redirect} />
    }

    return <Navigate replace to="/discover" />
  }

  const login = () => {
    bioInteractiveLoginMutation({
      variables: { authCode },
      onCompleted: data => {
        const { token } = data.bioInteractiveLogin

        if (token) {
          localStorage.removeItem('oauthState')
          localStorage.setItem('token', token)
          // history.go(0) 
          navigate(pathname + search, { replace: true });
        }

        console.error('No token returned from mutation!')
      },
    }).catch(e => console.error(e))
  }

  useEffect(() => {
    login()
  }, [])

  return <BioInteractiveOauth hasError={!!err} />
}

BioInteractiveLoginPage.propTypes = {}

BioInteractiveLoginPage.defaultProps = {}

export default BioInteractiveLoginPage
