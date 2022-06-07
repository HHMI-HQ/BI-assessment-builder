/* stylelint-disable string-quotes */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { uuid, th } from '@coko/client'

import WaxWrapper from '../wax/Wax'
import { DashLayout } from '../wax/layout'
import { dashConfig } from '../wax/config'

const Wrapper = styled.div`
  padding: 5px 0;
  position: relative;
  width: 100%;
`

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

const WaxContainer = styled.a`
  flex-grow: 1;
  height: 45px;
  overflow: hidden;
  padding-left: 5px;
  transition: outline ease 200ms;

  &:hover,
  &:focus {
    outline: 1px solid ${th('colorPrimary')};
  }

  * {
    overflow: hidden;
  }
`

const Status = styled.span`
  border-radius: 20px;
  color: ${({ status }) => {
    switch (status) {
      case 'Published':
        return th('colorSuccess')
      case 'Submitted':
        return th('colorPrimary')
      case 'Under review':
        return th('colorWarning')
      case 'Rejected':
        return th('colorError')
      default:
        return th('colorBackground')
    }
  }};
  flex: 0 0 110px;
  padding: 3px 10px;
  text-align: right;
`

const SecondRow = styled.div`
  justify-content: space-evenly;
  margin-bottom: 10px;
  padding: 0 5px;

  details {
    /* flex: 1 1 0px; */

    summary {
      cursor: pointer;
      padding-right: 5px;
      width: fit-content;

      &:hover,
      &:focus {
        outline: 1px solid ${th('colorPrimary')};
      }

      > * {
        display: inline;
      }
    }

    ul {
      padding: 0;

      li {
        list-style-type: none;

        &::before {
          content: '-';
          margin-right: 10px;
        }
      }
    }
  }
`

const BottomRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  padding: 0 5px;
`

const Metadata = styled.div`
  display: flex;
  flex-basis: 20%;
  flex-direction: column;
`

const MetadataLabel = styled.div`
  font-weight: bold;
  text-transform: uppercase;
`

const MetadataValue = styled.div``

const contentPlaceholder = `<p class="paragraph">-</p>`

const QuestionItem = props => {
  const { className, metadata, content, status, href, id, courses } = props

  return (
    <Wrapper className={className} id={id}>
      <FirstRow>
        <WaxContainer href={href}>
          <WaxWrapper
            config={dashConfig}
            content={content || contentPlaceholder}
            layout={DashLayout}
            readOnly
          />
        </WaxContainer>
        {status ? <Status status={status}>{status}</Status> : null}
      </FirstRow>

      <SecondRow>
        {courses.map(c => {
          return (
            <details key={uuid()}>
              <summary>
                <MetadataLabel>{`${c.label} for ${c.course.label}`}</MetadataLabel>
              </summary>
              <ul>
                {c.objectives.map(o => (
                  <li key={uuid()}>{o.label}</li>
                ))}
              </ul>
            </details>
          )
        })}
      </SecondRow>

      <BottomRow>
        {metadata &&
          metadata.length &&
          metadata.map(item => (
            <Metadata key={uuid()}>
              <MetadataLabel>{item.label}</MetadataLabel>
              <MetadataValue>{item.value || '-'}</MetadataValue>
            </Metadata>
          ))}
      </BottomRow>
    </Wrapper>
  )
}

QuestionItem.propTypes = {
  metadata: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ).isRequired,
  content: PropTypes.shape({
    type: PropTypes.string,
    content: PropTypes.arrayOf(PropTypes.shape()),
  }),
  status: PropTypes.string,
  href: PropTypes.string,
  id: PropTypes.string,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      course: PropTypes.shape({
        label: PropTypes.string,
      }),
      label: PropTypes.string,
      objectives: PropTypes.arrayOf(
        PropTypes.shape({ label: PropTypes.string }),
      ),
    }),
  ),
}

QuestionItem.defaultProps = {
  content: null,
  status: '',
  href: '#',
  id: uuid(),
  courses: [],
}

export default QuestionItem
