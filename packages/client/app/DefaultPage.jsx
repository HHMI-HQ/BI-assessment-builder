import React, { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client/react'
// import {
//   Route,
//   Routes,
//   Redirect,
//   useLocation,
//   useHistory,
// } from 'react-router-dom'

import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router'
import styled from 'styled-components'

import {
  PageLayout as Page,
  useCurrentUser,
} from '@coko/client'

import {
  Header,
  Footer,
  VisuallyHiddenElement,
  Spin,
  ToastNotification,
  LayoutWrapper,
} from './ui'

import GlobalStyles from './globalStyles' 
import {
  hasGlobalRole,
  MetadataProvider,
  NotificationsProvider,
  FiltersProvider,
  useNotifications,
} from './utilities'

import Router from './Router'

import { DELETED_SUBSCRIPTION } from './graphql'


const StyledPage = styled(Page)`
  height: calc(100% - 60px - 50px);
`

const StyledSpin = styled(Spin)`
  display: grid;
  height: 100vh;
  place-content: center;
`

const StyledMain = styled.main`
  height: 100%;
`

const regexPaths = [
  // {
  //   path: /^\/question\/[A-Za-z0-9-]+\/test$/i,
  //   name: 'Question page',
  // },
  // {
  //   path: /^\/question\/[A-Za-z0-9-]+$/i,
  //   name: 'Question Editor page',
  // },
  {
    path: /^\/discover$/,
    name: 'Browse Questions',
  },
  {
    path: /^\/dashboard$/,
    name: 'Dashboard',
  },
  {
    path: /^\/sets$/,
    name: 'Context-Dependent Item Sets',
  },
  {
    path: /^\/lists$/,
    name: 'Lists',
  },
  {
    path: /^\/manage-users$/,
    name: 'User Manager',
  },
  {
    path: /^\/manage-teams$/,
    name: 'Team Manager',
  },
  {
    path: /^\/manage-metadata$/,
    name: 'Metadata manager',
  },
  {
    path: /^\/notifications$/,
    name: 'Notifications',
  },
  {
    path: /^\/profile$/,
    name: 'User Profile',
  },
  {
    path: /^\/login+/,
    name: 'Login',
  },
  {
    path: /^\/signup$/,
    name: 'Signup',
  },
  {
    path: /^\/signup-profile$/,
    name: 'Signup Questionnaire',
  },
  {
    path: /^\/email-verification\/[A-Za-z0-9-]+$/,
    name: 'Verify email',
  },
  {
    path: /^\/request-password-reset$/,
    name: 'Request Password Reset',
  },
  {
    path: /^\/password-reset\/[A-Za-z0-9-]+$/,
    name: 'Reset Password',
  },
  {
    path: /^\/ensure-verified-login$/,
    name: 'Email Not Verified',
  },
  {
    path: /^\/biointeractive-oauth+/,
    name: 'BioInteractive login',
  },
  {
    path: /^\/$/,
    name: 'Homepage',
  },
  {
    path: /^\/about$/,
    name: 'About',
  },
  {
    path: /^\/learning$/,
    name: 'Professional Learning',
  },
]

const Wrapper = props => {
  const { children } = props

  const { currentUser } = useCurrentUser()
  const location = useLocation()

  // const [refetchCurrentUser] = useLazyQuery(CURRENT_USER, {
  //   fetchPolicy: 'network-only',
  // })

  useEffect(() => {
    const path = location.pathname
    const title = regexPaths.find(p => p.path.test(path))

    if (title) {
      document.title = `${title?.name} - HHMI Assessment Builder`
      document
          .getElementById('page-announcement')
          .replaceChildren(title?.name)
    }

  }, [location])

  // useEffect(() => {
  //   const path = history.location.pathname
  //   const title = regexPaths.find(p => p.path.test(path))

  //   if (title) {
  //     document.title = `${title?.name} - HHMI Assessment Builder`

  //   }

  //   const unlisten = history.listen(val => {
  //     const pathName = val.pathname
  //     const pathTitle = regexPaths.find(p => p.path.test(pathName))

  //     if (pathTitle) {
  //       document
  //         .getElementById('page-announcement')
  //         .replaceChildren(pathTitle?.name)

  //       document.title = `${pathTitle?.name} - HHMI Assessment Builder`
  //     }
  //   })

  //   return unlisten
  // }, [])

  useEffect(() => {
    const keyDownListener = (e) => {
      if (e.key === 'Tab') {
        // select only visible antd modal dialog
        const dialog = document.querySelector(
          ':not([style="display: none;"]) > .ant-modal[role="dialog"]',
        )

        if (dialog) {
          const focusableElements = dialog.querySelectorAll(
            [
              'a[href]',
              'area[href]',
              'input:not([disabled]):not([type=hidden])',
              'select:not([disabled])',
              'textarea:not([disabled])',
              'button:not([disabled])',
              'object',
              'embed',
              '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
              'audio[controls]',
              'video[controls]',
              '[contenteditable]:not([contenteditable="false"])',
            ].join(', '),
          )

          const firstFocusableElement = focusableElements[0]

          const lastFocusableElement =
            focusableElements[focusableElements.length - 1]

          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus()
              e.preventDefault()
            }
          } else if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', keyDownListener)

    return document.removeEventListener('kaydown', keyDownListener)
  }, [])

  useEffect(() => {
    if (
      // temporary, create a wrapper hook that extends the User type
      (currentUser)?.profileSubmitted &&
      !localStorage.getItem('profileSubmitted')
    ) {
      localStorage.setItem('profileSubmitted', 'true')
    }

    // if (
    //   currentUser &&
    //   !Object.prototype.hasOwnProperty.call(currentUser, 'profileSubmitted')
    // ) {
    //   refetchCurrentUser().then(({ data }) => {
    //     setCurrentUser(data.currentUser)
    //   })
    // }
  }, [currentUser])

  // interface DeletedSubscriptionResult {
  //   userDeleted: string;
  // }

  useSubscription(DELETED_SUBSCRIPTION, {
    onData: ({
      data: {
        data: { userDeleted },
      },
    }) => {      
      if (userDeleted === currentUser.id) window.location.href = '/'
    },
  })

  return (
    <LayoutWrapper style={{ display: 'flex',
  'flex-direction': 'column',
  'height': '100vh'}}>
      {children}
      <VisuallyHiddenElement
        aria-live="polite"
        as="div"
        id="page-announcement"
        role="status"
      />
    </LayoutWrapper>
  )
}

const Loader = props => {
  const { pathname } = useLocation()

  return (
    <StyledSpin
      {...props}
      // render background to avoid rendering biointeractive login component twice
      renderBackground={pathname === '/biointeractive-oauth'}
    />
  )
}

const SiteHeader = () => {
  const headerLinks = {
    homepage: '/',
    questions: '/discover',
    dashboard: '/dashboard',
    sets: '/sets',
    lists: '/lists',
    about: '/about',
    learning: '/learning',
    manageUsers: '/manage-users',
    manageTeams: '/manage-teams',
    manageMetadata: '/manage-metadata',
    // tasks: '/notifications/tasks',
    messages: '/notifications/messages',
    profile: '/profile',
    login: '/login',
  }

  const { currentUser } = useCurrentUser()
  const { unreadMentionsCount } = useNotifications()
  const client = useApolloClient()
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState(location.pathname)

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location]);

  // useEffect(() => {
  //   const unlisten = history.listen(val => setCurrentPath(val.pathname))

  //   return unlisten
  // }, [])

  // inject GTM script
  useEffect(() => {
    let headScript
    let noscript

    if (window.location.origin === 'https://assessment.biointeractive.org') {
      headScript = document.createElement('script')
      headScript.replaceChildren(`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MR7JX6C');`)

      noscript = document.createElement('noscript')
      noscript.replaceChildren(`
        <iframe
          height="0"
          src="https://www.googletagmanager.com/ns.html?id=GTM-MR7JX6C"
          style="display:none;visibility:hidden"
          width="0"
        />`)

      document.head.prepend(headScript)
      document.body.prepend(noscript)
    }

    return () => {
      noscript && document.body.removeChild(noscript)
      headScript && document.head.removeChild(headScript)
    }
  }, [])

  const logout = () => {
    // setCurrentUser(null)
    client.cache.reset()

    localStorage.removeItem('token')
    localStorage.removeItem('dashboardLastUsedTab')
    localStorage.removeItem('profileSubmitted')

    navigate('/login')
  }

  const isAdmin = hasGlobalRole(currentUser, 'admin')

  return (
    <Header
      canManageResources={isAdmin}
      canManageTeams={isAdmin}
      canManageUsers={isAdmin}
      currentPath={currentPath}
      displayName={currentUser?.displayName}
      links={headerLinks}
      loggedin={!!currentUser}
      onLogout={logout}
      unreadMentionsCount={unreadMentionsCount}
    />
  )
}

const ToastNotifications = () => {
  const { newNotification } = useNotifications()

  return <ToastNotification notification={newNotification} />
}

// const RequireProfile = ({ children }) => {
//   const { pathname } = useLocation()
//   const { currentUser } = useCurrentUser()

//   if (!currentUser) return null

//   if (!currentUser.isActive && pathname !== '/deactivated-user') {
//     return <Navigate replace to="/deactivated-user" />
//   }

//   if (
//     pathname !== '/signup-profile' &&
//     !(currentUser as any).profileSubmitted &&
//     !localStorage.getItem('profileSubmitted')
//   ) {
//     return <Navigate replace to="/signup-profile" />
//   }

//   return children
// }

const routes = (
  <Wrapper>
    <GlobalStyles />
    <NotificationsProvider>
      <SiteHeader />
      <MetadataProvider>
        <FiltersProvider>
          <StyledMain id="main-content" tabIndex={-1}>
            <StyledPage fadeInPages={false} padPages={false}>
              <Router />
                {/* <Routes>
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

                  <Route element={Login}  path="/login" />
                  <Route element={Signup}  path="/signup" />
                  <Route
                    element={VerifyEmail}
                    path="/email-verification/:token"
                  />
                  <Route
                    element={RequestPasswordReset}
                    path="/request-password-reset"
                  />
                  <Route
                    element={ResetPassword}
                    path="/password-reset/:token"
                  />
                  <Route
                    element={VerifyCheck}
                    path="/ensure-verified-login"
                  />
                  <Route
                    element={BioInteractiveOauth}
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
                  <Route
                    path="/set/:id"
                    element={
                      <Authenticated>
                        <ComplexItemSet />
                      </Authenticated>
                    }
                  />
                  <Route element={DeactivatedUser} path="/deactivated-user" />

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
                  <Route element={PageNotFound} path="/404" />
                  <Route element={PageNotFound} path="*" />
                </Routes> */}
              <ToastNotifications />
            </StyledPage>
          </StyledMain>
        </FiltersProvider>
      </MetadataProvider>
    </NotificationsProvider>

    <Footer
      links={{
        termsOfUse: 'https://www.hhmi.org/terms-of-use',
        privacyPolicy: 'https://www.hhmi.org/privacy-policy',
        homepage: '/',
      }}
    />
    </Wrapper>
)

export default routes
