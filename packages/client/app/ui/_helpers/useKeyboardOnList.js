import { useState } from 'react'
import { isBoolean } from 'lodash'
import { safeIndex, isFunction, safeCall } from '../../utilities'

const useKeyboardOnList = ({
  enabled = true, // condition to return the keyboardHandler callback or null
  initialState = false, // initial open state
  menuItems, // Elements that belong to menu
  openButton, // button that toggles open state and listens for the keyboard event
  overrideKeys, // callback to override the default keys/actions behavior: one arg = actions >> returns {}
  additionalKeys = () => {}, // callback to add keys/actions to listen and execute: one arg = actions >> returns {}
  selectByFirstLetter = true, // optionally select a menu item by first letter
  closeOnStart = true, // optionally close the menu if action is moveUp and the active element is the first
  closeOnEnd = false, // optionally close the menu if action is moveDown and the active element is the last
  closeOnSelect = false, // optionally close the menu when selecting a menu item
  notPreventDefault = ['Tab', '229'], // boolean or array of keycode(s) strings that must not preventDefault (229 for mobile), if bool: FALSE: prevent on all keys, TRUE: dont prevent
  selectAction = () => document?.activeElement?.click(), // callback to select menu item
  onFocus = (item, setFocused) => {
    item.focus()
    setFocused(item)
  },
}) => {
  const [prevKey, setPrevKey] = useState('')
  const [open, setOpen] = useState(initialState)
  const [focused, setFocused] = useState(null)

  const currentIndex = () => menuItems.indexOf(document.activeElement)
  const atLastIndex = () => currentIndex() === menuItems.length - 1

  const itemSelected = () =>
    menuItems.filter(el => el === document.activeElement && el)

  const actions = {
    onTabOpenButton: () => {
      if (open) return
      openButton === document.activeElement && setOpen(true)
      itemSelected() && setFocused(itemSelected())
    },
    open: () => {
      if (open) return
      !itemSelected() && actions.goToFirst()
      setOpen(true)
    },
    close: () => {
      if (!open) return
      setOpen(false)
      openButton?.focus()
    },
    select: () => {
      isFunction(selectAction) && selectAction(menuItems, actions)
      closeOnSelect && actions.close()
    },
    goToFirst: () => {
      onFocus(menuItems, setFocused)
    },
    goToLast: () => {
      onFocus(menuItems[menuItems.length - 1], setFocused)
    },
    moveDownLoop: () => {
      !open
        ? actions.open()
        : onFocus(
            menuItems[safeIndex(currentIndex() + 1, `down`, menuItems)],
            setFocused,
          )
    },
    moveUpLoop: () => {
      open &&
        onFocus(
          menuItems[safeIndex(currentIndex() - 1, `up`, menuItems)],
          setFocused,
        )
    },
    moveDown: () => {
      if (atLastIndex()) return closeOnEnd && actions.close()

      return !open
        ? actions.open()
        : onFocus(
            menuItems[safeIndex(currentIndex() + 1, `down-stop`, menuItems)],
            setFocused,
          )
    },
    moveUp: () => {
      if (currentIndex() === 0) return closeOnStart && actions.close()

      return (
        open &&
        onFocus(
          menuItems[safeIndex(currentIndex() - 1, `up-stop`, menuItems)],
          setFocused,
        )
      )
    },
  }

  const defaultKeys = {
    Tab: actions.onTabOpenButton,
    Escape: actions.close,
    Enter: actions.select,
    Space: actions.goToFirst,
    ArrowDown: actions.moveDownLoop,
    ArrowUp: actions.moveUp,
    PageUp: actions.goToFirst,
    PageDown: actions.goToLast,
  }

  const handleBlur = e => {
    !e.currentTarget.contains(e.relatedTarget)
      ? open && setOpen(false)
      : e.currentTarget.focus()
  }

  const handleKeyboard = e => {
    if (!enabled || menuItems.length === 0) return null
    const { code, key } = e
    isBoolean(notPreventDefault)
      ? !notPreventDefault && e.preventDefault()
      : !notPreventDefault.includes(code) && e.preventDefault()

    const selectByFirstChar = () => {
      if (!selectByFirstLetter || key.length > 1) return setPrevKey('')

      const matches = menuItems.filter(item =>
        item.textContent?.toUpperCase().startsWith(key.toUpperCase()),
      )

      if (matches.length === 0) return setPrevKey('')

      const nextItem = matches.indexOf(document.activeElement) + 1

      prevKey !== key
        ? matches[0].focus()
        : matches[safeIndex(nextItem, 'down', matches)].focus()

      return prevKey !== key && setPrevKey(key)
    }

    const keys = !isFunction(overrideKeys)
      ? { ...defaultKeys, ...additionalKeys(actions, e) }
      : { ...overrideKeys(actions, e), ...additionalKeys(actions, e) }

    return safeCall(keys[code], selectByFirstChar)
  }

  return [open, setOpen, handleBlur, handleKeyboard, focused]
}

export default useKeyboardOnList
