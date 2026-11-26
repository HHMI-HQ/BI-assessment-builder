import React from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@apollo/client/react";

import { VerifyEmail } from "ui";
import { RESEND_VERIFICATION_EMAIL, VERIFY_EMAIL } from "../graphql";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const redirectToLogin = () => navigate("/login");

  const [verifyingLoader, setVerifyingLoader] = React.useState(false);
  const [resendingLoader, setResendingLoader] = React.useState(false);

  const [
    verifyEmailMutation,
    {
      data: verifyData,
      loading: verifying,
      error: verifyError,
      called: verifyCalled,
    },
  ] = useMutation(VERIFY_EMAIL, { variables: { token } });

  const [
    resendVerificationEmailMutation,
    { data: resendData, loading: resending },
  ] = useMutation(RESEND_VERIFICATION_EMAIL, { variables: { token } });

  if (!verifyCalled) {
    setVerifyingLoader(true);
    verifyEmailMutation().then(() => {
      setVerifyingLoader(false);
    });
  }

  const resendVerificationEmail = () => {
    setResendingLoader(true);
    resendVerificationEmailMutation().then(() => {
      setResendingLoader(false);
    });
  };

  let alreadyVerified = false;
  if (verifyError && verifyError.message.includes("already been confirmed"))
    alreadyVerified = true;

  let expired = false;
  if (verifyError && verifyError.message.includes("expired")) expired = true;

  return (
    <VerifyEmail
      alreadyVerified={alreadyVerified}
      expired={expired}
      redirectToLogin={redirectToLogin}
      resend={resendVerificationEmail}
      resending={resending || resendingLoader}
      resent={!!resendData}
      successfullyVerified={!!verifyData}
      verifying={verifying || verifyingLoader}
    />
  );
};

VerifyEmailPage.propTypes = {};

export default VerifyEmailPage;
