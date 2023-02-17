import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { TabsStyled as Tabs, QuestionList } from '../common'

const Wrapper = styled.div``
const TabItem = styled.div``

const sortOptions = [
  {
    label: 'Date (descending)',
    value: 'date-desc',
    isDefault: true,
  },
  {
    label: 'Date (ascending)',
    value: 'date-asc',
    isDefault: false,
  },
]

const ListContent = ({ title, ...rest }) => {
  return (
    <Wrapper>
      <Tabs
        items={[
          {
            label: <TabItem>{title}</TabItem>,
            key: 0,
            children: <QuestionList sortOptions={sortOptions} {...rest} />,
          },
        ]}
      />
    </Wrapper>
  )
}

ListContent.propTypes = {
  title: PropTypes.string.isRequired,
}

export default ListContent
