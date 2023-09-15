import { useEffect, useLayoutEffect, useState } from 'react'
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
  notPreventDefault = ['Enter', 'Tab', '229'], // boolean or array of keycode(s) strings that must not preventDefault (229 for mobile), if bool: FALSE: prevent on all keys, TRUE: dont prevent
  onSelect = item => item?.click(), // callback to select menu item
  onFocus = item => item?.focus(),
}) => {
  const [prevKey, setPrevKey] = useState('')
  const [open, setOpen] = useState(initialState)
  const [focused, setFocused] = useState(null)
  const [selected, setSelected] = useState(null)

  const currentIndex = () =>
    menuItems.indexOf(focused || document.activeElement)

  const atLastIndex = () => currentIndex() === menuItems.length - 1

  const setInertAttrOnItems = () =>
    menuItems.forEach(item => {
      !open ? item.setAttribute('inert', true) : item.removeAttribute('inert')
    })

  const actions = {
    onTab: () => {
      setFocused(null)
      setInertAttrOnItems()
    },
    open: () => {
      !open && setOpen(true)
    },
    close: () => {
      if (!open) return
      setOpen(false)
      openButton?.focus()
    },
    select: () => {
      focused ? setSelected(focused) : setSelected(menuItems[currentIndex()])
      closeOnSelect && actions.close()
    },
    goToFirst: () => {
      setFocused(menuItems[0])
    },
    goToLast: () => {
      setFocused(menuItems[menuItems.length - 1])
    },
    moveDownLoop: () => {
      !open
        ? actions.open()
        : setFocused(
            menuItems[safeIndex(currentIndex() + 1, `down`, menuItems)],
          )
    },
    moveUpLoop: () => {
      open &&
        setFocused(menuItems[safeIndex(currentIndex() - 1, `up`, menuItems)])
    },
    moveDown: () => {
      if (atLastIndex()) return closeOnEnd && actions.close()

      return !open
        ? actions.open()
        : setFocused(
            menuItems[safeIndex(currentIndex() + 1, `down-stop`, menuItems)],
          )
    },
    moveUp: () => {
      if (currentIndex() === 0) return closeOnStart && actions.close()

      return (
        open &&
        setFocused(
          menuItems[safeIndex(currentIndex() - 1, `up-stop`, menuItems)],
        )
      )
    },
  }

  const defaultKeys = {
    Tab: actions.onTab,
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

      const nextItem = matches.indexOf(focused || document.activeElement) + 1

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

  useEffect(() => {
    setInertAttrOnItems()
    !open ? focused && setFocused(null) : !focused && setFocused(menuItems[0])
  }, [open])

  useLayoutEffect(() => {
    focused && onFocus(focused)
  }, [focused])

  useLayoutEffect(() => {
    selected && onSelect(selected)
  }, [selected])

  return [open, setOpen, handleBlur, handleKeyboard, focused, selected]
}

export default useKeyboardOnList
