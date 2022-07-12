// import cloneDeep from 'lodash/cloneDeep'
// import { InMemoryCache } from '@apollo/client'

// const makeApolloConfig = apolloConfig => {
//   const config = cloneDeep(apolloConfig)

//   config.cache = new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           getAuthorDashboard: {
//             keyArgs: false,
//             merge(existing, incoming, { args }) {
//               const { page, pageSize } = args

//               const merged = existing ? existing.slice(0) : []

//               incoming.forEach((item, i) => {})

//               for (let i = 0; i < incoming.length; ++i) {
//                 merged[offset + i] = incoming[i]
//               }

//               return merged
//             },
//           },
//         },
//       },
//     },
//   })

//   return config
// }

// export default makeApolloConfig
