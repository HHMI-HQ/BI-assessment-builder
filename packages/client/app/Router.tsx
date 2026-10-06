import React, { ReactNode } from 'react'
// import { Route, Routes, useLocation, Navigate } from 'react-router'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import {
  RequireAuth,
  useCurrentUser,
} from '@coko/client'

import {
  Login,
  Signup,
  VerifyEmail,
  RequestPasswordReset,
  ResetPassword,
  VerifyCheck,
  Dashboard,
  Discover,
  Question,
  ManageUsers,
  TeamManager,
  UserProfile,
  DeactivatedUser,
  Lists,
  ListContent,
  BioInteractiveOauth,
  External,
  PageNotFound,
  ComplexItemSet,
  ComplexItemSetsList,
  Notifications,
  ManageResources,
  ManageMetadata,
  // QuestionContentEditingPage,
} from './pages'

const RequireProfile = ({ children }) => {
  const { pathname } = useLocation()
  const { currentUser } = useCurrentUser()

  if (!currentUser) return null

  if (!currentUser.isActive && pathname !== '/deactivated-user') {
    return <Navigate replace to="/deactivated-user" />
  }

  if (
    pathname !== '/signup-profile' &&
    !(currentUser as any).profileSubmitted &&
    !localStorage.getItem('profileSubmitted')
  ) {
    return <Navigate replace to="/signup-profile" />
  }

  return children
}

const Authenticated = ({ children }) => {
  return (
    <RequireAuth notAuthenticatedRedirectTo="/login">
      <RequireProfile>{children}</RequireProfile>
    </RequireAuth>
  )
}


const AppRoutes = (): ReactNode => {
    return (
    <Routes>
        <Route
            path="/signup-profile"
            element={
                <Authenticated>
                    <UserProfile signup />
                </Authenticated>
            }
        />

        <Route
            path="/dashboard"
            element={
                <Authenticated>
                    <Dashboard />
                </Authenticated>
            }
        />

        <Route
            path="/discover"
            element={
                <Authenticated>
                    <Discover />
                </Authenticated>
            }
        />

        <Route
            path="/lists"
            element={
                <Authenticated>
                    <Lists />
                </Authenticated>
            }
        />

        <Route
            path="/list/:id"
            element={
                <Authenticated>
                    <ListContent />
                </Authenticated>
            }
        />

        <Route
            path="/question/:id/test"
            element={
                <Authenticated>
                    <Question testMode />
                </Authenticated>
            }
        />

        <Route
            path="/question/:id"
            element={
                <Authenticated>
                    <Question />
                </Authenticated>
            }
        />
        <Route
            path="/manage-users"
            element={
                <Authenticated>
                    <ManageUsers />
                </Authenticated>
            }
        />
        {/* <Route
        exact
        path="/secret-editing-page"
        render={() => (
            <Authenticated>
            <QuestionContentEditingPage />
            </Authenticated>
        )}
        /> */}

        <Route
            path="/manage-teams"
            element={
                <Authenticated>
                    <TeamManager />
                </Authenticated>
            }
        />

        <Route
            path="/manage-resources"
            element={
                <Authenticated>
                    <ManageResources />
                </Authenticated>
            }
        />

        <Route
            path="/manage-metadata"
            element={
                <Authenticated>
                    <ManageMetadata />
                </Authenticated>
            }
        />

        <Route
            path="/profile"
            element={
                <Authenticated>
                    <UserProfile />
                </Authenticated>
            }
        />
        <Route
            path="/profile/:id"
            element={
                <Authenticated>
                    <UserProfile />
                </Authenticated>
            }
        />

        <Route element={<Login />}  path="/login" />
        <Route element={<Signup />}  path="/signup" />
        <Route
            element={<VerifyEmail />}
            path="/email-verification/:token"
        />
        <Route
            element={<RequestPasswordReset />}
            path="/request-password-reset"
        />
        <Route
            element={<ResetPassword />}
            path="/password-reset/:token"
        />
        <Route
            element={<VerifyCheck />}
            path="/ensure-verified-login"
        />
        <Route
            element={<BioInteractiveOauth />}
            path="/biointeractive-oauth"
        />
        <Route
            path="/sets"
            element={
                <Authenticated>
                    <ComplexItemSetsList />
                </Authenticated>
            }
        />
        <Route
            path="/notifications/"
            element={
                <Authenticated>
                    <Notifications />
                </Authenticated>
            }
        />
        <Route
            path="/set/new"
            element={
                <Authenticated>
                    <ComplexItemSet />
                </Authenticated>
            }
        />
        {/* individual sets and their questions can be viewed by all visitors */}
        <Route
            path="/set/:id"
            element={
                <Authenticated>
                    <ComplexItemSet />
                </Authenticated>
            }
        />
        <Route element={DeactivatedUser} path="/deactivated-user" />
        {/* Static pages hosted elsewhere */}
        <Route
        element={
            <External ariaLabel="Home page" src="/drupal/" />
        }
        path="/"
        />
        <Route
        element={
            <External ariaLabel="About page" src="/drupal/about" />
        }
        path="/about"
        />
        <Route
        element={
            <External
                ariaLabel="Proffessional learning page"
                src="/drupal/professional-learning"
            />
        }
        path="/learning"
        />
        <Route element={<PageNotFound />} path="/404" />
        <Route element={<PageNotFound />} path="*" />
    </Routes>
    )
}

export default AppRoutes