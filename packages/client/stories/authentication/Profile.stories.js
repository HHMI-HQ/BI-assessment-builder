/* eslint-disable no-console */
import React, { useState } from 'react'
import { Profile, Checkbox } from 'ui'

const initialValues = {
  firstName: 'Filan',
  lastName: 'Fisteku',
  email: 'filanfisteku@email.com',
}

export const Base = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [submissionStatus, setSubmissionStatus] = useState(null)

  const [error, setError] = useState(false)

  const handleProfileSubmit = vals => {
    console.log(vals)
    console.log(error)

    setLoading(true)

    setTimeout(() => {
      setLoading(false)

      if (!error) {
        setMessage('Profile updated successfully')
        setSubmissionStatus('success')
      } else {
        setMessage('There was an error, please try again')
        setSubmissionStatus('error')
      }
    }, 1000)
  }

  const handlePasswordSubmit = vals => {
    console.log(vals)
    console.log(error)

    setLoading(true)

    setTimeout(() => {
      setLoading(false)

      if (!error) {
        setMessage('Password changed successfully')
        setSubmissionStatus('success')
      } else {
        setMessage('There was an error, please try again')
        setSubmissionStatus('error')
      }
    }, 1000)
  }

  return (
    <>
      <p>
        <Checkbox checked={error} onChange={() => setError(!error)}>
          Check and submit the form to see error state
        </Checkbox>
      </p>
      <Profile
        initialValues={initialValues}
        loading={loading}
        message={message}
        onAutoSave={vals => console.log('saving', vals)}
        onPasswordUpdate={handlePasswordSubmit}
        onProfileUpdate={handleProfileSubmit}
        submissionStatus={submissionStatus}
      />
    </>
  )
}

export default {
  component: Profile,
  title: 'Authentication/Profile',
}
