import React from "react";
import PropTypes from "prop-types";
import { Button, Spin, Result } from "../common";

const VerifyEmail = ({
  className,
  resend,
  redirectToLogin,
  verifying = false,
  successfullyVerified = false,
  alreadyVerified = false,
  expired = false,
  resending = false,
  resent = false,
  redirectDelay = 3000,
}) => {
  const redirect = () =>
    setTimeout(() => {
      redirectToLogin();
    }, redirectDelay);

  if (verifying)
    return (
      <div className={className}>
        <Result
          icon={<Spin size={18} spinning />}
          title="Verifying your email address..."
        />
      </div>
    );

  if (successfullyVerified) {
    redirect();

    return (
      <div className={className}>
        <Result
          status="success"
          subTitle="Redirecting you to login..."
          title="Email successfully verified!"
        />
      </div>
    );
  }

  if (alreadyVerified) {
    redirect();

    return (
      <div className={className}>
        <Result
          status="success"
          subTitle="Redirecting you to login..."
          title="This email has already been verified!"
        />
      </div>
    );
  }

  if (expired && !(resending || resent))
    return (
      <div className={className}>
        <Result
          extra={
            <Button onClick={resend} type="primary">
              Resend verification email
            </Button>
          }
          status="error"
          subTitle="Click the button below to get a new token"
          title="Your verification token has expired!"
        />
      </div>
    );

  if (resending)
    return (
      <div className={className}>
        <Result
          icon={<Spin size={18} spinning />}
          title="Sending verification email..."
        />
      </div>
    );

  if (resent)
    return (
      <div className={className}>
        <Result
          status="success"
          subTitle="Check your email for further instructions"
          title="New verification email has been sent!"
        />
      </div>
    );

  // if (hasError)
  return (
    <div className={className}>
      <Result
        status="error"
        subTitle="Try reloading the page or contact us"
        title="Something went wrong!"
      />
    </div>
  );

  // return null
};

VerifyEmail.propTypes = {
  verifying: PropTypes.bool,
  successfullyVerified: PropTypes.bool,
  alreadyVerified: PropTypes.bool,
  expired: PropTypes.bool,
  resend: PropTypes.func.isRequired,
  resending: PropTypes.bool,
  resent: PropTypes.bool,
  redirectToLogin: PropTypes.func.isRequired,
  redirectDelay: PropTypes.number,
};

export default VerifyEmail;
