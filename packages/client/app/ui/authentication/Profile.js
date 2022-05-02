import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { TabsStyled } from '../common'
import ProfileInfo from './ProfileInfo'
import ChangePassword from './ChangePassword'

const Wrapper = styled.div``

const StyledTabPane = styled(TabsStyled.TabPane)`
  margin-top: ${grid(4)};
`

const Profile = props => {
  const {
    className,
    initialValues,
    loading,
    message,
    onAutoSave,
    onPasswordUpdate,
    onProfileUpdate,
    submissionStatus,
  } = props

  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [activeKey, setActiveKey] = useState('profileInfo')

  const checkForUnsavedChanges = newTabKey => {
    if (newTabKey !== activeKey) {
      if (unsavedChanges) {
        // TODO: show dialog to warn user of unsaved changes and proceed accoring to their choice
        // eslint-disable-next-line no-alert, no-restricted-globals
        const result = confirm('you have unsaved changes. continue anyway?')
        if (!result) return false
        setUnsavedChanges(false)
        setActiveKey(newTabKey)
        return true
      }

      setActiveKey(newTabKey)
      return true
    }

    setActiveKey(newTabKey)
    return true
  }

  const handleValuesChange = () => {
    if (!unsavedChanges) setUnsavedChanges(true)
  }

  const handleProfileInfoSubmit = values => {
    setUnsavedChanges(false)
    onProfileUpdate(values)
  }

  const handleChangePasswordSubmit = values => {
    setUnsavedChanges(false)
    onPasswordUpdate(values)
  }

  return (
    <Wrapper className={className}>
      <TabsStyled activeKey={activeKey} onTabClick={checkForUnsavedChanges}>
        <StyledTabPane key="profileInfo" tab="Profile info">
          <ProfileInfo
            initialValues={initialValues}
            loading={loading}
            message={message}
            onAutoSave={onAutoSave}
            onSubmit={handleProfileInfoSubmit}
            onValuesChange={handleValuesChange}
            secondaryButtonLabel="Cancel"
            submissionStatus={submissionStatus}
            submitButtonLabel="Save"
          />
        </StyledTabPane>
        <StyledTabPane key="changePassword" tab="Password">
          <ChangePassword
            loading={loading}
            message={message}
            onSubmit={handleChangePasswordSubmit}
            onValuesChange={handleValuesChange}
            submissionStatus={submissionStatus}
          />
        </StyledTabPane>
      </TabsStyled>
    </Wrapper>
  )
}

Profile.propTypes = {
  initialValues: PropTypes.shape(),
  loading: PropTypes.bool,
  message: PropTypes.string,
  onAutoSave: PropTypes.func,
  onPasswordUpdate: PropTypes.func.isRequired,
  onProfileUpdate: PropTypes.func.isRequired,
  submissionStatus: PropTypes.string,
}

Profile.defaultProps = {
  initialValues: {},
  loading: false,
  message: '',
  onAutoSave: () => {},
  submissionStatus: null,
}

export default Profile
