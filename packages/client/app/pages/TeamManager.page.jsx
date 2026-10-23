import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useQuery, useMutation } from "@apollo/client/react";
import { useCurrentUser } from "@coko/client";
import { hasGlobalRole } from "../utilities";

import {
  GLOBAL_TEAMS,
  NON_TEAM_MEMBER_USERS,
  UPDATE_GLOBAL_TEAMS,
} from "../graphql";
import { TeamManagerList, Result } from "../ui";

const TeamManagerPage = () => {
  // #region hooks
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const { currentUser } = useCurrentUser();

  const {
    data: teamsData,
    loading: loadingTeams,
    // error: initialTeamsError,
  } = useQuery(GLOBAL_TEAMS);

  const [nonTeamMembersUsersData, setNonTeamMembersUsersData] = useState([]);

  const { refetch: fetchNonTeamMembers } = useQuery(NON_TEAM_MEMBER_USERS, {
    skip: true,
  });

  const [
    updateGlobalTeams,
    // { loading: updatingGlobalTeams, error: updateGlobalTeamsError },
  ] = useMutation(UPDATE_GLOBAL_TEAMS, {
    refetchQueries: [{ query: GLOBAL_TEAMS }],
  });

  const teams = teamsData?.teams.result.map((t) => {
    const { members, ...rest } = t;

    const transformedMembers = members.map((m) => {
      return {
        id: m.user.id,
        displayName: m.user.displayName,
      };
    });

    return {
      ...rest,
      members: transformedMembers,
    };
  });

  useEffect(() => {
    setSearchLoading(false);

    const mappedOptions = nonTeamMembersUsersData.map((user) => {
      return {
        label: user.displayName,
        value: user.id,
      };
    });

    setSearchOptions(mappedOptions);
  }, [nonTeamMembersUsersData]);
  // #endregion hooks

  // #region handlers
  const handleAdd = (teamId, opts) => {
    const newMemberIds = opts.map((opt) => opt.value);
    const team = teams.find((t) => t.id === teamId);
    const existingMemberIds = team.members.map((m) => m.id);

    const mutationData = {
      variables: {
        teamId,
        members: [...existingMemberIds, ...newMemberIds],
      },
    };

    updateGlobalTeams(mutationData).catch((e) => console.error(e));
  };

  const handleRemove = (teamId, opts) => {
    const team = teams.find((t) => t.id === teamId);
    const existingMemberIds = team.members.map((m) => m.id);
    const newMembers = existingMemberIds.filter((id) => !opts.includes(id));

    const mutationData = {
      variables: {
        teamId,
        members: newMembers,
      },
    };

    updateGlobalTeams(mutationData).catch((e) => console.error(e));
  };

  const handleSearch = async (teamId, searchValue) => {
    if (!searchValue) {
      setSearchOptions([]);
    } else {
      setSearchLoading(true);
      const results = await fetchNonTeamMembers({
        id: teamId,
        term: searchValue,
      });
      console.log(results);

      setNonTeamMembersUsersData(results.data.getNonTeamMemberUsers);
    }
  };
  // #endregion handlers

  if (!hasGlobalRole(currentUser, "admin")) {
    return (
      <Result
        // replace link with a Button with to="/dashboard" after MR is merged
        extra={<Link to="/dashboard">Back to Dashboard</Link>}
        status="403"
        subTitle="Sorry, you are not authorized to access this page."
        title="403"
      />
    );
  }

  return (
    <TeamManagerList
      loading={loadingTeams}
      onAdd={handleAdd}
      onRemove={handleRemove}
      onSearch={handleSearch}
      searchLoading={searchLoading}
      searchOptions={searchOptions}
      teams={teams}
    />
  );
};

TeamManagerPage.propTypes = {};

TeamManagerPage.defaultProps = {};

export default TeamManagerPage;
