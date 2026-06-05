/* stylelint-disable declaration-no-important */
/* stylelint-disable string-quotes */
import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../common'

const ReviewFormToggle = props => {
  const { className, showReviewForm, toggleReviewForm } = props

  return (
    <Button
      className={className}
      id="reviewForm"
      onClick={toggleReviewForm}
      type="primary"
    >
      {showReviewForm ? 'Close' : 'Open'} Review Form
    </Button>
  )
}

ReviewFormToggle.propTypes = {
  showReviewForm: PropTypes.bool,
  toggleReviewForm: PropTypes.func,
}

ReviewFormToggle.defaultProps = {
  showReviewForm: false,
  toggleReviewForm: null,
}

export default ReviewFormToggle
