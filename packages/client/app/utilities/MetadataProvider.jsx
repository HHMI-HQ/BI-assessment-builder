/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useState, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import { MetadataContext } from "./metadataContext";
import { GET_METADATA_OPTIMIZED } from "../graphql";

const MetadataProvider = (props) => {
  const { children } = props;
  const [metadata, setMetadata] = useState(null);
  const { refetch: fetchMetadata } = useQuery(GET_METADATA_OPTIMIZED, {
    skip: true,
  });

  useEffect(() => {
    resetMetadata();
  }, []);

  const resetMetadata = () => {
    fetchMetadata().then(({ data }) => {
      if (data) {
        setMetadata(data.getMetadataOptimized);
      }
    });
  };

  return (
    <MetadataContext.Provider value={{ metadata, resetMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};

export default MetadataProvider;
