import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { grid, th } from "@coko/client";
import { TabsStyled as Tabs } from "../common";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import theme from "../../theme";

const Wrapper = styled.div`
  background-color: ${th("colorBackgroundHue")};
  min-block-size: 100%;
`;

const StyledTabs = styled(Tabs)`
  max-inline-size: 1000px;
  margin-inline: auto;

  .ant-tabs-nav {
    background-color: ${th("colorBackgroundHue")};
  }

  .ant-tabs-body-holder {
    background-color: ${th("colorBackground")};
    border: 1px solid ${th("colorBorder")};
    border-radius: 0 0 4px 4px;
    border-top: none;
    padding: ${grid(4)};
  }
`;

const Profile = ({
  className,
  onPasswordUpdate,
  onProfileUpdate,
  onCountryChange,
  showPasswordTab,
  initialValues = {},
  loading = false,
  message = "",
  onAutoSave = () => {},
  submissionStatus = null,
  countries = [],
  courses = [],
  institutionLevels = [],
  institutionalSetting = [],
  states = [],
  topics = [],
  userId = null,
}) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [activeKey, setActiveKey] = useState("profileInfo");

  const checkForUnsavedChanges = (newTabKey) => {
    if (newTabKey !== activeKey) {
      if (unsavedChanges) {
        // TODO: show dialog to warn user of unsaved changes and proceed accoring to their choice
        // eslint-disable-next-line no-alert, no-restricted-globals
        const result = confirm("you have unsaved changes. continue anyway?");
        if (!result) return false;
        setUnsavedChanges(false);
        setActiveKey(newTabKey);
        return true;
      }

      setActiveKey(newTabKey);
      return true;
    }

    setActiveKey(newTabKey);
    return true;
  };

  const handleValuesChange = () => {
    if (!unsavedChanges) setUnsavedChanges(true);
  };

  const handleProfileInfoSubmit = (values) => {
    setUnsavedChanges(false);
    onProfileUpdate(values);
  };

  const handleChangePasswordSubmit = (values) => {
    setUnsavedChanges(false);
    onPasswordUpdate(values);
  };

  const items = [
    {
      label: "Profile info",
      key: "profileInfo",
      children: (
        <ProfileInfo
          countries={countries}
          courses={courses}
          initialValues={initialValues}
          institutionalSetting={institutionalSetting}
          institutionLevels={institutionLevels}
          loading={loading}
          message={message}
          onAutoSave={onAutoSave}
          onCountryChange={onCountryChange}
          onSubmit={handleProfileInfoSubmit}
          onValuesChange={handleValuesChange}
          // secondaryButtonLabel="Cancel"
          showSecondaryButton={false}
          states={states}
          submissionStatus={submissionStatus}
          submitButtonLabel="Save"
          topics={topics}
          userId={userId}
        />
      ),
    },
  ];

  if (!userId && showPasswordTab)
    items.push({
      label: "Password",
      key: "changePassword",
      children: (
        <ChangePassword
          loading={loading}
          message={message}
          onSubmit={handleChangePasswordSubmit}
          onValuesChange={handleValuesChange}
          submissionStatus={submissionStatus}
        />
      ),
    });

  return (
    <Wrapper className={className}>
      <StyledTabs
        activebg={theme.colorBackground} // prop to set active tab background-color
        activeKey={activeKey}
        items={items}
        onTabClick={checkForUnsavedChanges}
      />
    </Wrapper>
  );
};

Profile.propTypes = {
  initialValues: PropTypes.shape(),
  loading: PropTypes.bool,
  message: PropTypes.string,
  onAutoSave: PropTypes.func,
  onPasswordUpdate: PropTypes.func.isRequired,
  onProfileUpdate: PropTypes.func.isRequired,
  submissionStatus: PropTypes.string,
  countries: PropTypes.arrayOf(PropTypes.shape()),
  courses: PropTypes.arrayOf(PropTypes.shape()),
  institutionLevels: PropTypes.arrayOf(PropTypes.shape()),
  institutionalSetting: PropTypes.arrayOf(PropTypes.shape()),
  states: PropTypes.arrayOf(PropTypes.shape()),
  topics: PropTypes.arrayOf(PropTypes.shape()),
  onCountryChange: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

export default Profile;
