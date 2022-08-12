/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react'
import classNames from 'classnames'
import { composeRef } from 'rc-util/lib/ref'
import { warning } from 'rc-util/lib/warning'
import SelectContext from '../SelectContext'

const Input = (
  {
    prefixCls,
    id,
    inputElement,
    disabled,
    tabIndex,
    autoFocus,
    autoComplete,
    editable,
    activeDescendantId,
    value,
    maxLength,
    onKeyDown,
    onMouseDown,
    onChange,
    onPaste,
    onCompositionStart,
    onCompositionEnd,
    open,
    attrs,
  },
  ref,
) => {
  let inputNode = inputElement || <input />

  const { ref: originRef, props: originProps } = inputNode

  const {
    onKeyDown: onOriginKeyDown,
    onChange: onOriginChange,
    onMouseDown: onOriginMouseDown,
    onCompositionStart: onOriginCompositionStart,
    onCompositionEnd: onOriginCompositionEnd,
    style,
  } = originProps

  const { hasOptionList, noAvailableOptions } = React.useContext(SelectContext)

  warning(
    !('maxLength' in inputNode.props),
    `Passing 'maxLength' to input element directly may not work because input in BaseSelect is controlled.`,
  )

  inputNode = React.cloneElement(inputNode, {
    ...originProps,

    // Override over origin props
    id,
    ref: composeRef(ref, originRef),
    disabled,
    tabIndex,
    autoComplete: autoComplete || 'off',

    autoFocus,
    className: classNames(
      `${prefixCls}-selection-search-input`,
      inputNode?.props?.className,
    ),

    ...(hasOptionList
      ? {
          type: 'search',
          role: 'combobox',
          'aria-expanded': open,
          'aria-haspopup': 'listbox',
          'aria-owns': `${id}_list`,
          'aria-autocomplete': 'list',
          'aria-controls': `${id}_list`,
          // 'aria-activedescendant': activeDescendantId,
        }
      : { type: 'text' }),
    ...(noAvailableOptions
      ? {}
      : { 'aria-activedescendant': activeDescendantId }),
    ...attrs,
    value: editable ? value : '',
    maxLength,
    readOnly: !editable,
    unselectable: !editable ? 'on' : null,

    style: { ...style, opacity: editable ? null : 0 },

    onKeyDown: event => {
      onKeyDown(event)

      if (onOriginKeyDown) {
        onOriginKeyDown(event)
      }
    },
    onMouseDown: event => {
      onMouseDown(event)

      if (onOriginMouseDown) {
        onOriginMouseDown(event)
      }
    },
    onChange: event => {
      onChange(event)

      if (onOriginChange) {
        onOriginChange(event)
      }
    },
    onCompositionStart(event) {
      onCompositionStart(event)

      if (onOriginCompositionStart) {
        onOriginCompositionStart(event)
      }
    },
    onCompositionEnd(event) {
      onCompositionEnd(event)

      if (onOriginCompositionEnd) {
        onOriginCompositionEnd(event)
      }
    },
    onPaste,
  })

  return inputNode
}

const RefInput = React.forwardRef(Input)
RefInput.displayName = 'Input'

export default RefInput
