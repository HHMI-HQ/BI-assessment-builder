import React from 'react'
import styled from 'styled-components'
import { lorem } from 'faker'

export const Background = styled.div`
  background: ${props => props.theme.colorBody};
  padding: 40px;
`

const StyledFiller = styled.div`
  align-items: center;
  background: ${props => props.theme.colorSecondary};
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: center;
  margin-bottom: 16px;
  padding: 48px;
  text-align: justify;

  > div {
    font-weight: bold;
    text-align: center;
  }
`

export const Filler = () => {
  return (
    <StyledFiller>
      <div>Filler</div>
      <span>{lorem.sentences(10)}</span>
    </StyledFiller>
  )
}
