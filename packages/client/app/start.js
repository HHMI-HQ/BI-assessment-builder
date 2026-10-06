import { startClient } from '@coko/client'

import routes from './DefaultPage'
import theme from './theme'
// import makeApolloConfig from './apolloConfig'

startClient(routes, theme)
