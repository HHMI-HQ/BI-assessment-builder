/* eslint-disable no-case-declarations */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { grid, th } from "@coko/client";
import { LinkOutlined } from "@ant-design/icons";
import {
  extractTopicsAndSubtopics,
  extractComplexItemSet,
  extractAPCourseMetadata,
  extractIBCourseMetadata,
  extractIntroBioCourseMetadata,
  extractNGSSCourseMetadata,
} from "../../utilities";
import { Link, VisuallyHiddenElement, Spin } from "../common";

const Wrapper = styled.div`
  font-size: ${th("fontSizeBase")};
  overflow-y: auto;
  padding: ${grid(4)};
`;

const MetadataHeading = styled.h3`
  font-size: ${th("fontSizeBase")};
`;

const StyledDetails = styled.details`
  summary {
    cursor: pointer;
    margin-bottom: 1em;

    /* &:hover, */
    &:focus {
      outline: 1px solid ${th("colorPrimary")};
    }
  }

  ol {
    padding-left: 15px;

    li::marker {
      font-weight: bold;
    }
  }
`;

const StyledList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const MetadataInfo = ({
  values,
  metadata,
  resources,
  complexItemSetOptions = [],
}) => {
  if (Object.keys(values).length) {
    const questionTopics = extractTopicsAndSubtopics(
      values.topics,
      metadata.topics,
    );

    const complexItemSet = extractComplexItemSet(
      values.complexItemSetId,
      complexItemSetOptions,
    );

    const { dependsOn } = values;

    return (
      <Wrapper tabIndex={0}>
        <VisuallyHiddenElement as="h2">Item Metadata</VisuallyHiddenElement>
        {complexItemSet && (
          <>
            <MetadataHeading>Context-dependent item set</MetadataHeading>
            <p>
              <Link to={`/set/${complexItemSet.value}`}>
                <LinkOutlined /> {complexItemSet.label}
              </Link>
            </p>
          </>
        )}
        {complexItemSet && dependsOn && (
          <>
            <MetadataHeading>Depends on</MetadataHeading>
            {dependsOn?.map((d) => (
              <p>
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  to={`/question/${d}/test`}
                >
                  <LinkOutlined /> Item {d}
                </Link>
              </p>
            ))}
          </>
        )}
        <MetadataHeading>Item type</MetadataHeading>
        <p>
          {
            metadata.questionTypes
              .flatMap((group) => group.options)
              .find((qType) => qType.value === values.questionType)?.label
          }
        </p>
        <MetadataHeading>Topic(s)</MetadataHeading>
        <p>{questionTopics.topics}</p>
        <MetadataHeading>Subtopic(s)</MetadataHeading>
        <p>{questionTopics.subtopics}</p>
        <MetadataHeading>Courses</MetadataHeading>
        {values.courses.map((course) => {
          const courseObject = metadata.frameworks.find(
            (f) => f.value === course.course,
          );

          const courseUnits = course.units.map((unitData) => {
            switch (courseObject.textValue) {
              case "apBiology":
              case "apEnvironmentalScience":
                return (
                  <li key={`${JSON.stringify(unitData)}`}>
                    {extractAPCourseMetadata(unitData, courseObject).map(
                      (cm) => {
                        return (
                          cm.value && (
                            <div key={JSON.stringify(cm)}>
                              <p>
                                <strong>{cm.label}</strong>
                              </p>
                              <p>{cm.value}</p>
                            </div>
                          )
                        );
                      },
                    )}
                  </li>
                );
              case "biBiology":
              case "biEnvironmentalScience":
                return (
                  <li key={`${JSON.stringify(unitData)}`}>
                    {extractIBCourseMetadata(unitData, courseObject).map(
                      (cm) => {
                        return (
                          cm.value && (
                            <div key={JSON.stringify(cm)}>
                              <p>
                                <strong>{cm.label}</strong>
                              </p>
                              <p>{cm.value}</p>
                            </div>
                          )
                        );
                      },
                    )}
                  </li>
                );
              case "introBioForMajors":
                return (
                  <li key={`${JSON.stringify(unitData)}`}>
                    {extractIntroBioCourseMetadata(
                      unitData,
                      courseObject,
                      metadata.introToBioMeta,
                    ).map((cm) => {
                      return (
                        cm.value && (
                          <div key={JSON.stringify(cm)}>
                            <p>
                              <strong>{cm.label}</strong>
                            </p>
                            <p>{cm.value}</p>
                          </div>
                        )
                      );
                    })}
                  </li>
                );
              case "ngss":
                return (
                  <li key={`${JSON.stringify(unitData)}`}>
                    {extractNGSSCourseMetadata(unitData, courseObject).map(
                      (cm) => {
                        return (
                          cm.value && (
                            <div key={JSON.stringify(cm)}>
                              <p>
                                <strong>{cm.label}</strong>
                              </p>
                              <p>{cm.value}</p>
                            </div>
                          )
                        );
                      },
                    )}
                  </li>
                );
              default:
                return null;
            }
          });

          return (
            <StyledDetails key={course.course}>
              <summary>{courseObject.label}</summary>
              <ol>{courseUnits}</ol>
            </StyledDetails>
          );
        })}
        {values.keywords?.length ? (
          <>
            <MetadataHeading>Keywords</MetadataHeading>
            <p>{values.keywords.join(", ")}</p>
          </>
        ) : (
          ""
        )}
        <MetadataHeading>Bloom&apos;s cognitive level</MetadataHeading>
        <p>
          {
            [
              ...metadata.blooms.cognitive[0].options,
              ...metadata.blooms.cognitive[1].options,
            ].find((cLevel) => cLevel.value === values.cognitiveLevel)?.label
          }
        </p>
        {values.affectiveLevel && (
          <>
            <MetadataHeading>Bloom&apos;s affective level</MetadataHeading>
            <p>
              {
                metadata.blooms.affective.find(
                  (aLevel) => aLevel.value === values.affectiveLevel,
                )?.label
              }
            </p>
          </>
        )}
        {values.psychomotorLevel && (
          <>
            <MetadataHeading>Bloom&apos;s psychomotor level</MetadataHeading>
            <p>
              {
                metadata.blooms.psychomotor.find(
                  (pLevel) => pLevel.value === values.psychomotorLevel,
                )?.label
              }
            </p>
          </>
        )}
        {values.biointeractiveResources.length > 0 && (
          <>
            <MetadataHeading>Biointeractive Resources</MetadataHeading>
            <StyledList>
              {values.biointeractiveResources.map((resource) => {
                const resourceObject = resources.find(
                  (r) => r.value === resource,
                );

                return resourceObject ? (
                  <li key={resourceObject.value}>
                    <Link
                      as="a"
                      href={resourceObject.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {resourceObject.label}
                    </Link>
                  </li>
                ) : null;
              })}
            </StyledList>
          </>
        )}
        {values.literatureAttribution && (
          <>
            <MetadataHeading>Citation</MetadataHeading>
            <ul>
              {values.literatureAttribution.split("\n").map((c, i) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </>
        )}
      </Wrapper>
    );
  }

  return <Spin fullscreen />;
};

export default MetadataInfo;
