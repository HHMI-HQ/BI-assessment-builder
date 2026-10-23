/* stylelint-disable declaration-no-important */
/* stylelint-disable string-quotes */
import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../common'

const ReviewFormToggle = props => {
  const { className, showReviewForm, toggleReviewForm, reviewSubmitted } = props

  return (
    <Button className={className} onClick={toggleReviewForm} type="primary">
      {showReviewForm ? 'Close' : 'Show'} Review {reviewSubmitted ? '' : 'Form'}
    </Button>
  )
}

ReviewFormToggle.propTypes = {
  showReviewForm: PropTypes.bool,
  toggleReviewForm: PropTypes.func,
  reviewSubmitted: PropTypes.bool,
}

ReviewFormToggle.defaultProps = {
  showReviewForm: false,
  toggleReviewForm: null,
  reviewSubmitted: false,
}

export default ReviewFormToggle
