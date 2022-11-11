import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'ui'

const ExportToScormButton = props => {
  const { className, loading, onExport } = props

  return (
    <Button
      className={className}
      loading={loading}
      onClick={onExport}
      type="primary"
    >
      Export to SCORM
    </Button>
  )
}

ExportToScormButton.propTypes = {
  loading: PropTypes.bool.isRequired,
  onExport: PropTypes.func.isRequired,
}

export default ExportToScormButton
