import React from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@coko/client";
import { Result } from "../common";

const DeactivateUsers = () => {
  const { currentUser } = useCurrentUser();
  if (currentUser?.isActive) {
    return <Navigate replace to="/discover" />;
  }

  return (
    <Result
      status="403"
      subTitle="Sorry, your user has been deactivated. Please contact the administrators if you think this is a mistake."
      title="403"
    />
  );
};

export default DeactivateUsers;
