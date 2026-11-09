import React, { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router";
import { useMutation } from "@apollo/client/react";
import { useCurrentUser } from "@coko/client";

import { BioInteractiveOauth } from "ui";

import { BIOINTERACTIVE_LOGIN } from "../graphql";

const BioInteractiveLoginPage = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  const params = new URLSearchParams(search);
  const authCode = params.get("code");
  const state = params.get("state");
  const oauthError = params.get("error");

  const [bioInteractiveLoginMutation, { error: loginError }] = useMutation(
    BIOINTERACTIVE_LOGIN,
    {
      onCompleted: (data) => {
        const { token } = data.bioInteractiveLogin;

        if (token) {
          localStorage.removeItem("oauthState");
          localStorage.setItem("token", token);
          navigate(pathname + search, { replace: true });
        } else {
          console.error("No token returned from mutation!");
        }
      },
    },
  );

  const err = loginError || oauthError;

  useEffect(() => {
    bioInteractiveLoginMutation({ variables: { authCode } });
  }, []);

  if (currentUser) return <Navigate to="/dashboard" />;

  if (state !== localStorage.getItem("oauthState")) {
    // after logging in redirect to stored redirect url, or to /discover
    if (localStorage.getItem("redirectTo")) {
      const redirect = localStorage.getItem("redirectTo").substring(6);
      localStorage.removeItem("redirectTo");
      return <Navigate replace to={redirect} />;
    }

    return <Navigate replace to="/discover" />;
  }

  return <BioInteractiveOauth hasError={!!err} />;
};

export default BioInteractiveLoginPage;
