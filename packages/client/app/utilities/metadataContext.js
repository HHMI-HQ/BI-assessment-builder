import { createContext, useContext } from 'react'

export const MetadataContext = createContext({})
export const useMetadata = () => useContext(MetadataContext)
