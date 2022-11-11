/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { MetadataContext } from './metadataContext'
import { GET_METADATA } from '../graphql'

const MetadataProvider = props => {
  const { children } = props
  const [metadata, setMetadata] = useState(null)
  const { data } = useQuery(GET_METADATA)

  useEffect(() => {
    if (data && !metadata) {
      setMetadata(data.getMetadata)
    }
  }, [data])

  return (
    <MetadataContext.Provider value={{ metadata }}>
      {children}
    </MetadataContext.Provider>
  )
}

export default MetadataProvider
