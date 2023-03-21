/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import { render } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'
import { ThemeProvider } from 'styled-components'

// to enable async/await functionalities
import 'regenerator-runtime'

import theme from './theme'

expect.extend(toHaveNoViolations)

const AllTheProviders = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

export * from 'jest-axe'

// for snapshot testing
export { default as renderer } from 'react-test-renderer'

// override render method
export { customRender as render }
