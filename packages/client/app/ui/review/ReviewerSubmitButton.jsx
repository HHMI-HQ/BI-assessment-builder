import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '../common'

const ReviewerSubmitButton = props => {
  const { className, onSubmit, showDialog } = props

  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    onSubmit()
      .then(() => {
        showDialog(
          'success',
          'Review submitted successfully',
          'Thank you for reviewing this assessment item; your responses have been submitted.',
        )
      })
      .catch(() => {
        showDialog(
          'error',
          'Problem submitting review',
          'There was an error while submitting your review. Please try again!',
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Button
      className={className}
      id="reviewerSubmitReview"
      loading={loading}
      onClick={handleSubmit}
      type="primary"
    >
      Submit Review
    </Button>
  )
}

ReviewerSubmitButton.propTypes = {
  onSubmit: PropTypes.func,
  showDialog: PropTypes.func,
}

ReviewerSubmitButton.defaultProps = {
  onSubmit: null,
  showDialog: null,
}

export default ReviewerSubmitButton
