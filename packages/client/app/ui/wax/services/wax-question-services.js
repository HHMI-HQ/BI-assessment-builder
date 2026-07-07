/* eslint-disable */
import {
  Commands,
  MenuButton,
  WaxContext,
  Tools,
  Icon,
  ApplicationContext,
  ComponentPlugin,
  DocumentHelpers,
  QuestionsNodeView,
  Service,
  ToolGroup,
  FakeCursorPlugin as FakeCursorPlugin$1,
  useOnClickOutside,
} from 'wax-prosemirror-core'
import React, {
  useContext,
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
  createRef,
  useLayoutEffect,
} from 'react'
import { isEmpty, get, find } from 'lodash'
import { injectable, inject } from 'inversify'
import { v4 } from 'uuid'
import { Fragment, DOMParser, DOMSerializer } from 'prosemirror-model'
import {
  TextSelection,
  PluginKey,
  Plugin,
  EditorState,
  NodeSelection,
} from 'prosemirror-state'
import { findWrapping, StepMap } from 'prosemirror-transform'
import { GapCursor, gapCursor } from 'prosemirror-gapcursor'
import styled, { css } from 'styled-components'
import { DecorationSet, Decoration, EditorView } from 'prosemirror-view'
import { dropCursor } from 'prosemirror-dropcursor'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap, chainCommands } from 'prosemirror-commands'
import { undo, redo } from 'prosemirror-history'
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from 'prosemirror-schema-list'
import useDynamicRefs from 'use-dynamic-refs'
import Switch from 'rc-switch'

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }

  return _setPrototypeOf(o, p)
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function')
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true,
    },
  })
  if (superClass) _setPrototypeOf(subClass, superClass)
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
      }
  return _getPrototypeOf(o)
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false
  if (Reflect.construct.sham) return false
  if (typeof Proxy === 'function') return true

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}))
    return true
  } catch (e) {
    return false
  }
}

function _typeof(obj) {
  '@babel/helpers - typeof'

  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj
    }
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj
    }
  }

  return _typeof(obj)
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    )
  }

  return self
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === 'object' || typeof call === 'function')) {
    return call
  }

  return _assertThisInitialized(self)
}

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
      result

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor
      result = Reflect.construct(Super, arguments, NewTarget)
    } else {
      result = Super.apply(this, arguments)
    }

    return _possibleConstructorReturn(this, result)
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

var createEmptyParagraph = function createEmptyParagraph(context, newAnswerId) {
  if (context.pmViews[newAnswerId]) {
    context.pmViews[newAnswerId].dispatch(
      context.pmViews[newAnswerId].state.tr.setSelection(
        TextSelection.between(
          context.pmViews[newAnswerId].state.selection.$anchor,
          context.pmViews[newAnswerId].state.selection.$head,
        ),
      ),
    )

    if (context.pmViews[newAnswerId].dispatch) {
      var type = context.pmViews.main.state.schema.nodes.paragraph
      context.pmViews[newAnswerId].dispatch(
        context.pmViews[newAnswerId].state.tr
          .insert(0, type.create())
          .setMeta('exludeToHistoryFromOutside', true),
      )
    }

    context.pmViews[newAnswerId].dispatch(
      context.pmViews[newAnswerId].state.tr.setSelection(
        TextSelection.between(
          context.pmViews[newAnswerId].state.selection.$anchor,
          context.pmViews[newAnswerId].state.selection.$head,
        ),
      ),
    )
    context.pmViews[newAnswerId].focus()
  }
}

var checkifEmpty = function checkifEmpty(view) {
  var state = view.state
  var _state$selection = state.selection,
    from = _state$selection.from,
    to = _state$selection.to
  state.doc.nodesBetween(from, to, function (node, pos) {
    if (node.textContent !== ' ') Commands.simulateKey(view, 13, 'Enter')
  })

  if (state.selection instanceof GapCursor) {
    Commands.simulateKey(view, 13, 'Enter')
    setTimeout(function () {
      view.focus()
    })
  }
}

var createOptions = function createOptions(
  main,
  context,
  parentType,
  questionType,
  answerType,
) {
  checkifEmpty(main)
  var state = main.state,
    dispatch = main.dispatch
  /* Create Wrapping */

  var _state$selection2 = state.selection,
    $from = _state$selection2.$from,
    $to = _state$selection2.$to
  var range = $from.blockRange($to)
  var tr = main.state.tr
  var wrapping =
    range &&
    findWrapping(range, parentType, {
      id: v4(),
    })
  if (!wrapping) return false
  tr.wrap(range, wrapping)
  var map = tr.mapping.maps[0]
  var newPos = 0
  map.forEach(function (_from, _to, _newFrom, newTo) {
    newPos = newTo
  })
  tr.setSelection(TextSelection.create(tr.doc, range.$to.pos))
  var question = questionType.create(
    {
      id: v4(),
    },
    Fragment.empty,
  )
  /* create First Option */

  var firstOption = answerType.create(
    {
      id: v4(),
    },
    Fragment.empty,
  )
  /* create Second Option */

  var secondOption = answerType.create(
    {
      id: v4(),
    },
    Fragment.empty,
  )
  tr.replaceSelectionWith(question)
  tr.replaceSelectionWith(firstOption)
  tr.setSelection(TextSelection.create(tr.doc, newPos + 1))
  tr.replaceSelectionWith(secondOption)
  dispatch(tr)
  setTimeout(function () {
    context.pmViews[question.attrs.id].focus()
    createEmptyParagraph(context, firstOption.attrs.id)
    createEmptyParagraph(context, secondOption.attrs.id)
    createEmptyParagraph(context, question.attrs.id)
  }, 50)
  return true
}

var helpers = {
  createEmptyParagraph: createEmptyParagraph,
  checkifEmpty: checkifEmpty,
  createOptions: createOptions,
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0)
  }

  return Object.freeze(
    Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw),
      },
    }),
  )
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(['\n  ', '\n'])

  _templateObject2 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject() {
  var data = _taggedTemplateLiteral(['\n  pointer-events: none;\n'])

  _templateObject = function _templateObject() {
    return data
  }

  return data
}
var activeStyles = css(_templateObject())
var StyledButton = styled(MenuButton)(_templateObject2(), function (props) {
  return props.active && activeStyles
})

var ToolBarBtn = function ToolBarBtn(_ref) {
  var _ref$view = _ref.view,
    view = _ref$view === void 0 ? {} : _ref$view,
    item = _ref.item
  var icon = item.icon,
    label = item.label,
    select = item.select,
    title = item.title
  var context = useContext(WaxContext)

  var _useContext = useContext(WaxContext),
    main = _useContext.pmViews.main,
    activeView = _useContext.activeView

  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var state = view.state
  var isDisabled = !select(state, activeView)
  if (!isEditable) isDisabled = true
  var ToolBarBtnComponent = useMemo(
    function () {
      return /*#__PURE__*/ React.createElement(StyledButton, {
        active: false,
        disabled: isDisabled,
        iconName: icon,
        label: label,
        onMouseDown: function onMouseDown(e) {
          e.preventDefault()
          item.run(main, context)
        },
        title: title,
      })
    },
    [isDisabled],
  )
  return ToolBarBtnComponent
}

var _dec, _class, _temp

var createEmptyParagraph$1 = function createEmptyParagraph(
  context,
  newAnswerId,
) {
  var pmViews = context.pmViews

  if (pmViews[newAnswerId]) {
    pmViews[newAnswerId].dispatch(
      pmViews[newAnswerId].state.tr.setSelection(
        TextSelection.between(
          pmViews[newAnswerId].state.selection.$anchor,
          pmViews[newAnswerId].state.selection.$head,
        ),
      ),
    )

    if (pmViews[newAnswerId].dispatch) {
      var type = pmViews.main.state.schema.nodes.paragraph
      pmViews[newAnswerId].dispatch(
        pmViews[newAnswerId].state.tr
          .insert(0, type.create())
          .setMeta('exludeToHistoryFromOutside', true),
      )
    }

    pmViews[newAnswerId].dispatch(
      pmViews[newAnswerId].state.tr.setSelection(
        TextSelection.between(
          pmViews[newAnswerId].state.selection.$head,
          pmViews[newAnswerId].state.selection.$head,
        ),
      ),
    )
    pmViews[newAnswerId].focus()
  }
}

var EssayQuestion =
  ((_dec = injectable()),
  _dec(
    (_class =
      ((_temp = /*#__PURE__*/ (function (_Tools) {
        _inherits(EssayQuestion, _Tools)

        var _super = _createSuper(EssayQuestion)

        function EssayQuestion() {
          var _this

          _classCallCheck(this, EssayQuestion)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Add Essay Question'
          _this.icon = 'essay'
          _this.name = 'Essay'
          _this.label = ''

          _this.select = function (state, activeView) {
            var status = true
            var _state$selection = state.selection,
              from = _state$selection.from,
              to = _state$selection.to
            var _activeView$props$dis = activeView.props.disallowedTools,
              disallowedTools =
                _activeView$props$dis === void 0 ? [] : _activeView$props$dis
            if (from === null || disallowedTools.includes('Essay'))
              status = false
            state.doc.nodesBetween(from, to, function (node) {
              if (node.type.groups.includes('questions')) {
                status = false
              }
            })
            return status
          }

          return _this
        }

        _createClass(EssayQuestion, [
          {
            key: 'renderTool',
            value: function renderTool(view) {
              if (isEmpty(view)) return null
              return this.isDisplayed()
                ? /*#__PURE__*/ React.createElement(ToolBarBtn, {
                    item: this.toJSON(),
                    key: v4(),
                    view: view,
                  })
                : null
            },
          },
          {
            key: 'run',
            get: function get() {
              return function (main, context) {
                helpers.checkifEmpty(main)
                var state = main.state,
                  dispatch = main.dispatch
                /* Create Wrapping */

                var _state$selection2 = state.selection,
                  $from = _state$selection2.$from,
                  $to = _state$selection2.$to
                var range = $from.blockRange($to)
                var tr = state.tr
                var wrapping =
                  range &&
                  findWrapping(
                    range,
                    state.config.schema.nodes.essay_container,
                    {
                      id: v4(),
                    },
                  )
                if (!wrapping) return false
                tr.wrap(range, wrapping)
                var map = tr.mapping.maps[0]
                var newPos = 0
                map.forEach(function (_from, _to, _newFrom, newTo) {
                  newPos = newTo
                })
                tr.setSelection(TextSelection.create(tr.doc, range.$to.pos))
                var essayQuestion =
                  state.config.schema.nodes.essay_question.create(
                    {
                      id: v4(),
                    },
                    Fragment.empty,
                  )
                var essayPrompt = state.config.schema.nodes.essay_prompt.create(
                  {
                    id: v4(),
                  },
                  Fragment.empty,
                )
                var essayAnswer = state.config.schema.nodes.essay_answer.create(
                  {
                    id: v4(),
                  },
                  Fragment.empty,
                )
                tr.replaceSelectionWith(essayQuestion)
                tr.setSelection(TextSelection.create(tr.doc, newPos))
                tr.replaceSelectionWith(essayPrompt)
                tr.setSelection(TextSelection.create(tr.doc, newPos + 1))
                tr.replaceSelectionWith(essayAnswer)
                dispatch(tr)
                setTimeout(function () {
                  createEmptyParagraph$1(context, essayAnswer.attrs.id)
                  createEmptyParagraph$1(context, essayPrompt.attrs.id)
                  createEmptyParagraph$1(context, essayQuestion.attrs.id)
                }, 150)
                return true
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {
                if (
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.essay_container,
                  )
                ) {
                  return true
                }

                return false
              }
            },
          },
        ])

        return EssayQuestion
      })(Tools)),
      _temp)),
  ) || _class)

var essayContainerNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'essay',
    },
  },
  group: 'block questions',
  isolating: true,
  content: 'block+',
  parseDOM: [
    {
      tag: 'div.essay',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var essayPromptNode = {
  attrs: {
    class: {
      default: 'essay-prompt',
    },
    id: {
      default: v4(),
    },
  },
  group: 'block questions',
  content: 'block*',
  defining: true,
  parseDOM: [
    {
      tag: 'div.essay-prompt',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var essayQuestionNode = {
  attrs: {
    class: {
      default: 'essay-question',
    },
    id: {
      default: v4(),
    },
  },
  group: 'block questions',
  content: 'block*',
  // defining: true,
  parseDOM: [
    {
      tag: 'div.essay-question',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var essayAnswerNode = {
  attrs: {
    class: {
      default: 'essay-answer',
    },
    id: {
      default: v4(),
    },
  },
  group: 'block questions',
  content: 'block*',
  defining: true,
  parseDOM: [
    {
      tag: 'div.essay-answer',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }

  return obj
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i]
  }

  return arr2
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr)
}

function _iterableToArray(iter) {
  if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter))
    return Array.from(iter)
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen)
  var n = Object.prototype.toString.call(o).slice(8, -1)
  if (n === 'Object' && o.constructor) n = o.constructor.name
  if (n === 'Map' || n === 'Set') return Array.from(n)
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen)
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  )
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  )
}

var placeHolderText = new PluginKey('placeHolderText')
var Placeholder = function (props) {
  return new Plugin({
    key: placeHolderText,
    props: {
      decorations: function decorations(state) {
        var decorations = []

        var decorate = function decorate(node, pos) {
          if (
            node.type.isBlock &&
            node.childCount === 0 &&
            state.doc.content.childCount === 1
          ) {
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, {
                class: 'empty-node',
                'data-content': props.content,
              }),
            )
          }
        }

        state.doc.descendants(decorate)
        return DecorationSet.create(state.doc, decorations)
      },
    },
  })
}

/* eslint-disable */
var fakeCursorPluginMultiple = new PluginKey('fakeCursorPluginMultiple')
var FakeCursorPlugin = function (props) {
  return new Plugin({
    key: fakeCursorPluginMultiple,
    state: {
      init: function init(_, state) {},
      apply: function apply(tr, prev, _, newState) {
        var createDecoration

        if (
          newState.selection.from === newState.selection.to &&
          Commands.isInTable(newState)
        ) {
          var widget = document.createElement('span')
          widget.setAttribute('id', 'fake-cursor')
          createDecoration = DecorationSet.create(newState.doc, [
            Decoration.widget(newState.selection.from, widget, {
              key: 'fakecursor',
            }),
          ])
        }

        return {
          createDecoration: createDecoration,
        }
      },
    },
    props: {
      decorations: function decorations(state) {
        var fakeCursorPluginMultipleState =
          state && fakeCursorPluginMultiple.getState(state)
        if (fakeCursorPluginMultipleState)
          return fakeCursorPluginMultipleState.createDecoration
      },
      handleDOMEvents: {
        focus: function focus(view, event) {
          event.preventDefault()
          var fakeCursor = document.getElementById('fake-cursor')

          if (fakeCursor) {
            if (
              navigator.userAgent.includes('Firefox') &&
              view.state.selection.$from.nodeBefore == null
            ) {
              fakeCursor.style.visibility = 'hidden'
            } else {
              fakeCursor.style.display = 'none'
            }
          }
        },
        blur: function blur(view, event) {
          event.preventDefault()

          if (view && event.relatedTarget === null) {
            setTimeout(function () {
              view.focus()
            })
          } else {
            var fakeCursor = document.getElementById('fake-cursor')

            if (fakeCursor) {
              if (
                navigator.userAgent.includes('Firefox') &&
                view.state.selection.$from.nodeBefore === null
              ) {
                fakeCursor.style.visibility = 'visible'
              } else {
                fakeCursor.style.display = 'inline'
              }
            }
          }
        },
      },
    },
  })
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject4 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  border: none;\n  bottom: 14px;\n  cursor: pointer;\n  float: right;\n  margin-top: 16px;\n  position: relative;\n',
  ])

  _templateObject3 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$1() {
  var data = _taggedTemplateLiteral([
    '\n  border: none;\n  display: flex;\n  flex: 2 1 auto;\n  justify-content: left;\n  padding: ',
    ";\n  width: 100%;\n\n  .ProseMirror {\n    white-space: break-spaces;\n    width: 100%;\n    word-wrap: break-word;\n\n    &:focus {\n      outline: none;\n    }\n\n    :empty::before {\n      color: #aaa;\n      content: 'Type your item';\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n\n    p:first-child {\n      margin: 0;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n",
  ])

  _templateObject2$1 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$1() {
  var data = _taggedTemplateLiteral([
    '\n  border-bottom: 3px solid #f5f5f7;\n  height: 30px;\n',
  ])

  _templateObject$1 = function _templateObject() {
    return data
  }

  return data
}
var DeleteArea = styled.div(_templateObject$1())
var EditorWrapper = styled.div(_templateObject2$1(), function (props) {
  return props.$usePadding ? '0px 20px 10px 20px' : '0px'
})
var ActionButton = styled.button(_templateObject3())
var StyledIconActionRemove = styled(Icon)(_templateObject4())

var WaxOverlays = function WaxOverlays() {
  return true
}

var QuestionEditorComponent = function QuestionEditorComponent(_ref) {
  var _node$attrs

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos,
    _ref$placeholderText = _ref.placeholderText,
    placeholderText =
      _ref$placeholderText === void 0 ? 'Type your item' : _ref$placeholderText,
    _ref$QuestionType = _ref.QuestionType,
    QuestionType =
      _ref$QuestionType === void 0 ? 'Multiple' : _ref$QuestionType,
    _ref$forceEditable = _ref.forceEditable,
    forceEditable = _ref$forceEditable === void 0 ? false : _ref$forceEditable,
    _ref$showDelete = _ref.showDelete,
    showDelete = _ref$showDelete === void 0 ? false : _ref$showDelete
  var editorRef = useRef()

  var _useContext = useContext(ApplicationContext),
    app = _useContext.app

  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var questionView
  var questionId =
    node === null || node === void 0
      ? void 0
      : (_node$attrs = node.attrs) === null || _node$attrs === void 0
      ? void 0
      : _node$attrs.id
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  if (forceEditable) isEditable = true
  var finalPlugins = [FakeCursorPlugin(), gapCursor(), dropCursor()]

  var createKeyBindings = function createKeyBindings() {
    var keys = getKeys()
    Object.keys(baseKeymap).forEach(function (key) {
      if (keys[key]) {
        keys[key] = chainCommands(keys[key], baseKeymap[key])
      } else {
        keys[key] = baseKeymap[key]
      }
    })
    return keys
  }

  var pressEnter = function pressEnter(state, dispatch) {
    if (state.selection.node && state.selection.node.type.name === 'image') {
      var _state$selection = state.selection,
        $from = _state$selection.$from,
        to = _state$selection.to
      var same = $from.sharedDepth(to)
      var pos = $from.before(same)
      dispatch(state.tr.setSelection(NodeSelection.create(state.doc, pos)))
      return true
    } // LISTS

    if (splitListItem(state.schema.nodes.list_item)(state)) {
      splitListItem(state.schema.nodes.list_item)(state, dispatch)
      return true
    }

    return false
  }

  var getKeys = function getKeys() {
    return {
      'Mod-z': function ModZ() {
        return undo(main.state, main.dispatch)
      },
      'Mod-y': function ModY() {
        return redo(main.state, main.dispatch)
      },
      'Mod-[': liftListItem(view.state.schema.nodes.list_item),
      'Mod-]': sinkListItem(view.state.schema.nodes.list_item),
      Enter: pressEnter,
    }
  }

  var filteredplugins = app.PmPlugins.getAll().filter(function (plugin) {
    return (
      !plugin.key.includes('y-sync') &&
      !plugin.key.includes('y-undo') &&
      !plugin.key.includes('yjs') &&
      !plugin.key.includes('comment')
    )
  })
  var plugins = [keymap(createKeyBindings())].concat(
    _toConsumableArray(filteredplugins),
  )

  var createPlaceholder = function createPlaceholder(placeholder) {
    return Placeholder({
      content: placeholder,
    })
  }

  finalPlugins = finalPlugins.concat(
    [createPlaceholder(placeholderText)].concat(_toConsumableArray(plugins)),
  )
  useEffect(function () {
    WaxOverlays = ComponentPlugin('waxOverlays')
    questionView = new EditorView(
      {
        mount: editorRef.current,
      },
      {
        editable: function editable() {
          return isEditable
        },
        state: EditorState.create({
          doc: node,
          plugins: finalPlugins,
        }),
        dispatchTransaction: dispatchTransaction,
        disallowedTools: ['MultipleChoice'],
        handleDOMEvents: {
          mousedown: function mousedown() {
            context.updateView({}, questionId)
            main.dispatch(
              main.state.tr
                .setMeta('outsideView', questionId)
                .setSelection(
                  new TextSelection(
                    main.state.tr.doc.resolve(
                      getPos() +
                        1 +
                        context.pmViews[questionId].state.selection.to,
                    ),
                  ),
                ),
            )
            context.updateView({}, questionId)
            if (questionView.hasFocus()) questionView.focus()
          },
          blur: function blur(editorView, event) {
            if (questionView && event.relatedTarget === null) {
              questionView.focus()
            }
          },
        },
        type: QuestionType,
        scrollMargin: 200,
        scrollThreshold: 200,
        attributes: {
          spellcheck: 'false',
        },
      },
    ) // Set Each note into Wax's Context

    context.updateView(
      _defineProperty({}, questionId, questionView),
      questionId,
    )
    if (questionView.hasFocus()) questionView.focus()
  }, [])

  var dispatchTransaction = function dispatchTransaction(tr) {
    var addToHistory = !tr.getMeta('exludeToHistoryFromOutside')

    var _questionView$state$a = questionView.state.applyTransaction(tr),
      state = _questionView$state$a.state,
      transactions = _questionView$state$a.transactions

    questionView.updateState(state)
    context.updateView({}, questionId)

    if (!tr.getMeta('fromOutside')) {
      var outerTr = view.state.tr
      var offsetMap = StepMap.offset(getPos() + 1)

      for (var i = 0; i < transactions.length; i++) {
        var steps = transactions[i].steps

        for (var j = 0; j < steps.length; j++) {
          outerTr.step(steps[j].map(offsetMap))
        }
      }

      if (outerTr.docChanged)
        view.dispatch(
          outerTr
            .setMeta('outsideView', questionId)
            .setMeta('addToHistory', addToHistory),
        )
    }
  }

  var removeQuestion = function removeQuestion() {
    var allNodes = getNodes(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      context.pmViews.main.dispatch(
        context.pmViews.main.state.tr['delete'](
          singleNode.pos,
          singleNode.pos + singleNode.node.nodeSize,
        ),
      )
    })
  }

  return /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    showDelete &&
      /*#__PURE__*/ React.createElement(
        DeleteArea,
        null,
        /*#__PURE__*/ React.createElement(
          ActionButton,
          {
            'aria-label': 'delete this question',
            onClick: removeQuestion,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconActionRemove, {
            name: 'deleteOutlinedQuestion',
          }),
        ),
      ),
    /*#__PURE__*/ React.createElement(
      EditorWrapper,
      {
        $usePadding: showDelete && QuestionType !== 'EssayQuestion',
      },
      /*#__PURE__*/ React.createElement('div', {
        ref: editorRef,
      }),
      /*#__PURE__*/ React.createElement(WaxOverlays, {
        activeViewId: questionId,
      }),
    ),
  )
}

var getNodes = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var fillTheGapContainerNodes = []
  allNodes.forEach(function (node) {
    if (
      node.node.type.name === 'multiple_choice_container' ||
      node.node.type.name === 'multiple_choice_single_correct_container' ||
      node.node.type.name === 'true_false_container' ||
      node.node.type.name === 'true_false_single_correct_container' ||
      node.node.type.name === 'essay_container'
    ) {
      fillTheGapContainerNodes.push(node)
    }
  })
  return fillTheGapContainerNodes
}

var EssayQuestionComponent = function (_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var testMode = customProps.testMode
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  return /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
    getPos: getPos,
    node: node,
    placeholderText: 'Type your essay item',
    QuestionType: 'EssayQuestion',
    showDelete: !testMode && isEditable,
    view: view,
  })
}

function _templateObject$2() {
  var data = _taggedTemplateLiteral(['\n  display: ', ';\n'])

  _templateObject$2 = function _templateObject() {
    return data
  }

  return data
}
var EditorWrapper$1 = styled.div(_templateObject$2(), function (props) {
  return props.$testMode ? 'none' : 'block'
})
var EssayPromptComponent = function (_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var testMode = customProps.testMode
  return /*#__PURE__*/ React.createElement(
    EditorWrapper$1,
    {
      $testMode: testMode,
    },
    /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
      getPos: getPos,
      node: node,
      placeholderText: 'Provide response summary and rubric',
      QuestionType: 'EssayQuestion',
      view: view,
    }),
  )
}

function _templateObject$3() {
  var data = _taggedTemplateLiteral(['\n  display: ', ';\n'])

  _templateObject$3 = function _templateObject() {
    return data
  }

  return data
}
var EditorWrapper$2 = styled.div(_templateObject$3(), function (props) {
  return props.$testMode || props.$showFeedBack ? 'block' : 'none'
})
var EssayAnswerComponent = function (_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var testMode = customProps.testMode,
    showFeedBack = customProps.showFeedBack
  return /*#__PURE__*/ React.createElement(
    EditorWrapper$2,
    {
      $showFeedBack: showFeedBack,
      $testMode: testMode,
    },
    /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
      forceEditable: testMode,
      getPos: getPos,
      node: node,
      placeholderText: 'Type your essay answer',
      QuestionType: 'EssayQuestion',
      view: view,
    }),
  )
}

var EssayQuestionNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(EssayQuestionNodeView, _QuestionsNodeView)

  var _super = _createSuper(EssayQuestionNodeView)

  function EssayQuestionNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, EssayQuestionNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    EssayQuestionNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'essay_question'
        },
      },
    ],
  )

  return EssayQuestionNodeView
})(QuestionsNodeView)

var EssayPromptNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(EssayPromptNodeView, _QuestionsNodeView)

  var _super = _createSuper(EssayPromptNodeView)

  function EssayPromptNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, EssayPromptNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    EssayPromptNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'essay_prompt'
        },
      },
    ],
  )

  return EssayPromptNodeView
})(QuestionsNodeView)

var EssayAnswerNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(EssayAnswerNodeView, _QuestionsNodeView)

  var _super = _createSuper(EssayAnswerNodeView)

  function EssayAnswerNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, EssayAnswerNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    EssayAnswerNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'essay_answer'
        },
      },
    ],
  )

  return EssayAnswerNodeView
})(QuestionsNodeView)

var EssayService = /*#__PURE__*/ (function (_Service) {
  _inherits(EssayService, _Service)

  var _super = _createSuper(EssayService)

  function EssayService() {
    _classCallCheck(this, EssayService)

    return _super.apply(this, arguments)
  }

  _createClass(EssayService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('EssayQuestion').to(EssayQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          essay_container: essayContainerNode,
        })
        createNode({
          essay_question: essayQuestionNode,
        })
        createNode({
          essay_prompt: essayPromptNode,
        })
        createNode({
          essay_answer: essayAnswerNode,
        })
        addPortal({
          nodeView: EssayQuestionNodeView,
          component: EssayQuestionComponent,
          context: this.app,
        })
        addPortal({
          nodeView: EssayPromptNodeView,
          component: EssayPromptComponent,
          context: this.app,
        })
        addPortal({
          nodeView: EssayAnswerNodeView,
          component: EssayAnswerComponent,
          context: this.app,
        })
      },
    },
  ])

  return EssayService
})(Service)

var _dec$1, _class$1, _temp$1
var FillTheGapQuestion =
  ((_dec$1 = injectable()),
  _dec$1(
    (_class$1 =
      ((_temp$1 = /*#__PURE__*/ (function (_Tools) {
        _inherits(FillTheGapQuestion, _Tools)

        var _super = _createSuper(FillTheGapQuestion)

        function FillTheGapQuestion() {
          var _this

          _classCallCheck(this, FillTheGapQuestion)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Add Fill The Gap Question'
          _this.icon = 'gapQuestion'
          _this.name = 'Fill The Gap'

          _this.select = function (state, activeViewId, activeView) {
            var _activeView$props$dis = activeView.props.disallowedTools,
              disallowedTools =
                _activeView$props$dis === void 0 ? [] : _activeView$props$dis
            var status = true
            var _state$selection = state.selection,
              from = _state$selection.from,
              to = _state$selection.to
            if (from === null || disallowedTools.includes('FillTheGap'))
              return false
            state.doc.nodesBetween(from, to, function (node, pos) {
              if (node.type.groups.includes('questions')) {
                status = false
              }
            })
            return status
          }

          return _this
        }

        _createClass(FillTheGapQuestion, [
          {
            key: 'run',
            get: function get() {
              return function (main) {
                var dispatch = main.dispatch
                var state = main.state
                helpers.checkifEmpty(main)
                var _main$state$selection = main.state.selection,
                  $from = _main$state$selection.$from,
                  $to = _main$state$selection.$to
                var range = $from.blockRange($to)
                var tr = main.state.tr
                var wrapping =
                  range &&
                  findWrapping(
                    range,
                    state.config.schema.nodes.fill_the_gap_container,
                    {
                      id: v4(),
                    },
                  )
                if (!wrapping) return false
                tr.wrap(range, wrapping)
                dispatch(tr)
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {
                if (
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.fill_the_gap_container,
                  )
                ) {
                  return true
                }

                return false
              }
            },
          },
        ])

        return FillTheGapQuestion
      })(Tools)),
      _temp$1)),
  ) || _class$1)

var fillTheGapContainerNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'fill-the-gap',
    },
    feedback: {
      default: '',
    },
  },
  group: 'block questions',
  isolating: true,
  content: 'paragraph+',
  parseDOM: [
    {
      tag: 'div.fill-the-gap',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          feedback: dom.getAttribute('feedback'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var fillTheGapNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'fill-the-gap',
    },
    answer: {
      default: '',
    },
  },
  group: 'inline',
  content: 'text*',
  inline: true,
  atom: true,
  excludes: 'fill_the_gap',
  parseDOM: [
    {
      tag: 'span.fill-the-gap',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          answer: dom.getAttribute('answer'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['span', node.attrs, 0]
  },
}

var _dec$2, _class$2, _temp$2
var CreateGap =
  ((_dec$2 = injectable()),
  _dec$2(
    (_class$2 =
      ((_temp$2 = /*#__PURE__*/ (function (_Tools) {
        _inherits(CreateGap, _Tools)

        var _super = _createSuper(CreateGap)

        function CreateGap() {
          var _this

          _classCallCheck(this, CreateGap)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Create Gap Option'
          _this.icon = 'insertGap'
          _this.name = 'Create Gap'
          _this.label = 'Insert answers'

          _this.select = function (state, activeViewId, activeView) {
            if (
              activeView.props.type &&
              activeView.props.type === 'filltheGapContaier'
            )
              return true
            return false
          }

          return _this
        }

        _createClass(CreateGap, [
          {
            key: 'run',
            get: function get() {
              return function (state, dispatch, activeView, context) {
                var _state$selection = state.selection,
                  empty = _state$selection.empty,
                  $from = _state$selection.$from,
                  $to = _state$selection.$to
                var content = Fragment.empty
                if (
                  !empty &&
                  $from.sameParent($to) &&
                  $from.parent.inlineContent
                )
                  content = $from.parent.content.cut(
                    $from.parentOffset,
                    $to.parentOffset,
                  )
                var createGap = state.config.schema.nodes.fill_the_gap.create(
                  {
                    id: v4(),
                  },
                  content,
                )
                dispatch(state.tr.replaceSelectionWith(createGap))
                setTimeout(function () {
                  context.pmViews[createGap.attrs.id].focus()
                }, 100)
              }
            },
          },
        ])

        return CreateGap
      })(Tools)),
      _temp$2)),
  ) || _class$2)

var _dec$3, _class$3, _temp$3
var FillTheGap =
  ((_dec$3 = injectable()),
  _dec$3(
    (_class$3 =
      ((_temp$3 = /*#__PURE__*/ (function (_ToolGroup) {
        _inherits(FillTheGap, _ToolGroup)

        var _super = _createSuper(FillTheGap)

        function FillTheGap(CreateGap) {
          var _this

          _classCallCheck(this, FillTheGap)

          _this = _super.call(this)
          _this.tools = []
          _this.tools = [CreateGap]
          return _this
        }

        FillTheGap = inject('CreateGap')(FillTheGap, undefined, 0) || FillTheGap
        return FillTheGap
      })(ToolGroup)),
      _temp$3)),
  ) || _class$3)

var FillTheGapToolGroupService = /*#__PURE__*/ (function (_Service) {
  _inherits(FillTheGapToolGroupService, _Service)

  var _super = _createSuper(FillTheGapToolGroupService)

  function FillTheGapToolGroupService() {
    _classCallCheck(this, FillTheGapToolGroupService)

    return _super.apply(this, arguments)
  }

  _createClass(FillTheGapToolGroupService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('FillTheGap').to(FillTheGap)
      },
    },
  ])

  return FillTheGapToolGroupService
})(Service)

var FillTheGapQuestionService = /*#__PURE__*/ (function (_Service) {
  _inherits(FillTheGapQuestionService, _Service)

  var _super = _createSuper(FillTheGapQuestionService)

  function FillTheGapQuestionService() {
    var _this

    _classCallCheck(this, FillTheGapQuestionService)

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))
    _this.dependencies = [new FillTheGapToolGroupService()]
    return _this
  }

  _createClass(FillTheGapQuestionService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('CreateGap').to(CreateGap)
      },
    },
  ])

  return FillTheGapQuestionService
})(Service)

var FillTheGapContainerNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(FillTheGapContainerNodeView, _QuestionsNodeView)

  var _super = _createSuper(FillTheGapContainerNodeView)

  function FillTheGapContainerNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, FillTheGapContainerNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    FillTheGapContainerNodeView,
    [
      {
        key: 'selectNode',
        value: function selectNode() {
          this.context.pmViews[this.node.attrs.id].focus()
        },
      },
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (event.target.type === 'textarea' || !event.target.type) {
            return true
          }

          return (
            this.context.pmViews[this.node.attrs.id] !== undefined &&
            event.target !== undefined &&
            this.context.pmViews[this.node.attrs.id].dom.contains(event.target)
          )
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'fill_the_gap_container'
        },
      },
    ],
  )

  return FillTheGapContainerNodeView
})(QuestionsNodeView)

var FillTheGapNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(FillTheGapNodeView, _QuestionsNodeView)

  var _super = _createSuper(FillTheGapNodeView)

  function FillTheGapNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, FillTheGapNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    FillTheGapNodeView,
    [
      {
        key: 'selectNode',
        value: function selectNode() {
          this.context.pmViews[this.node.attrs.id].focus()
        },
      },
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          return (
            this.context.pmViews[this.node.attrs.id] !== undefined &&
            event.target !== undefined &&
            this.context.pmViews[this.node.attrs.id].dom.contains(event.target)
          )
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'fill_the_gap'
        },
      },
    ],
  )

  return FillTheGapNodeView
})(QuestionsNodeView)

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr))) return
  var _arr = []
  var _n = true
  var _d = false
  var _e = undefined

  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value)

      if (i && _arr.length === i) break
    }
  } catch (err) {
    _d = true
    _e = err
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']()
    } finally {
      if (_d) throw _e
    }
  }

  return _arr
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  )
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  )
}

var grid = function grid(value) {
  return function (props) {
    return 'calc('.concat(props.theme.gridUnit, ' * ').concat(value, ')')
  }
}

var th = function th(name) {
  return function (props) {
    return get(props.theme, name)
  }
}

function _templateObject$4() {
  var data = _taggedTemplateLiteral([
    '\n  > .ProseMirror {\n    padding: 5px;\n    &:focus {\n      outline: none;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n',
  ])

  _templateObject$4 = function _templateObject() {
    return data
  }

  return data
}
var EditorWrapper$3 = styled.div(_templateObject$4())

var ContainerEditor = function ContainerEditor(_ref) {
  var _node$attrs

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos,
    disallowedTools = _ref.disallowedTools,
    _ref$isNotEditable = _ref.isNotEditable,
    isNotEditable = _ref$isNotEditable === void 0 ? false : _ref$isNotEditable
  var editorRef = useRef()

  var _useContext = useContext(ApplicationContext),
    app = _useContext.app

  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var gapContainerView
  var questionId =
    node === null || node === void 0
      ? void 0
      : (_node$attrs = node.attrs) === null || _node$attrs === void 0
      ? void 0
      : _node$attrs.id
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  if (isNotEditable) isEditable = false
  var finalPlugins = []

  var createKeyBindings = function createKeyBindings() {
    var keys = getKeys()
    Object.keys(baseKeymap).forEach(function (key) {
      keys[key] = baseKeymap[key]
    })
    return keys
  }

  var getKeys = function getKeys() {
    return {
      'Mod-z': function ModZ() {
        return undo(view.state, view.dispatch)
      },
      'Mod-y': function ModY() {
        return redo(view.state, view.dispatch)
      },
    }
  }

  var filteredplugins = app.PmPlugins.getAll().filter(function (plugin) {
    return (
      !plugin.key.includes('y-sync') &&
      !plugin.key.includes('y-undo') &&
      !plugin.key.includes('yjs') &&
      !plugin.key.includes('comment')
    )
  })
  var plugins = [keymap(createKeyBindings())].concat(
    _toConsumableArray(filteredplugins),
  )
  finalPlugins = finalPlugins.concat(_toConsumableArray(plugins))
  useEffect(function () {
    gapContainerView = new EditorView(
      {
        mount: editorRef.current,
      },
      {
        editable: function editable() {
          return isEditable
        },
        state: EditorState.create({
          doc: node,
          plugins: finalPlugins,
        }),
        dispatchTransaction: dispatchTransaction,
        disallowedTools: disallowedTools,
        type: 'filltheGapContaier',
        handleDOMEvents: {
          mousedown: function mousedown() {
            main.dispatch(
              main.state.tr
                .setMeta('outsideView', questionId)
                .setSelection(
                  new TextSelection(
                    main.state.tr.doc.resolve(
                      getPos() +
                        2 +
                        context.pmViews[questionId].state.selection.to,
                    ),
                  ),
                ),
            )
            context.updateView({}, questionId)
            if (gapContainerView.hasFocus()) gapContainerView.focus()
          },
        },
        attributes: {
          spellcheck: 'false',
        },
      },
    ) // Set Each note into Wax's Context

    context.updateView(
      _defineProperty({}, questionId, gapContainerView),
      questionId,
    )
    gapContainerView.focus()
  }, [])

  var dispatchTransaction = function dispatchTransaction(tr) {
    var _gapContainerView$sta = gapContainerView.state.applyTransaction(tr),
      state = _gapContainerView$sta.state,
      transactions = _gapContainerView$sta.transactions

    gapContainerView.updateState(state)
    context.updateView({}, questionId)

    if (!tr.getMeta('fromOutside')) {
      var outerTr = view.state.tr
      var offsetMap = StepMap.offset(getPos() + 1)

      for (var i = 0; i < transactions.length; i++) {
        var steps = transactions[i].steps

        for (var j = 0; j < steps.length; j++) {
          outerTr.step(steps[j].map(offsetMap))
        }
      }

      if (outerTr.docChanged)
        view.dispatch(
          outerTr
            .setMeta('outsideView', questionId)
            .setMeta('addToHistory', tr.getMeta('addToHistory')),
        )
    }
  }

  return /*#__PURE__*/ React.createElement(
    EditorWrapper$3,
    null,
    /*#__PURE__*/ React.createElement('div', {
      ref: editorRef,
    }),
  )
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })
    keys.push.apply(keys, symbols)
  }

  return keys
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key),
        )
      })
    }
  }

  return target
}

function _templateObject3$1() {
  var data = _taggedTemplateLiteral([
    '\n  border: none;\n  display: flex;\n  font-family: Fira Sans Condensed;\n  width: 100%;\n  resize: vertical;\n  white-space: pre-wrap;\n  overflow-wrap: break-word;\n\n  background-attachment: local;\n  background-image: linear-gradient(to right, white 10px, transparent 10px),\n    linear-gradient(to left, white 10px, transparent 10px),\n    repeating-linear-gradient(\n      white,\n      white 30px,\n      #ccc 30px,\n      #ccc 31px,\n      white 31px\n    );\n  line-height: 31px;\n  padding: 8px 10px;\n\n  &:focus {\n    outline: none;\n  }\n\n  ::placeholder {\n    color: rgb(170, 170, 170);\n    font-style: italic;\n  }\n',
  ])

  _templateObject3$1 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$2() {
  var data = _taggedTemplateLiteral(['\n  font-weight: 700;\n'])

  _templateObject2$2 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$5() {
  var data = _taggedTemplateLiteral([
    '\n  color: black;\n  margin-top: 10px;\n',
  ])

  _templateObject$5 = function _templateObject() {
    return data
  }

  return data
}
var FeedBack = styled.div(_templateObject$5())
var FeedBackLabel = styled.span(_templateObject2$2())
var FeedBackInput = styled.textarea(_templateObject3$1())
var FeedbackComponent = function (_ref) {
  var _node$attrs, _node$attrs2, _node$attrs5

  var node = _ref.node,
    getPos = _ref.getPos,
    readOnly = _ref.readOnly
  var context = useContext(WaxContext)
  var main = context.pmViews.main,
    setOption = context.setOption

  var _useState = useState(true),
    _useState2 = _slicedToArray(_useState, 2),
    isFirstRun = _useState2[0],
    setFirstRun = _useState2[1]

  var _useState3 = useState(
      (node === null || node === void 0
        ? void 0
        : (_node$attrs = node.attrs) === null || _node$attrs === void 0
        ? void 0
        : _node$attrs.feedback) || '',
    ),
    _useState4 = _slicedToArray(_useState3, 2),
    feedBack = _useState4[0],
    setFeedBack = _useState4[1]

  var feedBackRef = useRef(null)
  var textareaId = 'feedback-'.concat(
    node === null || node === void 0
      ? void 0
      : (_node$attrs2 = node.attrs) === null || _node$attrs2 === void 0
      ? void 0
      : _node$attrs2.id,
  )

  var feedBackInput = function feedBackInput() {
    setFeedBack(feedBackRef.current.value)
    var allNodes = getNodes$1(main)
    allNodes.forEach(function (singleNode) {
      var _node$attrs3

      if (
        singleNode.node.attrs.id ===
        (node === null || node === void 0
          ? void 0
          : (_node$attrs3 = node.attrs) === null || _node$attrs3 === void 0
          ? void 0
          : _node$attrs3.id)
      ) {
        main.dispatch(
          main.state.tr.setNodeMarkup(
            getPos(),
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                feedback: feedBackRef.current.value,
              },
            ),
          ),
        )
      }
    })
    setNullSelection()
    setHeight()
    return false
  }

  var setHeight = function setHeight() {
    var textarea = feedBackRef.current
    if (!textarea) return
    var heightLimit = 200
    textarea.style.height = ''
    textarea.style.height = ''.concat(
      Math.min(textarea.scrollHeight, heightLimit),
      'px',
    )
  }

  var setNullSelection = function setNullSelection() {
    main.dispatch(
      main.state.tr.setSelection(TextSelection.create(main.state.tr.doc, null)),
    )
  }

  var _onFocus = function onFocus() {
    setTimeout(function () {
      setNullSelection()
    }, 50)
  }

  var handleInteraction = useCallback(
    function () {
      // Save the textarea ID to context when clicked or focused
      if (setOption && textareaId) {
        setOption({
          activeTextareaId: textareaId,
        })
      }
    },
    [setOption, textareaId],
  )
  useEffect(function () {
    setTimeout(function () {
      setFirstRun(false)
    })
  }, [])
  return useMemo(
    function () {
      var _node$attrs4

      return /*#__PURE__*/ React.createElement(
        FeedBack,
        null,
        /*#__PURE__*/ React.createElement(FeedBackLabel, null, 'Feedback'),
        /*#__PURE__*/ React.createElement(FeedBackInput, {
          'data-textarea-id': textareaId,
          onChange: feedBackInput,
          onClick: handleInteraction,
          onFocus: function onFocus(e) {
            handleInteraction()

            _onFocus()
          },
          placeholder: 'Insert feedback',
          readOnly: readOnly,
          ref: feedBackRef,
          rows: '1',
          style: {
            height: setHeight(),
          },
          type: 'text',
          value:
            (node === null || node === void 0
              ? void 0
              : (_node$attrs4 = node.attrs) === null || _node$attrs4 === void 0
              ? void 0
              : _node$attrs4.feedback) || feedBack,
        }),
      )
    },
    [
      feedBack,
      isFirstRun,
      node === null || node === void 0
        ? void 0
        : (_node$attrs5 = node.attrs) === null || _node$attrs5 === void 0
        ? void 0
        : _node$attrs5.feedback,
      textareaId,
      handleInteraction,
    ],
  )
}

var getNodes$1 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (
      node.node.type.name === 'multiple_choice' ||
      node.node.type.name === 'multiple_choice_single_correct' ||
      node.node.type.name === 'true_false' ||
      node.node.type.name === 'true_false_single_correct' ||
      node.node.type.name === 'matching_container' ||
      node.node.type.name === 'fill_the_gap_container' ||
      node.node.type.name === 'multiple_drop_down_container' ||
      node.node.type.name === 'numerical_answer_container'
    ) {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject8 = function _templateObject8() {
    return data
  }

  return data
}

function _templateObject7() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n  border: none;\n  position: relative;\n  bottom: 14px;\n  left: -11px;\n  float: right;\n',
  ])

  _templateObject7 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([
    '\n  background: ',
    ';\n  border-radius: 4px;\n  bottom: 32px;\n  color: #fff;\n  display: none;\n  float: right;\n  padding: 4px;\n  position: relative;\n  left: 60px;\n',
  ])

  _templateObject6 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n  position: relative;\n  right: 4px;\n  cursor: pointer;\n  height: 24px;\n  width: 24px;\n',
  ])

  _templateObject5 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$1() {
  var data = _taggedTemplateLiteral(['\n  float: right;\n'])

  _templateObject4$1 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$2() {
  var data = _taggedTemplateLiteral([
    '\n  margin: 0px 38px 15px 38px;\n  margin-top: 10px;\n',
  ])

  _templateObject3$2 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$3() {
  var data = _taggedTemplateLiteral([
    '\n  border: 3px solid #f5f5f7;\n  border-bottom: none;\n\n  span:first-of-type {\n    position: relative;\n    top: 3px;\n  }\n',
  ])

  _templateObject2$3 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$6() {
  var data = _taggedTemplateLiteral([
    '\n  border: 3px solid #f5f5f7;\n  margin-bottom: 30px;\n',
  ])

  _templateObject$6 = function _templateObject() {
    return data
  }

  return data
}
var FillTheGapContainer = styled.div(_templateObject$6())
var FillTheGapContainerTool = styled.div(_templateObject2$3())
var FillTheGapWrapper = styled.div(_templateObject3$2())
var StyledIconContainer = styled.span(_templateObject4$1())
var StyledIconAction = styled(Icon)(_templateObject5())
var InfoMsg = styled.div(_templateObject6(), th('colorPrimary'))
var ActionButton$1 = styled.button(_templateObject7())
var StyledIconActionRemove$1 = styled(Icon)(_templateObject8())
var FillTheGapContainerComponent = function (_ref) {
  var _getUpdatedNode

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var infoMsgRef = useRef()

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    infoMsgIsOpen = _useState2[0],
    setInfoMsgIsOpen = _useState2[1]

  var FillTheGapTool = ComponentPlugin('fillTheGap')
  var customProps = main.props.customValues
  var testMode = customProps.testMode
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var readOnly = !isEditable
  var feedback = node.attrs.feedback

  var displayInfoMsg = function displayInfoMsg() {
    if (infoMsgRef.current && !infoMsgIsOpen)
      infoMsgRef.current.style.display = 'inline'
    if (infoMsgRef.current && infoMsgIsOpen)
      infoMsgRef.current.style.display = 'none'
    setInfoMsgIsOpen(!infoMsgIsOpen)
  }

  var removeQuestion = function removeQuestion() {
    var allNodes = getNodes$2(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr['delete'](
            singleNode.pos,
            singleNode.pos + singleNode.node.nodeSize,
          ),
        )
      }
    })
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$2(context.pmViews.main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  return /*#__PURE__*/ React.createElement(
    FillTheGapWrapper,
    null,
    /*#__PURE__*/ React.createElement(
      'div',
      null,
      !testMode &&
        !readOnly &&
        /*#__PURE__*/ React.createElement(
          FillTheGapContainerTool,
          null,
          /*#__PURE__*/ React.createElement(FillTheGapTool, null),
          /*#__PURE__*/ React.createElement(
            StyledIconContainer,
            {
              onClick: displayInfoMsg,
              onKeyPress: function onKeyPress() {},
              role: 'button',
              tabIndex: 0,
            },
            /*#__PURE__*/ React.createElement(StyledIconAction, {
              name: 'help',
            }),
          ),
          /*#__PURE__*/ React.createElement(
            ActionButton$1,
            {
              'aria-label': 'delete this question',
              onClick: removeQuestion,
              type: 'button',
            },
            /*#__PURE__*/ React.createElement(StyledIconActionRemove$1, {
              name: 'deleteOutlinedQuestion',
            }),
          ),
          /*#__PURE__*/ React.createElement(
            InfoMsg,
            {
              ref: infoMsgRef,
            },
            'enter answers seperated with a semi colon',
          ),
        ),
    ),
    /*#__PURE__*/ React.createElement(
      FillTheGapContainer,
      {
        className: 'fill-the-gap',
      },
      /*#__PURE__*/ React.createElement(ContainerEditor, {
        disallowedTools: [
          'Images',
          'Lists',
          'lift',
          'Tables',
          'FillTheGap',
          'MultipleChoice',
        ],
        getPos: getPos,
        node: node,
        view: view,
      }),
      !testMode &&
        !(readOnly && feedback === '') &&
        /*#__PURE__*/ React.createElement(FeedbackComponent, {
          getPos: getPos,
          node:
            (_getUpdatedNode = getUpdatedNode()) === null ||
            _getUpdatedNode === void 0
              ? void 0
              : _getUpdatedNode.node,
          readOnly: readOnly,
          view: view,
        }),
    ),
  )
}

var getNodes$2 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var fillTheGapContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'fill_the_gap_container') {
      fillTheGapContainerNodes.push(node)
    }
  })
  return fillTheGapContainerNodes
}

function _templateObject$7() {
  var data = _taggedTemplateLiteral([
    '\n  border: none;\n  border-bottom: 1px solid black;\n  color: #535e76;\n  display: inline-flex;\n  width: 120px;\n\n  &:focus {\n    outline: none;\n  }\n',
  ])

  _templateObject$7 = function _templateObject() {
    return data
  }

  return data
}
var AnswerInput = styled.input(_templateObject$7())
var InputComponent = function (_ref) {
  var node = _ref.node
  var context = useContext(WaxContext)
  var main = context.pmViews.main

  var _useState = useState(''),
    _useState2 = _slicedToArray(_useState, 2),
    answer = _useState2[0],
    setAnswer = _useState2[1]

  var answerRef = useRef(null)
  useEffect(function () {}, [])

  var handleKeyDown = function handleKeyDown(e) {
    if (e.key === 'Backspace') {
      main.dispatch(
        main.state.tr.setSelection(
          TextSelection.create(main.state.tr.doc, null),
        ),
      )
    }
  }

  var setAnswerInput = function setAnswerInput() {
    setAnswer(answerRef.current.value)
    var allNodes = getNodes$3(main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        main.dispatch(
          main.state.tr.setNodeMarkup(
            singleNode.pos,
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                answer: answerRef.current.value,
              },
            ),
          ),
        )
      }
    })
  }

  var onFocus = function onFocus() {
    main.dispatch(
      main.state.tr.setSelection(TextSelection.create(main.state.tr.doc, null)),
    )
  }

  return /*#__PURE__*/ React.createElement(AnswerInput, {
    'aria-label': 'answer input',
    onChange: setAnswerInput,
    onFocus: onFocus,
    onKeyDown: handleKeyDown,
    ref: answerRef,
    type: 'text',
    value: answer,
  })
}

var getNodes$3 = function getNodes(main) {
  var allNodes = DocumentHelpers.findInlineNodes(main.state.doc)
  var fillTheGapNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'fill_the_gap') {
      fillTheGapNodes.push(node)
    }
  })
  return fillTheGapNodes
}

function _templateObject3$3() {
  var data = _taggedTemplateLiteral([
    '\n  border-bottom: 1px solid green;\n  margin-right: 5px;\n',
  ])

  _templateObject3$3 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$4() {
  var data = _taggedTemplateLiteral([
    '\n  border-bottom: 1px solid black;\n  margin-right: 5px;\n  color: ',
    ';\n',
  ])

  _templateObject2$4 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$8() {
  var data = _taggedTemplateLiteral([
    '\n  display: inline-flex;\n\n  > .ProseMirror {\n    border-bottom: 1px solid #a6a6a6 !important;\n    border-radius: 4px;\n    box-shadow: none;\n    color: #008000;\n    display: inline;\n    min-width: 50px;\n    padding: 0px 2px 0px 2px !important;\n    white-space: break-spaces;\n    width: auto;\n    word-wrap: break-word;\n\n    &:focus {\n      outline: none;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n',
  ])

  _templateObject$8 = function _templateObject() {
    return data
  }

  return data
}
var EditorWrapper$4 = styled.span(_templateObject$8())
var StudentAnswer = styled.span(_templateObject2$4(), function (props) {
  return props.$isCorrect ? ' #008000' : 'red'
})
var CorrectAnswers = styled.span(_templateObject3$3())

var EditorComponent = function EditorComponent(_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var editorRef = useRef()

  var _useContext = useContext(ApplicationContext),
    app = _useContext.app

  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var _main$props$customVal = main.props.customValues,
    testMode = _main$props$customVal.testMode,
    showFeedBack = _main$props$customVal.showFeedBack
  var gapView
  var questionId = node.attrs.id
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var finalPlugins = []

  var createKeyBindings = function createKeyBindings() {
    var keys = getKeys()
    Object.keys(baseKeymap).forEach(function (key) {
      keys[key] = baseKeymap[key]
    })
    return keys
  }

  var getKeys = function getKeys() {
    return {
      'Mod-z': function ModZ() {
        return undo(view.state, view.dispatch)
      },
      'Mod-y': function ModY() {
        return redo(view.state, view.dispatch)
      },
    }
  }

  var filteredplugins = app.PmPlugins.getAll().filter(function (plugin) {
    return (
      !plugin.key.includes('y-sync') &&
      !plugin.key.includes('y-undo') &&
      !plugin.key.includes('yjs') &&
      !plugin.key.includes('comment')
    )
  })
  var plugins = [keymap(createKeyBindings())].concat(
    _toConsumableArray(filteredplugins),
  )
  finalPlugins = finalPlugins.concat(_toConsumableArray(plugins))
  useEffect(function () {
    gapView = new EditorView(
      {
        mount: editorRef.current,
      },
      {
        editable: function editable() {
          return isEditable
        },
        state: EditorState.create({
          doc: node,
          plugins: finalPlugins,
        }),
        dispatchTransaction: dispatchTransaction,
        disallowedTools: [
          'Images',
          'Lists',
          'lift',
          'Tables',
          'FillTheGap',
          'Gap',
          'MultipleChoice',
          'Essay',
        ],
        handleDOMEvents: {
          mousedown: function mousedown() {
            main.dispatch(
              main.state.tr
                .setMeta('outsideView', questionId)
                .setSelection(
                  new TextSelection(
                    main.state.tr.doc.resolve(
                      getPos() +
                        2 +
                        context.pmViews[questionId].state.selection.to,
                    ),
                  ),
                ),
            )
            context.updateView({}, questionId)
            if (gapView.hasFocus()) gapView.focus()
          },
        },
        attributes: {
          spellcheck: 'false',
        },
      },
    ) // Set Each note into Wax's Context

    context.updateView(_defineProperty({}, questionId, gapView), questionId)
    gapView.focus()
  }, [])

  var dispatchTransaction = function dispatchTransaction(tr) {
    var _gapView$state$applyT = gapView.state.applyTransaction(tr),
      state = _gapView$state$applyT.state,
      transactions = _gapView$state$applyT.transactions

    gapView.updateState(state)
    context.updateView({}, questionId)

    if (!tr.getMeta('fromOutside')) {
      var outerTr = view.state.tr
      var offsetMap = StepMap.offset(getPos() + 1)

      for (var i = 0; i < transactions.length; i += 1) {
        var steps = transactions[i].steps

        for (var j = 0; j < steps.length; j += 1) {
          outerTr.step(steps[j].map(offsetMap))
        }
      }

      if (outerTr.docChanged)
        view.dispatch(outerTr.setMeta('outsideView', questionId))
    }
  }

  var isCorrect = false

  if (
    node.textContent.split(';').find(function (element) {
      return element === node.attrs.answer.trim()
    })
  ) {
    isCorrect = true
  }

  return (
    (isEditable &&
      !testMode &&
      !showFeedBack &&
      /*#__PURE__*/ React.createElement(
        EditorWrapper$4,
        null,
        /*#__PURE__*/ React.createElement('div', {
          ref: editorRef,
        }),
      )) ||
    (!isEditable &&
      !testMode &&
      !showFeedBack &&
      /*#__PURE__*/ React.createElement(
        EditorWrapper$4,
        null,
        /*#__PURE__*/ React.createElement('div', {
          ref: editorRef,
        }),
      )) ||
    (showFeedBack &&
      !testMode &&
      /*#__PURE__*/ React.createElement(
        React.Fragment,
        null,
        /*#__PURE__*/ React.createElement(
          StudentAnswer,
          {
            $isCorrect: isCorrect,
          },
          node.attrs.answer,
        ),
        /*#__PURE__*/ React.createElement(
          CorrectAnswers,
          null,
          '(Accepted Answers : '.concat(
            node.textContent.replaceAll(';', ' -'),
            ')',
          ),
        ),
      )) ||
    /*#__PURE__*/ React.createElement(InputComponent, {
      getPos: getPos,
      node: node,
      view: view,
    })
  )
}

var GapComponent = function (_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  return /*#__PURE__*/ React.createElement(EditorComponent, {
    getPos: getPos,
    node: node,
    view: view,
  })
}

var FillTheGapQuestionService$1 = /*#__PURE__*/ (function (_Service) {
  _inherits(FillTheGapQuestionService$1, _Service)

  var _super = _createSuper(FillTheGapQuestionService$1)

  function FillTheGapQuestionService$1() {
    var _this

    _classCallCheck(this, FillTheGapQuestionService$1)

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))
    _this.dependencies = [new FillTheGapQuestionService()]
    return _this
  }

  _createClass(FillTheGapQuestionService$1, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('FillTheGapQuestion').to(FillTheGapQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          fill_the_gap_container: fillTheGapContainerNode,
        })
        createNode({
          fill_the_gap: fillTheGapNode,
        })
        addPortal({
          nodeView: FillTheGapContainerNodeView,
          component: FillTheGapContainerComponent,
          context: this.app,
        })
        addPortal({
          nodeView: FillTheGapNodeView,
          component: GapComponent,
          context: this.app,
        })
      },
    },
  ])

  return FillTheGapQuestionService$1
})(Service)

var _dec$4, _class$4, _temp$4
var MatchingQuestion =
  ((_dec$4 = injectable()),
  _dec$4(
    (_class$4 =
      ((_temp$4 = /*#__PURE__*/ (function (_Tools) {
        _inherits(MatchingQuestion, _Tools)

        var _super = _createSuper(MatchingQuestion)

        function MatchingQuestion() {
          var _this

          _classCallCheck(this, MatchingQuestion)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Add Matching'
          _this.label = 'Matching'
          _this.name = 'Matching'

          _this.select = function (state, activeViewId, activeView) {
            var _activeView$props$dis = activeView.props.disallowedTools,
              disallowedTools =
                _activeView$props$dis === void 0 ? [] : _activeView$props$dis
            var status = true
            var _state$selection = state.selection,
              from = _state$selection.from,
              to = _state$selection.to
            if (from === null || disallowedTools.includes('Matching'))
              return false
            state.doc.nodesBetween(from, to, function (node, pos) {
              if (node.type.groups.includes('questions')) {
                status = false
              }
            })
            return status
          }

          return _this
        }

        _createClass(MatchingQuestion, [
          {
            key: 'run',
            get: function get() {
              return function (main) {
                var dispatch = main.dispatch
                var state = main.state
                helpers.checkifEmpty(main)
                /* Create Wrapping */

                var _main$state$selection = main.state.selection,
                  $from = _main$state$selection.$from,
                  $to = _main$state$selection.$to
                var range = $from.blockRange($to)
                var tr = main.state.tr
                var wrapping =
                  range &&
                  findWrapping(
                    range,
                    state.config.schema.nodes.matching_container,
                    {
                      id: v4(),
                    },
                  )
                if (!wrapping) return false
                tr.wrap(range, wrapping) // const map = tr.mapping.maps[0];
                // let newPos = 0;
                // map.forEach((_from, _to, _newFrom, newTo) => {
                //   newPos = newTo;
                // });

                tr.setSelection(TextSelection.create(tr.doc, range.$to.pos + 1))
                var option = state.config.schema.nodes.matching_option.create(
                  {
                    id: v4(),
                    isfirst: true,
                  },
                  Fragment.empty,
                )
                tr.replaceSelectionWith(option)
                dispatch(tr)
                return true
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {
                if (
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.matching_container,
                  ) ||
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.matching_option,
                  )
                ) {
                  return true
                }

                return false
              }
            },
          },
        ])

        return MatchingQuestion
      })(Tools)),
      _temp$4)),
  ) || _class$4)

var matchingContainerNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'matching-container',
    },
    options: {
      default: [],
    },
    feedback: {
      default: '',
    },
  },
  group: 'block questions',
  isolating: true,
  content: 'block*',
  parseDOM: [
    {
      tag: 'div.matching-container',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          feedback: dom.getAttribute('feedback'),
          options: JSON.parse(dom.getAttribute('options')),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return [
      'div',
      {
        id: node.attrs.id,
        class: node.attrs['class'],
        options: JSON.stringify(node.attrs.options),
        feedback: node.attrs.feedback,
      },
      0,
    ]
  },
}

var matchingOptionNode = {
  attrs: {
    class: {
      default: 'matching-option',
    },
    id: {
      default: '',
    },
    isfirst: {
      default: false,
    },
    answer: {
      default: '',
    },
    correct: {
      default: '',
    },
    options: {
      default: [],
    },
  },
  group: 'inline questions',
  content: 'inline*',
  inline: true,
  atom: true,
  defining: true,
  parseDOM: [
    {
      tag: 'div.matching-option',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          isfirst: JSON.parse(dom.getAttribute('isfirst').toLowerCase()),
          answer: dom.getAttribute('answer'),
          correct: dom.getAttribute('correct'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return [
      'div',
      {
        id: node.attrs.id,
        class: node.attrs['class'],
        isfirst: node.attrs.isfirst,
        answer: node.attrs.answer,
        correct: node.attrs.correct,
      },
      0,
    ]
  },
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object)
    if (object === null) break
  }

  return object
}

function _get(target, property, receiver) {
  if (typeof Reflect !== 'undefined' && Reflect.get) {
    _get = Reflect.get
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property)
      if (!base) return
      var desc = Object.getOwnPropertyDescriptor(base, property)

      if (desc.get) {
        return desc.get.call(receiver)
      }

      return desc.value
    }
  }

  return _get(target, property, receiver || target)
}

var MatchingContainerNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(MatchingContainerNodeView, _QuestionsNodeView)

  var _super = _createSuper(MatchingContainerNodeView)

  function MatchingContainerNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, MatchingContainerNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    MatchingContainerNodeView,
    [
      {
        key: 'update',
        value: function update(node) {
          if (node.type.name === 'paragraph') {
            if (!node.sameMarkup(this.node)) return false
          }

          return _get(
            _getPrototypeOf(MatchingContainerNodeView.prototype),
            'update',
            this,
          ).call(this, node)
        },
      },
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            event.target.type === 'textarea' ||
            event.target.type === 'text' ||
            event.target.type === 'button' ||
            !event.target.type
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'matching_container'
        },
      },
    ],
  )

  return MatchingContainerNodeView
})(QuestionsNodeView)

var MatchingOptionNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(MatchingOptionNodeView, _QuestionsNodeView)

  var _super = _createSuper(MatchingOptionNodeView)

  function MatchingOptionNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, MatchingOptionNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    MatchingOptionNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (event.target.type === 'text' || event.target.type === 'button') {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'matching_option'
        },
      },
    ],
  )

  return MatchingOptionNodeView
})(QuestionsNodeView)

function _templateObject$9() {
  var data = _taggedTemplateLiteral([
    '\n  width: 100% !important;\n  display: flex;\n  flex-direction: row;\n  > .ProseMirror {\n    padding: 0px !important;\n    box-shadow: none !important;\n    width: 100% !important;\n    &:focus {\n      outline: none;\n    }\n    p {\n      margin: 0;\n\n      br {\n        display: none;\n      }\n    }\n  }\n',
  ])

  _templateObject$9 = function _templateObject() {
    return data
  }

  return data
}
var EditorWrapper$5 = styled.div(_templateObject$9())

var ContainerEditor$1 = function ContainerEditor(_ref) {
  var _node$attrs

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var editorRef = useRef()

  var _useContext = useContext(ApplicationContext),
    app = _useContext.app

  var context = useContext(WaxContext)
  var containerView
  var questionId =
    node === null || node === void 0
      ? void 0
      : (_node$attrs = node.attrs) === null || _node$attrs === void 0
      ? void 0
      : _node$attrs.id
  var filteredplugins = app.PmPlugins.getAll().filter(function (plugin) {
    return (
      !plugin.key.includes('y-sync') &&
      !plugin.key.includes('y-undo') &&
      !plugin.key.includes('yjs') &&
      !plugin.key.includes('comment')
    )
  })
  useEffect(function () {
    containerView = new EditorView(
      {
        mount: editorRef.current,
      },
      {
        editable: function editable() {
          return false
        },
        state: EditorState.create({
          doc: node,
          plugins: _toConsumableArray(filteredplugins),
        }),
        dispatchTransaction: dispatchTransaction,
        disallowedTools: [
          'Images',
          'Lists',
          'lift',
          'Tables',
          'FillTheGap',
          'MultipleChoice',
        ],
      },
    ) // Set Each note into Wax's Context

    context.updateView(
      _defineProperty({}, questionId, containerView),
      questionId,
    )
  }, [])

  var dispatchTransaction = function dispatchTransaction(tr) {
    var _containerView$state$ = containerView.state.applyTransaction(tr),
      state = _containerView$state$.state,
      transactions = _containerView$state$.transactions

    containerView.updateState(state)
    context.updateView({}, questionId)

    if (!tr.getMeta('fromOutside')) {
      var outerTr = view.state.tr
      var offsetMap = StepMap.offset(getPos() + 1)

      for (var i = 0; i < transactions.length; i++) {
        var steps = transactions[i].steps

        for (var j = 0; j < steps.length; j++) {
          outerTr.step(steps[j].map(offsetMap))
        }
      }

      if (outerTr.docChanged)
        view.dispatch(outerTr.setMeta('outsideView', questionId))
    }
  }

  return /*#__PURE__*/ React.createElement(
    EditorWrapper$5,
    null,
    /*#__PURE__*/ React.createElement('div', {
      ref: editorRef,
    }),
  )
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject11 = function _templateObject11() {
    return data
  }

  return data
}

function _templateObject10() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 6px;\n  border: none;\n  position: relative;\n  bottom: 2px;\n  left: -11px;\n  float: right;\n',
  ])

  _templateObject10 = function _templateObject10() {
    return data
  }

  return data
}

function _templateObject9() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n\n  input {\n    border: none;\n    border-bottom: 1px solid black;\n\n    &:focus {\n      outline: none;\n    }\n\n    ::placeholder {\n      color: rgb(170, 170, 170);\n      font-style: italic;\n    }\n  }\n\n  button {\n    background: #fff;\n    border: 1px solid #535e76;\n    color: #535e76;\n    cursor: pointer;\n    margin-left: 20px;\n    padding: 4px 8px 4px 8px;\n\n    &:hover {\n      background: #535e76;\n      border: 1px solid #535e76;\n      color: #fff;\n      cursor: pointer;\n      margin-right: 20px;\n      padding: 4px 8px 4px 8px;\n    }\n  }\n',
  ])

  _templateObject9 = function _templateObject9() {
    return data
  }

  return data
}

function _templateObject8$1() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  width: 100%;\n\n  ul {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n    margin: 0;\n    padding: 0;\n\n    li {\n      list-style-type: none;\n      padding-bottom: 7px;\n      padding-right: 7px;\n\n      span {\n        background: #535e76;\n        border-radius: 12px;\n        color: white;\n        padding: 3px 3px 3px 10px;\n      }\n\n      svg {\n        fill: white;\n        height: 16px;\n        width: 16px;\n      }\n    }\n  }\n',
  ])

  _templateObject8$1 = function _templateObject8() {
    return data
  }

  return data
}

function _templateObject7$1() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  padding-bottom: 10px;\n',
  ])

  _templateObject7$1 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$1() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject6$1 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$1() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  height: 24px;\n  padding-left: 0;\n',
  ])

  _templateObject5$1 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$2() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n',
  ])

  _templateObject4$2 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$4() {
  var data = _taggedTemplateLiteral([
    '\n  border: 3px solid #f5f5f7;\n  margin-bottom: 30px;\n  padding: 10px;\n',
  ])

  _templateObject3$4 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$5() {
  var data = _taggedTemplateLiteral([
    '\n  border: 3px solid #f5f5f7;\n  border-bottom: none;\n',
  ])

  _templateObject2$5 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$a() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  margin: 0px 38px 15px 38px;\n  margin-top: 10px;\n\n  .ProseMirror-selectednode {\n    outline: none;\n  }\n',
  ])

  _templateObject$a = function _templateObject() {
    return data
  }

  return data
}
var MatchingWrapper = styled.div(_templateObject$a())
var MatchingContainerTool = styled.div(_templateObject2$5())
var MatchingContainer = styled.div(_templateObject3$4())
var QuestionWrapper = styled.div(_templateObject4$2())
var ActionButton$2 = styled.button(_templateObject5$1())
var StyledIconAction$1 = styled(Icon)(_templateObject6$1())
var CreateOptions = styled.div(_templateObject7$1())
var OptionArea = styled.div(_templateObject8$1())
var AddOption = styled.div(_templateObject9())
var RemoveQuestionButton = styled.button(_templateObject10())
var StyledIconActionRemove$2 = styled(Icon)(_templateObject11())
var MatchingContainerComponent = function (_ref) {
  var _getUpdatedNode

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main

  var _useState = useState(node.attrs.options),
    _useState2 = _slicedToArray(_useState, 2),
    options = _useState2[0],
    setOptions = _useState2[1]

  var _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    optionText = _useState4[0],
    setOptionText = _useState4[1]

  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    addingOption = _useState6[0],
    setAddingOption = _useState6[1]

  var addOptionRef = useRef(null)
  var addOptionBtnRef = useRef(null)

  var _useDynamicRefs = useDynamicRefs(),
    _useDynamicRefs2 = _slicedToArray(_useDynamicRefs, 2),
    getRef = _useDynamicRefs2[0],
    setRef = _useDynamicRefs2[1]

  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var readOnly = !isEditable
  useEffect(function () {
    var listener = function listener(event) {
      if (event.code === 'Enter') {
        event.preventDefault()
        if (addOptionBtnRef.current) addOptionBtnRef.current.click()
      }
    }

    if (addOptionBtnRef.current)
      addOptionBtnRef.current.addEventListener('keydown', listener)
    return function () {
      if (addOptionBtnRef.current)
        addOptionBtnRef.current.removeEventListener('keydown', listener)
    }
  }, [])
  useEffect(
    function () {
      var allNodes = getNodes$4(main)
      /* TEMP TO SAVE NODE OPTIONS TODO: SAVE IN CONTEXT OPTIONS */

      saveInChildOptions(allNodes)
      if (!addingOption) return
      allNodes.forEach(function (singleNode) {
        if (singleNode.node.attrs.id === node.attrs.id) {
          main.dispatch(
            main.state.tr.setMeta('addToHistory', false).setNodeMarkup(
              getPos(),
              undefined,
              _objectSpread2(
                _objectSpread2({}, singleNode.node.attrs),
                {},
                {
                  options: options,
                },
              ),
            ),
          )
        }
      })
    },
    [options, JSON.stringify(context.pmViews.main.state)],
  )

  var addOption = function addOption() {
    if (addOptionRef.current.value.trim() === '') return
    var obj = {
      label: addOptionRef.current.value,
      value: v4(),
    }
    setOptions(function (prevOptions) {
      return [].concat(_toConsumableArray(prevOptions), [obj])
    })
    setAddingOption(true)
    setTimeout(function () {
      setAddingOption(false)
    })
    setOptionText('')
    addOptionRef.current.focus()
  }

  var updateOptionText = function updateOptionText() {
    setOptionText(addOptionRef.current.value)
  }

  var handleKeyDown = function handleKeyDown(event) {
    if (event.key === 'Enter' || event.which === 13) {
      addOption()
    }
  }

  var removeOption = function removeOption(value) {
    setOptions(
      options.filter(function (option) {
        return option.value !== value
      }),
    )
    setAddingOption(true)
    setTimeout(function () {
      setAddingOption(false)
    })
    var allNodes = getNodes$4(context.pmViews.main) // const allNodesOptions = getOptionsNodes(context.pmViews.main);

    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        singleNode.node.content.content.forEach(function (parentNodes) {
          parentNodes.forEach(function (optionNode) {
            if (optionNode.type.name === 'matching_option') {
              // setTimeout(() => {
              //   context.pmViews.main.dispatch(
              //     context.pmViews.main.state.tr
              //       .setMeta('addToHistory', false)
              //       .setNodeMarkup(allNodesOptions[0].pos, undefined, {
              //         ...allNodesOptions[0].node.attrs,
              //         options: options.filter(option => option.value !== value),
              //         correct: '',
              //       }),
              //   );
              //
              // });

              /* eslint-disable-next-line no-param-reassign */
              optionNode.attrs.options = options.filter(function (option) {
                return option.value !== value
              })

              if (optionNode.attrs.correct === value) {
                optionNode.attrs.correct = null
              }
            }
          })
        })
      }
    })
  }

  var saveInChildOptions = function saveInChildOptions(allNodes) {
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        singleNode.node.content.content.forEach(function (parentNodes) {
          parentNodes.forEach(function (optionNode) {
            if (optionNode.type.name === 'matching_option')
              /* eslint-disable-next-line no-param-reassign */
              optionNode.attrs.options = options
          })
        })
      }
    })
  }

  useEffect(
    function () {
      var listener = function listener(event) {
        if (event.code === 'Enter') {
          event.preventDefault()
          options.forEach(function (option) {
            if (document.activeElement === getRef(option.value).current) {
              getRef(option.value).current.click()
            }
          })
        }
      }

      options.forEach(function (option) {
        if (getRef(option.value) && getRef(option.value).current)
          getRef(option.value).current.addEventListener('keydown', listener)
      })
      return function () {
        options.forEach(function (option) {
          if (getRef(option.value) && getRef(option.value).current)
            getRef(option.value).current.removeEventListener(
              'keydown',
              listener,
            )
        })
      }
    },
    [options],
  )
  var testMode = customProps.testMode
  var feedback = node.attrs.feedback

  var removeQuestion = function removeQuestion() {
    var allNodes = getNodes$4(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr['delete'](
            singleNode.pos,
            singleNode.pos + singleNode.node.nodeSize,
          ),
        )
      }
    })
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$4(context.pmViews.main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  return /*#__PURE__*/ React.createElement(
    MatchingWrapper,
    null,
    !testMode &&
      !readOnly &&
      /*#__PURE__*/ React.createElement(
        MatchingContainerTool,
        null,
        /*#__PURE__*/ React.createElement(
          RemoveQuestionButton,
          {
            'aria-label': 'delete this question',
            onClick: removeQuestion,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconActionRemove$2, {
            name: 'deleteOutlinedQuestion',
          }),
        ),
      ),
    /*#__PURE__*/ React.createElement(
      MatchingContainer,
      {
        className: 'matching',
      },
      /*#__PURE__*/ React.createElement(
        QuestionWrapper,
        null,
        /*#__PURE__*/ React.createElement(ContainerEditor$1, {
          getPos: getPos,
          node: node,
          view: view,
        }),
      ),
      (!readOnly ||
        (readOnly && !customProps.testMode && !customProps.showFeedBack)) &&
        /*#__PURE__*/ React.createElement(
          CreateOptions,
          null,
          /*#__PURE__*/ React.createElement(
            OptionArea,
            null,
            options.length > 0 &&
              /*#__PURE__*/ React.createElement(
                'ul',
                null,
                /*#__PURE__*/ React.createElement('li', null, 'Options: '),
                options.map(function (option) {
                  return /*#__PURE__*/ React.createElement(
                    'li',
                    {
                      key: option.value,
                    },
                    /*#__PURE__*/ React.createElement(
                      'span',
                      null,
                      option.label,
                      ' \xA0',
                      !readOnly &&
                        /*#__PURE__*/ React.createElement(
                          ActionButton$2,
                          {
                            'aria-label': 'delete '.concat(option.label),
                            onClick: function onClick() {
                              return removeOption(option.value)
                            },
                            ref: setRef(option.value),
                            type: 'button',
                          },
                          /*#__PURE__*/ React.createElement(
                            StyledIconAction$1,
                            {
                              label: 'delete '.concat(option.label),
                              name: 'deleteOutlined',
                            },
                          ),
                        ),
                    ),
                  )
                }),
              ),
          ),
          !readOnly &&
            /*#__PURE__*/ React.createElement(
              AddOption,
              null,
              /*#__PURE__*/ React.createElement('input', {
                onChange: updateOptionText,
                onKeyPress: handleKeyDown,
                placeholder: 'Type an option ...',
                ref: addOptionRef,
                type: 'text',
                value: optionText,
              }),
              /*#__PURE__*/ React.createElement(
                'button',
                {
                  'aria-label': 'add new option',
                  onClick: addOption,
                  ref: addOptionBtnRef,
                  type: 'button',
                },
                'Add Option',
              ),
            ),
        ),
      !testMode &&
        !(readOnly && feedback === '') &&
        /*#__PURE__*/ React.createElement(FeedbackComponent, {
          getPos: getPos,
          node:
            (_getUpdatedNode = getUpdatedNode()) === null ||
            _getUpdatedNode === void 0
              ? void 0
              : _getUpdatedNode.node,
          readOnly: readOnly,
          view: view,
        }),
    ),
  )
}

var getNodes$4 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var matchingContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'matching_container') {
      matchingContainerNodes.push(node)
    }
  })
  return matchingContainerNodes
}

function _templateObject$b() {
  var data = _taggedTemplateLiteral([
    "\n  border: none;\n  display: flex;\n  width: 68%;\n\n  > .ProseMirror {\n    white-space: break-spaces;\n    width: 100% !important;\n    min-height: 25px !important;\n    word-wrap: break-word;\n    padding: 4px !important;\n    border: 12px solid #f4f4f7;\n    border-radius: 12px;\n    box-shadow: none !important;\n\n    &:focus {\n      outline: none;\n    }\n\n    :empty::before {\n      content: 'Type your text';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n\n    p:first-child {\n      margin: 0;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n",
  ])

  _templateObject$b = function _templateObject() {
    return data
  }

  return data
}
var EditorWrapper$6 = styled.div(_templateObject$b())

var EditorComponent$1 = function EditorComponent(_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var editorRef = useRef()

  var _useContext = useContext(ApplicationContext),
    app = _useContext.app

  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var questionView
  var questionId = node.attrs.id
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var finalPlugins = [FakeCursorPlugin$1()]

  var createKeyBindings = function createKeyBindings() {
    var keys = getKeys()
    Object.keys(baseKeymap).forEach(function (key) {
      keys[key] = baseKeymap[key]
    })
    return keys
  }

  var getKeys = function getKeys() {
    return {
      'Mod-z': function ModZ() {
        return undo(view.state, view.dispatch)
      },
      'Mod-y': function ModY() {
        return redo(view.state, view.dispatch)
      },
    }
  }

  var filteredplugins = app.PmPlugins.getAll().filter(function (plugin) {
    return (
      !plugin.key.includes('y-sync') &&
      !plugin.key.includes('y-undo') &&
      !plugin.key.includes('yjs') &&
      !plugin.key.includes('comment')
    )
  })
  var plugins = [keymap(createKeyBindings())].concat(
    _toConsumableArray(filteredplugins),
  )

  var createPlaceholder = function createPlaceholder(placeholder) {
    return Placeholder({
      content: placeholder,
    })
  }

  finalPlugins = finalPlugins.concat(
    [createPlaceholder('Type your answer')].concat(_toConsumableArray(plugins)),
  )
  useEffect(function () {
    questionView = new EditorView(
      {
        mount: editorRef.current,
      },
      {
        editable: function editable() {
          return isEditable
        },
        state: EditorState.create({
          doc: node,
          plugins: finalPlugins,
        }),
        dispatchTransaction: dispatchTransaction,
        disallowedTools: [
          'Images',
          'Lists',
          'lift',
          'MultipleChoice',
          'Tables',
        ],
        handleDOMEvents: {
          mousedown: function mousedown() {
            main.dispatch(
              main.state.tr
                .setMeta('outsideView', questionId)
                .setSelection(
                  new TextSelection(
                    main.state.tr.doc.resolve(
                      getPos() + context.pmViews[questionId].state.selection.to,
                    ),
                  ),
                ),
            )
            context.updateView({}, questionId)
            if (questionView.hasFocus()) questionView.focus()
          },
          blur: function blur(editorView, event) {
            if (questionView && event.relatedTarget === null) {
              questionView.focus()
            }
          },
        },
        attributes: {
          spellcheck: 'false',
        },
      },
    ) // Set Each note into Wax's Context

    context.updateView(
      _defineProperty({}, questionId, questionView),
      questionId,
    )
    questionView.focus()
  }, [])

  var dispatchTransaction = function dispatchTransaction(tr) {
    var _questionView$state$a = questionView.state.applyTransaction(tr),
      state = _questionView$state$a.state,
      transactions = _questionView$state$a.transactions

    questionView.updateState(state)
    context.updateView({}, questionId)

    if (!tr.getMeta('fromOutside')) {
      var outerTr = view.state.tr
      var offsetMap = StepMap.offset(getPos() + 1)

      for (var i = 0; i < transactions.length; i++) {
        var steps = transactions[i].steps

        for (var j = 0; j < steps.length; j++) {
          outerTr.step(steps[j].map(offsetMap))
        }
      }

      if (outerTr.docChanged)
        view.dispatch(outerTr.setMeta('outsideView', questionId))
    }
  }

  return /*#__PURE__*/ React.createElement(
    EditorWrapper$6,
    null,
    /*#__PURE__*/ React.createElement('div', {
      ref: editorRef,
    }),
  )
}

function _templateObject4$3() {
  var data = _taggedTemplateLiteral([
    '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n',
  ])

  _templateObject4$3 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$5() {
  var data = _taggedTemplateLiteral([
    '\n  visibility: ',
    ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 10px auto auto;\n  position: absolute;\n  width: 170px;\n  max-height: 150px;\n  overflow-y: auto;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
  ])

  _templateObject3$5 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$6() {
  var data = _taggedTemplateLiteral([
    '\n  background: #fff;\n  border: none;\n  color: #000;\n  cursor: ',
    ';\n  opacity: ',
    ';\n  display: flex;\n  position: relative;\n  width: 160px;\n\n  span {\n    position: relative;\n    top: 2px;\n  }\n',
  ])

  _templateObject2$6 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$c() {
  var data = _taggedTemplateLiteral([''])

  _templateObject$c = function _templateObject() {
    return data
  }

  return data
}
var Wrapper = styled.div(_templateObject$c())
var DropDownButton = styled.button(
  _templateObject2$6(),
  function (props) {
    return props.$disabled ? 'not-allowed' : 'pointer'
  },
  function (props) {
    return props.$disabled ? '0.4' : '1'
  },
)
var DropDownMenu = styled.div(_templateObject3$5(), function (props) {
  return props.$isOpen ? 'visible' : 'hidden'
})
var StyledIcon = styled(Icon)(_templateObject4$3())

var DropComponent = function DropComponent(_ref) {
  var _getMatchingNode, _getMatchingNode$attr

  var getPos = _ref.getPos,
    node = _ref.node,
    view = _ref.view,
    uniqueId = _ref.uniqueId

  var _useState = useState(node.attrs.correct),
    _useState2 = _slicedToArray(_useState, 2),
    selectedOption = _useState2[0],
    setSelectedOption = _useState2[1]

  var _useState3 = useState(node.attrs.options),
    _useState4 = _slicedToArray(_useState3, 2),
    allOptions = _useState4[0],
    setAllOptions = _useState4[1]

  var itemRefs = useRef([])
  var wrapperRef = useRef()

  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isOpen = _useState6[0],
    setIsOpen = _useState6[1]

  var context = useContext(WaxContext)
  var main = context.pmViews.main,
    activeView = context.activeView
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var isDisabled = !isEditable
  if (allOptions && allOptions.length === 0) isDisabled = true

  var onChange = function onChange(option) {
    var allNodes = getNodes$5(main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        main.dispatch(
          main.state.tr.setMeta('addToHistory', false).setNodeMarkup(
            singleNode.pos,
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                correct: option.value,
              },
            ),
          ),
        )
      }
    })
    openCloseMenu()
    setSelectedOption(option.value)
  }

  useOnClickOutside(wrapperRef, function () {
    return setIsOpen(false)
  })
  useEffect(
    function () {
      var _theNode$attrs, _theNode$attrs2

      var theNode = getMatchingNode(main, node)
      setAllOptions(
        theNode === null || theNode === void 0
          ? void 0
          : (_theNode$attrs = theNode.attrs) === null ||
            _theNode$attrs === void 0
          ? void 0
          : _theNode$attrs.options,
      )
      setSelectedOption(
        theNode === null || theNode === void 0
          ? void 0
          : (_theNode$attrs2 = theNode.attrs) === null ||
            _theNode$attrs2 === void 0
          ? void 0
          : _theNode$attrs2.correct,
      )
    },
    [
      (_getMatchingNode = getMatchingNode(main, node)) === null ||
      _getMatchingNode === void 0
        ? void 0
        : (_getMatchingNode$attr = _getMatchingNode.attrs) === null ||
          _getMatchingNode$attr === void 0
        ? void 0
        : _getMatchingNode$attr.options,
    ],
  )
  useEffect(
    function () {
      if (isDisabled) setIsOpen(false)
    },
    [isDisabled],
  )

  var openCloseMenu = function openCloseMenu() {
    if (!isDisabled) setIsOpen(!isOpen)
    if (isOpen)
      setTimeout(function () {
        activeView.focus()
      })
  }

  var _onKeyDown = function onKeyDown(e, index) {
    e.preventDefault()

    if (e.keyCode === 40) {
      // arrow down
      if (index === itemRefs.current.length - 1) {
        itemRefs.current[0].current.focus()
      } else {
        itemRefs.current[index + 1].current.focus()
      }
    } // arrow up

    if (e.keyCode === 38) {
      if (
        index === 0 &&
        itemRefs.current[itemRefs.current.length - 1].current
      ) {
        itemRefs.current[itemRefs.current.length - 1].current.focus()
      } else {
        itemRefs.current[index - 1].current.focus()
      }
    } // enter

    if (e.keyCode === 13) {
      itemRefs.current[index].current.click()
    } // ESC

    if (e.keyCode === 27) {
      setIsOpen(false)
    }
  }

  var MultipleDropDown = useMemo(
    function () {
      var _selectedValue$

      var selectedValue

      if (selectedOption) {
        selectedValue = allOptions.filter(function (option) {
          return option.value === selectedOption
        })
      }

      return /*#__PURE__*/ React.createElement(
        Wrapper,
        {
          $disabled: isDisabled,
          ref: wrapperRef,
        },
        /*#__PURE__*/ React.createElement(
          DropDownButton,
          {
            $disabled: isDisabled,
            'aria-controls': uniqueId,
            'aria-expanded': isOpen,
            'aria-haspopup': true,
            onKeyDown: function onKeyDown(e) {
              if (e.keyCode === 40) {
                if (!itemRefs.current[0].current) return
                itemRefs.current[0].current.focus()
              }

              if (e.keyCode === 27) {
                setIsOpen(false)
              }

              if (e.keyCode === 13 || e.keyCode === 32) {
                setIsOpen(true)
              }
            },
            onMouseDown: openCloseMenu,
            role: 'combobox',
            type: 'button',
          },
          selectedOption === null || !selectedOption
            ? 'Select Option'
            : (_selectedValue$ = selectedValue[0]) === null ||
              _selectedValue$ === void 0
            ? void 0
            : _selectedValue$.label,
          /*#__PURE__*/ React.createElement(StyledIcon, {
            name: 'expand',
          }),
        ),
        /*#__PURE__*/ React.createElement(
          DropDownMenu,
          {
            $isOpen: isOpen,
            'aria-label': 'Choose an option',
            id: uniqueId,
            role: 'listbox',
          },
          allOptions &&
            allOptions.map(function (option, index) {
              itemRefs.current[index] = itemRefs.current[index] || createRef()
              return /*#__PURE__*/ React.createElement(
                'span',
                {
                  'aria-selected': option.value === selectedOption,
                  key: option.value,
                  onClick: function onClick() {
                    return onChange(option)
                  },
                  onKeyDown: function onKeyDown(e) {
                    return _onKeyDown(e, index)
                  },
                  ref: itemRefs.current[index],
                  role: 'option',
                  tabIndex: '-1',
                },
                option.label,
              )
            }),
        ),
      )
    },
    [allOptions, selectedOption, isOpen, isDisabled],
  )
  return MultipleDropDown
}

var getNodes$5 = function getNodes(view) {
  var allNodes = DocumentHelpers.findInlineNodes(view.state.doc)
  var matchingOptionNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'matching_option') {
      matchingOptionNodes.push(node)
    }
  })
  return matchingOptionNodes
}

var getMatchingNode = function getMatchingNode(view, node) {
  var allNodes = DocumentHelpers.findInlineNodes(view.state.doc)
  var matchingNode = ''
  allNodes.forEach(function (singleNode) {
    if (
      singleNode.node.type.name === 'matching_option' &&
      singleNode.node.attrs.id === node.attrs.id
    ) {
      matchingNode = singleNode.node
    }
  })
  return matchingNode
}

function _templateObject4$4() {
  var data = _taggedTemplateLiteral([
    '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n',
  ])

  _templateObject4$4 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$6() {
  var data = _taggedTemplateLiteral([
    '\n  visibility: ',
    ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 10px auto auto;\n  position: absolute;\n  width: 170px;\n  max-height: 150px;\n  overflow-y: auto;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
  ])

  _templateObject3$6 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$7() {
  var data = _taggedTemplateLiteral([
    '\n  background: #fff;\n  border: none;\n  color: #000;\n  cursor: ',
    ';\n  opacity: ',
    ';\n  display: flex;\n  position: relative;\n  width: 160px;\n\n  span {\n    position: relative;\n    top: 2px;\n  }\n',
  ])

  _templateObject2$7 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$d() {
  var data = _taggedTemplateLiteral([''])

  _templateObject$d = function _templateObject() {
    return data
  }

  return data
}
var Wrapper$1 = styled.div(_templateObject$d())
var DropDownButton$1 = styled.button(
  _templateObject2$7(),
  function (props) {
    return props.$disabled ? 'not-allowed' : 'pointer'
  },
  function (props) {
    return props.$disabled ? '0.4' : '1'
  },
)
var DropDownMenu$1 = styled.div(_templateObject3$6(), function (props) {
  return props.$isOpen ? 'visible' : 'hidden'
})
var StyledIcon$1 = styled(Icon)(_templateObject4$4())

var TestModeDropDownComponent = function TestModeDropDownComponent(_ref) {
  var getPos = _ref.getPos,
    node = _ref.node,
    view = _ref.view,
    uniqueId = _ref.uniqueId

  var _useState = useState(undefined),
    _useState2 = _slicedToArray(_useState, 2),
    selectedOption = _useState2[0],
    setSelectedOption = _useState2[1]

  var itemRefs = useRef([])
  var wrapperRef = useRef()

  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isOpen = _useState4[0],
    setIsOpen = _useState4[1]

  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var isDisabled = false
  if (node.attrs.options.length === 0) isDisabled = true

  var onChange = function onChange(option) {
    setSelectedOption(option)
    var allNodes = getNodes$6(main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        main.dispatch(
          main.state.tr.setMeta('addToHistory', false).setNodeMarkup(
            singleNode.pos,
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                answer: option.value,
              },
            ),
          ),
        )
      }
    })
    openCloseMenu()
    setSelectedOption(option.value)
  }

  useOnClickOutside(wrapperRef, function () {
    return setIsOpen(false)
  })
  useEffect(
    function () {
      var value = selectedOption ? selectedOption.value : ''
      var found = find(node.attrs.options, {
        value: value,
      })

      if (!found) {
        setSelectedOption(undefined)
      }
    },
    [node.attrs.options],
  )

  var _onKeyDown = function onKeyDown(e, index) {
    e.preventDefault()

    if (e.keyCode === 40) {
      // arrow down
      if (index === itemRefs.current.length - 1) {
        itemRefs.current[0].current.focus()
      } else {
        itemRefs.current[index + 1].current.focus()
      }
    } // arrow up

    if (e.keyCode === 38) {
      if (
        index === 0 &&
        itemRefs.current[itemRefs.current.length - 1].current
      ) {
        itemRefs.current[itemRefs.current.length - 1].current.focus()
      } else {
        itemRefs.current[index - 1].current.focus()
      }
    } // enter

    if (e.keyCode === 13) {
      itemRefs.current[index].current.click()
    } // ESC

    if (e.keyCode === 27) {
      setIsOpen(false)
    }
  }

  useEffect(
    function () {
      if (isDisabled) setIsOpen(false)
    },
    [isDisabled],
  )

  var openCloseMenu = function openCloseMenu() {
    if (!isDisabled) setIsOpen(!isOpen)
  }

  var ReadOnlyMultipleDropDown = useMemo(
    function () {
      var selectedValue

      if (selectedOption) {
        selectedValue = node.attrs.options.filter(function (option) {
          return option.value === selectedOption
        })
      }

      return /*#__PURE__*/ React.createElement(
        Wrapper$1,
        {
          $disabled: isDisabled,
          ref: wrapperRef,
        },
        /*#__PURE__*/ React.createElement(
          DropDownButton$1,
          {
            $disabled: isDisabled,
            'aria-controls': uniqueId,
            'aria-expanded': isOpen,
            'aria-haspopup': true,
            onKeyDown: function onKeyDown(e) {
              if (e.keyCode === 40) {
                if (!itemRefs.current[0].current) return
                itemRefs.current[0].current.focus()
              }

              if (e.keyCode === 27) {
                setIsOpen(false)
              }

              if (e.keyCode === 13 || e.keyCode === 32) {
                setIsOpen(true)
              }
            },
            onMouseDown: openCloseMenu,
            role: 'combobox',
            type: 'button',
          },
          selectedOption === null || !selectedOption
            ? 'Select Option'
            : selectedValue[0].label,
          /*#__PURE__*/ React.createElement(StyledIcon$1, {
            name: 'expand',
          }),
        ),
        /*#__PURE__*/ React.createElement(
          DropDownMenu$1,
          {
            $isOpen: isOpen,
            'aria-label': 'Choose an option',
            id: uniqueId,
            role: 'listbox',
          },
          node.attrs.options.map(function (option, index) {
            itemRefs.current[index] = itemRefs.current[index] || createRef()
            return /*#__PURE__*/ React.createElement(
              'span',
              {
                'aria-selected': option.value === selectedOption,
                key: option.value,
                onClick: function onClick() {
                  return onChange(option)
                },
                onKeyDown: function onKeyDown(e) {
                  return _onKeyDown(e, index)
                },
                ref: itemRefs.current[index],
                role: 'option',
                tabIndex: '-1',
              },
              option.label,
            )
          }),
        ),
      )
    },
    [node.attrs.options, selectedOption, isOpen],
  )
  return ReadOnlyMultipleDropDown
}

var getNodes$6 = function getNodes(view) {
  return DocumentHelpers.findInlineNodes(view.state.doc)
}

function _templateObject8$2() {
  var data = _taggedTemplateLiteral(['\n  span {\n    color: ', ';\n  }\n'])

  _templateObject8$2 = function _templateObject8() {
    return data
  }

  return data
}

function _templateObject7$2() {
  var data = _taggedTemplateLiteral(['\n  span {\n    color: #008000;\n  }\n'])

  _templateObject7$2 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$2() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  margin-left: 10px;\n',
  ])

  _templateObject6$2 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$2() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject5$2 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$5() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  height: 24px;\n  padding-left: 0;\n',
  ])

  _templateObject4$5 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$7() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n',
  ])

  _templateObject3$7 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$8() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  width: 7%;\n',
  ])

  _templateObject2$8 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$e() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  padding-bottom: 10px;\n  width: 100%;\n',
  ])

  _templateObject$e = function _templateObject() {
    return data
  }

  return data
}
var Option = styled.div(_templateObject$e())
var ButtonsContainer = styled.div(_templateObject2$8())
var DropDownContainer = styled.div(_templateObject3$7())
var ActionButton$3 = styled.button(_templateObject4$5())
var StyledIconAction$2 = styled(Icon)(_templateObject5$2())
var AnswerContainer = styled.div(_templateObject6$2())
var CorrectAnswer = styled.span(_templateObject7$2())
var Answer = styled.span(_templateObject8$2(), function (props) {
  return props.$isCorrect ? '#008000' : '#FF3030'
})
var MatchingOptionComponent = function (_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var readOnly = !isEditable
  var customProps = main.props.customValues
  var testMode = customProps.testMode,
    showFeedBack = customProps.showFeedBack

  var addAnswer = function addAnswer() {
    var nodeId = node.attrs.id
    var newAnswerId = v4()
    main.state.doc.descendants(function (editorNode, index) {
      if (editorNode.type.name === 'matching_option') {
        if (editorNode.attrs.id === nodeId) {
          main.dispatch(
            main.state.tr.setSelection(
              new TextSelection(
                main.state.tr.doc.resolve(editorNode.nodeSize + index),
              ),
            ),
          )
          var newOption = main.state.config.schema.nodes.matching_option.create(
            {
              id: newAnswerId,
            },
            Fragment.empty,
          )
          main.dispatch(main.state.tr.replaceSelectionWith(newOption))
        }
      }
    })
  }

  var removeAnswer = function removeAnswer() {
    main.state.doc.descendants(function (sinlgeNode, pos) {
      if (sinlgeNode.attrs.id === node.attrs.id) {
        main.dispatch(main.state.tr.deleteRange(pos, pos + sinlgeNode.nodeSize))
      }
    })
  }

  var answer = node.attrs.options.find(function (option) {
    return option.value === node.attrs.answer
  })
  var correct = node.attrs.options.find(function (option) {
    return option.value === node.attrs.correct
  })
  var isCorrect = node.attrs.correct === node.attrs.answer
  return /*#__PURE__*/ React.createElement(
    Option,
    null,
    !readOnly &&
      /*#__PURE__*/ React.createElement(
        ButtonsContainer,
        null,
        /*#__PURE__*/ React.createElement(
          ActionButton$3,
          {
            'aria-label': 'add new option',
            onClick: addAnswer,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$2, {
            name: 'plusSquare',
          }),
        ),
        !node.attrs.isfirst &&
          /*#__PURE__*/ React.createElement(
            ActionButton$3,
            {
              'aria-label': 'delete this option',
              onClick: removeAnswer,
              type: 'button',
            },
            /*#__PURE__*/ React.createElement(StyledIconAction$2, {
              name: 'deleteOutlined',
            }),
          ),
      ),
    /*#__PURE__*/ React.createElement(EditorComponent$1, {
      getPos: getPos,
      node: node,
      view: view,
    }),
    /*#__PURE__*/ React.createElement(
      DropDownContainer,
      null,
      (!readOnly || (readOnly && !testMode && !showFeedBack)) &&
        /*#__PURE__*/ React.createElement(DropComponent, {
          getPos: getPos,
          node: node,
          uniqueId: v4(),
          view: view,
        }),
      readOnly &&
        testMode &&
        !showFeedBack &&
        /*#__PURE__*/ React.createElement(TestModeDropDownComponent, {
          getPos: getPos,
          node: node,
          uniqueId: v4(),
          view: view,
        }),
      readOnly &&
        showFeedBack &&
        /*#__PURE__*/ React.createElement(
          AnswerContainer,
          null,
          /*#__PURE__*/ React.createElement(
            CorrectAnswer,
            null,
            'Correct : \xA0',
            correct &&
              /*#__PURE__*/ React.createElement(
                'span',
                null,
                correct.label,
                ' ',
              ),
          ),
          /*#__PURE__*/ React.createElement(
            Answer,
            {
              $isCorrect: isCorrect,
            },
            'Answer : \xA0',
            answer &&
              /*#__PURE__*/ React.createElement(
                'span',
                null,
                answer.label,
                ' ',
              ),
          ),
        ),
    ),
  )
}

var MatchingService = /*#__PURE__*/ (function (_Service) {
  _inherits(MatchingService, _Service)

  var _super = _createSuper(MatchingService)

  function MatchingService() {
    var _this

    _classCallCheck(this, MatchingService)

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))
    _this.name = 'MatchingService'
    return _this
  }

  _createClass(MatchingService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('MatchingQuestion').to(MatchingQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          matching_container: matchingContainerNode,
        })
        createNode({
          matching_option: matchingOptionNode,
        })
        addPortal({
          nodeView: MatchingContainerNodeView,
          component: MatchingContainerComponent,
          context: this.app,
        })
        addPortal({
          nodeView: MatchingOptionNodeView,
          component: MatchingOptionComponent,
          context: this.app,
        })
      },
    },
  ])

  return MatchingService
})(Service)

var _dec$5, _class$5, _temp$5
var MultipleDropDownQuestion =
  ((_dec$5 = injectable()),
  _dec$5(
    (_class$5 =
      ((_temp$5 = /*#__PURE__*/ (function (_Tools) {
        _inherits(MultipleDropDownQuestion, _Tools)

        var _super = _createSuper(MultipleDropDownQuestion)

        function MultipleDropDownQuestion() {
          var _this

          _classCallCheck(this, MultipleDropDownQuestion)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Add Multiple Drop Down Question'
          _this.icon = 'mulitpleDropDownQuestion'
          _this.name = 'Multiple Drop Down'

          _this.select = function (state, activeViewId, activeView) {
            var _activeView$props$dis = activeView.props.disallowedTools,
              disallowedTools =
                _activeView$props$dis === void 0 ? [] : _activeView$props$dis
            var status = true
            var _state$selection = state.selection,
              from = _state$selection.from,
              to = _state$selection.to
            if (from === null || disallowedTools.includes('MultipleDropDown'))
              return false
            state.doc.nodesBetween(from, to, function (node, pos) {
              if (node.type.groups.includes('questions')) {
                status = false
              }
            })
            return status
          }

          return _this
        }

        _createClass(MultipleDropDownQuestion, [
          {
            key: 'run',
            get: function get() {
              return function (main) {
                var dispatch = main.dispatch
                var state = main.state
                helpers.checkifEmpty(main)
                var _main$state$selection = main.state.selection,
                  $from = _main$state$selection.$from,
                  $to = _main$state$selection.$to
                var range = $from.blockRange($to)
                var tr = main.state.tr
                var wrapping =
                  range &&
                  findWrapping(
                    range,
                    state.config.schema.nodes.multiple_drop_down_container,
                    {
                      id: v4(),
                    },
                  )
                if (!wrapping) return false
                tr.wrap(range, wrapping)
                dispatch(tr)
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {
                if (
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.multiple_drop_down_container,
                  )
                ) {
                  return true
                }

                return false
              }
            },
          },
          {
            key: 'enable',
            get: function get() {
              return function (state) {}
            },
          },
        ])

        return MultipleDropDownQuestion
      })(Tools)),
      _temp$5)),
  ) || _class$5)

var MultipleDropDownContainerNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
  _inherits(MultipleDropDownContainerNodeView, _QuestionsNodeView)

  var _super = _createSuper(MultipleDropDownContainerNodeView)

  function MultipleDropDownContainerNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, MultipleDropDownContainerNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    MultipleDropDownContainerNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            event.target.type === 'textarea' ||
            event.target.type === 'text' ||
            !event.target.type
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'multiple_drop_down_container'
        },
      },
    ],
  )

  return MultipleDropDownContainerNodeView
})(QuestionsNodeView)

var multipleDropDownContainerNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'multiple-drop-down-container',
    },
    feedback: {
      default: '',
    },
  },
  group: 'block questions',
  isolating: true,
  // content: 'paragraph* bulletlist* orderedlist*',
  content: 'block*',
  parseDOM: [
    {
      tag: 'div.multiple-drop-down-container',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          feedback: dom.getAttribute('feedback'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var _dec$6, _class$6, _temp$6
var CreateDropDown =
  ((_dec$6 = injectable()),
  _dec$6(
    (_class$6 =
      ((_temp$6 = /*#__PURE__*/ (function (_Tools) {
        _inherits(CreateDropDown, _Tools)

        var _super = _createSuper(CreateDropDown)

        function CreateDropDown() {
          var _this

          _classCallCheck(this, CreateDropDown)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Create Drop Down'
          _this.icon = 'mulitpleDropDown'
          _this.name = 'Create_Drop_Down'
          _this.label = 'Insert answer options'

          _this.select = function (state, activeViewId, activeView) {
            if (
              activeView.props.type &&
              activeView.props.type === 'MultipleDropDownContainer'
            )
              return true
            return false
          }

          return _this
        }

        _createClass(CreateDropDown, [
          {
            key: 'run',
            get: function get() {
              return function (state, dispatch) {
                var content = Fragment.empty
                var tr = state.tr
                var createGap =
                  state.config.schema.nodes.multiple_drop_down_option.create(
                    {
                      id: v4(),
                      options: [],
                    },
                    content,
                  )
                tr.replaceSelectionWith(createGap)
                var resolvedPos = tr.doc.resolve(
                  tr.selection.anchor -
                    tr.selection.$anchor.nodeBefore.nodeSize,
                )
                tr.setSelection(new NodeSelection(resolvedPos))
                dispatch(tr)
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {}
            },
          },
          {
            key: 'enable',
            get: function get() {
              return function (state) {}
            },
          },
        ])

        return CreateDropDown
      })(Tools)),
      _temp$6)),
  ) || _class$6)

var multipleDropDownOptionNode = {
  attrs: {
    class: {
      default: 'multiple-drop-down-option',
    },
    id: {
      default: '',
    },
    options: {
      default: [],
    },
    correct: {
      default: '',
    },
    answer: {
      default: '',
    },
  },
  group: 'inline questions',
  inline: true,
  defining: true,
  parseDOM: [
    {
      tag: 'span.multiple-drop-down-option',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          options: JSON.parse(dom.getAttribute('options')),
          correct: dom.getAttribute('correct'),
          answer: dom.getAttribute('answer'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return [
      'span',
      {
        id: node.attrs.id,
        class: node.attrs['class'],
        options: JSON.stringify(node.attrs.options),
        correct: node.attrs.correct,
        answer: node.attrs.answer,
      },
    ]
  },
}

var MultipleDropDownNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(MultipleDropDownNodeView, _QuestionsNodeView)

  var _super = _createSuper(MultipleDropDownNodeView)

  function MultipleDropDownNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, MultipleDropDownNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    MultipleDropDownNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (event.target.type === 'text') {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'multiple_drop_down_option'
        },
      },
    ],
  )

  return MultipleDropDownNodeView
})(QuestionsNodeView)

function _templateObject4$6() {
  var data = _taggedTemplateLiteral([
    '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n',
  ])

  _templateObject4$6 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$8() {
  var data = _taggedTemplateLiteral([
    '\n  visibility: ',
    ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 35px auto auto;\n  position: absolute;\n  width: 170px;\n  max-height: 150px;\n  overflow-y: auto;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
  ])

  _templateObject3$8 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$9() {
  var data = _taggedTemplateLiteral([
    '\n  background: #fff;\n  border: 1px solid rgb(204, 204, 204);\n  color: #000;\n  cursor: ',
    ';\n  display: inline-flex;\n  opacity: ',
    ';\n  padding: 8px 4px 4px 4px;\n  position: relative;\n  width: 165px;\n\n  span {\n    position: relative;\n    top: 2px;\n  }\n  &focus {\n    outline: 0;\n  }\n',
  ])

  _templateObject2$9 = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$f() {
  var data = _taggedTemplateLiteral(['\n  display: inline-flex;\n'])

  _templateObject$f = function _templateObject() {
    return data
  }

  return data
}
var Wrapper$2 = styled.div(_templateObject$f())
var DropDownButton$2 = styled.button(
  _templateObject2$9(),
  function (props) {
    return props.$disabled ? 'not-allowed' : 'pointer'
  },
  function (props) {
    return props.$disabled ? '0.4' : '1'
  },
)
var DropDownMenu$2 = styled.div(_templateObject3$8(), function (props) {
  return props.$isOpen ? 'visible' : 'hidden'
})
var StyledIcon$2 = styled(Icon)(_templateObject4$6())

var DropComponent$1 = function DropComponent(_ref) {
  var node = _ref.node,
    uniqueId = _ref.uniqueId

  var _useState = useState(undefined),
    _useState2 = _slicedToArray(_useState, 2),
    selectedOption = _useState2[0],
    setSelectedOption = _useState2[1]

  var itemRefs = useRef([])
  var wrapperRef = useRef()

  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isOpen = _useState4[0],
    setIsOpen = _useState4[1]

  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var testMode = customProps.testMode
  var isDisabled = false
  if (node.attrs.options.length === 0 || !testMode) isDisabled = true
  useEffect(function () {
    var currentOption = node.attrs.options.filter(function (option) {
      return option.value === node.attrs.correct
    })
    if (!testMode && currentOption[0]) setSelectedOption(currentOption[0].value)
  }, [])

  var onChange = function onChange(option) {
    var allNodes = getNodes$7(main)
    var tr = main.state.tr
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        tr.setNodeMarkup(
          singleNode.pos,
          undefined,
          _objectSpread2(
            _objectSpread2({}, singleNode.node.attrs),
            {},
            {
              answer: option.value,
            },
          ),
        )
      }
    })
    main.dispatch(tr)
    openCloseMenu()
    setSelectedOption(option.value)
  }

  useOnClickOutside(wrapperRef, function () {
    return setIsOpen(false)
  })

  var _onKeyDown = function onKeyDown(e, index) {
    e.preventDefault()

    if (e.keyCode === 40) {
      // arrow down
      if (index === itemRefs.current.length - 1) {
        itemRefs.current[0].current.focus()
      } else {
        itemRefs.current[index + 1].current.focus()
      }
    } // arrow up

    if (e.keyCode === 38) {
      if (
        index === 0 &&
        itemRefs.current[itemRefs.current.length - 1].current
      ) {
        itemRefs.current[itemRefs.current.length - 1].current.focus()
      } else {
        itemRefs.current[index - 1].current.focus()
      }
    } // enter

    if (e.keyCode === 13) {
      itemRefs.current[index].current.click()
    } // ESC

    if (e.keyCode === 27) {
      setIsOpen(false)
    }
  }

  var openCloseMenu = function openCloseMenu() {
    if (!isDisabled) setIsOpen(!isOpen)
  }

  var MultipleDropDown = useMemo(
    function () {
      var selectedValue

      if (selectedOption) {
        selectedValue = node.attrs.options.filter(function (option) {
          return option.value === selectedOption
        })
      }

      return /*#__PURE__*/ React.createElement(
        Wrapper$2,
        {
          disabled: isDisabled,
          ref: wrapperRef,
        },
        /*#__PURE__*/ React.createElement(
          DropDownButton$2,
          {
            $disabled: isDisabled,
            'aria-controls': uniqueId,
            'aria-expanded': isOpen,
            'aria-haspopup': true,
            onKeyDown: function onKeyDown(e) {
              if (e.keyCode === 40) {
                if (!itemRefs.current[0].current) return
                itemRefs.current[0].current.focus()
              }

              if (e.keyCode === 27) {
                setIsOpen(false)
              }

              if (e.keyCode === 13 || e.keyCode === 32) {
                setIsOpen(true)
              }
            },
            onMouseDown: openCloseMenu,
            role: 'combobox',
            type: 'button',
          },
          selectedOption === null || !selectedOption
            ? 'Select Option'
            : selectedValue[0].label,
          /*#__PURE__*/ React.createElement(StyledIcon$2, {
            name: 'expand',
          }),
        ),
        /*#__PURE__*/ React.createElement(
          DropDownMenu$2,
          {
            $isOpen: isOpen,
            'aria-label': 'Choose an option',
            id: uniqueId,
            role: 'listbox',
          },
          node.attrs.options.map(function (option, index) {
            itemRefs.current[index] = itemRefs.current[index] || createRef()
            return /*#__PURE__*/ React.createElement(
              'span',
              {
                'aria-selected': option.value === selectedOption,
                key: option.value,
                onClick: function onClick() {
                  return onChange(option)
                },
                onKeyDown: function onKeyDown(e) {
                  return _onKeyDown(e, index)
                },
                ref: itemRefs.current[index],
                role: 'option',
                tabIndex: '-1',
              },
              option.label,
            )
          }),
        ),
      )
    },
    [node.attrs.options, selectedOption, isOpen],
  )
  return MultipleDropDown
}

var getNodes$7 = function getNodes(view) {
  return DocumentHelpers.findInlineNodes(view.state.doc)
}

function _templateObject7$3() {
  var data = _taggedTemplateLiteral([''])

  _templateObject7$3 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$3() {
  var data = _taggedTemplateLiteral([''])

  _templateObject6$3 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$3() {
  var data = _taggedTemplateLiteral([
    '\n  display: inline-block;\n  border-bottom: ',
    ';\n  border-top: ',
    ';\n  border-radius: 192px;\n  padding: 2px 4px 2px 4px;\n',
  ])

  _templateObject5$3 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$7() {
  var data = _taggedTemplateLiteral(['\n  ', '\n'])

  _templateObject4$7 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$9() {
  var data = _taggedTemplateLiteral([
    '\n  display: inline-block;\n  height: 24px;\n  width: 24px;\n  cursor: pointer;\n  ',
    '\n',
  ])

  _templateObject3$9 = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$a() {
  var data = _taggedTemplateLiteral(['\n  fill: white !important;\n'])

  _templateObject2$a = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$g() {
  var data = _taggedTemplateLiteral([
    '\n  background: #535e76;\n  border-radius: 2px;\n',
  ])

  _templateObject$g = function _templateObject() {
    return data
  }

  return data
}
var activeStylesContainer = css(_templateObject$g())
var activeStylesSvg = css(_templateObject2$a())
var StyledIconActionContainer = styled.span(
  _templateObject3$9(),
  function (props) {
    return props.$isActive && activeStylesContainer
  },
)
var StyledIconAction$3 = styled(Icon)(_templateObject4$7(), function (props) {
  return props.$isActive && activeStylesSvg
})
var AnswerContainer$1 = styled.div(
  _templateObject5$3(),
  function (props) {
    return props.$isCorrect ? '1px solid #008000;' : '1px solid #FF3030'
  },
  function (props) {
    return props.$isCorrect ? '1px solid #008000;' : '1px solid #FF3030'
  },
)
var CorrectAnswer$1 = styled.span(_templateObject6$3())
var Answer$1 = styled.span(_templateObject7$3())
var MultipleDropDownComponent = function (_ref) {
  var node = _ref.node,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main,
    pmViews = context.pmViews,
    activeViewId = context.activeViewId

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isActive = _useState2[0],
    setIsActive = _useState2[1]

  var customProps = main.props.customValues
  var posFrom = pmViews[activeViewId].state.selection.from
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var readOnly = !isEditable
  useEffect(
    function () {
      setIsActive(false)

      if (getPos() === posFrom) {
        setIsActive(true)
      }
    },
    [posFrom],
  )

  if (!readOnly) {
    return /*#__PURE__*/ React.createElement(
      StyledIconActionContainer,
      {
        $isActive: isActive,
      },
      /*#__PURE__*/ React.createElement(StyledIconAction$3, {
        $isActive: isActive,
        name: 'mulitpleDropDown',
      }),
    )
  }

  if (!(readOnly && customProps && !customProps.showFeedBack)) {
    var answer = node.attrs.options.find(function (option) {
      return option.value === node.attrs.answer
    })
    var correct = node.attrs.options.find(function (option) {
      return option.value === node.attrs.correct
    })
    var isCorrect = node.attrs.correct === node.attrs.answer
    return /*#__PURE__*/ React.createElement(
      AnswerContainer$1,
      {
        $isCorrect: isCorrect,
      },
      'Correct:',
      correct &&
        /*#__PURE__*/ React.createElement(
          CorrectAnswer$1,
          null,
          ' ',
          correct.label,
          ' | \xA0',
        ),
      'Answer: ',
      answer &&
        /*#__PURE__*/ React.createElement(Answer$1, null, ' ', answer.label),
    )
  }

  return /*#__PURE__*/ React.createElement(DropComponent$1, {
    getPos: getPos,
    node: node,
    uniqueId: v4(),
  })
}

function _templateObject2$b() {
  var data = _taggedTemplateLiteral([
    "\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 15px;\n  width: 15px;\n  background-color: #eee;\n  border-radius: 50%;\n\n  &:after {\n    content: '';\n    position: absolute;\n    display: none;\n  }\n",
  ])

  _templateObject2$b = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$h() {
  var data = _taggedTemplateLiteral([
    '\n  display: block;\n  position: relative;\n  padding-left: 20px;\n  margin-bottom: 5px;\n  cursor: pointer;\n  user-select: none;\n\n  input {\n    position: absolute;\n    opacity: 0;\n    cursor: pointer;\n    height: 0;\n    width: 0;\n  }\n\n  &:hover input ~ span {\n    background-color: #ccc;\n  }\n\n  input:checked ~ span {\n    background-color: #535e76;\n  }\n\n  input:checked ~ .span:after {\n    display: block;\n  }\n\n  span:after {\n    top: 9px;\n    left: 9px;\n    width: 8px;\n    height: 8px;\n    border-radius: 50%;\n    background: white;\n  }\n',
  ])

  _templateObject$h = function _templateObject() {
    return data
  }

  return data
}
var CheckContainer = styled.label(_templateObject$h())
var RadioBtn = styled.span(_templateObject2$b())
var RadioButton = function (_ref) {
  var item = _ref.item,
    node = _ref.node
  var context = useContext(WaxContext)
  var activeView = context.activeView

  var _useState = useState(node.node.attrs.correct),
    _useState2 = _slicedToArray(_useState, 2),
    correctOption = _useState2[0],
    setCorrectOption = _useState2[1]

  var onChange = function onChange() {
    var tr = activeView.state.tr
    setCorrectOption(item.value)
    tr.setNodeMarkup(
      node.from,
      undefined,
      _objectSpread2(
        _objectSpread2({}, node.node.attrs),
        {},
        {
          correct: item.value,
        },
      ),
    )
    var resolvedPos = tr.doc.resolve(node.from)
    tr.setSelection(new NodeSelection(resolvedPos))
    activeView.dispatch(tr.setMeta('reject', true))
  }

  return /*#__PURE__*/ React.createElement(
    CheckContainer,
    null,
    item.label,
    /*#__PURE__*/ React.createElement('input', {
      checked: correctOption === item.value,
      name: 'radio',
      onChange: onChange,
      type: 'radio',
    }),
    /*#__PURE__*/ React.createElement(RadioBtn, null),
  )
}

function _templateObject6$4() {
  var data = _taggedTemplateLiteral([
    '\n  cursor: pointer;\n  position: relative;\n  top: 2px;\n  left: 6px;\n  height: 16px;\n  width: 16px;\n',
  ])

  _templateObject6$4 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$4() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  margin-top: auto;\n  input {\n    border: none;\n    border-bottom: 1px solid black;\n    width: 160px;\n    &:focus {\n      outline: none;\n    }\n\n    ::placeholder {\n      color: rgb(170, 170, 170);\n      font-style: italic;\n      font-size: 10px;\n    }\n  }\n  button {\n    border: 1px solid #535e76;\n    cursor: pointer;\n    color: #535e76;\n    margin-left: 20px;\n    background: #fff;\n    padding: 4px 8px 4px 8px;\n    &:hover {\n      border: 1px solid #535e76;\n      cursor: pointer;\n      color: #535e76;\n      margin-right: 10px;\n      background: #fff;\n      background: #535e76;\n      color: #fff;\n      padding: 4px 8px 4px 8px;\n    }\n  }\n',
  ])

  _templateObject5$4 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$8() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  width: 96%;\n',
  ])

  _templateObject4$8 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$a() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  height: 100px;\n  font-size: 11px;\n  overflow-y: auto;\n',
  ])

  _templateObject3$a = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$c() {
  var data = _taggedTemplateLiteral([
    '\n  width: 174px;\n  height: 150px;\n  background: white;\n  border: 1px solid #535e76;\n  display: flex;\n  flex-direction: column;\n  padding: 5px;\n',
  ])

  _templateObject2$c = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$i() {
  var data = _taggedTemplateLiteral([
    '\n  width: 0;\n  height: 0;\n  margin: 0px auto;\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-bottom: 10px solid #535e76;\n',
  ])

  _templateObject$i = function _templateObject() {
    return data
  }

  return data
}
var TriangleTop = styled.div(_templateObject$i())
var DropDownComponent = styled.div(_templateObject2$c())
var Options = styled.div(_templateObject3$a())
var Option$1 = styled.div(_templateObject4$8())
var AddOption$1 = styled.div(_templateObject5$4())
var IconRemove = styled(Icon)(_templateObject6$4())
var previousNode = ''
var DropDownComponent$1 = function (_ref) {
  var setPosition = _ref.setPosition,
    position = _ref.position
  var context = useContext(WaxContext)
  var activeView = context.activeView,
    main = context.pmViews.main
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var currentNode = position.node
  var currentOptions = currentNode.node.attrs.options
  var readOnly = !isEditable

  var _useState = useState(currentOptions),
    _useState2 = _slicedToArray(_useState, 2),
    options = _useState2[0],
    setOptions = _useState2[1]

  var _useState3 = useState(''),
    _useState4 = _slicedToArray(_useState3, 2),
    optionText = _useState4[0],
    setOptionText = _useState4[1]

  var addOptionRef = useRef(null)
  useLayoutEffect(
    function () {
      var selection = activeView.state.selection
      var from = selection.from
      var WaxSurface = activeView.dom.getBoundingClientRect()
      var start = activeView.coordsAtPos(from)
      var left = start.left - WaxSurface.left - 75
      var top = start.top - WaxSurface.top + 25
      setPosition(
        _objectSpread2(
          _objectSpread2({}, position),
          {},
          {
            left: left,
            top: top,
          },
        ),
      )
    },
    [position.left],
  )
  useEffect(
    function () {
      if (addOptionRef.current) addOptionRef.current.focus()
      if (!activeView.state.selection.node) return
      var tr = activeView.state.tr

      if (previousNode.from !== currentNode.from) {
        tr.setNodeMarkup(
          position.from,
          undefined,
          _objectSpread2(
            _objectSpread2({}, currentNode.node.attrs),
            {},
            {
              options: currentNode.node.attrs.options,
            },
          ),
        )
        setOptions(currentNode.node.attrs.options)
      } else {
        tr.setNodeMarkup(
          position.from,
          undefined,
          _objectSpread2(
            _objectSpread2({}, currentNode.node.attrs),
            {},
            {
              options: options,
            },
          ),
        )
      }

      previousNode = currentNode
      var resolvedPos = tr.doc.resolve(position.from)
      tr.setSelection(new NodeSelection(resolvedPos))
      activeView.dispatch(tr.setMeta('reject', true))
    },
    [options, position.from],
  )

  var updateOptionText = function updateOptionText() {
    setOptionText(addOptionRef.current.value)
  }

  var handleKeyDown = function handleKeyDown(event) {
    if (event.key === 'Enter' || event.which === 13) {
      addOption()
    }
  }

  var addOption = function addOption() {
    if (addOptionRef.current.value.trim() === '') return
    var obj = {
      label: addOptionRef.current.value,
      value: v4(),
    }
    setOptions(function (prevOptions) {
      return [].concat(_toConsumableArray(prevOptions), [obj])
    })
    setOptionText('')
    addOptionRef.current.focus()
  }

  var removeOption = function removeOption(id) {
    setOptions(
      options.filter(function (option) {
        return option.value !== id
      }),
    )
    setOptionText('')
  }

  if (!readOnly) {
    return /*#__PURE__*/ React.createElement(
      React.Fragment,
      null,
      /*#__PURE__*/ React.createElement(TriangleTop, null),
      /*#__PURE__*/ React.createElement(
        DropDownComponent,
        null,
        /*#__PURE__*/ React.createElement(
          Options,
          null,
          options.map(function (value) {
            return /*#__PURE__*/ React.createElement(
              Option$1,
              {
                key: v4(),
              },
              /*#__PURE__*/ React.createElement(RadioButton, {
                item: value,
                node: currentNode,
              }),
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  'aria-hidden': 'true',
                  onClick: function onClick() {
                    return removeOption(value.value)
                  },
                  role: 'button',
                  style: {
                    marginLeft: 'auto',
                  },
                },
                /*#__PURE__*/ React.createElement(IconRemove, {
                  name: 'deleteOutlined',
                }),
              ),
            )
          }),
        ),
        /*#__PURE__*/ React.createElement(
          AddOption$1,
          null,
          /*#__PURE__*/ React.createElement('input', {
            onChange: updateOptionText,
            onKeyPress: handleKeyDown,
            placeholder: 'Type an option and press enter...',
            ref: addOptionRef,
            type: 'text',
            value: optionText,
          }),
        ),
      ),
    )
  }

  return null
}

var _dec$7, _class$7, _temp$7
var MultipleDropDown =
  ((_dec$7 = injectable()),
  _dec$7(
    (_class$7 =
      ((_temp$7 = /*#__PURE__*/ (function (_ToolGroup) {
        _inherits(MultipleDropDown, _ToolGroup)

        var _super = _createSuper(MultipleDropDown)

        function MultipleDropDown(CreateDropDown) {
          var _this

          _classCallCheck(this, MultipleDropDown)

          _this = _super.call(this)
          _this.tools = []
          _this.tools = [CreateDropDown]
          return _this
        }

        MultipleDropDown =
          inject('CreateDropDown')(MultipleDropDown, undefined, 0) ||
          MultipleDropDown
        return MultipleDropDown
      })(ToolGroup)),
      _temp$7)),
  ) || _class$7)

var MultipleDropDownToolGroupService = /*#__PURE__*/ (function (_Service) {
  _inherits(MultipleDropDownToolGroupService, _Service)

  var _super = _createSuper(MultipleDropDownToolGroupService)

  function MultipleDropDownToolGroupService() {
    _classCallCheck(this, MultipleDropDownToolGroupService)

    return _super.apply(this, arguments)
  }

  _createClass(MultipleDropDownToolGroupService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('MultipleDropDown').to(MultipleDropDown)
      },
    },
  ])

  return MultipleDropDownToolGroupService
})(Service)

var CreateDropDownService = /*#__PURE__*/ (function (_Service) {
  _inherits(CreateDropDownService, _Service)

  var _super = _createSuper(CreateDropDownService)

  function CreateDropDownService() {
    var _this

    _classCallCheck(this, CreateDropDownService)

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))
    _this.name = 'CreateDropDownService'
    _this.dependencies = [new MultipleDropDownToolGroupService()]
    return _this
  }

  _createClass(CreateDropDownService, [
    {
      key: 'boot',
      value: function boot() {
        var createOverlay = this.container.get('CreateOverlay')
        createOverlay(
          DropDownComponent$1,
          {},
          {
            nodeType: 'multiple_drop_down_option',
            markType: '',
            followCursor: true,
            selection: false,
          },
        )
      },
    },
    {
      key: 'register',
      value: function register() {
        var CreateNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        this.container.bind('CreateDropDown').to(CreateDropDown)
        CreateNode({
          multiple_drop_down_option: multipleDropDownOptionNode,
        })
        addPortal({
          nodeView: MultipleDropDownNodeView,
          component: MultipleDropDownComponent,
          context: this.app,
        })
      },
    },
  ])

  return CreateDropDownService
})(Service)

function _templateObject$j() {
  var data = _taggedTemplateLiteral([
    "\n  position: relative;\n  height: 100%;\n\n  > .ProseMirror {\n    padding: 5px !important;\n    &:focus {\n      outline: none;\n    }\n\n    img[class='ProseMirror-separator'] {\n      display: inline !important;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n",
  ])

  _templateObject$j = function _templateObject() {
    return data
  }

  return data
}
var EditorWrapper$7 = styled.div(_templateObject$j())

var WaxOverlays$1 = function WaxOverlays() {
  return true
}

var ContainerEditor$2 = function ContainerEditor(_ref) {
  var _node$attrs

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var editorRef = useRef()

  var _useContext = useContext(ApplicationContext),
    app = _useContext.app

  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var multipleDropDownContainerNodeView
  var questionId =
    node === null || node === void 0
      ? void 0
      : (_node$attrs = node.attrs) === null || _node$attrs === void 0
      ? void 0
      : _node$attrs.id
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var finalPlugins = [FakeCursorPlugin()]

  var createKeyBindings = function createKeyBindings() {
    var keys = getKeys()
    Object.keys(baseKeymap).forEach(function (key) {
      if (keys[key]) {
        keys[key] = chainCommands(keys[key], baseKeymap[key])
      } else {
        keys[key] = baseKeymap[key]
      }
    })
    return keys
  }

  var pressEnter = function pressEnter(state, dispatch) {
    if (state.selection.node && state.selection.node.type.name === 'image') {
      var _state$selection = state.selection,
        $from = _state$selection.$from,
        to = _state$selection.to
      var same = $from.sharedDepth(to)
      var pos = $from.before(same)
      dispatch(state.tr.setSelection(NodeSelection.create(state.doc, pos)))
      return true
    } // LISTS

    if (splitListItem(state.schema.nodes.list_item)(state)) {
      splitListItem(state.schema.nodes.list_item)(state, dispatch)
      return true
    }

    return false
  }

  var getKeys = function getKeys() {
    return {
      'Mod-z': function ModZ() {
        return undo(view.state, view.dispatch)
      },
      'Mod-y': function ModY() {
        return redo(view.state, view.dispatch)
      },
      'Mod-[': liftListItem(view.state.schema.nodes.list_item),
      'Mod-]': sinkListItem(view.state.schema.nodes.list_item),
      //   Enter: () =>
      //     splitListItem(questionView.state.schema.nodes.list_item)(
      //       questionView.state,
      //       questionView.dispatch,
      //     ),
      Enter: pressEnter,
    }
  }

  var filteredplugins = app.PmPlugins.getAll().filter(function (plugin) {
    return (
      !plugin.key.includes('y-sync') &&
      !plugin.key.includes('y-undo') &&
      !plugin.key.includes('yjs') &&
      !plugin.key.includes('comment')
    )
  })
  var plugins = [keymap(createKeyBindings())].concat(
    _toConsumableArray(filteredplugins),
  )
  finalPlugins = finalPlugins.concat(_toConsumableArray(plugins))
  useEffect(function () {
    WaxOverlays$1 = ComponentPlugin('waxOverlays')
    multipleDropDownContainerNodeView = new EditorView(
      {
        mount: editorRef.current,
      },
      {
        editable: function editable() {
          return isEditable
        },
        state: EditorState.create({
          doc: node,
          plugins: finalPlugins,
        }),
        dispatchTransaction: dispatchTransaction,
        disallowedTools: ['Images', 'FillTheGap', 'MultipleChoice'],
        type: 'MultipleDropDownContainer',
        handleDOMEvents: {
          mousedown: function mousedown() {
            main.dispatch(
              main.state.tr
                .setMeta('outsideView', questionId)
                .setSelection(
                  new TextSelection(
                    main.state.tr.doc.resolve(
                      getPos() + context.pmViews[questionId].state.selection.to,
                    ),
                  ),
                ),
            )
            context.updateView({}, questionId)
            if (multipleDropDownContainerNodeView.hasFocus())
              multipleDropDownContainerNodeView.focus()
          },
        },
        attributes: {
          spellcheck: 'false',
        },
      },
    ) // Set Each note into Wax's Context

    context.updateView(
      _defineProperty({}, questionId, multipleDropDownContainerNodeView),
      questionId,
    )
    multipleDropDownContainerNodeView.focus()
  }, [])

  var dispatchTransaction = function dispatchTransaction(tr) {
    var _multipleDropDownCont =
        multipleDropDownContainerNodeView.state.applyTransaction(tr),
      state = _multipleDropDownCont.state,
      transactions = _multipleDropDownCont.transactions

    multipleDropDownContainerNodeView.updateState(state)
    context.updateView({}, questionId)

    if (!tr.getMeta('fromOutside')) {
      var outerTr = view.state.tr
      var offsetMap = StepMap.offset(getPos() + 1)

      for (var i = 0; i < transactions.length; i++) {
        var steps = transactions[i].steps

        for (var j = 0; j < steps.length; j++) {
          outerTr.step(steps[j].map(offsetMap))
        }
      }

      if (outerTr.docChanged) {
        var history = true
        if (tr.getMeta('reject')) history = false
        view.dispatch(
          outerTr
            .setMeta('outsideView', questionId)
            .setMeta('addToHistory', history),
        )
      }
    }
  }

  return /*#__PURE__*/ React.createElement(
    EditorWrapper$7,
    null,
    /*#__PURE__*/ React.createElement('div', {
      ref: editorRef,
    }),
    /*#__PURE__*/ React.createElement(WaxOverlays$1, {
      activeViewId: questionId,
      group: 'questions',
    }),
  )
}

function _templateObject5$5() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject5$5 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$9() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n  border: none;\n  position: relative;\n  bottom: 14px;\n  left: -11px;\n  float: right;\n',
  ])

  _templateObject4$9 = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$b() {
  var data = _taggedTemplateLiteral([
    '\n  border: 3px solid #f5f5f7;\n  margin-bottom: 30px;\n',
  ])

  _templateObject3$b = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$d() {
  var data = _taggedTemplateLiteral([
    '\n  border: 3px solid #f5f5f7;\n  border-bottom: none;\n\n  span {\n    position: relative;\n    top: 3px;\n  }\n',
  ])

  _templateObject2$d = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$k() {
  var data = _taggedTemplateLiteral([
    '\n  margin: 0px 38px 15px 38px;\n  margin-top: 10px;\n',
  ])

  _templateObject$k = function _templateObject() {
    return data
  }

  return data
}
var MultipleDropDownpWrapper = styled.div(_templateObject$k())
var MultipleDropDownContainerTool = styled.div(_templateObject2$d())
var MultipleDropDownpContainer = styled.div(_templateObject3$b())
var ActionButton$4 = styled.button(_templateObject4$9())
var StyledIconActionRemove$3 = styled(Icon)(_templateObject5$5())
var MultipleDropDownContainerComponent = function (_ref) {
  var _getUpdatedNode

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var MultipleDropDown = ComponentPlugin('MultipleDropDown')
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var readOnly = !isEditable
  var testMode = customProps.testMode
  var feedback = node.attrs.feedback

  var removeQuestion = function removeQuestion() {
    var allNodes = getNodes$8(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr['delete'](
            singleNode.pos,
            singleNode.pos + singleNode.node.nodeSize,
          ),
        )
      }
    })
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$8(context.pmViews.main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  return /*#__PURE__*/ React.createElement(
    MultipleDropDownpWrapper,
    null,
    /*#__PURE__*/ React.createElement(
      'div',
      null,
      !testMode &&
        !readOnly &&
        /*#__PURE__*/ React.createElement(
          MultipleDropDownContainerTool,
          null,
          /*#__PURE__*/ React.createElement(MultipleDropDown, null),
          /*#__PURE__*/ React.createElement(
            ActionButton$4,
            {
              'aria-label': 'delete this question',
              onClick: removeQuestion,
              type: 'button',
            },
            /*#__PURE__*/ React.createElement(StyledIconActionRemove$3, {
              name: 'deleteOutlinedQuestion',
            }),
          ),
        ),
    ),
    /*#__PURE__*/ React.createElement(
      MultipleDropDownpContainer,
      {
        className: 'multiple-drop-down',
      },
      /*#__PURE__*/ React.createElement(ContainerEditor$2, {
        getPos: getPos,
        node: node,
        view: view,
      }),
      !testMode &&
        !(readOnly && feedback === '') &&
        /*#__PURE__*/ React.createElement(FeedbackComponent, {
          getPos: getPos,
          node:
            (_getUpdatedNode = getUpdatedNode()) === null ||
            _getUpdatedNode === void 0
              ? void 0
              : _getUpdatedNode.node,
          readOnly: readOnly,
          view: view,
        }),
    ),
  )
}

var getNodes$8 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleDropContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'multiple_drop_down_container') {
      multipleDropContainerNodes.push(node)
    }
  })
  return multipleDropContainerNodes
}

var MultipleDropDownService = /*#__PURE__*/ (function (_Service) {
  _inherits(MultipleDropDownService, _Service)

  var _super = _createSuper(MultipleDropDownService)

  function MultipleDropDownService() {
    var _this

    _classCallCheck(this, MultipleDropDownService)

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))
    _this.name = 'MultipleDropDownService'
    _this.dependencies = [new CreateDropDownService()]
    return _this
  }

  _createClass(MultipleDropDownService, [
    {
      key: 'register',
      value: function register() {
        this.container
          .bind('MultipleDropDownQuestion')
          .to(MultipleDropDownQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          multiple_drop_down_container: multipleDropDownContainerNode,
        })
        addPortal({
          nodeView: MultipleDropDownContainerNodeView,
          component: MultipleDropDownContainerComponent,
          context: this.app,
        })
      },
    },
  ])

  return MultipleDropDownService
})(Service)

var NumericalAnswerContainerNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'numerical-answer',
    },
    feedback: {
      default: '',
    },
    answerType: {
      default: '',
    },
    answersExact: {
      default: [],
    },
    answerExact: {
      default: '',
    },
    answersRange: {
      default: [],
    },
    answerRange: {
      default: '',
    },
    answersPrecise: {
      default: [],
    },
    answerPrecise: {
      default: '',
    },
  },
  group: 'block questions',
  isolating: true,
  content: 'block+',
  parseDOM: [
    {
      tag: 'div.numerical-answer',
      getAttrs: function getAttrs(dom) {
        return {
          answersExact: JSON.parse(dom.getAttribute('answersExact')),
          answerExact: dom.getAttribute('answerExact'),
          answersRange: JSON.parse(dom.getAttribute('answersRange')),
          answerRange: dom.getAttribute('answerRange'),
          answersPrecise: JSON.parse(dom.getAttribute('answersPrecise')),
          answerPrecise: dom.getAttribute('answerPrecise'),
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          feedback: dom.getAttribute('feedback'),
          answerType: dom.getAttribute('answerType'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return [
      'div',
      {
        answerType: node.attrs.answerType,
        answersExact: JSON.stringify(node.attrs.answersExact),
        answerExact: node.attrs.answerExact,
        answersRange: JSON.stringify(node.attrs.answersRange),
        answerRange: node.attrs.answerRange,
        answersPrecise: JSON.stringify(node.attrs.answersPrecise),
        answerPrecise: node.attrs.answerPrecise,
        id: node.attrs.id,
        class: node.attrs['class'],
        feedback: node.attrs.feedback,
      },
      0,
    ]
  },
}

var _dec$8, _class$8, _temp$8
var NumericalAnswerQuestion =
  ((_dec$8 = injectable()),
  _dec$8(
    (_class$8 =
      ((_temp$8 = /*#__PURE__*/ (function (_Tools) {
        _inherits(NumericalAnswerQuestion, _Tools)

        var _super = _createSuper(NumericalAnswerQuestion)

        function NumericalAnswerQuestion() {
          var _this

          _classCallCheck(this, NumericalAnswerQuestion)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Numerical Answer Question'
          _this.icon = ''
          _this.name = 'Numerical Answer'

          _this.select = function (state, activeViewId, activeView) {}

          return _this
        }

        _createClass(NumericalAnswerQuestion, [
          {
            key: 'run',
            get: function get() {
              return function (main) {
                var dispatch = main.dispatch
                var state = main.state
                helpers.checkifEmpty(main)
                var _main$state$selection = main.state.selection,
                  $from = _main$state$selection.$from,
                  $to = _main$state$selection.$to
                var range = $from.blockRange($to)
                var tr = main.state.tr
                var wrapping =
                  range &&
                  findWrapping(
                    range,
                    state.config.schema.nodes.numerical_answer_container,
                    {
                      id: v4(),
                    },
                  )
                if (!wrapping) return false
                tr.wrap(range, wrapping)
                dispatch(tr)
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {
                if (
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.numerical_answer_container,
                  )
                ) {
                  return true
                }

                return false
              }
            },
          },
        ])

        return NumericalAnswerQuestion
      })(Tools)),
      _temp$8)),
  ) || _class$8)

var NumericalAnswerContainerNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
  _inherits(NumericalAnswerContainerNodeView, _QuestionsNodeView)

  var _super = _createSuper(NumericalAnswerContainerNodeView)

  function NumericalAnswerContainerNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, NumericalAnswerContainerNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    NumericalAnswerContainerNodeView,
    [
      {
        key: 'selectNode',
        value: function selectNode() {
          this.context.pmViews[this.node.attrs.id].focus()
        },
      },
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          return true
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'numerical_answer_container'
        },
      },
    ],
  )

  return NumericalAnswerContainerNodeView
})(QuestionsNodeView)

function _templateObject4$a() {
  var data = _taggedTemplateLiteral([
    '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n  position: relative;\n  top: 1px;\n',
  ])

  _templateObject4$a = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$c() {
  var data = _taggedTemplateLiteral([
    '\n  visibility: ',
    ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 2px auto auto;\n  position: absolute;\n  width: 235px;\n  max-height: 150px;\n  overflow-y: auto;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    border-bottom: 1px solid #f4f4f4;\n    font-size: 11px;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
  ])

  _templateObject3$c = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$e() {
  var data = _taggedTemplateLiteral([
    '\n  background: #fff;\n  border: 1px solid #f4f4f4;\n  color: #000;\n  cursor: ',
    ';\n  display: flex;\n  position: relative;\n  top: 2px;\n  left: 3px;\n  width: 235px;\n  height: 26px;\n\n  span {\n    position: relative;\n    top: 4px;\n  }\n',
  ])

  _templateObject2$e = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$l() {
  var data = _taggedTemplateLiteral(['\n  opacity: ', ';\n  z-index: 999;\n'])

  _templateObject$l = function _templateObject() {
    return data
  }

  return data
}
var Wrapper$3 = styled.div(_templateObject$l(), function (props) {
  return props.$disabled ? '0.4' : '1'
})
var DropDownButton$3 = styled.button(_templateObject2$e(), function (props) {
  return props.$disabled ? 'not-allowed' : 'pointer'
})
var DropDownMenu$3 = styled.div(_templateObject3$c(), function (props) {
  return props.$isOpen ? 'visible' : 'hidden'
})
var StyledIcon$3 = styled(Icon)(_templateObject4$a())

var NumericalAnswerDropDownCompontent =
  function NumericalAnswerDropDownCompontent(_ref) {
    var node = _ref.node
    var dropDownOptions = [
      {
        label: 'Exact answer with margin of error',
        value: 'exactAnswer',
      },
      {
        label: 'Answer within a range',
        value: 'rangeAnswer',
      },
      {
        label: 'Precise answer',
        value: 'preciseAnswer',
      },
    ]
    var context = useContext(WaxContext)
    var activeView = context.activeView,
      main = context.pmViews.main,
      setOption = context.setOption,
      options = context.options
    var itemRefs = useRef([])
    var wrapperRef = useRef()

    var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1]

    useOnClickOutside(wrapperRef, function () {
      return setIsOpen(false)
    })

    var _useState3 = useState('Select Type'),
      _useState4 = _slicedToArray(_useState3, 2),
      label = _useState4[0],
      setLabel = _useState4[1]

    var isEditable = main.props.editable(function (editable) {
      return editable
    })
    useEffect(function () {
      setLabel('Select Type')
      setOption(
        _defineProperty({}, node.attrs.id, {
          numericalAnswer: node.attrs.answerType,
        }),
      )
      dropDownOptions.forEach(function (option) {
        var _options$node$attrs$i

        if (
          ((_options$node$attrs$i = options[node.attrs.id]) === null ||
          _options$node$attrs$i === void 0
            ? void 0
            : _options$node$attrs$i.numericalAnswer) === option.value
        ) {
          setLabel(option.label)
        }
      })
    }, [])
    var isDisabled = !isEditable // if (activeView.props?.type !== 'NumericalAnswer') isDisabled = true;

    useEffect(
      function () {
        if (isDisabled) setIsOpen(false)
      },
      [isDisabled],
    )

    var openCloseMenu = function openCloseMenu() {
      if (!isDisabled) setIsOpen(!isOpen)
      if (isOpen)
        setTimeout(function () {
          activeView.focus()
        })
    }

    var _onKeyDown = function onKeyDown(e, index) {
      e.preventDefault() // arrow down

      if (e.keyCode === 40) {
        if (index === itemRefs.current.length - 1) {
          itemRefs.current[0].current.focus()
        } else {
          itemRefs.current[index + 1].current.focus()
        }
      } // arrow up

      if (e.keyCode === 38) {
        if (index === 0) {
          itemRefs.current[itemRefs.current.length - 1].current.focus()
        } else {
          itemRefs.current[index - 1].current.focus()
        }
      } // enter

      if (e.keyCode === 13) {
        itemRefs.current[index].current.click()
      } // ESC

      if (e.keyCode === 27) {
        setIsOpen(false)
      }
    }

    var SaveTypeToNode = function SaveTypeToNode(option) {
      var allNodes = getNodes$9(context.pmViews.main)
      allNodes.forEach(function (singleNode) {
        if (singleNode.node.attrs.id === node.attrs.id) {
          context.pmViews.main.dispatch(
            context.pmViews.main.state.tr.setNodeMarkup(
              singleNode.pos,
              undefined,
              _objectSpread2(
                _objectSpread2({}, singleNode.node.attrs),
                {},
                {
                  answerType: option,
                  answersExact: [],
                  answersRange: [],
                  answersPrecise: [],
                },
              ),
            ),
          )
        }
      })
    }

    var onChange = function onChange(option) {
      context.setOption(
        _defineProperty({}, node.attrs.id, {
          numericalAnswer: option.value,
        }),
      )
      setLabel(option.label)
      openCloseMenu()
      SaveTypeToNode(option.value)
      activeView.focus()
    }

    var NumericalAnswerDropDown = useMemo(
      function () {
        return /*#__PURE__*/ React.createElement(
          Wrapper$3,
          {
            $disabled: isDisabled,
            ref: wrapperRef,
          },
          /*#__PURE__*/ React.createElement(
            DropDownButton$3,
            {
              $disabled: isDisabled,
              'aria-controls': 'numerical-answer-list',
              'aria-expanded': isOpen,
              'aria-haspopup': true,
              onKeyDown: function onKeyDown(e) {
                if (e.keyCode === 40) {
                  itemRefs.current[0].current.focus()
                }

                if (e.keyCode === 27) {
                  setIsOpen(false)
                }

                if (e.keyCode === 13 || e.keyCode === 32) {
                  setIsOpen(true)
                }
              },
              onMouseDown: openCloseMenu,
              type: 'button',
            },
            /*#__PURE__*/ React.createElement('span', null, label),
            ' ',
            /*#__PURE__*/ React.createElement(StyledIcon$3, {
              name: 'expand',
            }),
          ),
          /*#__PURE__*/ React.createElement(
            DropDownMenu$3,
            {
              $isOpen: isOpen,
              'aria-label': 'Choose an item type',
              id: 'numerical-list',
              role: 'menu',
            },
            dropDownOptions.map(function (option, index) {
              itemRefs.current[index] = itemRefs.current[index] || createRef()
              return /*#__PURE__*/ React.createElement(
                'span',
                {
                  key: option.value,
                  onClick: function onClick() {
                    return onChange(option)
                  },
                  onKeyDown: function onKeyDown(e) {
                    return _onKeyDown(e, index)
                  },
                  ref: itemRefs.current[index],
                  role: 'menuitem',
                  tabIndex: '-1',
                },
                option.label,
              )
            }),
          ),
        )
      },
      [isDisabled, isOpen, label],
    )
    return NumericalAnswerDropDown
  }

var getNodes$9 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var numericalAnswerpContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'numerical_answer_container') {
      numericalAnswerpContainerNodes.push(node)
    }
  })
  return numericalAnswerpContainerNodes
}

function _templateObject7$4() {
  var data = _taggedTemplateLiteral([
    '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject7$4 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$5() {
  var data = _taggedTemplateLiteral([
    '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject6$5 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$6() {
  var data = _taggedTemplateLiteral(['\n  color: ', ';\n  font-weight: 999;\n'])

  _templateObject5$6 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$b() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n',
  ])

  _templateObject4$b = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$d() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n',
  ])

  _templateObject3$d = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$f() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  margin-right: 25px;\n\n  label {\n    font-size: 12px;\n  }\n\n  input:focus {\n    outline: none;\n  }\n',
  ])

  _templateObject2$f = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$m() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n',
  ])

  _templateObject$m = function _templateObject() {
    return data
  }

  return data
}
var AnswerContainer$2 = styled.div(_templateObject$m())
var ValueContainer = styled.div(_templateObject2$f())
var ValueInnerContainer = styled.div(_templateObject3$d())
var ResultContainer = styled.div(_templateObject4$b())
var FinalResult = styled.span(_templateObject5$6(), function (props) {
  return props.$isCorrect ? ' #008000' : 'red'
})
var StyledIconCorrect = styled(Icon)(_templateObject6$5())
var StyledIconWrong = styled(Icon)(_templateObject7$4())

var ExactAnswerComponent = function ExactAnswerComponent(_ref) {
  var _node$attrs,
    _node$attrs$answersEx,
    _node$attrs2,
    _node$attrs2$answersE,
    _node$attrs3,
    _node$attrs4,
    _node$attrs4$answersE,
    _node$attrs5,
    _node$attrs5$answersE

  var node = _ref.node,
    readOnly = _ref.readOnly,
    testMode = _ref.testMode,
    showFeedBack = _ref.showFeedBack
  var context = useContext(WaxContext)

  var _useState = useState(
      (node === null || node === void 0
        ? void 0
        : (_node$attrs = node.attrs) === null || _node$attrs === void 0
        ? void 0
        : (_node$attrs$answersEx = _node$attrs.answersExact) === null ||
          _node$attrs$answersEx === void 0
        ? void 0
        : _node$attrs$answersEx.exactAnswer) || '',
    ),
    _useState2 = _slicedToArray(_useState, 2),
    exact = _useState2[0],
    setExact = _useState2[1]

  var _useState3 = useState(
      (node === null || node === void 0
        ? void 0
        : (_node$attrs2 = node.attrs) === null || _node$attrs2 === void 0
        ? void 0
        : (_node$attrs2$answersE = _node$attrs2.answersExact) === null ||
          _node$attrs2$answersE === void 0
        ? void 0
        : _node$attrs2$answersE.marginError) || '',
    ),
    _useState4 = _slicedToArray(_useState3, 2),
    marginError = _useState4[0],
    setMarginError = _useState4[1]

  var _useState5 = useState(
      (node === null || node === void 0
        ? void 0
        : (_node$attrs3 = node.attrs) === null || _node$attrs3 === void 0
        ? void 0
        : _node$attrs3.answerExact) || '',
    ),
    _useState6 = _slicedToArray(_useState5, 2),
    exactStudent = _useState6[0],
    setExactStudent = _useState6[1]

  var exactRef = useRef(null)
  var errorRef = useRef(null)
  var exactStudentRef = useRef(null)

  var onlyNumbers = function onlyNumbers(value) {
    return value
      .replace(/[^-?0-9.]/g, '')
      .replace(/(?<!^)-/g, '')
      .replace(/(\..*?)\..*/g, '$1')
      .replace(/^0[^.]/, '0')
  }

  var SaveValuesToNode = function SaveValuesToNode() {
    var allNodes = getNodes$a(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        var obj = {
          exactAnswer: onlyNumbers(exactRef.current.value),
          marginError: onlyNumbers(errorRef.current.value),
        }
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr.setNodeMarkup(
            singleNode.pos,
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                answersExact: obj,
              },
            ),
          ),
        )
      }
    })
  }

  var onChangeExact = function onChangeExact() {
    setExact(onlyNumbers(exactRef.current.value))
    SaveValuesToNode()
  }

  var onChangeError = function onChangeError() {
    setMarginError(onlyNumbers(errorRef.current.value))
    SaveValuesToNode()
  }

  var onChangeExactStudent = function onChangeExactStudent() {
    setExactStudent(onlyNumbers(exactStudentRef.current.value))
    var allNodes = getNodes$a(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr.setNodeMarkup(
            singleNode.pos,
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                answerExact: onlyNumbers(exactStudentRef.current.value),
              },
            ),
          ),
        )
      }
    })
  } // SUBMIT

  var exactMultMargin = Math.abs(parseFloat((exact * marginError) / 100))
  var castExactStudent = ['-', '-.', '.'].includes(exactStudent)
    ? 0
    : Number(exactStudent)
  var computedMaxValue = Number(exactMultMargin) + Number(exact)
  var computedMinValue = Number(exact) - Number(exactMultMargin)
  var isCorrect = !!(
    castExactStudent <= computedMaxValue && castExactStudent >= computedMinValue
  )
  return /*#__PURE__*/ React.createElement(
    AnswerContainer$2,
    null,
    !testMode &&
      !showFeedBack &&
      /*#__PURE__*/ React.createElement(
        React.Fragment,
        null,
        /*#__PURE__*/ React.createElement(
          ValueContainer,
          null,
          /*#__PURE__*/ React.createElement(
            'label',
            {
              htmlFor: 'exactAnswer',
            },
            /*#__PURE__*/ React.createElement(
              ValueInnerContainer,
              null,
              /*#__PURE__*/ React.createElement('span', null, 'Exact Answer'),
              /*#__PURE__*/ React.createElement('input', {
                disabled: readOnly,
                name: 'exactAnswer',
                onChange: onChangeExact,
                ref: exactRef,
                type: 'text',
                value:
                  (node === null || node === void 0
                    ? void 0
                    : (_node$attrs4 = node.attrs) === null ||
                      _node$attrs4 === void 0
                    ? void 0
                    : (_node$attrs4$answersE = _node$attrs4.answersExact) ===
                        null || _node$attrs4$answersE === void 0
                    ? void 0
                    : _node$attrs4$answersE.exactAnswer) || exact,
              }),
            ),
          ),
        ),
        /*#__PURE__*/ React.createElement(
          ValueContainer,
          null,
          /*#__PURE__*/ React.createElement(
            'label',
            {
              htmlFor: 'errorAnswer',
            },
            /*#__PURE__*/ React.createElement(
              ValueInnerContainer,
              null,
              /*#__PURE__*/ React.createElement(
                'span',
                null,
                'Margin of error (%)',
              ),
              /*#__PURE__*/ React.createElement('input', {
                disabled: readOnly,
                name: 'errorAnswer',
                onChange: onChangeError,
                ref: errorRef,
                type: 'text',
                value:
                  (node === null || node === void 0
                    ? void 0
                    : (_node$attrs5 = node.attrs) === null ||
                      _node$attrs5 === void 0
                    ? void 0
                    : (_node$attrs5$answersE = _node$attrs5.answersExact) ===
                        null || _node$attrs5$answersE === void 0
                    ? void 0
                    : _node$attrs5$answersE.marginError) || marginError,
              }),
            ),
          ),
        ),
      ),
    testMode &&
      /*#__PURE__*/ React.createElement(
        ValueContainer,
        null,
        /*#__PURE__*/ React.createElement(
          'label',
          {
            htmlFor: 'exactAnswerStudent',
          },
          /*#__PURE__*/ React.createElement(
            ValueInnerContainer,
            null,
            /*#__PURE__*/ React.createElement('span', null, 'Exact Answer'),
            /*#__PURE__*/ React.createElement('input', {
              name: 'exactAnswerStudent',
              onChange: onChangeExactStudent,
              ref: exactStudentRef,
              type: 'text',
              value: exactStudent,
            }),
          ),
        ),
      ),
    readOnly &&
      showFeedBack &&
      /*#__PURE__*/ React.createElement(
        ResultContainer,
        null,
        /*#__PURE__*/ React.createElement(
          'span',
          null,
          'Accepted Answer Range: ',
          computedMinValue,
          ' - ',
          computedMaxValue,
        ),
        /*#__PURE__*/ React.createElement(
          'span',
          null,
          'Answer:',
          ' ',
          /*#__PURE__*/ React.createElement(
            FinalResult,
            {
              $isCorrect: isCorrect,
            },
            exactStudent,
            ' ',
            isCorrect &&
              /*#__PURE__*/ React.createElement(StyledIconCorrect, {
                name: 'done',
              }),
            !isCorrect &&
              /*#__PURE__*/ React.createElement(StyledIconWrong, {
                name: 'close',
              }),
          ),
        ),
      ),
  )
}

var getNodes$a = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var numericalAnswerpContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'numerical_answer_container') {
      numericalAnswerpContainerNodes.push(node)
    }
  })
  return numericalAnswerpContainerNodes
}

function _templateObject7$5() {
  var data = _taggedTemplateLiteral([
    '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject7$5 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$6() {
  var data = _taggedTemplateLiteral([
    '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject6$6 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$7() {
  var data = _taggedTemplateLiteral(['\n  color: ', ';\n  font-weight: 999;\n'])

  _templateObject5$7 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$c() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n',
  ])

  _templateObject4$c = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$e() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n',
  ])

  _templateObject3$e = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$g() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  margin-right: 25px;\n\n  label {\n    font-size: 12px;\n  }\n\n  input:focus {\n    outline: none;\n  }\n',
  ])

  _templateObject2$g = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$n() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n',
  ])

  _templateObject$n = function _templateObject() {
    return data
  }

  return data
}
var AnswerContainer$3 = styled.div(_templateObject$n())
var ValueContainer$1 = styled.div(_templateObject2$g())
var ValueInnerContainer$1 = styled.div(_templateObject3$e())
var ResultContainer$1 = styled.div(_templateObject4$c())
var FinalResult$1 = styled.span(_templateObject5$7(), function (props) {
  return props.$isCorrect ? ' #008000' : 'red'
})
var StyledIconCorrect$1 = styled(Icon)(_templateObject6$6())
var StyledIconWrong$1 = styled(Icon)(_templateObject7$5())

var PreciseAnswerComponent = function PreciseAnswerComponent(_ref) {
  var _node$attrs,
    _node$attrs$answersPr,
    _node$attrs2,
    _node$attrs3,
    _node$attrs3$answersP

  var node = _ref.node,
    readOnly = _ref.readOnly,
    testMode = _ref.testMode,
    showFeedBack = _ref.showFeedBack
  var context = useContext(WaxContext)

  var _useState = useState(
      (node === null || node === void 0
        ? void 0
        : (_node$attrs = node.attrs) === null || _node$attrs === void 0
        ? void 0
        : (_node$attrs$answersPr = _node$attrs.answersPrecise) === null ||
          _node$attrs$answersPr === void 0
        ? void 0
        : _node$attrs$answersPr.preciseAnswer) || '',
    ),
    _useState2 = _slicedToArray(_useState, 2),
    precise = _useState2[0],
    setPrecise = _useState2[1]

  var _useState3 = useState(
      (node === null || node === void 0
        ? void 0
        : (_node$attrs2 = node.attrs) === null || _node$attrs2 === void 0
        ? void 0
        : _node$attrs2.answerPrecise) || '',
    ),
    _useState4 = _slicedToArray(_useState3, 2),
    preciseStudent = _useState4[0],
    setPreciseStudent = _useState4[1]

  var preciseRef = useRef(null)
  var preciseStudentRef = useRef(null)

  var onlyNumbers = function onlyNumbers(value) {
    return value
      .replace(/[^-?0-9.;]/g, '')
      .replace(/(\..*?)\..*/g, '$1')
      .replace(/^0[^.]/, '0')
  }

  var SaveValuesToNode = function SaveValuesToNode() {
    var allNodes = getNodes$b(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        var obj = {
          preciseAnswer: onlyNumbers(preciseRef.current.value),
        }
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr.setNodeMarkup(
            singleNode.pos,
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                answersPrecise: obj,
              },
            ),
          ),
        )
      }
    })
  }

  var onChangePrecice = function onChangePrecice() {
    setPrecise(onlyNumbers(preciseRef.current.value))
    SaveValuesToNode()
  }

  var onChangePreciseStudent = function onChangePreciseStudent() {
    setPreciseStudent(onlyNumbers(preciseStudentRef.current.value))
    var allNodes = getNodes$b(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr.setNodeMarkup(
            singleNode.pos,
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                answerPrecise: onlyNumbers(preciseStudentRef.current.value),
              },
            ),
          ),
        )
      }
    })
  }

  var isCorrect = precise.split(';').find(function (element) {
    return element === preciseStudent.trim()
  })
  return /*#__PURE__*/ React.createElement(
    AnswerContainer$3,
    null,
    !testMode &&
      !showFeedBack &&
      /*#__PURE__*/ React.createElement(
        ValueContainer$1,
        null,
        /*#__PURE__*/ React.createElement(
          'label',
          {
            htmlFor: 'preciseAnswer',
          },
          /*#__PURE__*/ React.createElement(
            ValueInnerContainer$1,
            null,
            /*#__PURE__*/ React.createElement('span', null, 'Precise Answer'),
            /*#__PURE__*/ React.createElement('input', {
              disabled: readOnly,
              name: 'preciseAnswer',
              onChange: onChangePrecice,
              ref: preciseRef,
              type: 'text',
              value:
                (node === null || node === void 0
                  ? void 0
                  : (_node$attrs3 = node.attrs) === null ||
                    _node$attrs3 === void 0
                  ? void 0
                  : (_node$attrs3$answersP = _node$attrs3.answersPrecise) ===
                      null || _node$attrs3$answersP === void 0
                  ? void 0
                  : _node$attrs3$answersP.preciseAnswer) || precise,
            }),
          ),
        ),
      ),
    testMode &&
      /*#__PURE__*/ React.createElement(
        ValueContainer$1,
        null,
        /*#__PURE__*/ React.createElement(
          'label',
          {
            htmlFor: 'exactAnswerStudent',
          },
          /*#__PURE__*/ React.createElement(
            ValueInnerContainer$1,
            null,
            /*#__PURE__*/ React.createElement('span', null, 'Precise Answer'),
            /*#__PURE__*/ React.createElement('input', {
              name: 'exactAnswerStudent',
              onChange: onChangePreciseStudent,
              ref: preciseStudentRef,
              type: 'text',
              value: preciseStudent,
            }),
          ),
        ),
      ),
    readOnly &&
      showFeedBack &&
      /*#__PURE__*/ React.createElement(
        ResultContainer$1,
        null,
        /*#__PURE__*/ React.createElement(
          'span',
          null,
          '(Accepted Answers : '.concat(precise.replaceAll(';', '; '), ')'),
        ),
        /*#__PURE__*/ React.createElement(
          'span',
          null,
          'Answer:',
          ' ',
          /*#__PURE__*/ React.createElement(
            FinalResult$1,
            {
              $isCorrect: isCorrect,
            },
            preciseStudent,
            ' ',
            isCorrect &&
              /*#__PURE__*/ React.createElement(StyledIconCorrect$1, {
                name: 'done',
              }),
            !isCorrect &&
              /*#__PURE__*/ React.createElement(StyledIconWrong$1, {
                name: 'close',
              }),
          ),
        ),
      ),
  )
}

var getNodes$b = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var numericalAnswerpContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'numerical_answer_container') {
      numericalAnswerpContainerNodes.push(node)
    }
  })
  return numericalAnswerpContainerNodes
}

function _templateObject7$6() {
  var data = _taggedTemplateLiteral([
    '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject7$6 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$7() {
  var data = _taggedTemplateLiteral([
    '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject6$7 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$8() {
  var data = _taggedTemplateLiteral(['\n  color: ', ';\n  font-weight: 999;\n'])

  _templateObject5$8 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$d() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n',
  ])

  _templateObject4$d = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$f() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n',
  ])

  _templateObject3$f = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$h() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  margin-right: 25px;\n\n  label {\n    font-size: 12px;\n  }\n\n  input:focus {\n    outline: none;\n  }\n',
  ])

  _templateObject2$h = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$o() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n',
  ])

  _templateObject$o = function _templateObject() {
    return data
  }

  return data
}
var AnswerContainer$4 = styled.div(_templateObject$o())
var ValueContainer$2 = styled.div(_templateObject2$h())
var ValueInnerContainer$2 = styled.div(_templateObject3$f())
var ResultContainer$2 = styled.div(_templateObject4$d())
var FinalResult$2 = styled.span(_templateObject5$8(), function (props) {
  return props.$isCorrect ? ' #008000' : 'red'
})
var StyledIconCorrect$2 = styled(Icon)(_templateObject6$7())
var StyledIconWrong$2 = styled(Icon)(_templateObject7$6())

var RangeAnswerComponent = function RangeAnswerComponent(_ref) {
  var _node$attrs,
    _node$attrs$answersRa,
    _node$attrs2,
    _node$attrs2$answersR,
    _node$attrs3,
    _node$attrs4,
    _node$attrs4$answersR,
    _node$attrs5,
    _node$attrs5$answersR

  var node = _ref.node,
    readOnly = _ref.readOnly,
    testMode = _ref.testMode,
    showFeedBack = _ref.showFeedBack
  var context = useContext(WaxContext)

  var _useState = useState(
      (node === null || node === void 0
        ? void 0
        : (_node$attrs = node.attrs) === null || _node$attrs === void 0
        ? void 0
        : (_node$attrs$answersRa = _node$attrs.answersRange) === null ||
          _node$attrs$answersRa === void 0
        ? void 0
        : _node$attrs$answersRa.minAnswer) || '',
    ),
    _useState2 = _slicedToArray(_useState, 2),
    minValue = _useState2[0],
    setMinValue = _useState2[1]

  var _useState3 = useState(
      (node === null || node === void 0
        ? void 0
        : (_node$attrs2 = node.attrs) === null || _node$attrs2 === void 0
        ? void 0
        : (_node$attrs2$answersR = _node$attrs2.answersRange) === null ||
          _node$attrs2$answersR === void 0
        ? void 0
        : _node$attrs2$answersR.maxAnswer) || '',
    ),
    _useState4 = _slicedToArray(_useState3, 2),
    maxValue = _useState4[0],
    setMaxValue = _useState4[1]

  var _useState5 = useState(
      (node === null || node === void 0
        ? void 0
        : (_node$attrs3 = node.attrs) === null || _node$attrs3 === void 0
        ? void 0
        : _node$attrs3.answerRange) || '',
    ),
    _useState6 = _slicedToArray(_useState5, 2),
    rangeStudentValue = _useState6[0],
    setRangeStudentValue = _useState6[1]

  var minRef = useRef(null)
  var maxRef = useRef(null)
  var rangeStudentRef = useRef(null)

  var onlyNumbers = function onlyNumbers(value) {
    return value
      .replace(/[^-?0-9.]/g, '')
      .replace(/(?<!^)-/g, '')
      .replace(/(\..*?)\..*/g, '$1')
      .replace(/^0[^.]/, '0')
  }

  var SaveValuesToNode = function SaveValuesToNode() {
    var allNodes = getNodes$c(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        var obj = {
          minAnswer: onlyNumbers(minRef.current.value),
          maxAnswer: onlyNumbers(maxRef.current.value),
        }
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr.setNodeMarkup(
            singleNode.pos,
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                answersRange: obj,
              },
            ),
          ),
        )
      }
    })
  }

  var onChangeMin = function onChangeMin() {
    setMinValue(onlyNumbers(minRef.current.value))
    SaveValuesToNode()
  }

  var onChangeMax = function onChangeMax() {
    setMaxValue(onlyNumbers(maxRef.current.value))
    SaveValuesToNode()
  }

  var onChangeRangeStudent = function onChangeRangeStudent() {
    setRangeStudentValue(onlyNumbers(rangeStudentRef.current.value))
    var allNodes = getNodes$c(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr.setNodeMarkup(
            singleNode.pos,
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              {
                answerRange: onlyNumbers(rangeStudentRef.current.value),
              },
            ),
          ),
        )
      }
    })
  } // SUBMIT

  var castExactStudent = ['-', '-.', '.'].includes(rangeStudentValue)
    ? 0
    : Number(rangeStudentValue)
  var isCorrect = !!(
    castExactStudent <= Number(maxValue) && castExactStudent >= Number(minValue)
  )
  return /*#__PURE__*/ React.createElement(
    AnswerContainer$4,
    null,
    !testMode &&
      !showFeedBack &&
      /*#__PURE__*/ React.createElement(
        React.Fragment,
        null,
        /*#__PURE__*/ React.createElement(
          ValueContainer$2,
          null,
          /*#__PURE__*/ React.createElement(
            'label',
            {
              htmlFor: 'minAnswer',
            },
            /*#__PURE__*/ React.createElement(
              ValueInnerContainer$2,
              null,
              /*#__PURE__*/ React.createElement('span', null, 'Min'),
              /*#__PURE__*/ React.createElement('input', {
                disabled: readOnly,
                name: 'minAnswer',
                onChange: onChangeMin,
                ref: minRef,
                type: 'text',
                value:
                  (node === null || node === void 0
                    ? void 0
                    : (_node$attrs4 = node.attrs) === null ||
                      _node$attrs4 === void 0
                    ? void 0
                    : (_node$attrs4$answersR = _node$attrs4.answersRange) ===
                        null || _node$attrs4$answersR === void 0
                    ? void 0
                    : _node$attrs4$answersR.minAnswer) || minValue,
              }),
            ),
          ),
        ),
        /*#__PURE__*/ React.createElement(
          ValueContainer$2,
          null,
          /*#__PURE__*/ React.createElement(
            'label',
            {
              htmlFor: 'maxAnswer',
            },
            /*#__PURE__*/ React.createElement(
              ValueInnerContainer$2,
              null,
              /*#__PURE__*/ React.createElement('span', null, 'Max'),
              /*#__PURE__*/ React.createElement('input', {
                disabled: readOnly,
                name: 'maxAnswer',
                onChange: onChangeMax,
                ref: maxRef,
                type: 'text',
                value:
                  (node === null || node === void 0
                    ? void 0
                    : (_node$attrs5 = node.attrs) === null ||
                      _node$attrs5 === void 0
                    ? void 0
                    : (_node$attrs5$answersR = _node$attrs5.answersRange) ===
                        null || _node$attrs5$answersR === void 0
                    ? void 0
                    : _node$attrs5$answersR.maxAnswer) || maxValue,
              }),
            ),
          ),
        ),
      ),
    testMode &&
      /*#__PURE__*/ React.createElement(
        ValueContainer$2,
        null,
        /*#__PURE__*/ React.createElement(
          'label',
          {
            htmlFor: 'exactAnswerStudent',
          },
          /*#__PURE__*/ React.createElement(
            ValueInnerContainer$2,
            null,
            /*#__PURE__*/ React.createElement('span', null, 'Answer'),
            /*#__PURE__*/ React.createElement('input', {
              name: 'exactAnswerStudent',
              onChange: onChangeRangeStudent,
              ref: rangeStudentRef,
              type: 'text',
              value: rangeStudentValue,
            }),
          ),
        ),
      ),
    readOnly &&
      showFeedBack &&
      /*#__PURE__*/ React.createElement(
        ResultContainer$2,
        null,
        /*#__PURE__*/ React.createElement(
          'span',
          null,
          'Accepted Answer Range: ',
          minValue,
          ' - ',
          maxValue,
        ),
        /*#__PURE__*/ React.createElement(
          'span',
          null,
          'Answer:',
          ' ',
          /*#__PURE__*/ React.createElement(
            FinalResult$2,
            {
              $isCorrect: isCorrect,
            },
            rangeStudentValue,
            ' ',
            isCorrect &&
              /*#__PURE__*/ React.createElement(StyledIconCorrect$2, {
                name: 'done',
              }),
            !isCorrect &&
              /*#__PURE__*/ React.createElement(StyledIconWrong$2, {
                name: 'close',
              }),
          ),
        ),
      ),
  )
}

var getNodes$c = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var numericalAnswerpContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'numerical_answer_container') {
      numericalAnswerpContainerNodes.push(node)
    }
  })
  return numericalAnswerpContainerNodes
}

function _templateObject9$1() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject9$1 = function _templateObject9() {
    return data
  }

  return data
}

function _templateObject8$3() {
  var data = _taggedTemplateLiteral([
    '\n  color: #fff;\n  display: none;\n  user-select: none;\n  position: absolute;\n  width: 100%;\n  span {\n    background: ',
    ';\n    bottom: 35px;\n    border-radius: 4px;\n    float: right;\n    right: 162px;\n    padding: 4px;\n    position: relative;\n  }\n',
  ])

  _templateObject8$3 = function _templateObject8() {
    return data
  }

  return data
}

function _templateObject7$7() {
  var data = _taggedTemplateLiteral([
    '\n  position: relative;\n  right: 4px;\n  cursor: pointer;\n  height: 24px;\n  width: 24px;\n  z-index: 999;\n',
  ])

  _templateObject7$7 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$8() {
  var data = _taggedTemplateLiteral([
    '\n  float: right;\n  position: relative;\n  top: 3px;\n',
  ])

  _templateObject6$8 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$9() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  cursor: pointer;\n  border: none;\n  margin-left: auto;\n  z-index: 999;\n',
  ])

  _templateObject5$9 = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$e() {
  var data = _taggedTemplateLiteral(['\n  padding: 8px;\n'])

  _templateObject4$e = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$g() {
  var data = _taggedTemplateLiteral([
    '\n  border: 3px solid #f5f5f7;\n  border-bottom: none;\n  height: 33px;\n  display: flex;\n  flex-direction: row;\n',
  ])

  _templateObject3$g = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$i() {
  var data = _taggedTemplateLiteral([
    '\n  border: 3px solid #f5f5f7;\n  margin-bottom: 30px;\n',
  ])

  _templateObject2$i = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$p() {
  var data = _taggedTemplateLiteral([
    '\n  margin: 0px 38px 15px 38px;\n  margin-top: 10px;\n',
  ])

  _templateObject$p = function _templateObject() {
    return data
  }

  return data
}
var NumericalAnswerWrapper = styled.div(_templateObject$p())
var NumericalAnswerContainer = styled.div(_templateObject2$i())
var NumericalAnswerContainerTool = styled.div(_templateObject3$g())
var NumericalAnswerOption = styled.div(_templateObject4$e())
var ActionButton$5 = styled.button(_templateObject5$9())
var StyledIconContainer$1 = styled.span(_templateObject6$8())
var StyledIconAction$4 = styled(Icon)(_templateObject7$7())
var InfoMsg$1 = styled.div(_templateObject8$3(), th('colorPrimary'))
var StyledIconActionRemove$4 = styled(Icon)(_templateObject9$1())
var NumericalAnswerContainerComponent = function (_ref) {
  var _getUpdatedNode,
    _getUpdatedNode$node,
    _getUpdatedNode$node$,
    _getUpdatedNode2,
    _getUpdatedNode3,
    _getUpdatedNode3$node,
    _getUpdatedNode3$node2,
    _getUpdatedNode4,
    _getUpdatedNode4$node,
    _getUpdatedNode4$node2,
    _getUpdatedNode5,
    _getUpdatedNode6,
    _getUpdatedNode6$node,
    _getUpdatedNode6$node2,
    _getUpdatedNode7,
    _getUpdatedNode8,
    _getUpdatedNode8$node,
    _getUpdatedNode8$node2,
    _getUpdatedNode9,
    _getUpdatedNode10

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main,
    setOption = context.setOption
  var customProps = main.props.customValues
  var testMode = customProps.testMode,
    showFeedBack = customProps.showFeedBack
  var infoMsgRef = useRef()

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    infoMsgIsOpen = _useState2[0],
    setInfoMsgIsOpen = _useState2[1]

  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var readOnly = !isEditable
  var feedback = node.attrs.feedback

  var removeQuestion = function removeQuestion() {
    var allNodes = getNodes$d(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr['delete'](
            singleNode.pos,
            singleNode.pos + singleNode.node.nodeSize,
          ),
        )
      }
    })
  } // useEffect(() => {
  //   setOption({
  //     [getUpdatedNode().node.attrs.id]: {
  //       numericalAnswer: node.attrs.answerType,
  //     },
  //   });
  // }, []);

  var displayInfoMsg = function displayInfoMsg() {
    if (infoMsgRef.current && !infoMsgIsOpen)
      infoMsgRef.current.style.display = 'block'
    if (infoMsgRef.current && infoMsgIsOpen)
      infoMsgRef.current.style.display = 'none'
    setInfoMsgIsOpen(!infoMsgIsOpen)
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$d(context.pmViews.main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  return /*#__PURE__*/ React.createElement(
    NumericalAnswerWrapper,
    null,
    /*#__PURE__*/ React.createElement(
      'div',
      null,
      !testMode &&
        !readOnly &&
        /*#__PURE__*/ React.createElement(
          NumericalAnswerContainerTool,
          null,
          /*#__PURE__*/ React.createElement(NumericalAnswerDropDownCompontent, {
            node: node,
          }),
          /*#__PURE__*/ React.createElement(
            ActionButton$5,
            {
              'aria-label': 'delete this question',
              onClick: removeQuestion,
              type: 'button',
            },
            /*#__PURE__*/ React.createElement(StyledIconActionRemove$4, {
              name: 'deleteOutlinedQuestion',
            }),
          ),
          ((_getUpdatedNode = getUpdatedNode()) === null ||
          _getUpdatedNode === void 0
            ? void 0
            : (_getUpdatedNode$node = _getUpdatedNode.node) === null ||
              _getUpdatedNode$node === void 0
            ? void 0
            : (_getUpdatedNode$node$ = _getUpdatedNode$node.attrs) === null ||
              _getUpdatedNode$node$ === void 0
            ? void 0
            : _getUpdatedNode$node$.answerType) === 'preciseAnswer' &&
            /*#__PURE__*/ React.createElement(
              StyledIconContainer$1,
              {
                onClick: displayInfoMsg,
                onKeyPress: function onKeyPress() {},
                role: 'button',
                tabIndex: 0,
              },
              /*#__PURE__*/ React.createElement(StyledIconAction$4, {
                name: 'help',
              }),
            ),
          /*#__PURE__*/ React.createElement(
            InfoMsg$1,
            {
              ref: infoMsgRef,
            },
            /*#__PURE__*/ React.createElement(
              'span',
              null,
              'Separate answer variants with a semi colon',
            ),
          ),
        ),
    ),
    /*#__PURE__*/ React.createElement(
      NumericalAnswerContainer,
      {
        className: 'numerical-answer',
      },
      /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
        getPos: getPos,
        node:
          (_getUpdatedNode2 = getUpdatedNode()) === null ||
          _getUpdatedNode2 === void 0
            ? void 0
            : _getUpdatedNode2.node,
        QuestionType: 'NumericalAnswer',
        view: view,
      }),
      /*#__PURE__*/ React.createElement(
        NumericalAnswerOption,
        null,
        ((_getUpdatedNode3 = getUpdatedNode()) === null ||
        _getUpdatedNode3 === void 0
          ? void 0
          : (_getUpdatedNode3$node = _getUpdatedNode3.node) === null ||
            _getUpdatedNode3$node === void 0
          ? void 0
          : (_getUpdatedNode3$node2 = _getUpdatedNode3$node.attrs) === null ||
            _getUpdatedNode3$node2 === void 0
          ? void 0
          : _getUpdatedNode3$node2.answerType) === '' &&
          /*#__PURE__*/ React.createElement(
            React.Fragment,
            null,
            'No Type Selected',
          ),
        ((_getUpdatedNode4 = getUpdatedNode()) === null ||
        _getUpdatedNode4 === void 0
          ? void 0
          : (_getUpdatedNode4$node = _getUpdatedNode4.node) === null ||
            _getUpdatedNode4$node === void 0
          ? void 0
          : (_getUpdatedNode4$node2 = _getUpdatedNode4$node.attrs) === null ||
            _getUpdatedNode4$node2 === void 0
          ? void 0
          : _getUpdatedNode4$node2.answerType) === 'exactAnswer' &&
          /*#__PURE__*/ React.createElement(ExactAnswerComponent, {
            node:
              (_getUpdatedNode5 = getUpdatedNode()) === null ||
              _getUpdatedNode5 === void 0
                ? void 0
                : _getUpdatedNode5.node,
            readOnly: readOnly,
            showFeedBack: showFeedBack,
            testMode: testMode,
          }),
        ((_getUpdatedNode6 = getUpdatedNode()) === null ||
        _getUpdatedNode6 === void 0
          ? void 0
          : (_getUpdatedNode6$node = _getUpdatedNode6.node) === null ||
            _getUpdatedNode6$node === void 0
          ? void 0
          : (_getUpdatedNode6$node2 = _getUpdatedNode6$node.attrs) === null ||
            _getUpdatedNode6$node2 === void 0
          ? void 0
          : _getUpdatedNode6$node2.answerType) === 'rangeAnswer' &&
          /*#__PURE__*/ React.createElement(RangeAnswerComponent, {
            node:
              (_getUpdatedNode7 = getUpdatedNode()) === null ||
              _getUpdatedNode7 === void 0
                ? void 0
                : _getUpdatedNode7.node,
            readOnly: readOnly,
            showFeedBack: showFeedBack,
            testMode: testMode,
          }),
        ((_getUpdatedNode8 = getUpdatedNode()) === null ||
        _getUpdatedNode8 === void 0
          ? void 0
          : (_getUpdatedNode8$node = _getUpdatedNode8.node) === null ||
            _getUpdatedNode8$node === void 0
          ? void 0
          : (_getUpdatedNode8$node2 = _getUpdatedNode8$node.attrs) === null ||
            _getUpdatedNode8$node2 === void 0
          ? void 0
          : _getUpdatedNode8$node2.answerType) === 'preciseAnswer' &&
          /*#__PURE__*/ React.createElement(PreciseAnswerComponent, {
            node:
              (_getUpdatedNode9 = getUpdatedNode()) === null ||
              _getUpdatedNode9 === void 0
                ? void 0
                : _getUpdatedNode9.node,
            readOnly: readOnly,
            showFeedBack: showFeedBack,
            testMode: testMode,
          }),
      ),
      !testMode &&
        !(readOnly && feedback === '') &&
        /*#__PURE__*/ React.createElement(FeedbackComponent, {
          getPos: getPos,
          node:
            (_getUpdatedNode10 = getUpdatedNode()) === null ||
            _getUpdatedNode10 === void 0
              ? void 0
              : _getUpdatedNode10.node,
          readOnly: readOnly,
          view: view,
        }),
    ),
  )
}

var getNodes$d = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var numericalAnswerpContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'numerical_answer_container') {
      numericalAnswerpContainerNodes.push(node)
    }
  })
  return numericalAnswerpContainerNodes
}

var NumericalAnswerService = /*#__PURE__*/ (function (_Service) {
  _inherits(NumericalAnswerService, _Service)

  var _super = _createSuper(NumericalAnswerService)

  function NumericalAnswerService() {
    _classCallCheck(this, NumericalAnswerService)

    return _super.apply(this, arguments)
  }

  _createClass(NumericalAnswerService, [
    {
      key: 'register',
      value: function register() {
        this.container
          .bind('NumericalAnswerQuestion')
          .to(NumericalAnswerQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          numerical_answer_container: NumericalAnswerContainerNode,
        })
        addPortal({
          nodeView: NumericalAnswerContainerNodeView,
          component: NumericalAnswerContainerComponent,
          context: this.app,
        })
      },
    },
  ])

  return NumericalAnswerService
})(Service)

function _templateObject4$f() {
  var data = _taggedTemplateLiteral([
    '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n  position: relative;\n  top: 10px;\n',
  ])

  _templateObject4$f = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$h() {
  var data = _taggedTemplateLiteral([
    '\n  visibility: ',
    ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 2px auto auto;\n  position: absolute;\n  width: 220px;\n  max-height: 150px;\n  overflow-y: scroll;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
  ])

  _templateObject3$h = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$j() {
  var data = _taggedTemplateLiteral([
    '\n  background: #fff;\n  border: none;\n  color: #000;\n  cursor: ',
    ';\n  display: flex;\n  position: relative;\n  width: 215px;\n  height: 100%;\n\n  span {\n    position: relative;\n    top: 12px;\n  }\n',
  ])

  _templateObject2$j = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$q() {
  var data = _taggedTemplateLiteral(['\n  opacity: ', ';\n'])

  _templateObject$q = function _templateObject() {
    return data
  }

  return data
}
var Wrapper$4 = styled.div(_templateObject$q(), function (props) {
  return props.$disabled ? '0.4' : '1'
})
var DropDownButton$4 = styled.button(_templateObject2$j(), function (props) {
  return props.$disabled ? 'not-allowed' : 'pointer'
})
var DropDownMenu$4 = styled.div(_templateObject3$h(), function (props) {
  return props.$isOpen ? 'visible' : 'hidden'
})
var StyledIcon$4 = styled(Icon)(_templateObject4$f())

var DropDownComponent$2 = function DropDownComponent(_ref) {
  var view = _ref.view,
    tools = _ref.tools
  var dropDownOptions = [
    {
      label: 'Multiple Choice',
      value: '0',
      item: tools[0],
    },
    {
      label: 'Multiple Choice Single Correct',
      value: '1',
      item: tools[1],
    },
    {
      label: 'True/False',
      value: '2',
      item: tools[2],
    },
    {
      label: 'True/False Single Correct',
      value: '3',
      item: tools[3],
    },
    {
      label: 'Matching',
      value: '4',
      item: tools[4],
    },
    {
      label: 'Essay',
      value: '5',
      item: tools[5],
    },
    {
      label: 'Multiple dropdowns',
      value: '6',
      item: tools[6],
    },
    {
      label: 'Fill in the blank',
      value: '7',
      item: tools[7],
    },
    {
      label: 'Numerical answer',
      value: '8',
      item: tools[8],
    },
  ]
  var context = useContext(WaxContext)
  var activeView = context.activeView,
    activeViewId = context.activeViewId,
    main = context.pmViews.main
  var state = view.state
  var itemRefs = useRef([])
  var wrapperRef = useRef()

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1]

  useOnClickOutside(wrapperRef, function () {
    return setIsOpen(false)
  })

  var _useState3 = useState('Question Type'),
    _useState4 = _slicedToArray(_useState3, 2),
    label = _useState4[0],
    setLabel = _useState4[1]

  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  useEffect(
    function () {
      setLabel('Question Type')
      dropDownOptions.forEach(function (option) {
        if (option.item.active(main.state)) {
          setLabel(option.label)
        }
      })
    },
    [activeViewId],
  )
  var isDisabled = !tools[0].select(state, activeView)
  useEffect(
    function () {
      if (isDisabled) setIsOpen(false)
    },
    [isDisabled],
  )

  var openCloseMenu = function openCloseMenu() {
    if (!isDisabled) setIsOpen(!isOpen)
    if (isOpen)
      setTimeout(function () {
        activeView.focus()
      })
  }

  if (!isEditable) isDisabled = true

  var _onKeyDown = function onKeyDown(e, index) {
    e.preventDefault() // arrow down

    if (e.keyCode === 40) {
      if (index === itemRefs.current.length - 1) {
        itemRefs.current[0].current.focus()
      } else {
        itemRefs.current[index + 1].current.focus()
      }
    } // arrow up

    if (e.keyCode === 38) {
      if (index === 0) {
        itemRefs.current[itemRefs.current.length - 1].current.focus()
      } else {
        itemRefs.current[index - 1].current.focus()
      }
    } // enter

    if (e.keyCode === 13) {
      itemRefs.current[index].current.click()
    } // ESC

    if (e.keyCode === 27) {
      setIsOpen(false)
    }
  }

  var onChange = function onChange(option) {
    tools[option.value].run(main, context)
    openCloseMenu()
  }

  var MultipleDropDown = useMemo(
    function () {
      return /*#__PURE__*/ React.createElement(
        Wrapper$4,
        {
          $disabled: isDisabled,
          ref: wrapperRef,
        },
        /*#__PURE__*/ React.createElement(
          DropDownButton$4,
          {
            $disabled: isDisabled,
            'aria-controls': 'questions-list',
            'aria-expanded': isOpen,
            'aria-haspopup': true,
            onKeyDown: function onKeyDown(e) {
              if (e.keyCode === 40) {
                itemRefs.current[0].current.focus()
              }

              if (e.keyCode === 27) {
                setIsOpen(false)
              }

              if (e.keyCode === 13 || e.keyCode === 32) {
                setIsOpen(true)
              }
            },
            onMouseDown: openCloseMenu,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement('span', null, label),
          ' ',
          /*#__PURE__*/ React.createElement(StyledIcon$4, {
            name: 'expand',
          }),
        ),
        /*#__PURE__*/ React.createElement(
          DropDownMenu$4,
          {
            $isOpen: isOpen,
            'aria-label': 'Choose an item type',
            id: 'questions-list',
            role: 'menu',
          },
          dropDownOptions.map(function (option, index) {
            itemRefs.current[index] = itemRefs.current[index] || createRef()
            return /*#__PURE__*/ React.createElement(
              'span',
              {
                key: option.value,
                onClick: function onClick() {
                  return onChange(option)
                },
                onKeyDown: function onKeyDown(e) {
                  return _onKeyDown(e, index)
                },
                ref: itemRefs.current[index],
                role: 'menuitem',
                tabIndex: '-1',
              },
              option.label,
            )
          }),
        ),
      )
    },
    [isDisabled, isOpen, label],
  )
  return MultipleDropDown
}

var _dec$9, _class$9, _temp$9
var QuestionsDropDown =
  ((_dec$9 = injectable()),
  _dec$9(
    (_class$9 =
      ((_temp$9 = /*#__PURE__*/ (function (_ToolGroup) {
        _inherits(QuestionsDropDown, _ToolGroup)

        var _super = _createSuper(QuestionsDropDown)

        function QuestionsDropDown(
          multipleChoiceQuestion,
          multipleChoiceSingleCorrectQuestion,
          trueFalseQuestion,
          trueFalseSingleCorrectQuestion,
          matchingQuestion,
          essayQuestion,
          MultipleDropDownQuestion,
          FillTheGapQuestion,
          NumericalAnswerQuestion,
        ) {
          var _this

          _classCallCheck(this, QuestionsDropDown)

          _this = _super.call(this)
          _this.tools = []
          _this.tools = [
            multipleChoiceQuestion,
            multipleChoiceSingleCorrectQuestion,
            trueFalseQuestion,
            trueFalseSingleCorrectQuestion,
            matchingQuestion,
            essayQuestion,
            MultipleDropDownQuestion,
            FillTheGapQuestion,
            NumericalAnswerQuestion,
          ]
          return _this
        }

        QuestionsDropDown =
          inject('NumericalAnswerQuestion')(QuestionsDropDown, undefined, 8) ||
          QuestionsDropDown
        QuestionsDropDown =
          inject('FillTheGapQuestion')(QuestionsDropDown, undefined, 7) ||
          QuestionsDropDown
        QuestionsDropDown =
          inject('MultipleDropDownQuestion')(QuestionsDropDown, undefined, 6) ||
          QuestionsDropDown
        QuestionsDropDown =
          inject('EssayQuestion')(QuestionsDropDown, undefined, 5) ||
          QuestionsDropDown
        QuestionsDropDown =
          inject('MatchingQuestion')(QuestionsDropDown, undefined, 4) ||
          QuestionsDropDown
        QuestionsDropDown =
          inject('TrueFalseSingleCorrectQuestion')(
            QuestionsDropDown,
            undefined,
            3,
          ) || QuestionsDropDown
        QuestionsDropDown =
          inject('TrueFalseQuestion')(QuestionsDropDown, undefined, 2) ||
          QuestionsDropDown
        QuestionsDropDown =
          inject('MultipleChoiceSingleCorrectQuestion')(
            QuestionsDropDown,
            undefined,
            1,
          ) || QuestionsDropDown
        QuestionsDropDown =
          inject('MultipleChoiceQuestion')(QuestionsDropDown, undefined, 0) ||
          QuestionsDropDown

        _createClass(QuestionsDropDown, [
          {
            key: 'renderTools',
            value: function renderTools(view) {
              var _this2 = this

              if (isEmpty(view)) return null
              var MultipleDropDown = useMemo(function () {
                return /*#__PURE__*/ React.createElement(DropDownComponent$2, {
                  key: v4(),
                  tools: _this2._tools,
                  view: view,
                })
              }, [])
              return MultipleDropDown
            },
          },
        ])

        return QuestionsDropDown
      })(ToolGroup)),
      _temp$9)),
  ) || _class$9)

var QuestionsDropDownToolGroupService = /*#__PURE__*/ (function (_Service) {
  _inherits(QuestionsDropDownToolGroupService, _Service)

  var _super = _createSuper(QuestionsDropDownToolGroupService)

  function QuestionsDropDownToolGroupService() {
    _classCallCheck(this, QuestionsDropDownToolGroupService)

    return _super.apply(this, arguments)
  }

  _createClass(QuestionsDropDownToolGroupService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('QuestionsDropDown').to(QuestionsDropDown)
      },
    },
  ])

  return QuestionsDropDownToolGroupService
})(Service)

function _templateObject2$k() {
  var data = _taggedTemplateLiteral(['\n  ', '\n'])

  _templateObject2$k = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$r() {
  var data = _taggedTemplateLiteral(['\n  pointer-events: none;\n'])

  _templateObject$r = function _templateObject() {
    return data
  }

  return data
}
var activeStyles$1 = css(_templateObject$r())
var StyledButton$1 = styled(MenuButton)(_templateObject2$k(), function (props) {
  return props.active && activeStyles$1
})

var ToolBarBtn$1 = function ToolBarBtn(_ref) {
  var _ref$view = _ref.view,
    view = _ref$view === void 0 ? {} : _ref$view,
    item = _ref.item
  var icon = item.icon,
    label = item.label,
    select = item.select,
    title = item.title
  var context = useContext(WaxContext)

  var _useContext = useContext(WaxContext),
    main = _useContext.pmViews.main,
    activeView = _useContext.activeView

  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var state = view.state
  var isDisabled = !select(state, activeView)
  if (!isEditable) isDisabled = true
  var ToolBarBtnComponent = useMemo(
    function () {
      return /*#__PURE__*/ React.createElement(StyledButton$1, {
        active: false,
        disabled: isDisabled,
        iconName: icon,
        label: label,
        onMouseDown: function onMouseDown(e) {
          e.preventDefault()
          item.run(main, context)
        },
        title: title,
      })
    },
    [isDisabled],
  )
  return ToolBarBtnComponent
}

var _dec$a, _class$a, _temp$a
var MultipleChoiceQuestion =
  ((_dec$a = injectable()),
  _dec$a(
    (_class$a =
      ((_temp$a = /*#__PURE__*/ (function (_Tools) {
        _inherits(MultipleChoiceQuestion, _Tools)

        var _super = _createSuper(MultipleChoiceQuestion)

        function MultipleChoiceQuestion() {
          var _this

          _classCallCheck(this, MultipleChoiceQuestion)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Add Multiple Choice Question'
          _this.icon = 'multipleChoice'
          _this.name = 'Multiple choice'
          _this.label = 'Multiple choice'

          _this.select = function (state, activeView) {
            var _activeView$props$dis = activeView.props.disallowedTools,
              disallowedTools =
                _activeView$props$dis === void 0 ? [] : _activeView$props$dis
            if (disallowedTools.includes('MultipleChoice')) return false
            var status = true
            var _state$selection = state.selection,
              from = _state$selection.from,
              to = _state$selection.to
            if (from === null) return false
            state.doc.nodesBetween(from, to, function (node) {
              if (node.type.groups.includes('questions')) {
                status = false
              }
            })
            return status
          }

          return _this
        }

        _createClass(MultipleChoiceQuestion, [
          {
            key: 'renderTool',
            value: function renderTool(view) {
              if (isEmpty(view)) return null
              return this.isDisplayed()
                ? /*#__PURE__*/ React.createElement(ToolBarBtn$1, {
                    item: this.toJSON(),
                    key: v4(),
                    view: view,
                  })
                : null
            },
          },
          {
            key: 'run',
            get: function get() {
              return function (view, context) {
                helpers.createOptions(
                  view,
                  context,
                  view.state.config.schema.nodes.multiple_choice_container,
                  view.state.config.schema.nodes.question_node_multiple,
                  view.state.config.schema.nodes.multiple_choice,
                )
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {
                if (
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.multiple_choice,
                  ) ||
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.question_node_multiple,
                  )
                ) {
                  return true
                }

                return false
              }
            },
          },
        ])

        return MultipleChoiceQuestion
      })(Tools)),
      _temp$a)),
  ) || _class$a)

var multipleChoiceNode = {
  attrs: {
    class: {
      default: 'multiple-choice-option',
    },
    id: {
      default: '',
    },
    correct: {
      default: false,
    },
    answer: {
      default: false,
    },
    feedback: {
      default: '',
    },
  },
  group: 'block questions',
  content: 'block*',
  // defining: true,
  parseDOM: [
    {
      tag: 'div.multiple-choice-option',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          correct: JSON.parse(dom.getAttribute('correct').toLowerCase()),
          answer: JSON.parse(dom.getAttribute('answer').toLowerCase()),
          feedback: dom.getAttribute('feedback'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var multipleChoiceContainerNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'multiple-choice',
    },
  },
  group: 'block questions',
  atom: true,
  content: 'block+',
  parseDOM: [
    {
      tag: 'div.multiple-choice',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var questionNode = {
  attrs: {
    class: {
      default: 'multiple-choice-question',
    },
    id: {
      default: '',
    },
  },
  group: 'block questions',
  content: 'block*',
  // defining: true,
  parseDOM: [
    {
      tag: 'div.multiple-choice-question',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {}
  var target = {}
  var sourceKeys = Object.keys(source)
  var key, i

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i]
    if (excluded.indexOf(key) >= 0) continue
    target[key] = source[key]
  }

  return target
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {}
  var target = _objectWithoutPropertiesLoose(source, excluded)
  var key, i

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source)

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i]
      if (excluded.indexOf(key) >= 0) continue
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue
      target[key] = source[key]
    }
  }

  return target
}

function _templateObject4$g() {
  var data = _taggedTemplateLiteral(['\n      margin-left: ', ';\n    '])

  _templateObject4$g = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$i() {
  var data = _taggedTemplateLiteral(['\n      margin-right: ', ';\n    '])

  _templateObject3$i = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$l() {
  var data = _taggedTemplateLiteral([
    '\n  ',
    '\n\n  ',
    '\n    cursor: pointer;\n',
  ])

  _templateObject2$l = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$s() {
  var data = _taggedTemplateLiteral([
    '\n  button {\n    width: 55px;\n  }\n\n  .rc-switch-inner {\n    left: 31px;\n  }\n\n  .rc-switch-checked {\n    border: 1px solid #008000;\n    background-color: #008000;\n\n    .rc-switch-inner {\n      left: 6px;\n    }\n\n    &:after {\n      left: 33px;\n    }\n  }\n',
  ])

  _templateObject$s = function _templateObject() {
    return data
  }

  return data
}
var Wrapper$5 = styled.span(_templateObject$s())
var Label = styled.label(
  _templateObject2$l(),
  function (props) {
    return props.$labelPosition === 'left' && css(_templateObject3$i(), grid(2))
  },
  function (props) {
    return (
      props.$labelPosition === 'right' && css(_templateObject4$g(), grid(2))
    )
  },
)

var SwitchComponent = function SwitchComponent(props) {
  var className = props.className,
    label = props.label,
    _props$labelPosition = props.labelPosition,
    labelPosition =
      _props$labelPosition === void 0 ? 'right' : _props$labelPosition,
    _props$onChange = props.onChange,
    onChange =
      _props$onChange === void 0
        ? function () {
            return true
          }
        : _props$onChange,
    _props$text = props.text,
    text = _props$text === void 0 ? '' : _props$text,
    rest = _objectWithoutProperties(props, [
      'className',
      'label',
      'labelPosition',
      'onChange',
      'text',
    ])

  return /*#__PURE__*/ React.createElement(
    Wrapper$5,
    {
      className: className,
    },
    label &&
      labelPosition === 'left' &&
      /*#__PURE__*/ React.createElement(
        Label,
        {
          $labelPosition: labelPosition,
          onClick: onChange,
        },
        label,
      ),
    /*#__PURE__*/ React.createElement(
      Switch,
      Object.assign(
        {
          'aria-label': 'Is it correct '.concat(text),
          onChange: onChange,
        },
        rest,
      ),
    ),
    label &&
      labelPosition === 'right' &&
      /*#__PURE__*/ React.createElement(
        Label,
        {
          $labelPosition: labelPosition,
          onClick: onChange,
        },
        label,
      ),
  )
}

function _templateObject6$9() {
  var data = _taggedTemplateLiteral([
    '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject6$9 = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$a() {
  var data = _taggedTemplateLiteral([
    '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject5$a = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$h() {
  var data = _taggedTemplateLiteral([
    '\n  margin-right: 10px;\n\n  span {\n    color: ',
    ';\n  }\n',
  ])

  _templateObject4$h = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$j() {
  var data = _taggedTemplateLiteral([
    '\n  margin-right: 10px;\n\n  span {\n    color: #008000;\n  }\n',
  ])

  _templateObject3$j = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$m() {
  var data = _taggedTemplateLiteral(['\n  margin-left: auto;\n'])

  _templateObject2$m = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$t() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  margin-left: auto;\n',
  ])

  _templateObject$t = function _templateObject() {
    return data
  }

  return data
}
var StyledSwitch = styled(SwitchComponent)(_templateObject$t())
var AnswerContainer$5 = styled.span(_templateObject2$m())
var Correct = styled.span(_templateObject3$j())
var Answer$2 = styled.span(_templateObject4$h(), function (props) {
  return props.$isCorrect ? ' #008000' : 'red'
})
var StyledIconCorrect$3 = styled(Icon)(_templateObject5$a())
var StyledIconWrong$3 = styled(Icon)(_templateObject6$9())

var YesNoSwitch = function YesNoSwitch(_ref) {
  var customProps = _ref.customProps,
    node = _ref.node.node,
    isEditable = _ref.isEditable,
    handleChange = _ref.handleChange,
    checked = _ref.checked,
    checkedAnswerMode = _ref.checkedAnswerMode
  var testMode = customProps.testMode,
    showFeedBack = customProps.showFeedBack

  if (showFeedBack && node) {
    var correct = node.attrs.correct ? 'YES' : 'NO'
    var answer = node.attrs.answer ? 'YES' : 'NO'
    var isCorrect = node.attrs.correct === node.attrs.answer
    return /*#__PURE__*/ React.createElement(
      AnswerContainer$5,
      null,
      /*#__PURE__*/ React.createElement(
        Correct,
        null,
        'Correct:',
        /*#__PURE__*/ React.createElement('span', null, correct),
      ),
      /*#__PURE__*/ React.createElement(
        Answer$2,
        {
          $isCorrect: isCorrect,
        },
        'Answer: ',
        /*#__PURE__*/ React.createElement('span', null, answer),
      ),
      isCorrect &&
        /*#__PURE__*/ React.createElement(StyledIconCorrect$3, {
          name: 'done',
        }),
      !isCorrect &&
        /*#__PURE__*/ React.createElement(StyledIconWrong$3, {
          name: 'close',
        }),
    )
  }

  return /*#__PURE__*/ React.createElement(StyledSwitch, {
    checked:
      isEditable || (!isEditable && !testMode) ? checked : checkedAnswerMode,
    checkedChildren: 'YES',
    disabled: !isEditable && !testMode,
    label: 'Correct?',
    labelPosition: 'left',
    onChange: handleChange,
    text: node === null || node === void 0 ? void 0 : node.textContent,
    unCheckedChildren: 'NO',
  })
}

var CustomSwitch = function CustomSwitch(_ref) {
  var node = _ref.node,
    getPos = _ref.getPos
  var context = useContext(WaxContext)

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    checked = _useState2[0],
    setChecked = _useState2[1]

  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    checkedAnswerMode = _useState4[0],
    setCheckedAnswerMode = _useState4[1]

  var main = context.pmViews.main
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  useEffect(
    function () {
      var allNodes = getNodes$e(main)
      allNodes.forEach(function (singNode) {
        if (singNode.node.attrs.id === node.attrs.id) {
          setChecked(singNode.node.attrs.correct)
          setCheckedAnswerMode(singNode.node.attrs.answer)
        }
      })
    },
    [getNodes$e(main)],
  )

  var handleChange = function handleChange() {
    setChecked(!checked)
    setCheckedAnswerMode(!checkedAnswerMode)
    var key = isEditable ? 'correct' : 'answer'
    var value = isEditable ? !checked : !checkedAnswerMode
    var allNodes = getNodes$e(main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        main.dispatch(
          main.state.tr.setNodeMarkup(
            getPos(),
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              _defineProperty({}, key, value),
            ),
          ),
        )
      }
    })
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$e(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  return /*#__PURE__*/ React.createElement(YesNoSwitch, {
    checked: checked,
    checkedAnswerMode: checkedAnswerMode,
    customProps: customProps,
    handleChange: handleChange,
    isEditable: isEditable,
    node: getUpdatedNode(),
  })
}

var getNodes$e = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'multiple_choice') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var FeedbackEditorComponent = function FeedbackEditorComponent(_ref) {
  var _node$attrs

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos,
    readOnly = _ref.readOnly,
    handleInteraction = _ref.handleInteraction
  var editorRef = useRef(null)
  var questionViewRef = useRef(null)

  var _useContext = useContext(ApplicationContext),
    app = _useContext.app

  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var feedbackId = 'feedback-'.concat(
    node === null || node === void 0
      ? void 0
      : (_node$attrs = node.attrs) === null || _node$attrs === void 0
      ? void 0
      : _node$attrs.id,
  )
  var mainDispatchFn = main.dispatch.bind(main)

  var getInitialDoc = function getInitialDoc(schema) {
    var _node$attrs2

    var feedbackHtml =
      node === null || node === void 0
        ? void 0
        : (_node$attrs2 = node.attrs) === null || _node$attrs2 === void 0
        ? void 0
        : _node$attrs2.feedback

    if (!feedbackHtml || !feedbackHtml.trim()) {
      return schema.topNodeType.create(null, [schema.nodes.paragraph.create()])
    }

    try {
      var div = document.createElement('div')
      div.innerHTML = feedbackHtml
      var parsed = DOMParser.fromSchema(schema).parse(div)

      if (parsed.content.childCount > 0) {
        return parsed
      }
    } catch (e) {
      // Parsing failed, fall through to default
    }

    return schema.topNodeType.create(null, [schema.nodes.paragraph.create()])
  }

  var createKeyBindings = function createKeyBindings() {
    var keys = getKeys()
    Object.keys(baseKeymap).forEach(function (key) {
      if (keys[key]) {
        keys[key] = chainCommands(keys[key], baseKeymap[key])
      } else {
        keys[key] = baseKeymap[key]
      }
    })
    return keys
  }

  var getKeys = function getKeys() {
    return {
      'Mod-z': function ModZ() {
        return undo(main.state, main.dispatch)
      },
      'Mod-y': function ModY() {
        return redo(main.state, main.dispatch)
      },
    }
  }

  var serializeToHtml = function serializeToHtml(state) {
    var fragment = DOMSerializer.fromSchema(state.schema).serializeFragment(
      state.doc.content,
    )
    var div = document.createElement('div')
    div.appendChild(fragment)
    return div.innerHTML
  }

  var storeFeedback = function storeFeedback(state) {
    var html = serializeToHtml(state)
    var currentPos = getPos()
    if (currentPos == null) return
    var currentNode = main.state.doc.nodeAt(currentPos)
    if (!currentNode) return
    mainDispatchFn(
      main.state.tr.setNodeMarkup(
        currentPos,
        undefined,
        _objectSpread2(
          _objectSpread2({}, currentNode.attrs),
          {},
          {
            feedback: html,
          },
        ),
      ),
    )
  }

  useEffect(function () {
    var schema = main.state.schema // Override main.dispatch so that toolbar commands are applied to the
    // feedback editor when it has focus.  We extract addMark / removeMark
    // steps from the transaction and replay them against the feedback
    // editor's current selection.

    var activateRedirect = function activateRedirect() {
      main.dispatch = function (tr) {
        var editorDom = editorRef.current
        var isFeedbackFocused =
          editorDom &&
          (editorDom.contains(document.activeElement) ||
            editorDom === document.activeElement)

        if (!isFeedbackFocused) {
          mainDispatchFn(tr)
          return
        } // Feedback editor is focused — redirect mark commands to it

        var feedbackState = editorView.state
        var _feedbackState$select = feedbackState.selection,
          from = _feedbackState$select.from,
          to = _feedbackState$select.to
        var feedbackTr = feedbackState.tr
        var hasSteps = false
        tr.steps.forEach(function (step) {
          if (step.jsonID === 'addMark') {
            feedbackTr.addMark(from, to, step.mark)
            hasSteps = true
          } else if (step.jsonID === 'removeMark') {
            feedbackTr.removeMark(from, to, step.mark)
            hasSteps = true
          }
        })

        if (hasSteps) {
          editorView.dispatch(feedbackTr)
        }
      }
    }

    var deactivateRedirect = function deactivateRedirect() {
      main.dispatch = mainDispatchFn
    }

    var filteredPlugins = app.PmPlugins.getAll().filter(function (plugin) {
      return (
        !plugin.key.includes('y-sync') &&
        !plugin.key.includes('y-undo') &&
        !plugin.key.includes('yjs') &&
        !plugin.key.includes('comment')
      )
    })
    var placeholderPlugin = Placeholder({
      content: 'Insert feedback',
    })
    var finalPlugins = [
      FakeCursorPlugin(),
      gapCursor(),
      dropCursor(),
      placeholderPlugin,
      keymap(createKeyBindings()),
    ].concat(_toConsumableArray(filteredPlugins))

    var dispatchTransaction = function dispatchTransaction(tr) {
      var _editorView$state$app = editorView.state.applyTransaction(tr),
        state = _editorView$state$app.state

      editorView.updateState(state)

      if (!tr.getMeta('fromOutside')) {
        storeFeedback(state)
      }
    }

    var editorView = new EditorView(
      {
        mount: editorRef.current,
      },
      {
        editable: function editable() {
          return !readOnly
        },
        state: EditorState.create({
          doc: getInitialDoc(schema),
          plugins: finalPlugins,
        }),
        disallowedTools: [],
        dispatchTransaction: dispatchTransaction,
        handleDOMEvents: {
          mousedown: function mousedown() {
            handleInteraction()
            var currentPos = getPos() // Only set the main selection when the editor is not already
            // focused.  When it IS focused the redirect is active and
            // main.dispatch is overridden; main.state is untouched so
            // reading it here is safe in either case.

            if (currentPos != null && !editorView.hasFocus()) {
              main.dispatch(
                main.state.tr.setSelection(
                  NodeSelection.create(main.state.doc, currentPos),
                ),
              )
            }

            if (editorView.hasFocus()) editorView.focus()
          },
          blur: function blur(editorViewInstance, event) {
            deactivateRedirect()

            if (editorViewInstance && event.relatedTarget === null) {
              editorViewInstance.focus()
            }
          },
          focus: function focus() {
            activateRedirect()
            handleInteraction()
          },
        },
        attributes: {
          spellcheck: 'false',
        },
      },
    )
    questionViewRef.current = editorView // Register the feedback inner editor in pmViews

    context.updateView(_defineProperty({}, feedbackId, editorView), feedbackId)
    return function () {
      deactivateRedirect()
      editorView.destroy()
      context.removeView(feedbackId)
    }
  }, [])
  return /*#__PURE__*/ React.createElement('div', {
    ref: editorRef,
  })
}

function _templateObject5$b() {
  var data = _taggedTemplateLiteral([
    '\n  .ProseMirror {\n    border: none;\n    /* display: flex; */\n    /* font-family: Fira Sans Condensed; */\n    /* width: 100%; */\n    /* white-space: pre-wrap;\n    overflow-wrap: break-word; */\n    line-height: 31px;\n    padding: 8px 10px;\n    min-height: 31px;\n\n    &:focus {\n      outline: none;\n    }\n\n    p:first-child {\n      margin: 0;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n',
  ])

  _templateObject5$b = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$i() {
  var data = _taggedTemplateLiteral(['\n  font-weight: 700;\n'])

  _templateObject4$i = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$k() {
  var data = _taggedTemplateLiteral([
    '\n  background: none;\n  border: none;\n  box-shadow: none;\n  cursor: pointer;\n',
  ])

  _templateObject3$k = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$n() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  justify-content: space-between;\n',
  ])

  _templateObject2$n = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$u() {
  var data = _taggedTemplateLiteral([
    '\n  color: black;\n  margin-top: 10px;\n',
  ])

  _templateObject$u = function _templateObject() {
    return data
  }

  return data
}
var FeedBack$1 = styled.div(_templateObject$u())
var FeedbackHeader = styled.div(_templateObject2$n())
var EditButton = styled.button(_templateObject3$k())
var FeedBackLabel$1 = styled.span(_templateObject4$i())
var FeedbackEditorWrapper = styled.div(_templateObject5$b())
var FeedbackComponent$1 = function (_ref) {
  var _node$attrs, _node$attrs2

  var node = _ref.node,
    getPos = _ref.getPos,
    readOnly = _ref.readOnly,
    view = _ref.view
  var context = useContext(WaxContext)
  var setOption = context.setOption
  var textareaId = 'feedback-'.concat(
    node === null || node === void 0
      ? void 0
      : (_node$attrs = node.attrs) === null || _node$attrs === void 0
      ? void 0
      : _node$attrs.id,
  )
  var editTextareaId = 'edit-feedback-'.concat(
    node === null || node === void 0
      ? void 0
      : (_node$attrs2 = node.attrs) === null || _node$attrs2 === void 0
      ? void 0
      : _node$attrs2.id,
  )
  var handleInteraction = useCallback(
    function () {
      if (setOption && textareaId) {
        setOption({
          activeTextareaId: textareaId,
        })
      }
    },
    [setOption, textareaId],
  )
  return /*#__PURE__*/ React.createElement(
    FeedBack$1,
    null,
    /*#__PURE__*/ React.createElement(
      FeedbackHeader,
      null,
      /*#__PURE__*/ React.createElement(FeedBackLabel$1, null, 'Feedback'),
      /*#__PURE__*/ React.createElement(
        EditButton,
        {
          hidden: true,
          id: editTextareaId,
        },
        /*#__PURE__*/ React.createElement(
          'svg',
          {
            'aria-hidden': 'true',
            'data-icon': 'edit',
            fill: 'currentColor',
            focusable: 'false',
            height: '1em',
            viewBox: '64 64 896 896',
            width: '1em',
          },
          /*#__PURE__*/ React.createElement('path', {
            d: 'M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z',
          }),
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      FeedbackEditorWrapper,
      null,
      /*#__PURE__*/ React.createElement(FeedbackEditorComponent, {
        getPos: getPos,
        handleInteraction: handleInteraction,
        node: node,
        readOnly: readOnly,
        view: view,
      }),
    ),
  )
}

function _templateObject9$2() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject9$2 = function _templateObject9() {
    return data
  }

  return data
}

function _templateObject8$4() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n',
  ])

  _templateObject8$4 = function _templateObject8() {
    return data
  }

  return data
}

function _templateObject7$8() {
  var data = _taggedTemplateLiteral([
    "\n  align-items: normal;\n  display: flex;\n  flex-direction: row;\n  .ProseMirror {\n    :empty::before {\n      content: 'Type option';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n  }\n",
  ])

  _templateObject7$8 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$a() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n\n  button {\n    border: none;\n    box-shadow: none;\n  }\n\n  span {\n    cursor: pointer;\n  }\n',
  ])

  _templateObject6$a = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$c() {
  var data = _taggedTemplateLiteral([
    '\n  border: 1px solid #a5a1a2;\n  border-radius: 4px;\n  color: black;\n  display: flex;\n  flex: 2 1 auto;\n  flex-direction: column;\n  padding: 10px;\n',
  ])

  _templateObject5$c = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$j() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n',
  ])

  _templateObject4$j = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$l() {
  var data = _taggedTemplateLiteral([
    "\n  &:before {\n    content: 'Answer ' counter(question-item-multiple);\n    counter-increment: question-item-multiple;\n  }\n",
  ])

  _templateObject3$l = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$o() {
  var data = _taggedTemplateLiteral([
    '\n  color: black;\n  display: flex;\n  flex-direction: row;\n  padding: 10px 0px 4px 0px;\n',
  ])

  _templateObject2$o = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$v() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  padding: 0px 0px 20px 20px;\n',
  ])

  _templateObject$v = function _templateObject() {
    return data
  }

  return data
}
var Wrapper$6 = styled.div(_templateObject$v())
var InfoRow = styled.div(_templateObject2$o())
var QuestionNunber = styled.span(_templateObject3$l())
var QuestionControlsWrapper = styled.div(_templateObject4$j())
var QuestionWrapper$1 = styled.div(_templateObject5$c())
var IconsWrapper = styled.div(_templateObject6$a())
var QuestionData = styled.div(_templateObject7$8())
var ActionButton$6 = styled.button(_templateObject8$4())
var StyledIconAction$5 = styled(Icon)(_templateObject9$2())
var AnswerComponent = function (_ref) {
  var _getUpdatedNode, _getUpdatedNode$node, _getUpdatedNode$node2

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var addOptionBtnRef = useRef(null)
  var removeOptionBtnRef = useRef(null)
  useEffect(function () {
    var listener = function listener(event) {
      if (event.code === 'Enter') {
        event.preventDefault()
        if (addOptionBtnRef.current) addOptionBtnRef.current.click()
      }
    }

    if (addOptionBtnRef.current)
      addOptionBtnRef.current.addEventListener('keydown', listener)
    return function () {
      if (addOptionBtnRef.current)
        addOptionBtnRef.current.removeEventListener('keydown', listener)
    }
  }, [])
  useEffect(function () {
    var listener = function listener(event) {
      if (event.code === 'Enter') {
        event.preventDefault()
        if (removeOptionBtnRef.current) removeOptionBtnRef.current.click()
      }
    }

    if (removeOptionBtnRef.current)
      removeOptionBtnRef.current.addEventListener('keydown', listener)
    return function () {
      if (removeOptionBtnRef.current)
        removeOptionBtnRef.current.removeEventListener('keydown', listener)
    }
  }, [])

  var removeOption = function removeOption() {
    var answersCount = findAnswerCount()

    if (answersCount.count >= 1) {
      main.state.doc.nodesBetween(
        getPos(),
        getPos() + 1,
        function (sinlgeNode) {
          if (sinlgeNode.attrs.id === node.attrs.id) {
            main.dispatch(
              main.state.tr.deleteRange(
                getPos(),
                getPos() + sinlgeNode.nodeSize,
              ),
            )
          }
        },
      )
    } else {
      main.dispatch(
        main.state.tr.setSelection(
          NodeSelection.create(main.state.doc, answersCount.parentPosition),
        ),
      )
      main.dispatch(main.state.tr.deleteSelection())
    }
  } // const removeOption = () => {
  //   const answersCount = findAnswerCount();
  //   if (answersCount.count >= 1) {
  //     answersCount.parentContainer.content.content.forEach(sinlgeNode => {
  //       if (sinlgeNode.attrs.id === node.attrs.id) {
  //         main.dispatch(
  //           main.state.tr.deleteRange(getPos(), getPos() + sinlgeNode.nodeSize),
  //         );
  //       }
  //     });
  //   } else {
  //     main.dispatch(
  //       main.state.tr.setSelection(
  //         NodeSelection.create(main.state.doc, answersCount.parentPosition),
  //       ),
  //     );
  //     main.dispatch(main.state.tr.deleteSelection());
  //   }
  // };

  var addOption = function addOption(nodeId) {
    var newAnswerId = v4()
    main.state.doc.descendants(function (editorNode, index) {
      if (editorNode.type.name === 'multiple_choice') {
        if (editorNode.attrs.id === nodeId) {
          main.dispatch(
            main.state.tr.setSelection(
              new TextSelection(
                main.state.tr.doc.resolve(editorNode.nodeSize + index),
              ),
            ),
          )
          var answerOption =
            main.state.config.schema.nodes.multiple_choice.create(
              {
                id: newAnswerId,
              },
              Fragment.empty,
            )
          main.dispatch(main.state.tr.replaceSelectionWith(answerOption)) // create Empty Paragraph

          setTimeout(function () {
            helpers.createEmptyParagraph(context, newAnswerId)
          }, 120)
        }
      }
    })
  }

  var findAnswerCount = function findAnswerCount() {
    main.dispatch(
      main.state.tr.setSelection(
        NodeSelection.create(main.state.doc, getPos()),
      ),
    )
    var parentContainer = DocumentHelpers.findParentOfType(
      main.state,
      main.state.config.schema.nodes.multiple_choice_container,
    )
    var parentPosition = 0
    main.state.doc.descendants(function (parentNode, parentPos) {
      if (
        parentNode.type.name === 'multiple_choice_container' &&
        parentNode.attrs.id === parentContainer.attrs.id
      ) {
        parentPosition = parentPos
      }
    })
    var count = -1
    parentContainer.descendants(function (element) {
      if (element.type.name === 'multiple_choice') {
        count += 1
      }
    })
    return {
      count: count,
      parentPosition: parentPosition,
      parentContainer: parentContainer,
    }
  }

  var readOnly = !isEditable
  var testMode = customProps.testMode
  var feedback = node.attrs.feedback

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$f(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  return /*#__PURE__*/ React.createElement(
    Wrapper$6,
    null,
    /*#__PURE__*/ React.createElement(
      QuestionControlsWrapper,
      null,
      /*#__PURE__*/ React.createElement(
        InfoRow,
        null,
        /*#__PURE__*/ React.createElement(QuestionNunber, null),
        /*#__PURE__*/ React.createElement(CustomSwitch, {
          getPos: getPos,
          node: node,
        }),
      ),
      /*#__PURE__*/ React.createElement(
        QuestionWrapper$1,
        null,
        /*#__PURE__*/ React.createElement(
          QuestionData,
          null,
          /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
            getPos: getPos,
            node: node,
            placeholderText: 'Type option',
            view: view,
          }),
        ),
        /*#__PURE__*/ React.createElement('hr', null),
        !testMode &&
          !(readOnly && feedback === '') &&
          /*#__PURE__*/ React.createElement(FeedbackComponent$1, {
            getPos: getPos,
            node:
              (_getUpdatedNode = getUpdatedNode()) === null ||
              _getUpdatedNode === void 0
                ? void 0
                : _getUpdatedNode.node,
            readOnly: readOnly,
            view: view,
          }), // <FeedbackComponent
        // getPos={getPos}
        // node={getUpdatedNode()?.node}
        // readOnly={readOnly}
        // // view={view}
        // />
      ),
    ),
    /*#__PURE__*/ React.createElement(
      IconsWrapper,
      null,
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$6,
          {
            'aria-label': 'Add new option below '.concat(
              (_getUpdatedNode$node = getUpdatedNode().node) === null ||
                _getUpdatedNode$node === void 0
                ? void 0
                : _getUpdatedNode$node.textContent,
            ),
            onClick: function onClick() {
              return addOption(node.attrs.id)
            },
            ref: addOptionBtnRef,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$5, {
            name: 'plusSquare',
          }),
        ),
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$6,
          {
            'aria-label': 'delete this option '.concat(
              (_getUpdatedNode$node2 = getUpdatedNode().node) === null ||
                _getUpdatedNode$node2 === void 0
                ? void 0
                : _getUpdatedNode$node2.textContent,
            ),
            onClick: removeOption,
            ref: removeOptionBtnRef,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$5, {
            name: 'deleteOutlined',
          }),
        ),
    ),
  )
}

var getNodes$f = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'multiple_choice') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var QuestionComponent = function (_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var testMode = customProps.testMode
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  return /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
    getPos: getPos,
    node: node,
    showDelete: !testMode && isEditable,
    view: view,
  })
}

function _templateObject5$d() {
  var data = _taggedTemplateLiteral([
    '\n  // border: 3px solid #f5f5f7;\n  margin-bottom: 30px;\n',
  ])

  _templateObject5$d = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$k() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject4$k = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$m() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n  border: none;\n  position: relative;\n  bottom: 14px;\n  left: 6px;\n  float: right;\n',
  ])

  _templateObject3$m = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$p() {
  var data = _taggedTemplateLiteral([
    '\n  border-bottom: 3px solid #f5f5f7;\n  height: 32px;\n',
  ])

  _templateObject2$p = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$w() {
  var data = _taggedTemplateLiteral([
    '\n  border: 3px solid #f5f5f7;\n  margin: 0px 38px 15px 38px;\n  margin-top: 10px;\n',
  ])

  _templateObject$w = function _templateObject() {
    return data
  }

  return data
}
var MultipleChoiceQuestionWrapper = styled.div(_templateObject$w())
var MultipleChoiceContainerTool = styled.div(_templateObject2$p())
var ActionButton$7 = styled.button(_templateObject3$m())
var StyledIconActionRemove$5 = styled(Icon)(_templateObject4$k())
var MultipleChoiceQuestionContainer = styled.div(_templateObject5$d())

var MultipleChoiceNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(MultipleChoiceNodeView, _QuestionsNodeView)

  var _super = _createSuper(MultipleChoiceNodeView)

  function MultipleChoiceNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, MultipleChoiceNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    MultipleChoiceNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            !event.target.type ||
            event.target.type === 'button' ||
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          var feedbackView =
            this.context.pmViews['feedback-'.concat(this.node.attrs.id)]
          return (
            (innerView && innerView.dom.contains(event.target)) ||
            (feedbackView && feedbackView.dom.contains(event.target))
          )
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'multiple_choice'
        },
      },
    ],
  )

  return MultipleChoiceNodeView
})(QuestionsNodeView)

var QuestionNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(QuestionNodeView, _QuestionsNodeView)

  var _super = _createSuper(QuestionNodeView)

  function QuestionNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, QuestionNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    QuestionNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'question_node_multiple'
        },
      },
    ],
  )

  return QuestionNodeView
})(QuestionsNodeView)

var _dec$b, _class$b, _temp$b
var MultipleChoiceSingleCorrectQuestion =
  ((_dec$b = injectable()),
  _dec$b(
    (_class$b =
      ((_temp$b = /*#__PURE__*/ (function (_Tools) {
        _inherits(MultipleChoiceSingleCorrectQuestion, _Tools)

        var _super = _createSuper(MultipleChoiceSingleCorrectQuestion)

        function MultipleChoiceSingleCorrectQuestion() {
          var _this

          _classCallCheck(this, MultipleChoiceSingleCorrectQuestion)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Add Multiple Choice Single Correct Question'
          _this.icon = 'multipleChoice'
          _this.name = 'Multiple choice (single correct)'
          _this.label = 'Multiple choice (single correct)'

          _this.select = function (state, activeView) {
            var _activeView$props$dis = activeView.props.disallowedTools,
              disallowedTools =
                _activeView$props$dis === void 0 ? [] : _activeView$props$dis
            if (disallowedTools.includes('MultipleChoice')) return false
            var status = true
            var _state$selection = state.selection,
              from = _state$selection.from,
              to = _state$selection.to
            if (from === null) return false
            state.doc.nodesBetween(from, to, function (node) {
              if (node.type.groups.includes('questions')) {
                status = false
              }
            })
            return status
          }

          return _this
        }

        _createClass(MultipleChoiceSingleCorrectQuestion, [
          {
            key: 'renderTool',
            value: function renderTool(view) {
              if (isEmpty(view)) return null
              return this.isDisplayed()
                ? /*#__PURE__*/ React.createElement(ToolBarBtn$1, {
                    item: this.toJSON(),
                    key: v4(),
                    view: view,
                  })
                : null
            },
          },
          {
            key: 'run',
            get: function get() {
              return function (view, context) {
                helpers.createOptions(
                  view,
                  context,
                  view.state.config.schema.nodes
                    .multiple_choice_single_correct_container,
                  view.state.config.schema.nodes.question_node_multiple_single,
                  view.state.config.schema.nodes.multiple_choice_single_correct,
                )
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {
                if (
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes
                      .multiple_choice_single_correct_container,
                  ) ||
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.multiple_choice_single_correct,
                  ) ||
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.question_node_multiple_single,
                  )
                ) {
                  return true
                }

                return false
              }
            },
          },
        ])

        return MultipleChoiceSingleCorrectQuestion
      })(Tools)),
      _temp$b)),
  ) || _class$b)

var multipleChoiceSingleCorrectNode = {
  attrs: {
    class: {
      default: 'multiple-choice-option-single-correct',
    },
    id: {
      default: '',
    },
    correct: {
      default: false,
    },
    answer: {
      default: false,
    },
    feedback: {
      default: '',
    },
  },
  group: 'block questions',
  content: 'block*',
  // defining: true,
  parseDOM: [
    {
      tag: 'div.multiple-choice-option-single-correct',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          correct: JSON.parse(dom.getAttribute('correct').toLowerCase()),
          answer: JSON.parse(dom.getAttribute('answer').toLowerCase()),
          feedback: dom.getAttribute('feedback'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var multipleChoiceSingleCorrectContainerNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'multiple-choice-single-correct',
    },
    correctId: {
      default: '',
    },
  },
  group: 'block questions',
  atom: true,
  selectable: true,
  draggable: true,
  content: 'block*',
  parseDOM: [
    {
      tag: 'div.multiple-choice-single-correct',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          correctId: dom.getAttribute('correctId'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var questionSingleNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'multiple-choice-question-single',
    },
  },
  group: 'block questions',
  content: 'block*',
  // defining: true,
  // atom: true,
  parseDOM: [
    {
      tag: 'div.multiple-choice-question-single',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var CustomSwitch$1 = function CustomSwitch(_ref) {
  var node = _ref.node,
    getPos = _ref.getPos
  var context = useContext(WaxContext)

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    checked = _useState2[0],
    setChecked = _useState2[1]

  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    checkedAnswerMode = _useState4[0],
    setCheckedAnswerMode = _useState4[1]

  var main = context.pmViews.main
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var customProps = main.props.customValues
  useEffect(
    function () {
      var allNodes = getNodes$g(main)
      allNodes.forEach(function (singNode) {
        if (singNode.node.attrs.id === node.attrs.id) {
          setChecked(singNode.node.attrs.correct)
          setCheckedAnswerMode(singNode.node.attrs.answer)
        }
      })
    },
    [getNodes$g(main)],
  )

  var handleChange = function handleChange() {
    setChecked(!checked)
    setCheckedAnswerMode(!checkedAnswerMode)
    var key = isEditable ? 'correct' : 'answer'
    var value = isEditable ? !checked : !checkedAnswerMode
    main.dispatch(
      main.state.tr.setSelection(
        NodeSelection.create(main.state.doc, getPos()),
      ),
    )
    var parentContainer = DocumentHelpers.findParentOfType(
      main.state,
      main.state.config.schema.nodes.multiple_choice_single_correct_container,
    )
    var parentPosition = 0
    main.state.doc.descendants(function (parentNode, parentPos) {
      if (
        parentNode.type.name === 'multiple_choice_single_correct_container' &&
        parentNode.attrs.id === parentContainer.attrs.id
      ) {
        parentPosition = parentPos
      }
    })
    var tr = main.state.tr
    parentContainer.descendants(function (element, position) {
      if (
        element.type.name === 'multiple_choice_single_correct' &&
        element.attrs.id === node.attrs.id
      ) {
        tr.setNodeMarkup(
          getPos(),
          undefined,
          _objectSpread2(
            _objectSpread2({}, element.attrs),
            {},
            _defineProperty({}, key, value),
          ),
        )
      } else if (
        element.type.name === 'multiple_choice_single_correct' &&
        element.attrs[key]
      ) {
        tr.setNodeMarkup(
          parentPosition + position + 1,
          undefined,
          _objectSpread2(
            _objectSpread2({}, element.attrs),
            {},
            _defineProperty({}, key, false),
          ),
        )
      }
    })
    main.dispatch(tr)
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$g(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  return /*#__PURE__*/ React.createElement(YesNoSwitch, {
    checked: checked,
    checkedAnswerMode: checkedAnswerMode,
    customProps: customProps,
    handleChange: handleChange,
    isEditable: isEditable,
    node: getUpdatedNode(),
  })
}

var getNodes$g = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'multiple_choice_single_correct') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

function _templateObject9$3() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject9$3 = function _templateObject9() {
    return data
  }

  return data
}

function _templateObject8$5() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n',
  ])

  _templateObject8$5 = function _templateObject8() {
    return data
  }

  return data
}

function _templateObject7$9() {
  var data = _taggedTemplateLiteral([
    "\n  align-items: normal;\n  display: flex;\n  flex-direction: row;\n  .ProseMirror {\n    :empty::before {\n      content: 'Type option';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n  }\n",
  ])

  _templateObject7$9 = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$b() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n\n  button {\n    border: none;\n    box-shadow: none;\n  }\n\n  span {\n    cursor: pointer;\n  }\n',
  ])

  _templateObject6$b = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$e() {
  var data = _taggedTemplateLiteral([
    '\n  border: 1px solid #a5a1a2;\n  border-radius: 4px;\n  color: black;\n  display: flex;\n  flex: 2 1 auto;\n  flex-direction: column;\n  padding: 10px;\n',
  ])

  _templateObject5$e = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$l() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n',
  ])

  _templateObject4$l = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$n() {
  var data = _taggedTemplateLiteral([
    "\n  &:before {\n    content: 'Answer ' counter(question-item-multiple);\n    counter-increment: question-item-multiple;\n  }\n",
  ])

  _templateObject3$n = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$q() {
  var data = _taggedTemplateLiteral([
    '\n  color: black;\n  display: flex;\n  flex-direction: row;\n  padding: 10px 0px 4px 0px;\n',
  ])

  _templateObject2$q = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$x() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  padding: 0px 0px 20px 20px;\n',
  ])

  _templateObject$x = function _templateObject() {
    return data
  }

  return data
}
var Wrapper$7 = styled.div(_templateObject$x())
var InfoRow$1 = styled.div(_templateObject2$q())
var QuestionNunber$1 = styled.span(_templateObject3$n())
var QuestionControlsWrapper$1 = styled.div(_templateObject4$l())
var QuestionWrapper$2 = styled.div(_templateObject5$e())
var IconsWrapper$1 = styled.div(_templateObject6$b())
var QuestionData$1 = styled.div(_templateObject7$9())
var ActionButton$8 = styled.button(_templateObject8$5())
var StyledIconAction$6 = styled(Icon)(_templateObject9$3())
var AnswerComponent$1 = function (_ref) {
  var _getUpdatedNode, _getUpdatedNode$node, _getUpdatedNode$node2

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var addOptionBtnRef = useRef(null)
  var removeOptionBtnRef = useRef(null)
  useEffect(function () {
    var listener = function listener(event) {
      if (event.code === 'Enter') {
        event.preventDefault()
        if (addOptionBtnRef.current) addOptionBtnRef.current.click()
      }
    }

    if (addOptionBtnRef.current)
      addOptionBtnRef.current.addEventListener('keydown', listener)
    return function () {
      if (addOptionBtnRef.current)
        addOptionBtnRef.current.removeEventListener('keydown', listener)
    }
  }, [])
  useEffect(function () {
    var listener = function listener(event) {
      if (event.code === 'Enter') {
        event.preventDefault()
        if (removeOptionBtnRef.current) removeOptionBtnRef.current.click()
      }
    }

    if (removeOptionBtnRef.current)
      removeOptionBtnRef.current.addEventListener('keydown', listener)
    return function () {
      if (removeOptionBtnRef.current)
        removeOptionBtnRef.current.removeEventListener('keydown', listener)
    }
  }, [])

  var removeOption = function removeOption() {
    var answersCount = findAnswerCount()

    if (answersCount.count >= 1) {
      main.state.doc.nodesBetween(
        getPos(),
        getPos() + 1,
        function (sinlgeNode, pos) {
          if (sinlgeNode.attrs.id === node.attrs.id) {
            main.dispatch(
              main.state.tr.deleteRange(
                getPos(),
                getPos() + sinlgeNode.nodeSize,
              ),
            )
          }
        },
      )
    } else {
      main.dispatch(
        main.state.tr.setSelection(
          NodeSelection.create(main.state.doc, answersCount.parentPosition),
        ),
      )
      main.dispatch(main.state.tr.deleteSelection())
    }
  }

  var addOption = function addOption(nodeId) {
    var newAnswerId = v4()
    main.state.doc.descendants(function (editorNode, index) {
      if (editorNode.type.name === 'multiple_choice_single_correct') {
        if (editorNode.attrs.id === nodeId) {
          main.dispatch(
            main.state.tr.setSelection(
              new TextSelection(
                main.state.tr.doc.resolve(editorNode.nodeSize + index),
              ),
            ),
          )
          var answerOption =
            main.state.config.schema.nodes.multiple_choice_single_correct.create(
              {
                id: newAnswerId,
              },
              Fragment.empty,
            )
          main.dispatch(main.state.tr.replaceSelectionWith(answerOption)) // create Empty Paragraph

          setTimeout(function () {
            helpers.createEmptyParagraph(context, newAnswerId)
          }, 120)
        }
      }
    })
  }

  var findAnswerCount = function findAnswerCount() {
    main.dispatch(
      main.state.tr.setSelection(
        NodeSelection.create(main.state.doc, getPos()),
      ),
    )
    var parentContainer = DocumentHelpers.findParentOfType(
      main.state,
      main.state.config.schema.nodes.multiple_choice_single_correct_container,
    )
    var parentPosition = 0
    main.state.doc.descendants(function (parentNode, parentPos) {
      if (
        parentNode.type.name === 'multiple_choice_single_correct_container' &&
        parentNode.attrs.id === parentContainer.attrs.id
      ) {
        parentPosition = parentPos
      }
    })
    var count = -1
    parentContainer.descendants(function (element) {
      if (element.type.name === 'multiple_choice_single_correct') {
        count += 1
      }
    })
    return {
      count: count,
      parentPosition: parentPosition,
      parentContainer: parentContainer,
    }
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$h(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  var readOnly = !isEditable
  var testMode = customProps.testMode
  var feedback = node.attrs.feedback
  return /*#__PURE__*/ React.createElement(
    Wrapper$7,
    null,
    /*#__PURE__*/ React.createElement(
      QuestionControlsWrapper$1,
      null,
      /*#__PURE__*/ React.createElement(
        InfoRow$1,
        null,
        /*#__PURE__*/ React.createElement(QuestionNunber$1, null),
        /*#__PURE__*/ React.createElement(CustomSwitch$1, {
          getPos: getPos,
          node: node,
        }),
      ),
      /*#__PURE__*/ React.createElement(
        QuestionWrapper$2,
        null,
        /*#__PURE__*/ React.createElement(
          QuestionData$1,
          null,
          /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
            getPos: getPos,
            node:
              (_getUpdatedNode = getUpdatedNode()) === null ||
              _getUpdatedNode === void 0
                ? void 0
                : _getUpdatedNode.node,
            placeholderText: 'Type option',
            view: view,
          }),
        ),
        !testMode &&
          !(readOnly && feedback === '') &&
          /*#__PURE__*/ React.createElement(FeedbackComponent, {
            getPos: getPos,
            node: node,
            readOnly: readOnly,
            view: view,
          }),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      IconsWrapper$1,
      null,
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$8,
          {
            'aria-label': 'Add new option below '.concat(
              (_getUpdatedNode$node = getUpdatedNode().node) === null ||
                _getUpdatedNode$node === void 0
                ? void 0
                : _getUpdatedNode$node.textContent,
            ),
            onClick: function onClick() {
              return addOption(node.attrs.id)
            },
            ref: addOptionBtnRef,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$6, {
            name: 'plusSquare',
          }),
        ),
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$8,
          {
            'aria-label': 'delete this option '.concat(
              (_getUpdatedNode$node2 = getUpdatedNode().node) === null ||
                _getUpdatedNode$node2 === void 0
                ? void 0
                : _getUpdatedNode$node2.textContent,
            ),
            onClick: removeOption,
            ref: removeOptionBtnRef,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$6, {
            name: 'deleteOutlined',
          }),
        ),
    ),
  )
}

var getNodes$h = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'multiple_choice_single_correct') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var MultipleChoiceSingleCorrectNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
  _inherits(MultipleChoiceSingleCorrectNodeView, _QuestionsNodeView)

  var _super = _createSuper(MultipleChoiceSingleCorrectNodeView)

  function MultipleChoiceSingleCorrectNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, MultipleChoiceSingleCorrectNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    MultipleChoiceSingleCorrectNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            !event.target.type ||
            event.target.type === 'button' ||
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'multiple_choice_single_correct'
        },
      },
    ],
  )

  return MultipleChoiceSingleCorrectNodeView
})(QuestionsNodeView)

var QuestionMultipleSingleNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
  _inherits(QuestionMultipleSingleNodeView, _QuestionsNodeView)

  var _super = _createSuper(QuestionMultipleSingleNodeView)

  function QuestionMultipleSingleNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, QuestionMultipleSingleNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    QuestionMultipleSingleNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            !event.target.type ||
            event.target.type === 'button' ||
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'question_node_multiple_single'
        },
      },
    ],
  )

  return QuestionMultipleSingleNodeView
})(QuestionsNodeView)

var MultipleChoiceSingleCorrectQuestionService = /*#__PURE__*/ (function (
  _Service,
) {
  _inherits(MultipleChoiceSingleCorrectQuestionService, _Service)

  var _super = _createSuper(MultipleChoiceSingleCorrectQuestionService)

  function MultipleChoiceSingleCorrectQuestionService() {
    _classCallCheck(this, MultipleChoiceSingleCorrectQuestionService)

    return _super.apply(this, arguments)
  }

  _createClass(MultipleChoiceSingleCorrectQuestionService, [
    {
      key: 'register',
      value: function register() {
        this.container
          .bind('MultipleChoiceSingleCorrectQuestion')
          .to(MultipleChoiceSingleCorrectQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          multiple_choice_single_correct_container:
            multipleChoiceSingleCorrectContainerNode,
        })
        createNode({
          multiple_choice_single_correct: multipleChoiceSingleCorrectNode,
        })
        createNode({
          question_node_multiple_single: questionSingleNode,
        }) // addPortal({
        //   nodeView: MultipleChoiceSingleCorrectContainerNodeView,
        //   component: MultipleChoiceContainerComponent,
        //   context: this.app,
        // });

        addPortal({
          nodeView: QuestionMultipleSingleNodeView,
          component: QuestionComponent,
          context: this.app,
        })
        addPortal({
          nodeView: MultipleChoiceSingleCorrectNodeView,
          component: AnswerComponent$1,
          context: this.app,
        })
      },
    },
  ])

  return MultipleChoiceSingleCorrectQuestionService
})(Service)

var _dec$c, _class$c, _temp$c
var TrueFalseQuestion =
  ((_dec$c = injectable()),
  _dec$c(
    (_class$c =
      ((_temp$c = /*#__PURE__*/ (function (_Tools) {
        _inherits(TrueFalseQuestion, _Tools)

        var _super = _createSuper(TrueFalseQuestion)

        function TrueFalseQuestion() {
          var _this

          _classCallCheck(this, TrueFalseQuestion)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Add True False Question'
          _this.icon = 'multipleChoice'
          _this.name = 'TrueFalse'
          _this.label = 'True False'

          _this.select = function (state, activeView) {
            var _activeView$props$dis = activeView.props.disallowedTools,
              disallowedTools =
                _activeView$props$dis === void 0 ? [] : _activeView$props$dis
            if (disallowedTools.includes('MultipleChoice')) return false
            var status = true
            var _state$selection = state.selection,
              from = _state$selection.from,
              to = _state$selection.to
            if (from === null) return false
            state.doc.nodesBetween(from, to, function (node) {
              if (node.type.groups.includes('questions')) {
                status = false
              }
            })
            return status
          }

          return _this
        }

        _createClass(TrueFalseQuestion, [
          {
            key: 'renderTool',
            value: function renderTool(view) {
              if (isEmpty(view)) return null
              return this.isDisplayed()
                ? /*#__PURE__*/ React.createElement(ToolBarBtn$1, {
                    item: this.toJSON(),
                    key: v4(),
                    view: view,
                  })
                : null
            },
          },
          {
            key: 'run',
            get: function get() {
              return function (view, context) {
                helpers.createOptions(
                  view,
                  context,
                  view.state.config.schema.nodes.true_false_container,
                  view.state.config.schema.nodes.question_node_true_false,
                  view.state.config.schema.nodes.true_false,
                )
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {
                if (
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.true_false_container,
                  ) ||
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.true_false,
                  ) ||
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.question_node_true_false,
                  )
                ) {
                  return true
                }

                return false
              }
            },
          },
        ])

        return TrueFalseQuestion
      })(Tools)),
      _temp$c)),
  ) || _class$c)

var trueFalseNode = {
  attrs: {
    class: {
      default: 'true-false-option',
    },
    id: {
      default: '',
    },
    correct: {
      default: false,
    },
    answer: {
      default: false,
    },
    feedback: {
      default: '',
    },
  },
  group: 'block questions',
  content: 'block*',
  // defining: true,
  parseDOM: [
    {
      tag: 'div.true-false-option',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          correct: JSON.parse(dom.getAttribute('correct').toLowerCase()),
          answer: JSON.parse(dom.getAttribute('answer').toLowerCase()),
          feedback: dom.getAttribute('feedback'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var questionTrueFalseNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'true-false-question',
    },
  },
  group: 'block questions',
  // content: 'paragraph* bulletlist* orderedlist*',
  content: 'block*',
  // defining: true,
  // atom: true,
  parseDOM: [
    {
      tag: 'div.true-false-question',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var trueFalseContainerNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'true-false',
    },
  },
  group: 'block questions',
  atom: true,
  selectable: true,
  draggable: true,
  content: 'block*',
  parseDOM: [
    {
      tag: 'div.true-false',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

function _templateObject6$c() {
  var data = _taggedTemplateLiteral([
    '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject6$c = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$f() {
  var data = _taggedTemplateLiteral([
    '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
  ])

  _templateObject5$f = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$m() {
  var data = _taggedTemplateLiteral([
    '\n  margin-right: 10px;\n\n  span {\n    color: ',
    ';\n  }\n',
  ])

  _templateObject4$m = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$o() {
  var data = _taggedTemplateLiteral([
    '\n  margin-right: 10px;\n\n  span {\n    color: #008000;\n  }\n',
  ])

  _templateObject3$o = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$r() {
  var data = _taggedTemplateLiteral(['\n  margin-left: auto;\n'])

  _templateObject2$r = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$y() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  margin-left: auto;\n\n  button {\n    width: 65px;\n  }\n\n  .rc-switch-inner {\n    font-size: 14px;\n    left: 25px;\n  }\n\n  .rc-switch-checked {\n    background-color: #008000;\n    border: 1px solid #008000;\n\n    .rc-switch-inner {\n      left: 6px;\n    }\n\n    &::after {\n      left: 42px;\n    }\n  }\n',
  ])

  _templateObject$y = function _templateObject() {
    return data
  }

  return data
}
var StyledSwitch$1 = styled(SwitchComponent)(_templateObject$y())
var AnswerContainer$6 = styled.span(_templateObject2$r())
var Correct$1 = styled.span(_templateObject3$o())
var Answer$3 = styled.span(_templateObject4$m(), function (props) {
  return props.$isCorrect ? ' #008000' : 'red'
})
var StyledIconCorrect$4 = styled(Icon)(_templateObject5$f())
var StyledIconWrong$4 = styled(Icon)(_templateObject6$c())

var TrueFalseSwitch = function TrueFalseSwitch(_ref) {
  var customProps = _ref.customProps,
    node = _ref.node.node,
    isEditable = _ref.isEditable,
    handleChange = _ref.handleChange,
    checked = _ref.checked,
    checkedAnswerMode = _ref.checkedAnswerMode
  var testMode = customProps.testMode,
    showFeedBack = customProps.showFeedBack

  if (showFeedBack) {
    var correct = node.attrs.correct ? 'TRUE' : 'FALSE'
    var answer = node.attrs.answer ? 'TRUE' : 'FALSE'
    var isCorrect = node.attrs.correct === node.attrs.answer
    return /*#__PURE__*/ React.createElement(
      AnswerContainer$6,
      null,
      /*#__PURE__*/ React.createElement(
        Correct$1,
        null,
        'Correct:',
        /*#__PURE__*/ React.createElement('span', null, correct),
      ),
      /*#__PURE__*/ React.createElement(
        Answer$3,
        {
          $isCorrect: isCorrect,
        },
        'Answer: ',
        /*#__PURE__*/ React.createElement('span', null, answer),
      ),
      isCorrect &&
        /*#__PURE__*/ React.createElement(StyledIconCorrect$4, {
          name: 'done',
        }),
      !isCorrect &&
        /*#__PURE__*/ React.createElement(StyledIconWrong$4, {
          name: 'close',
        }),
    )
  }

  return /*#__PURE__*/ React.createElement(StyledSwitch$1, {
    checked:
      isEditable || (!isEditable && !testMode) ? checked : checkedAnswerMode,
    checkedChildren: 'True',
    disabled: !isEditable && !testMode,
    label: 'True/False?',
    labelPosition: 'left',
    onChange: handleChange,
    unCheckedChildren: 'False',
  })
}

var CustomSwitch$2 = function CustomSwitch(_ref) {
  var node = _ref.node,
    getPos = _ref.getPos
  var context = useContext(WaxContext)

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    checked = _useState2[0],
    setChecked = _useState2[1]

  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    checkedAnswerMode = _useState4[0],
    setCheckedAnswerMode = _useState4[1]

  var main = context.pmViews.main
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  useEffect(
    function () {
      var allNodes = getNodes$i(main)
      allNodes.forEach(function (singNode) {
        if (singNode.node.attrs.id === node.attrs.id) {
          setChecked(singNode.node.attrs.correct)
          setCheckedAnswerMode(singNode.node.attrs.answer)
        }
      })
    },
    [getNodes$i(main)],
  )

  var handleChange = function handleChange() {
    setChecked(!checked)
    setCheckedAnswerMode(!checkedAnswerMode)
    var key = isEditable ? 'correct' : 'answer'
    var value = isEditable ? !checked : !checkedAnswerMode
    var allNodes = getNodes$i(main)
    allNodes.forEach(function (singleNode) {
      if (singleNode.node.attrs.id === node.attrs.id) {
        main.dispatch(
          main.state.tr.setNodeMarkup(
            getPos(),
            undefined,
            _objectSpread2(
              _objectSpread2({}, singleNode.node.attrs),
              {},
              _defineProperty({}, key, value),
            ),
          ),
        )
      }
    })
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$i(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  return /*#__PURE__*/ React.createElement(TrueFalseSwitch, {
    checked: checked,
    checkedAnswerMode: checkedAnswerMode,
    customProps: customProps,
    handleChange: handleChange,
    isEditable: isEditable,
    node: getUpdatedNode(),
  })
}

var getNodes$i = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'true_false') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

function _templateObject9$4() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject9$4 = function _templateObject9() {
    return data
  }

  return data
}

function _templateObject8$6() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n',
  ])

  _templateObject8$6 = function _templateObject8() {
    return data
  }

  return data
}

function _templateObject7$a() {
  var data = _taggedTemplateLiteral([
    "\n  align-items: normal;\n  display: flex;\n  flex-direction: row;\n  .ProseMirror {\n    :empty::before {\n      content: 'Type option';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n  }\n",
  ])

  _templateObject7$a = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$d() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n\n  button {\n    border: none;\n    box-shadow: none;\n  }\n\n  span {\n    cursor: pointer;\n  }\n',
  ])

  _templateObject6$d = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$g() {
  var data = _taggedTemplateLiteral([
    '\n  border: 1px solid #a5a1a2;\n  border-radius: 4px;\n  color: black;\n  display: flex;\n  flex: 2 1 auto;\n  flex-direction: column;\n  padding: 10px;\n',
  ])

  _templateObject5$g = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$n() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n',
  ])

  _templateObject4$n = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$p() {
  var data = _taggedTemplateLiteral([
    "\n  &:before {\n    content: 'Answer ' counter(question-item-multiple);\n    counter-increment: question-item-multiple;\n  }\n",
  ])

  _templateObject3$p = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$s() {
  var data = _taggedTemplateLiteral([
    '\n  color: black;\n  display: flex;\n  flex-direction: row;\n  padding: 10px 0px 4px 0px;\n',
  ])

  _templateObject2$s = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$z() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  padding: 0px 0px 20px 20px;\n',
  ])

  _templateObject$z = function _templateObject() {
    return data
  }

  return data
}
var Wrapper$8 = styled.div(_templateObject$z())
var InfoRow$2 = styled.div(_templateObject2$s())
var QuestionNunber$2 = styled.span(_templateObject3$p())
var QuestionControlsWrapper$2 = styled.div(_templateObject4$n())
var QuestionWrapper$3 = styled.div(_templateObject5$g())
var IconsWrapper$2 = styled.div(_templateObject6$d())
var QuestionData$2 = styled.div(_templateObject7$a())
var ActionButton$9 = styled.button(_templateObject8$6())
var StyledIconAction$7 = styled(Icon)(_templateObject9$4())
var AnswerComponent$2 = function (_ref) {
  var _getUpdatedNode, _getUpdatedNode$node, _getUpdatedNode$node2

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var addOptionBtnRef = useRef(null)
  var removeOptionBtnRef = useRef(null)
  useEffect(function () {
    var listener = function listener(event) {
      if (event.code === 'Enter') {
        event.preventDefault()
        if (addOptionBtnRef.current) addOptionBtnRef.current.click()
      }
    }

    if (addOptionBtnRef.current)
      addOptionBtnRef.current.addEventListener('keydown', listener)
    return function () {
      if (addOptionBtnRef.current)
        addOptionBtnRef.current.removeEventListener('keydown', listener)
    }
  }, [])
  useEffect(function () {
    var listener = function listener(event) {
      if (event.code === 'Enter') {
        event.preventDefault()
        if (removeOptionBtnRef.current) removeOptionBtnRef.current.click()
      }
    }

    if (removeOptionBtnRef.current)
      removeOptionBtnRef.current.addEventListener('keydown', listener)
    return function () {
      if (removeOptionBtnRef.current)
        removeOptionBtnRef.current.removeEventListener('keydown', listener)
    }
  }, [])

  var removeOption = function removeOption() {
    var answersCount = findAnswerCount()

    if (answersCount.count >= 1) {
      main.state.doc.nodesBetween(
        getPos(),
        getPos() + 1,
        function (sinlgeNode, pos) {
          if (sinlgeNode.attrs.id === node.attrs.id) {
            main.dispatch(
              main.state.tr.deleteRange(
                getPos(),
                getPos() + sinlgeNode.nodeSize,
              ),
            )
          }
        },
      )
    } else {
      main.dispatch(
        main.state.tr.setSelection(
          NodeSelection.create(main.state.doc, answersCount.parentPosition),
        ),
      )
      main.dispatch(main.state.tr.deleteSelection())
    }
  }

  var addOption = function addOption(nodeId) {
    var newAnswerId = v4()
    main.state.doc.descendants(function (editorNode, index) {
      if (editorNode.type.name === 'true_false') {
        if (editorNode.attrs.id === nodeId) {
          main.dispatch(
            main.state.tr.setSelection(
              new TextSelection(
                main.state.tr.doc.resolve(editorNode.nodeSize + index),
              ),
            ),
          )
          var answerOption = main.state.config.schema.nodes.true_false.create(
            {
              id: newAnswerId,
            },
            Fragment.empty,
          )
          main.dispatch(main.state.tr.replaceSelectionWith(answerOption)) // create Empty Paragraph

          setTimeout(function () {
            helpers.createEmptyParagraph(context, newAnswerId)
          }, 120)
        }
      }
    })
  }

  var findAnswerCount = function findAnswerCount() {
    main.dispatch(
      main.state.tr.setSelection(
        NodeSelection.create(main.state.doc, getPos()),
      ),
    )
    var parentContainer = DocumentHelpers.findParentOfType(
      main.state,
      main.state.config.schema.nodes.true_false_container,
    )
    var parentPosition = 0
    main.state.doc.descendants(function (parentNode, parentPos) {
      if (
        parentNode.type.name === 'true_false_container' &&
        parentNode.attrs.id === parentContainer.attrs.id
      ) {
        parentPosition = parentPos
      }
    })
    var count = -1
    parentContainer.descendants(function (element) {
      if (element.type.name === 'true_false') {
        count += 1
      }
    })
    return {
      count: count,
      parentPosition: parentPosition,
      parentContainer: parentContainer,
    }
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$j(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  var readOnly = !isEditable
  var testMode = customProps.testMode
  var feedback = node.attrs.feedback
  return /*#__PURE__*/ React.createElement(
    Wrapper$8,
    null,
    /*#__PURE__*/ React.createElement(
      QuestionControlsWrapper$2,
      null,
      /*#__PURE__*/ React.createElement(
        InfoRow$2,
        null,
        /*#__PURE__*/ React.createElement(QuestionNunber$2, null),
        /*#__PURE__*/ React.createElement(CustomSwitch$2, {
          getPos: getPos,
          node: node,
        }),
      ),
      /*#__PURE__*/ React.createElement(
        QuestionWrapper$3,
        null,
        /*#__PURE__*/ React.createElement(
          QuestionData$2,
          null,
          /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
            getPos: getPos,
            node: node,
            placeholderText: 'Type option',
            view: view,
          }),
        ),
        !testMode &&
          !(readOnly && feedback === '') &&
          /*#__PURE__*/ React.createElement(FeedbackComponent, {
            getPos: getPos,
            node:
              (_getUpdatedNode = getUpdatedNode()) === null ||
              _getUpdatedNode === void 0
                ? void 0
                : _getUpdatedNode.node,
            readOnly: readOnly,
            view: view,
          }),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      IconsWrapper$2,
      null,
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$9,
          {
            'aria-label': 'Add new option below '.concat(
              (_getUpdatedNode$node = getUpdatedNode().node) === null ||
                _getUpdatedNode$node === void 0
                ? void 0
                : _getUpdatedNode$node.textContent,
            ),
            onClick: function onClick() {
              return addOption(node.attrs.id)
            },
            ref: addOptionBtnRef,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$7, {
            name: 'plusSquare',
          }),
        ),
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$9,
          {
            'aria-label': 'delete this option '.concat(
              (_getUpdatedNode$node2 = getUpdatedNode().node) === null ||
                _getUpdatedNode$node2 === void 0
                ? void 0
                : _getUpdatedNode$node2.textContent,
            ),
            onClick: removeOption,
            ref: removeOptionBtnRef,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$7, {
            name: 'deleteOutlined',
          }),
        ),
    ),
  )
}

var getNodes$j = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'true_false') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var TrueFalseNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(TrueFalseNodeView, _QuestionsNodeView)

  var _super = _createSuper(TrueFalseNodeView)

  function TrueFalseNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, TrueFalseNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    TrueFalseNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            !event.target.type ||
            event.target.type === 'button' ||
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'true_false'
        },
      },
    ],
  )

  return TrueFalseNodeView
})(QuestionsNodeView)

var QuestionTrueFalseNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  _inherits(QuestionTrueFalseNodeView, _QuestionsNodeView)

  var _super = _createSuper(QuestionTrueFalseNodeView)

  function QuestionTrueFalseNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, QuestionTrueFalseNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    QuestionTrueFalseNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            !event.target.type ||
            event.target.type === 'button' ||
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'question_node_true_false'
        },
      },
    ],
  )

  return QuestionTrueFalseNodeView
})(QuestionsNodeView)

var TrueFalseQuestionService = /*#__PURE__*/ (function (_Service) {
  _inherits(TrueFalseQuestionService, _Service)

  var _super = _createSuper(TrueFalseQuestionService)

  function TrueFalseQuestionService() {
    _classCallCheck(this, TrueFalseQuestionService)

    return _super.apply(this, arguments)
  }

  _createClass(TrueFalseQuestionService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('TrueFalseQuestion').to(TrueFalseQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          true_false_container: trueFalseContainerNode,
        })
        createNode({
          true_false: trueFalseNode,
        })
        createNode({
          question_node_true_false: questionTrueFalseNode,
        }) // addPortal({
        //   nodeView: TrueFalseContainerNodeView,
        //   component: MultipleChoiceContainerComponent,
        //   context: this.app,
        // });

        addPortal({
          nodeView: QuestionTrueFalseNodeView,
          component: QuestionComponent,
          context: this.app,
        })
        addPortal({
          nodeView: TrueFalseNodeView,
          component: AnswerComponent$2,
          context: this.app,
        })
      },
    },
  ])

  return TrueFalseQuestionService
})(Service)

var _dec$d, _class$d, _temp$d
var TrueFalseSingleCorrectQuestion =
  ((_dec$d = injectable()),
  _dec$d(
    (_class$d =
      ((_temp$d = /*#__PURE__*/ (function (_Tools) {
        _inherits(TrueFalseSingleCorrectQuestion, _Tools)

        var _super = _createSuper(TrueFalseSingleCorrectQuestion)

        function TrueFalseSingleCorrectQuestion() {
          var _this

          _classCallCheck(this, TrueFalseSingleCorrectQuestion)

          for (
            var _len = arguments.length, args = new Array(_len), _key = 0;
            _key < _len;
            _key++
          ) {
            args[_key] = arguments[_key]
          }

          _this = _super.call.apply(_super, [this].concat(args))
          _this.title = 'Add True False Single Correct Question'
          _this.icon = 'multipleChoice'
          _this.name = 'True False (single correct)'
          _this.label = 'True False (single correct)'

          _this.select = function (state, activeView) {
            var _activeView$props$dis = activeView.props.disallowedTools,
              disallowedTools =
                _activeView$props$dis === void 0 ? [] : _activeView$props$dis
            if (disallowedTools.includes('MultipleChoice')) return false
            var status = true
            var _state$selection = state.selection,
              from = _state$selection.from,
              to = _state$selection.to
            if (from === null) return false
            state.doc.nodesBetween(from, to, function (node) {
              if (node.type.groups.includes('questions')) {
                status = false
              }
            })
            return status
          }

          return _this
        }

        _createClass(TrueFalseSingleCorrectQuestion, [
          {
            key: 'renderTool',
            value: function renderTool(view) {
              if (isEmpty(view)) return null
              return this.isDisplayed()
                ? /*#__PURE__*/ React.createElement(ToolBarBtn$1, {
                    item: this.toJSON(),
                    key: v4(),
                    view: view,
                  })
                : null
            },
          },
          {
            key: 'run',
            get: function get() {
              return function (view, context) {
                helpers.createOptions(
                  view,
                  context,
                  view.state.config.schema.nodes
                    .true_false_single_correct_container,
                  view.state.config.schema.nodes
                    .question_node_true_false_single,
                  view.state.config.schema.nodes.true_false_single_correct,
                )
              }
            },
          },
          {
            key: 'active',
            get: function get() {
              return function (state) {
                if (
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes
                      .true_false_single_correct_container,
                  ) ||
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.true_false_single_correct,
                  ) ||
                  Commands.isParentOfType(
                    state,
                    state.config.schema.nodes.question_node_true_false_single,
                  )
                ) {
                  return true
                }

                return false
              }
            },
          },
        ])

        return TrueFalseSingleCorrectQuestion
      })(Tools)),
      _temp$d)),
  ) || _class$d)

var trueFalseSingleCorrectNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'true-false-single-correct-option',
    },
    correct: {
      default: false,
    },
    answer: {
      default: false,
    },
    feedback: {
      default: '',
    },
  },
  group: 'block questions',
  content: 'block*',
  // defining: true,
  parseDOM: [
    {
      tag: 'div.true-false-single-correct-option',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          correct: JSON.parse(dom.getAttribute('correct').toLowerCase()),
          answer: JSON.parse(dom.getAttribute('answer').toLowerCase()),
          feedback: dom.getAttribute('feedback'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var trueFalseSingleCorrectContainerNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'true-false-single-correct',
    },
  },
  group: 'block questions',
  atom: true,
  selectable: true,
  draggable: true,
  content: 'block*',
  parseDOM: [
    {
      tag: 'div.true-false-single-correct',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var questionTrueFalseNode$1 = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'true-false-question-single',
    },
  },
  group: 'block questions',
  content: 'block*',
  // defining: true,
  parseDOM: [
    {
      tag: 'div.true-false-question-single',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return ['div', node.attrs, 0]
  },
}

var CustomSwitch$3 = function CustomSwitch(_ref) {
  var node = _ref.node,
    getPos = _ref.getPos
  var context = useContext(WaxContext)

  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    checked = _useState2[0],
    setChecked = _useState2[1]

  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    checkedAnswerMode = _useState4[0],
    setCheckedAnswerMode = _useState4[1]

  var main = context.pmViews.main
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  useEffect(
    function () {
      var allNodes = getNodes$k(main)
      allNodes.forEach(function (singNode) {
        if (singNode.node.attrs.id === node.attrs.id) {
          setChecked(singNode.node.attrs.correct)
          setCheckedAnswerMode(singNode.node.attrs.answer)
        }
      })
    },
    [getNodes$k(main)],
  )

  var handleChange = function handleChange() {
    setChecked(!checked)
    setCheckedAnswerMode(!checkedAnswerMode)
    var key = isEditable ? 'correct' : 'answer'
    var value = isEditable ? !checked : !checkedAnswerMode
    main.dispatch(
      main.state.tr.setSelection(
        NodeSelection.create(main.state.doc, getPos()),
      ),
    )
    var parentContainer = DocumentHelpers.findParentOfType(
      main.state,
      main.state.config.schema.nodes.true_false_single_correct_container,
    )
    var parentPosition = 0
    main.state.doc.descendants(function (parentNode, parentPos) {
      if (
        parentNode.type.name === 'true_false_single_correct_container' &&
        parentNode.attrs.id === parentContainer.attrs.id
      ) {
        parentPosition = parentPos
      }
    })
    var tr = main.state.tr
    parentContainer.descendants(function (element, position) {
      if (
        element.type.name === 'true_false_single_correct' &&
        element.attrs.id === node.attrs.id
      ) {
        tr.setNodeMarkup(
          getPos(),
          undefined,
          _objectSpread2(
            _objectSpread2({}, element.attrs),
            {},
            _defineProperty({}, key, value),
          ),
        )
      } else if (
        element.type.name === 'true_false_single_correct' &&
        element.attrs[key]
      ) {
        tr.setNodeMarkup(
          parentPosition + position + 1,
          undefined,
          _objectSpread2(
            _objectSpread2({}, element.attrs),
            {},
            _defineProperty({}, key, false),
          ),
        )
      }
    })
    main.dispatch(tr)
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$k(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  return /*#__PURE__*/ React.createElement(TrueFalseSwitch, {
    checked: checked,
    checkedAnswerMode: checkedAnswerMode,
    customProps: customProps,
    handleChange: handleChange,
    isEditable: isEditable,
    node: getUpdatedNode(),
  })
}

var getNodes$k = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'true_false_single_correct') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

function _templateObject9$5() {
  var data = _taggedTemplateLiteral(['\n  height: 24px;\n  width: 24px;\n'])

  _templateObject9$5 = function _templateObject9() {
    return data
  }

  return data
}

function _templateObject8$7() {
  var data = _taggedTemplateLiteral([
    '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n',
  ])

  _templateObject8$7 = function _templateObject8() {
    return data
  }

  return data
}

function _templateObject7$b() {
  var data = _taggedTemplateLiteral([
    "\n  align-items: normal;\n  display: flex;\n  flex-direction: row;\n  .ProseMirror {\n    :empty::before {\n      content: 'Type option';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n  }\n",
  ])

  _templateObject7$b = function _templateObject7() {
    return data
  }

  return data
}

function _templateObject6$e() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n\n  button {\n    border: none;\n    box-shadow: none;\n  }\n\n  span {\n    cursor: pointer;\n  }\n',
  ])

  _templateObject6$e = function _templateObject6() {
    return data
  }

  return data
}

function _templateObject5$h() {
  var data = _taggedTemplateLiteral([
    '\n  border: 1px solid #a5a1a2;\n  border-radius: 4px;\n  color: black;\n  display: flex;\n  flex: 2 1 auto;\n  flex-direction: column;\n  padding: 10px;\n',
  ])

  _templateObject5$h = function _templateObject5() {
    return data
  }

  return data
}

function _templateObject4$o() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n',
  ])

  _templateObject4$o = function _templateObject4() {
    return data
  }

  return data
}

function _templateObject3$q() {
  var data = _taggedTemplateLiteral([
    "\n  &:before {\n    content: 'Answer ' counter(question-item-multiple);\n    counter-increment: question-item-multiple;\n  }\n",
  ])

  _templateObject3$q = function _templateObject3() {
    return data
  }

  return data
}

function _templateObject2$t() {
  var data = _taggedTemplateLiteral([
    '\n  color: black;\n  display: flex;\n  flex-direction: row;\n  padding: 10px 0px 4px 0px;\n',
  ])

  _templateObject2$t = function _templateObject2() {
    return data
  }

  return data
}

function _templateObject$A() {
  var data = _taggedTemplateLiteral([
    '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n  padding: 0px 0px 20px 20px;\n',
  ])

  _templateObject$A = function _templateObject() {
    return data
  }

  return data
}
var Wrapper$9 = styled.div(_templateObject$A())
var InfoRow$3 = styled.div(_templateObject2$t())
var QuestionNunber$3 = styled.span(_templateObject3$q())
var QuestionControlsWrapper$3 = styled.div(_templateObject4$o())
var QuestionWrapper$4 = styled.div(_templateObject5$h())
var IconsWrapper$3 = styled.div(_templateObject6$e())
var QuestionData$3 = styled.div(_templateObject7$b())
var ActionButton$a = styled.button(_templateObject8$7())
var StyledIconAction$8 = styled(Icon)(_templateObject9$5())
var AnswerComponent$3 = function (_ref) {
  var _getUpdatedNode, _getUpdatedNode$node, _getUpdatedNode$node2

  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var addOptionBtnRef = useRef(null)
  var removeOptionBtnRef = useRef(null)
  useEffect(function () {
    var listener = function listener(event) {
      if (event.code === 'Enter') {
        event.preventDefault()
        if (addOptionBtnRef.current) addOptionBtnRef.current.click()
      }
    }

    if (addOptionBtnRef.current)
      addOptionBtnRef.current.addEventListener('keydown', listener)
    return function () {
      if (addOptionBtnRef.current)
        addOptionBtnRef.current.removeEventListener('keydown', listener)
    }
  }, [])
  useEffect(function () {
    var listener = function listener(event) {
      if (event.code === 'Enter') {
        event.preventDefault()
        if (removeOptionBtnRef.current) removeOptionBtnRef.current.click()
      }
    }

    if (removeOptionBtnRef.current)
      removeOptionBtnRef.current.addEventListener('keydown', listener)
    return function () {
      if (removeOptionBtnRef.current)
        removeOptionBtnRef.current.removeEventListener('keydown', listener)
    }
  }, [])

  var removeOption = function removeOption() {
    var answersCount = findAnswerCount()

    if (answersCount.count >= 1) {
      main.state.doc.nodesBetween(
        getPos(),
        getPos() + 1,
        function (sinlgeNode, pos) {
          if (sinlgeNode.attrs.id === node.attrs.id) {
            main.dispatch(
              main.state.tr.deleteRange(
                getPos(),
                getPos() + sinlgeNode.nodeSize,
              ),
            )
          }
        },
      )
    } else {
      main.dispatch(
        main.state.tr.setSelection(
          NodeSelection.create(main.state.doc, answersCount.parentPosition),
        ),
      )
      main.dispatch(main.state.tr.deleteSelection())
    }
  }

  var addOption = function addOption(nodeId) {
    var newAnswerId = v4()
    main.state.doc.descendants(function (editorNode, index) {
      if (editorNode.type.name === 'true_false_single_correct') {
        if (editorNode.attrs.id === nodeId) {
          main.dispatch(
            main.state.tr.setSelection(
              new TextSelection(
                main.state.tr.doc.resolve(editorNode.nodeSize + index),
              ),
            ),
          )
          var answerOption =
            main.state.config.schema.nodes.true_false_single_correct.create(
              {
                id: newAnswerId,
              },
              Fragment.empty,
            )
          main.dispatch(main.state.tr.replaceSelectionWith(answerOption)) // create Empty Paragraph

          setTimeout(function () {
            helpers.createEmptyParagraph(context, newAnswerId)
          }, 120)
        }
      }
    })
  }

  var findAnswerCount = function findAnswerCount() {
    main.dispatch(
      main.state.tr.setSelection(
        NodeSelection.create(main.state.doc, getPos()),
      ),
    )
    var parentContainer = DocumentHelpers.findParentOfType(
      main.state,
      main.state.config.schema.nodes.true_false_single_correct_container,
    )
    var parentPosition = 0
    main.state.doc.descendants(function (parentNode, parentPos) {
      if (
        parentNode.type.name === 'true_false_single_correct_container' &&
        parentNode.attrs.id === parentContainer.attrs.id
      ) {
        parentPosition = parentPos
      }
    })
    var count = -1
    parentContainer.descendants(function (element) {
      if (element.type.name === 'true_false_single_correct') {
        count += 1
      }
    })
    return {
      count: count,
      parentPosition: parentPosition,
      parentContainer: parentContainer,
    }
  }

  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$l(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }

  var readOnly = !isEditable
  var testMode = customProps.testMode
  var feedback = node.attrs.feedback
  return /*#__PURE__*/ React.createElement(
    Wrapper$9,
    null,
    /*#__PURE__*/ React.createElement(
      QuestionControlsWrapper$3,
      null,
      /*#__PURE__*/ React.createElement(
        InfoRow$3,
        null,
        /*#__PURE__*/ React.createElement(QuestionNunber$3, null),
        /*#__PURE__*/ React.createElement(CustomSwitch$3, {
          getPos: getPos,
          node: node,
        }),
      ),
      /*#__PURE__*/ React.createElement(
        QuestionWrapper$4,
        null,
        /*#__PURE__*/ React.createElement(
          QuestionData$3,
          null,
          /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
            getPos: getPos,
            node: node,
            placeholderText: 'Type option',
            view: view,
          }),
        ),
        !testMode &&
          !(readOnly && feedback === '') &&
          /*#__PURE__*/ React.createElement(FeedbackComponent, {
            getPos: getPos,
            node:
              (_getUpdatedNode = getUpdatedNode()) === null ||
              _getUpdatedNode === void 0
                ? void 0
                : _getUpdatedNode.node,
            readOnly: readOnly,
            view: view,
          }),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      IconsWrapper$3,
      null,
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$a,
          {
            'aria-label': 'Add new option below '.concat(
              (_getUpdatedNode$node = getUpdatedNode().node) === null ||
                _getUpdatedNode$node === void 0
                ? void 0
                : _getUpdatedNode$node.textContent,
            ),
            onClick: function onClick() {
              return addOption(node.attrs.id)
            },
            ref: addOptionBtnRef,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$8, {
            name: 'plusSquare',
          }),
        ),
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$a,
          {
            'aria-label': 'delete this option '.concat(
              (_getUpdatedNode$node2 = getUpdatedNode().node) === null ||
                _getUpdatedNode$node2 === void 0
                ? void 0
                : _getUpdatedNode$node2.textContent,
            ),
            onClick: removeOption,
            ref: removeOptionBtnRef,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$8, {
            name: 'deleteOutlined',
          }),
        ),
    ),
  )
}

var getNodes$l = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'true_false_single_correct') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var TrueFalseSingleCorrectNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
  _inherits(TrueFalseSingleCorrectNodeView, _QuestionsNodeView)

  var _super = _createSuper(TrueFalseSingleCorrectNodeView)

  function TrueFalseSingleCorrectNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, TrueFalseSingleCorrectNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    TrueFalseSingleCorrectNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            !event.target.type ||
            event.target.type === 'button' ||
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'true_false_single_correct'
        },
      },
    ],
  )

  return TrueFalseSingleCorrectNodeView
})(QuestionsNodeView)

var QuestionTrueFalseSingleNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
  _inherits(QuestionTrueFalseSingleNodeView, _QuestionsNodeView)

  var _super = _createSuper(QuestionTrueFalseSingleNodeView)

  function QuestionTrueFalseSingleNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this

    _classCallCheck(this, QuestionTrueFalseSingleNodeView)

    _this = _super.call(
      this,
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    )
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }

  _createClass(
    QuestionTrueFalseSingleNodeView,
    [
      {
        key: 'stopEvent',
        value: function stopEvent(event) {
          if (
            !event.target.type ||
            event.target.type === 'button' ||
            event.target.type === 'text' ||
            event.target.type === 'textarea'
          ) {
            return true
          }

          var innerView = this.context.pmViews[this.node.attrs.id]
          return innerView && innerView.dom.contains(event.target)
        },
      },
    ],
    [
      {
        key: 'name',
        value: function name() {
          return 'question_node_true_false_single'
        },
      },
    ],
  )

  return QuestionTrueFalseSingleNodeView
})(QuestionsNodeView)

var TrueFalseSingleCorrectQuestionService = /*#__PURE__*/ (function (_Service) {
  _inherits(TrueFalseSingleCorrectQuestionService, _Service)

  var _super = _createSuper(TrueFalseSingleCorrectQuestionService)

  function TrueFalseSingleCorrectQuestionService() {
    _classCallCheck(this, TrueFalseSingleCorrectQuestionService)

    return _super.apply(this, arguments)
  }

  _createClass(TrueFalseSingleCorrectQuestionService, [
    {
      key: 'register',
      value: function register() {
        this.container
          .bind('TrueFalseSingleCorrectQuestion')
          .to(TrueFalseSingleCorrectQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          true_false_single_correct_container:
            trueFalseSingleCorrectContainerNode,
        })
        createNode({
          question_node_true_false_single: questionTrueFalseNode$1,
        })
        createNode({
          true_false_single_correct: trueFalseSingleCorrectNode,
        }) // addPortal({
        //   nodeView: TrueFalseSingleCorrectContainerNodeView,
        //   component: MultipleChoiceContainerComponent,
        //   context: this.app,
        // });

        addPortal({
          nodeView: QuestionTrueFalseSingleNodeView,
          component: QuestionComponent,
          context: this.app,
        })
        addPortal({
          nodeView: TrueFalseSingleCorrectNodeView,
          component: AnswerComponent$3,
          context: this.app,
        })
      },
    },
  ])

  return TrueFalseSingleCorrectQuestionService
})(Service)

var MultipleChoiceQuestionService = /*#__PURE__*/ (function (_Service) {
  _inherits(MultipleChoiceQuestionService, _Service)

  var _super = _createSuper(MultipleChoiceQuestionService)

  function MultipleChoiceQuestionService() {
    var _this

    _classCallCheck(this, MultipleChoiceQuestionService)

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))
    _this.dependencies = [
      new MultipleChoiceSingleCorrectQuestionService(),
      new TrueFalseQuestionService(),
      new TrueFalseSingleCorrectQuestionService(),
    ]
    return _this
  }

  _createClass(MultipleChoiceQuestionService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('MultipleChoiceQuestion').to(MultipleChoiceQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          multiple_choice_container: multipleChoiceContainerNode,
        })
        createNode({
          multiple_choice: multipleChoiceNode,
        })
        createNode({
          question_node_multiple: questionNode,
        }) // addPortal({
        //   nodeView: MultipleChoiceContainerNodeView,
        //   component: MultipleChoiceContainerComponent,
        //   context: this.app,
        // });

        addPortal({
          nodeView: QuestionNodeView,
          component: QuestionComponent,
          context: this.app,
        })
        addPortal({
          nodeView: MultipleChoiceNodeView,
          component: AnswerComponent,
          context: this.app,
        })
      },
    },
  ])

  return MultipleChoiceQuestionService
})(Service)

var QuestionsService = /*#__PURE__*/ (function (_Service) {
  _inherits(QuestionsService, _Service)

  var _super = _createSuper(QuestionsService)

  function QuestionsService() {
    var _this

    _classCallCheck(this, QuestionsService)

    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))
    _this.name = 'QuestionsService'
    _this.dependencies = [
      new MultipleChoiceQuestionService(),
      new EssayService(),
      new FillTheGapQuestionService$1(),
      new MatchingService(),
      new MultipleDropDownService(),
      new NumericalAnswerService(),
      new QuestionsDropDownToolGroupService(),
    ]
    return _this
  }

  return QuestionsService
})(Service)

export { QuestionsService }
