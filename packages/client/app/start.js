import { startClient } from '@coko/client'

import routes from './DefaultPage'
import theme from './theme'
import { CURRENT_USER } from './graphql'
// import makeApolloConfig from './apolloConfig'

startClient(routes, theme, { currentUserQuery: CURRENT_USER })
