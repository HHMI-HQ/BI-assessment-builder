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
  createRef,
  useLayoutEffect,
} from 'react'
import { isEmpty, get, find } from 'lodash'
import { injectable, inject } from 'inversify'
import { v4 } from 'uuid'
import { Fragment } from 'prosemirror-model'
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

function _typeof(o) {
  '@babel/helpers - typeof'

  return (
    (_typeof =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (o) {
            return typeof o
          }
        : function (o) {
            return o &&
              'function' == typeof Symbol &&
              o.constructor === Symbol &&
              o !== Symbol.prototype
              ? 'symbol'
              : typeof o
          }),
    _typeof(o)
  )
}

function toPrimitive(t, r) {
  if ('object' != _typeof(t) || !t) return t
  var e = t[Symbol.toPrimitive]
  if (void 0 !== e) {
    var i = e.call(t, r || 'default')
    if ('object' != _typeof(i)) return i
    throw new TypeError('@@toPrimitive must return a primitive value.')
  }
  return ('string' === r ? String : Number)(t)
}

function toPropertyKey(t) {
  var i = toPrimitive(t, 'string')
  return 'symbol' == _typeof(i) ? i : i + ''
}

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t]
    ;(o.enumerable = o.enumerable || !1),
      (o.configurable = !0),
      'value' in o && (o.writable = !0),
      Object.defineProperty(e, toPropertyKey(o.key), o)
  }
}
function _createClass(e, r, t) {
  return (
    r && _defineProperties(e.prototype, r),
    t && _defineProperties(e, t),
    Object.defineProperty(e, 'prototype', {
      writable: !1,
    }),
    e
  )
}

function _classCallCheck(a, n) {
  if (!(a instanceof n))
    throw new TypeError('Cannot call a class as a function')
}

function _getPrototypeOf(t) {
  return (
    (_getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t)
        }),
    _getPrototypeOf(t)
  )
}

function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {}),
    )
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t
  })()
}

function _assertThisInitialized(e) {
  if (void 0 === e)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    )
  return e
}

function _possibleConstructorReturn(t, e) {
  if (e && ('object' == _typeof(e) || 'function' == typeof e)) return e
  if (void 0 !== e)
    throw new TypeError(
      'Derived constructors may only return object or undefined',
    )
  return _assertThisInitialized(t)
}

function _callSuper(t, o, e) {
  return (
    (o = _getPrototypeOf(o)),
    _possibleConstructorReturn(
      t,
      _isNativeReflectConstruct()
        ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor)
        : o.apply(t, e),
    )
  )
}

function _setPrototypeOf(t, e) {
  return (
    (_setPrototypeOf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return (t.__proto__ = e), t
        }),
    _setPrototypeOf(t, e)
  )
}

function _inherits(t, e) {
  if ('function' != typeof e && null !== e)
    throw new TypeError('Super expression must either be null or a function')
  ;(t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: !0,
      configurable: !0,
    },
  })),
    Object.defineProperty(t, 'prototype', {
      writable: !1,
    }),
    e && _setPrototypeOf(t, e)
}

var createEmptyParagraph$1 = function createEmptyParagraph(
  context,
  newAnswerId,
) {
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
  state.doc.nodesBetween(from, to, function (node) {
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
  feedbackType,
) {
  checkifEmpty(main)
  var state = main.state,
    dispatch = main.dispatch
  var _state$selection2 = state.selection,
    from = _state$selection2.from,
    to = _state$selection2.to
  var question = questionType.create(
    {
      id: v4(),
    },
    Fragment.empty,
  )
  var firstOption = answerType.create(
    {
      id: v4(),
    },
    Fragment.empty,
  )
  var firstFeedback = feedbackType.create(
    {
      id: v4(),
      optionId: firstOption.attrs.id,
    },
    Fragment.empty,
  )
  var secondOption = answerType.create(
    {
      id: v4(),
    },
    Fragment.empty,
  )
  var secondFeedback = feedbackType.create(
    {
      id: v4(),
      secondOption: firstOption.attrs.id,
    },
    Fragment.empty,
  )
  var container = parentType.create(
    {
      id: v4(),
    },
    Fragment.from([
      question,
      firstOption,
      firstFeedback,
      secondOption,
      secondFeedback,
    ]),
  )
  var tr = state.tr
  tr.replaceWith(from, to, container)
  dispatch(tr)
  setTimeout(function () {
    context.pmViews[question.attrs.id].focus()
    createEmptyParagraph$1(context, firstOption.attrs.id)
    createEmptyParagraph$1(context, firstFeedback.attrs.id)
    createEmptyParagraph$1(context, secondOption.attrs.id)
    createEmptyParagraph$1(context, secondFeedback.attrs.id)
    createEmptyParagraph$1(context, question.attrs.id)
  }, 50)
  return true
}
var helpers = {
  createEmptyParagraph: createEmptyParagraph$1,
  checkifEmpty: checkifEmpty,
  createOptions: createOptions,
}

function _taggedTemplateLiteral(e, t) {
  return (
    t || (t = e.slice(0)),
    Object.freeze(
      Object.defineProperties(e, {
        raw: {
          value: Object.freeze(t),
        },
      }),
    )
  )
}

var _templateObject$C, _templateObject2$r
var activeStyles$1 = css(
  _templateObject$C ||
    (_templateObject$C = _taggedTemplateLiteral([
      '\n  pointer-events: none;\n',
    ])),
)
var StyledButton$1 = styled(MenuButton)(
  _templateObject2$r ||
    (_templateObject2$r = _taggedTemplateLiteral(['\n  ', '\n'])),
  function (props) {
    return props.active && activeStyles$1
  },
)
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

var _dec$d, _class$d
var createEmptyParagraph = function createEmptyParagraph(context, newAnswerId) {
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
  ((_dec$d = injectable()),
  _dec$d(
    (_class$d = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(this, EssayQuestion, [].concat(args))
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
          if (from === null || disallowedTools.includes('Essay')) status = false
          state.doc.nodesBetween(from, to, function (node) {
            if (node.type.groups.includes('questions')) {
              status = false
            }
          })
          return status
        }
        return _this
      }
      _inherits(EssayQuestion, _Tools)
      return _createClass(EssayQuestion, [
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
                findWrapping(range, state.config.schema.nodes.essay_container, {
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
                createEmptyParagraph(context, essayAnswer.attrs.id)
                createEmptyParagraph(context, essayPrompt.attrs.id)
                createEmptyParagraph(context, essayQuestion.attrs.id)
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
      ])
    })(Tools)),
  ) || _class$d)

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

function _defineProperty(e, r, t) {
  return (
    (r = toPropertyKey(r)) in e
      ? Object.defineProperty(e, r, {
          value: t,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[r] = t),
    e
  )
}

function _arrayLikeToArray(r, a) {
  ;(null == a || a > r.length) && (a = r.length)
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]
  return n
}

function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r)
}

function _iterableToArray(r) {
  if (
    ('undefined' != typeof Symbol && null != r[Symbol.iterator]) ||
    null != r['@@iterator']
  )
    return Array.from(r)
}

function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ('string' == typeof r) return _arrayLikeToArray(r, a)
    var t = {}.toString.call(r).slice(8, -1)
    return (
      'Object' === t && r.constructor && (t = r.constructor.name),
      'Map' === t || 'Set' === t
        ? Array.from(r)
        : 'Arguments' === t ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
        ? _arrayLikeToArray(r, a)
        : void 0
    )
  }
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  )
}

function _toConsumableArray(r) {
  return (
    _arrayWithoutHoles(r) ||
    _iterableToArray(r) ||
    _unsupportedIterableToArray(r) ||
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

var _templateObject$B,
  _templateObject2$q,
  _templateObject3$n,
  _templateObject4$m
var DeleteArea = styled.div(
  _templateObject$B ||
    (_templateObject$B = _taggedTemplateLiteral([
      '\n  border-bottom: 3px solid #f5f5f7;\n  height: 30px;\n',
    ])),
)
var EditorWrapper$7 = styled.div(
  _templateObject2$q ||
    (_templateObject2$q = _taggedTemplateLiteral([
      '\n  border: none;\n  display: flex;\n  flex: 2 1 auto;\n  justify-content: left;\n  padding: ',
      ";\n  width: 100%;\n\n  .ProseMirror {\n    white-space: break-spaces;\n    width: 100%;\n    word-wrap: break-word;\n\n    &:focus {\n      outline: none;\n    }\n\n    :empty::before {\n      color: #aaa;\n      content: 'Type your item';\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n\n    p:first-child {\n      margin: 0;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n",
    ])),
  function (props) {
    return props.$usePadding ? '0px 20px 10px 20px' : '0px'
  },
)
var ActionButton$9 = styled.button(
  _templateObject3$n ||
    (_templateObject3$n = _taggedTemplateLiteral([
      '\n  background: transparent;\n  border: none;\n  bottom: 14px;\n  cursor: pointer;\n  float: right;\n  margin-top: 16px;\n  position: relative;\n',
    ])),
)
var StyledIconActionRemove$4 = styled(Icon)(
  _templateObject4$m ||
    (_templateObject4$m = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var WaxOverlays$1 = function WaxOverlays() {
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
    }
    // LISTS
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
    WaxOverlays$1 = ComponentPlugin('waxOverlays')
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
    )

    // Set Each note into Wax's Context
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
        for (var j = 0; j < steps.length; j++)
          outerTr.step(steps[j].map(offsetMap))
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
    var allNodes = getNodes$k(context.pmViews.main)
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
          ActionButton$9,
          {
            'aria-label': 'delete this question',
            onClick: removeQuestion,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconActionRemove$4, {
            name: 'deleteOutlinedQuestion',
          }),
        ),
      ),
    /*#__PURE__*/ React.createElement(
      EditorWrapper$7,
      {
        $usePadding: showDelete && QuestionType !== 'EssayQuestion',
      },
      /*#__PURE__*/ React.createElement('div', {
        ref: editorRef,
      }),
      /*#__PURE__*/ React.createElement(WaxOverlays$1, {
        activeViewId: questionId,
      }),
    ),
  )
}
var getNodes$k = function getNodes(view) {
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

var _templateObject$A
var EditorWrapper$6 = styled.div(
  _templateObject$A ||
    (_templateObject$A = _taggedTemplateLiteral(['\n  display: ', ';\n'])),
  function (props) {
    return props.$testMode ? 'none' : 'block'
  },
)
var EssayPromptComponent = function (_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var testMode = customProps.testMode
  return /*#__PURE__*/ React.createElement(
    EditorWrapper$6,
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

var _templateObject$z
var EditorWrapper$5 = styled.div(
  _templateObject$z ||
    (_templateObject$z = _taggedTemplateLiteral(['\n  display: ', ';\n'])),
  function (props) {
    return props.$testMode || props.$showFeedBack ? 'block' : 'none'
  },
)
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
    EditorWrapper$5,
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
    _this = _callSuper(this, EssayQuestionNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(EssayQuestionNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var EssayPromptNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
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
    _this = _callSuper(this, EssayPromptNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(EssayPromptNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var EssayAnswerNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
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
    _this = _callSuper(this, EssayAnswerNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(EssayAnswerNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var EssayService = /*#__PURE__*/ (function (_Service) {
  function EssayService() {
    _classCallCheck(this, EssayService)
    return _callSuper(this, EssayService, arguments)
  }
  _inherits(EssayService, _Service)
  return _createClass(EssayService, [
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
})(Service)

var _dec$c, _class$c
var FillTheGapQuestion =
  ((_dec$c = injectable()),
  _dec$c(
    (_class$c = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(this, FillTheGapQuestion, [].concat(args))
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
          state.doc.nodesBetween(from, to, function (node) {
            if (node.type.groups.includes('questions')) {
              status = false
            }
          })
          return status
        }
        return _this
      }
      _inherits(FillTheGapQuestion, _Tools)
      return _createClass(FillTheGapQuestion, [
        {
          key: 'run',
          get: function get() {
            return function (main) {
              helpers.checkifEmpty(main)
              var state = main.state,
                dispatch = main.dispatch
              var _state$selection2 = state.selection,
                from = _state$selection2.from,
                to = _state$selection2.to
              var container =
                state.config.schema.nodes.fill_the_gap_container.create(
                  {
                    id: v4(),
                  },
                  Fragment.empty,
                )
              var feedback = state.config.schema.nodes.feedback_prompt.create(
                {
                  id: v4(),
                },
                Fragment.empty,
              )
              var wrapper =
                state.config.schema.nodes.fill_the_gap_wrapper.create(
                  {
                    id: v4(),
                  },
                  Fragment.from([container, feedback]),
                )
              var tr = state.tr
              tr.replaceWith(from, to, wrapper)
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
    })(Tools)),
  ) || _class$c)

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

var fillTheGapWrapperNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'fill-the-gap-wrapper',
    },
  },
  group: 'block questions',
  atom: true,
  content: 'block+',
  parseDOM: [
    {
      tag: 'div.fill-the-gap-wrapper',
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

var _dec$b, _class$b
var CreateGap =
  ((_dec$b = injectable()),
  _dec$b(
    (_class$b = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(this, CreateGap, [].concat(args))
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
      _inherits(CreateGap, _Tools)
      return _createClass(CreateGap, [
        {
          key: 'run',
          get: function get() {
            return function (state, dispatch, activeView, context) {
              var _state$selection = state.selection,
                empty = _state$selection.empty,
                $from = _state$selection.$from,
                $to = _state$selection.$to
              var content = Fragment.empty
              if (!empty && $from.sameParent($to) && $from.parent.inlineContent)
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
    })(Tools)),
  ) || _class$b)

var _dec$a, _class$a
var FillTheGap =
  ((_dec$a = injectable()),
  _dec$a(
    (_class$a = /*#__PURE__*/ (function (_ToolGroup) {
      function FillTheGap(CreateGap) {
        var _this
        _classCallCheck(this, FillTheGap)
        _this = _callSuper(this, FillTheGap)
        _this.tools = []
        _this.tools = [CreateGap]
        return _this
      }
      FillTheGap = inject('CreateGap')(FillTheGap, undefined, 0) || FillTheGap
      _inherits(FillTheGap, _ToolGroup)
      return _createClass(FillTheGap)
    })(ToolGroup)),
  ) || _class$a)

var FillTheGapToolGroupService = /*#__PURE__*/ (function (_Service) {
  function FillTheGapToolGroupService() {
    _classCallCheck(this, FillTheGapToolGroupService)
    return _callSuper(this, FillTheGapToolGroupService, arguments)
  }
  _inherits(FillTheGapToolGroupService, _Service)
  return _createClass(FillTheGapToolGroupService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('FillTheGap').to(FillTheGap)
      },
    },
  ])
})(Service)

var FillTheGapQuestionService$1 = /*#__PURE__*/ (function (_Service) {
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
    _this = _callSuper(this, FillTheGapQuestionService, [].concat(args))
    _this.dependencies = [new FillTheGapToolGroupService()]
    return _this
  }
  _inherits(FillTheGapQuestionService, _Service)
  return _createClass(FillTheGapQuestionService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('CreateGap').to(CreateGap)
      },
    },
  ])
})(Service)

var FillTheGapContainerNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
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
    _this = _callSuper(this, FillTheGapContainerNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(FillTheGapContainerNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var FillTheGapNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
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
    _this = _callSuper(this, FillTheGapNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(FillTheGapNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r
}

function _iterableToArrayLimit(r, l) {
  var t =
    null == r
      ? null
      : ('undefined' != typeof Symbol && r[Symbol.iterator]) || r['@@iterator']
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1
    try {
      if (((i = (t = t.call(r)).next), 0 === l)) {
        if (Object(t) !== t) return
        f = !1
      } else
        for (
          ;
          !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l);
          f = !0
        );
    } catch (r) {
      ;(o = !0), (n = r)
    } finally {
      try {
        if (!f && null != t['return'] && ((u = t['return']()), Object(u) !== u))
          return
      } finally {
        if (o) throw n
      }
    }
    return a
  }
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
  )
}

function _slicedToArray(r, e) {
  return (
    _arrayWithHoles(r) ||
    _iterableToArrayLimit(r, e) ||
    _unsupportedIterableToArray(r, e) ||
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

var _templateObject$y
var EditorWrapper$4 = styled.div(
  _templateObject$y ||
    (_templateObject$y = _taggedTemplateLiteral([
      '\n  > .ProseMirror {\n    padding: 5px;\n    &:focus {\n      outline: none;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n',
    ])),
)
var ContainerEditor$2 = function ContainerEditor(_ref) {
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
    )

    // Set Each note into Wax's Context
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
        for (var j = 0; j < steps.length; j++)
          outerTr.step(steps[j].map(offsetMap))
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
    EditorWrapper$4,
    null,
    /*#__PURE__*/ React.createElement('div', {
      ref: editorRef,
    }),
  )
}

var _templateObject$x,
  _templateObject2$p,
  _templateObject3$m,
  _templateObject4$l,
  _templateObject5$f,
  _templateObject6$e
var FillTheGapContainerTool = styled.div(
  _templateObject$x ||
    (_templateObject$x = _taggedTemplateLiteral([
      '\n  border-bottom: 3px solid #f5f5f7;\n\n  span:first-of-type {\n    position: relative;\n    top: 3px;\n  }\n',
    ])),
)
var StyledIconContainer$1 = styled.span(
  _templateObject2$p ||
    (_templateObject2$p = _taggedTemplateLiteral(['\n  float: right;\n'])),
)
var StyledIconAction$8 = styled(Icon)(
  _templateObject3$m ||
    (_templateObject3$m = _taggedTemplateLiteral([
      '\n  position: relative;\n  right: 4px;\n  cursor: pointer;\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var InfoMsg$1 = styled.div(
  _templateObject4$l ||
    (_templateObject4$l = _taggedTemplateLiteral([
      '\n  background: ',
      ';\n  border-radius: 4px;\n  bottom: 32px;\n  color: #fff;\n  display: none;\n  float: right;\n  padding: 4px;\n  position: relative;\n  left: 60px;\n',
    ])),
  th('colorPrimary'),
)
var ActionButton$8 = styled.button(
  _templateObject5$f ||
    (_templateObject5$f = _taggedTemplateLiteral([
      '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n  border: none;\n  position: relative;\n  bottom: 14px;\n  left: -11px;\n  float: right;\n',
    ])),
)
var StyledIconActionRemove$3 = styled(Icon)(
  _templateObject6$e ||
    (_templateObject6$e = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var FillTheGapContainerComponent = function (_ref) {
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
  var displayInfoMsg = function displayInfoMsg() {
    if (infoMsgRef.current && !infoMsgIsOpen)
      infoMsgRef.current.style.display = 'inline'
    if (infoMsgRef.current && infoMsgIsOpen)
      infoMsgRef.current.style.display = 'none'
    setInfoMsgIsOpen(!infoMsgIsOpen)
  }
  var removeQuestion = function removeQuestion() {
    var allNodes = getNodes$j(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      var _singleNode$node$cont
      var containerId =
        (_singleNode$node$cont = singleNode.node.content.content.find(function (
          n,
        ) {
          return n.type.name === 'fill_the_gap_container'
        })) === null || _singleNode$node$cont === void 0
          ? void 0
          : _singleNode$node$cont.attrs.id
      if (containerId === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr['delete'](
            singleNode.pos,
            singleNode.pos + singleNode.node.nodeSize,
          ),
        )
      }
    })
  }
  return /*#__PURE__*/ React.createElement(
    'div',
    {
      className: 'fill-the-gap-container',
    },
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
            StyledIconContainer$1,
            {
              onClick: displayInfoMsg,
              onKeyPress: function onKeyPress() {},
              role: 'button',
              tabIndex: 0,
            },
            /*#__PURE__*/ React.createElement(StyledIconAction$8, {
              name: 'help',
            }),
          ),
          /*#__PURE__*/ React.createElement(
            ActionButton$8,
            {
              'aria-label': 'delete this question',
              onClick: removeQuestion,
              type: 'button',
            },
            /*#__PURE__*/ React.createElement(StyledIconActionRemove$3, {
              name: 'deleteOutlinedQuestion',
            }),
          ),
          /*#__PURE__*/ React.createElement(
            InfoMsg$1,
            {
              ref: infoMsgRef,
            },
            'enter answers seperated with a semi colon',
          ),
        ),
    ),
    /*#__PURE__*/ React.createElement(
      'div',
      {
        className: 'fill-the-gap',
      },
      /*#__PURE__*/ React.createElement(ContainerEditor$2, {
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
    ),
  )
}
var getNodes$j = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var fillTheGapContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'fill_the_gap_wrapper') {
      fillTheGapContainerNodes.push(node)
    }
  })
  return fillTheGapContainerNodes
}

function ownKeys(e, r) {
  var t = Object.keys(e)
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e)
    r &&
      (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable
      })),
      t.push.apply(t, o)
  }
  return t
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {}
    r % 2
      ? ownKeys(Object(t), !0).forEach(function (r) {
          _defineProperty(e, r, t[r])
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
      : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
        })
  }
  return e
}

var _templateObject$w
var AnswerInput = styled.input(
  _templateObject$w ||
    (_templateObject$w = _taggedTemplateLiteral([
      '\n  border: none;\n  border-bottom: 1px solid black;\n  color: #535e76;\n  display: inline-flex;\n  width: 120px;\n\n  &:focus {\n    outline: none;\n  }\n',
    ])),
)
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
    var allNodes = getNodes$i(main)
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
var getNodes$i = function getNodes(main) {
  var allNodes = DocumentHelpers.findInlineNodes(main.state.doc)
  var fillTheGapNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'fill_the_gap') {
      fillTheGapNodes.push(node)
    }
  })
  return fillTheGapNodes
}

var _templateObject$v, _templateObject2$o, _templateObject3$l
var EditorWrapper$3 = styled.span(
  _templateObject$v ||
    (_templateObject$v = _taggedTemplateLiteral([
      '\n  display: inline-flex;\n\n  > .ProseMirror {\n    border-bottom: 1px solid #a6a6a6 !important;\n    border-radius: 4px;\n    box-shadow: none;\n    color: #008000;\n    display: inline;\n    min-width: 50px;\n    padding: 0px 2px 0px 2px !important;\n    white-space: break-spaces;\n    width: auto;\n    word-wrap: break-word;\n\n    &:focus {\n      outline: none;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n',
    ])),
)
var StudentAnswer = styled.span(
  _templateObject2$o ||
    (_templateObject2$o = _taggedTemplateLiteral([
      '\n  border-bottom: 1px solid black;\n  margin-right: 5px;\n  color: ',
      ';\n',
    ])),
  function (props) {
    return props.$isCorrect ? ' #008000' : 'red'
  },
)
var CorrectAnswers = styled.span(
  _templateObject3$l ||
    (_templateObject3$l = _taggedTemplateLiteral([
      '\n  border-bottom: 1px solid green;\n  margin-right: 5px;\n',
    ])),
)
var EditorComponent$1 = function EditorComponent(_ref) {
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
    )

    // Set Each note into Wax's Context
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
        for (var j = 0; j < steps.length; j += 1)
          outerTr.step(steps[j].map(offsetMap))
      }
      if (outerTr.docChanged)
        view.dispatch(outerTr.setMeta('outsideView', questionId))
    }
  }
  var isCorrect = false
  if (
    node.textContent.split(';').find(function (element) {
      var _node$attrs$answer
      return (
        element ===
        ((_node$attrs$answer = node.attrs.answer) === null ||
        _node$attrs$answer === void 0
          ? void 0
          : _node$attrs$answer.trim())
      )
    })
  ) {
    isCorrect = true
  }
  return (
    (isEditable &&
      !testMode &&
      !showFeedBack &&
      /*#__PURE__*/ React.createElement(
        EditorWrapper$3,
        null,
        /*#__PURE__*/ React.createElement('div', {
          ref: editorRef,
        }),
      )) ||
    (!isEditable &&
      !testMode &&
      !showFeedBack &&
      /*#__PURE__*/ React.createElement(
        EditorWrapper$3,
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
  return /*#__PURE__*/ React.createElement(EditorComponent$1, {
    getPos: getPos,
    node: node,
    view: view,
  })
}

var feedbackNode = {
  attrs: {
    class: {
      default: 'feedback-prompt',
    },
    id: {
      default: v4(),
    },
    optionId: {
      default: null,
    },
  },
  group: 'block questions',
  content: 'block*',
  defining: true,
  parseDOM: [
    {
      tag: 'div.feedback-prompt',
      getAttrs: function getAttrs(dom) {
        return {
          id: dom.getAttribute('id'),
          class: dom.getAttribute('class'),
          optionId: dom.getAttribute('data-option-id'),
        }
      },
    },
  ],
  toDOM: function toDOM(node) {
    return [
      'div',
      _objectSpread2(
        _objectSpread2({}, node.attrs),
        {},
        {
          'data-option-id': node.attrs.optionId,
        },
      ),
      0,
    ]
  },
}

var FeedbackNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
  function FeedbackNodeView(
    node,
    view,
    getPos,
    decorations,
    createPortal,
    Component,
    context,
  ) {
    var _this
    _classCallCheck(this, FeedbackNodeView)
    _this = _callSuper(this, FeedbackNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(FeedbackNodeView, _QuestionsNodeView)
  return _createClass(
    FeedbackNodeView,
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
          return 'feedback_prompt'
        },
      },
    ],
  )
})(QuestionsNodeView)

var _templateObject$u
styled.div(
  _templateObject$u ||
    (_templateObject$u = _taggedTemplateLiteral([
      '\n  --space: 2.5rem;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n\n  > * {\n    /* \u2193 Any extant vertical margins are removed */\n    margin-bottom: 0;\n    margin-top: 0;\n  }\n\n  > * + * {\n    /* \u2193 Top margin is only applied to successive elements */\n    margin-top: var(--space, 2.5rem);\n  }\n',
    ])),
)

var _templateObject$t
var Box = styled.div(
  _templateObject$t ||
    (_templateObject$t = _taggedTemplateLiteral([
      '\n  --s1: 1rem;\n  padding: var(--s1);\n',
    ])),
)

var _templateObject$s
styled.div(
  _templateObject$s ||
    (_templateObject$s = _taggedTemplateLiteral([
      '\n  --max-width: 70ch;\n  --min-width: 0;\n  --s1: 1em;\n  /* \u2193 Remove padding from the width calculation */\n  box-sizing: content-box;\n  /* \u2193 Only affect horizontal margins */\n  margin-inline: auto;\n  /* \u2193 The maximum width is the maximum measure */\n  max-width: var(--max-width, 70ch);\n  min-width: var(--min-width, 0);\n  /* \u2193 Apply the minimum horizontal space */\n  padding-inline: var(--s1);\n',
    ])),
)

var _templateObject$r, _templateObject2$n
var Wrapper$b = styled(Box)(
  _templateObject$r ||
    (_templateObject$r = _taggedTemplateLiteral([
      '\n  border-radius: 0 0 4px 4px;\n  border: 1px solid #a5a1a2;\n  border-top: none;\n  display: ',
      ';\n  margin: 0 32px 20px 20px;\n  margin-right: ',
      ';\n  padding: 0;\n\n  > div {\n    padding: 0 10px 10px;\n  }\n',
    ])),
  function (p) {
    return p.$testMode ? 'none' : 'block'
  },
  function (p) {
    return p.$fullWidth ? '20px' : '32px'
  },
)
var FeedbackLabel = styled.span(
  _templateObject2$n ||
    (_templateObject2$n = _taggedTemplateLiteral([
      '\n  font-weight: bold;\n  padding-inline: 15px;\n',
    ])),
)
var FeedbackComponentNew = function (_ref) {
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var testMode = customProps.testMode,
    showFeedBack = customProps.showFeedBack
  return /*#__PURE__*/ React.createElement(
    Wrapper$b,
    {
      $fullWidth: showFeedBack || testMode || !isEditable,
      $testMode: testMode,
      className: 'feedback-prompt',
    },
    /*#__PURE__*/ React.createElement(FeedbackLabel, null, 'Feedback'),
    /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
      getPos: getPos,
      node: node,
      placeholderText: 'Insert feedback',
      // QuestionType="EssayQuestion"
      view: view,
    }),
  )
}

var FillTheGapQuestionService = /*#__PURE__*/ (function (_Service) {
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
    _this = _callSuper(this, FillTheGapQuestionService, [].concat(args))
    _this.dependencies = [new FillTheGapQuestionService$1()]
    return _this
  }
  _inherits(FillTheGapQuestionService, _Service)
  return _createClass(FillTheGapQuestionService, [
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
        createNode({
          fill_the_gap_wrapper: fillTheGapWrapperNode,
        })
        createNode({
          feedback_prompt: feedbackNode,
        })
        addPortal({
          nodeView: FeedbackNodeView,
          component: FeedbackComponentNew,
          context: this.app,
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
})(Service)

var _dec$9, _class$9
var MatchingQuestion =
  ((_dec$9 = injectable()),
  _dec$9(
    (_class$9 = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(this, MatchingQuestion, [].concat(args))
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
          state.doc.nodesBetween(from, to, function (node) {
            if (node.type.groups.includes('questions')) {
              status = false
            }
          })
          return status
        }
        return _this
      }
      _inherits(MatchingQuestion, _Tools)
      return _createClass(MatchingQuestion, [
        {
          key: 'run',
          get: function get() {
            return function (main, context) {
              helpers.checkifEmpty(main)
              var state = main.state,
                dispatch = main.dispatch
              var _state$selection2 = state.selection,
                from = _state$selection2.from,
                to = _state$selection2.to
              var option = state.config.schema.nodes.matching_option.create(
                {
                  id: v4(),
                },
                Fragment.empty,
              )
              var paragraph = state.config.schema.nodes.paragraph.create(
                {
                  id: v4(),
                },
                Fragment.from([option]),
              )
              var container =
                state.config.schema.nodes.matching_container.create(
                  {
                    id: v4(),
                  },
                  Fragment.from([paragraph]),
                )
              var feedback = state.config.schema.nodes.feedback_prompt.create(
                {
                  id: v4(),
                },
                Fragment.empty,
              )
              var wrapper = state.config.schema.nodes.matching_wrapper.create(
                {
                  id: v4(),
                },
                Fragment.from([container, feedback]),
              )
              var tr = state.tr
              tr.replaceWith(from, to, wrapper)
              dispatch(tr)
              setTimeout(function () {
                helpers.createEmptyParagraph(context, feedback.attrs.id)
                context.pmViews[option.attrs.id].focus()
              }, 150)
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
    })(Tools)),
  ) || _class$9)

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
    // feedback: { default: '' },
  },
  group: 'block questions',
  isolating: true,
  content: 'block+',
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

var mathcingWrapperNode$1 = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'matching-wrapper',
    },
  },
  group: 'block questions',
  atom: true,
  content: 'block+',
  parseDOM: [
    {
      tag: 'div.matching-wrapper',
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

function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)); );
  return t
}

function _get() {
  return (
    (_get =
      'undefined' != typeof Reflect && Reflect.get
        ? Reflect.get.bind()
        : function (e, t, r) {
            var p = _superPropBase(e, t)
            if (p) {
              var n = Object.getOwnPropertyDescriptor(p, t)
              return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value
            }
          }),
    _get.apply(null, arguments)
  )
}

function _superPropGet(t, o, e, r) {
  var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e)
  return 2 & r && 'function' == typeof p
    ? function (t) {
        return p.apply(e, t)
      }
    : p
}

var MatchingContainerNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
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
    _this = _callSuper(this, MatchingContainerNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(MatchingContainerNodeView, _QuestionsNodeView)
  return _createClass(
    MatchingContainerNodeView,
    [
      {
        key: 'update',
        value: function update(node) {
          if (node.type.name === 'paragraph') {
            if (!node.sameMarkup(this.node)) return false
          }
          return _superPropGet(
            MatchingContainerNodeView,
            'update',
            this,
            3,
          )([node])
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
})(QuestionsNodeView)

var MatchingOptionNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
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
    _this = _callSuper(this, MatchingOptionNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(MatchingOptionNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var _templateObject$q
var EditorWrapper$2 = styled.div(
  _templateObject$q ||
    (_templateObject$q = _taggedTemplateLiteral([
      '\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n\n  > .ProseMirror {\n    padding: 0px;\n    box-shadow: none;\n    width: 100%;\n\n    &:focus {\n      outline: none;\n    }\n\n    p {\n      margin: 0;\n\n      br {\n        display: none;\n      }\n    }\n  }\n',
    ])),
)
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
    )

    // Set Each note into Wax's Context
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
        for (var j = 0; j < steps.length; j++)
          outerTr.step(steps[j].map(offsetMap))
      }
      if (outerTr.docChanged)
        view.dispatch(outerTr.setMeta('outsideView', questionId))
    }
  }
  return /*#__PURE__*/ React.createElement(
    EditorWrapper$2,
    null,
    /*#__PURE__*/ React.createElement('div', {
      ref: editorRef,
    }),
  )
}

var _templateObject$p,
  _templateObject2$m,
  _templateObject3$k,
  _templateObject4$k,
  _templateObject5$e,
  _templateObject6$d,
  _templateObject7$a,
  _templateObject8$6,
  _templateObject9$4,
  _templateObject0$4,
  _templateObject1
var MatchingWrapper = styled.div(
  _templateObject$p ||
    (_templateObject$p = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  margin: 0;\n\n  .ProseMirror-selectednode {\n    outline: none;\n  }\n',
    ])),
)
var MatchingContainerTool = styled.div(
  _templateObject2$m || (_templateObject2$m = _taggedTemplateLiteral([''])),
)
var MatchingContainer = styled.div(
  _templateObject3$k ||
    (_templateObject3$k = _taggedTemplateLiteral([
      '\n  border-block: 3px solid #f5f5f7;\n  margin-bottom: 30px;\n  padding: 10px;\n',
    ])),
)
var QuestionWrapper$4 = styled.div(
  _templateObject4$k ||
    (_templateObject4$k = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n\n  .feedback-prompt {\n    border: 0;\n    margin: 0;\n  }\n',
    ])),
)
var ActionButton$7 = styled.button(
  _templateObject5$e ||
    (_templateObject5$e = _taggedTemplateLiteral([
      '\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  height: 24px;\n  padding-left: 0;\n',
    ])),
)
var StyledIconAction$7 = styled(Icon)(
  _templateObject6$d ||
    (_templateObject6$d = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var CreateOptions = styled.div(
  _templateObject7$a ||
    (_templateObject7$a = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  padding-bottom: 10px;\n',
    ])),
)
var OptionArea = styled.div(
  _templateObject8$6 ||
    (_templateObject8$6 = _taggedTemplateLiteral([
      '\n  display: flex;\n  width: 100%;\n\n  ul {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n    margin: 0;\n    padding: 0;\n\n    li {\n      list-style-type: none;\n      padding-bottom: 7px;\n      padding-right: 7px;\n\n      span {\n        background: #535e76;\n        border-radius: 12px;\n        color: white;\n        padding: 3px 3px 3px 10px;\n      }\n\n      svg {\n        fill: white;\n        height: 16px;\n        width: 16px;\n      }\n    }\n  }\n',
    ])),
)
var AddOption$1 = styled.div(
  _templateObject9$4 ||
    (_templateObject9$4 = _taggedTemplateLiteral([
      '\n  display: flex;\n\n  input {\n    border: none;\n    border-bottom: 1px solid black;\n\n    &:focus {\n      outline: none;\n    }\n\n    ::placeholder {\n      color: rgb(170, 170, 170);\n      font-style: italic;\n    }\n  }\n\n  button {\n    background: #fff;\n    border: 1px solid #535e76;\n    color: #535e76;\n    cursor: pointer;\n    margin-left: 20px;\n    padding: 4px 8px 4px 8px;\n\n    &:hover {\n      background: #535e76;\n      border: 1px solid #535e76;\n      color: #fff;\n      cursor: pointer;\n      margin-right: 20px;\n      padding: 4px 8px 4px 8px;\n    }\n  }\n',
    ])),
)
var RemoveQuestionButton = styled.button(
  _templateObject0$4 ||
    (_templateObject0$4 = _taggedTemplateLiteral([
      '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 6px;\n  border: none;\n  position: relative;\n  bottom: 2px;\n  left: -11px;\n  float: right;\n',
    ])),
)
var StyledIconActionRemove$2 = styled(Icon)(
  _templateObject1 ||
    (_templateObject1 = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var MatchingContainerComponent = function (_ref) {
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
      var allNodes = getNodes$h(main)

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
    var allNodes = getNodes$h(context.pmViews.main)
    // const allNodesOptions = getOptionsNodes(context.pmViews.main);

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
                // eslint-disable-next-line no-param-reassign
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
  var removeQuestion = function removeQuestion() {
    var allNodes = getNodesToDelete$1(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      var _singleNode$node$cont
      var containerId =
        (_singleNode$node$cont = singleNode.node.content.content.find(function (
          n,
        ) {
          return n.type.name === 'matching_container'
        })) === null || _singleNode$node$cont === void 0
          ? void 0
          : _singleNode$node$cont.attrs.id
      if (containerId === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr['delete'](
            singleNode.pos,
            singleNode.pos + singleNode.node.nodeSize,
          ),
        )
      }
    })
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
        QuestionWrapper$4,
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
                          ActionButton$7,
                          {
                            'aria-label': 'delete '.concat(option.label),
                            onClick: function onClick() {
                              return removeOption(option.value)
                            },
                            ref: setRef(option.value),
                            type: 'button',
                          },
                          /*#__PURE__*/ React.createElement(
                            StyledIconAction$7,
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
              AddOption$1,
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
    ),
  )
}
var getNodes$h = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var matchingContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'matching_container') {
      matchingContainerNodes.push(node)
    }
  })
  return matchingContainerNodes
}
var getNodesToDelete$1 = function getNodesToDelete(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var matchingContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'matching_wrapper') {
      matchingContainerNodes.push(node)
    }
  })
  return matchingContainerNodes
}

// const getOptionsNodes = view => {
//   const allNodes = DocumentHelpers.findInlineNodes(view.state.doc);
//   const matchingOptionNodes = [];
//   allNodes.forEach(node => {
//     if (node.node.type.name === 'matching_option') {
//       matchingOptionNodes.push(node);
//     }
//   });
//   return matchingOptionNodes;
// };

var _templateObject$o
var EditorWrapper$1 = styled.div(
  _templateObject$o ||
    (_templateObject$o = _taggedTemplateLiteral([
      "\n  border: none;\n  display: flex;\n  width: 68%;\n\n  > .ProseMirror {\n    white-space: break-spaces;\n    width: 100% !important;\n    min-height: 25px !important;\n    word-wrap: break-word;\n    padding: 4px !important;\n    border: 12px solid #f4f4f7;\n    border-radius: 12px;\n    box-shadow: none !important;\n\n    &:focus {\n      outline: none;\n    }\n\n    :empty::before {\n      content: 'Type your text';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n\n    p:first-child {\n      margin: 0;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n",
    ])),
)
var EditorComponent = function EditorComponent(_ref) {
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
    )

    // Set Each note into Wax's Context
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
        for (var j = 0; j < steps.length; j++)
          outerTr.step(steps[j].map(offsetMap))
      }
      if (outerTr.docChanged)
        view.dispatch(outerTr.setMeta('outsideView', questionId))
    }
  }
  return /*#__PURE__*/ React.createElement(
    EditorWrapper$1,
    null,
    /*#__PURE__*/ React.createElement('div', {
      ref: editorRef,
    }),
  )
}

var _templateObject$n,
  _templateObject2$l,
  _templateObject3$j,
  _templateObject4$j
var Wrapper$a = styled.div(
  _templateObject$n || (_templateObject$n = _taggedTemplateLiteral([''])),
)
var DropDownButton$4 = styled.button(
  _templateObject2$l ||
    (_templateObject2$l = _taggedTemplateLiteral([
      '\n  background: #fff;\n  border: none;\n  color: #000;\n  cursor: ',
      ';\n  opacity: ',
      ';\n  display: flex;\n  position: relative;\n  width: 160px;\n\n  span {\n    position: relative;\n    top: 2px;\n  }\n',
    ])),
  function (props) {
    return props.$disabled ? 'not-allowed' : 'pointer'
  },
  function (props) {
    return props.$disabled ? '0.4' : '1'
  },
)
var DropDownMenu$4 = styled.div(
  _templateObject3$j ||
    (_templateObject3$j = _taggedTemplateLiteral([
      '\n  visibility: ',
      ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 10px auto auto;\n  position: absolute;\n  width: 170px;\n  max-height: 150px;\n  overflow-y: auto;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
    ])),
  function (props) {
    return props.$isOpen ? 'visible' : 'hidden'
  },
)
var StyledIcon$4 = styled(Icon)(
  _templateObject4$j ||
    (_templateObject4$j = _taggedTemplateLiteral([
      '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n',
    ])),
)
var DropComponent$1 = function DropComponent(_ref) {
  var _getMatchingNode, _getMatchingNode$attr
  _ref.getPos
  var node = _ref.node
  _ref.view
  var uniqueId = _ref.uniqueId
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
    var allNodes = getNodes$g(main)
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
    }

    // arrow up
    if (e.keyCode === 38) {
      if (
        index === 0 &&
        itemRefs.current[itemRefs.current.length - 1].current
      ) {
        itemRefs.current[itemRefs.current.length - 1].current.focus()
      } else {
        itemRefs.current[index - 1].current.focus()
      }
    }

    // enter
    if (e.keyCode === 13) {
      itemRefs.current[index].current.click()
    }

    // ESC
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
        Wrapper$a,
        {
          $disabled: isDisabled,
          ref: wrapperRef,
        },
        /*#__PURE__*/ React.createElement(
          DropDownButton$4,
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
          /*#__PURE__*/ React.createElement(StyledIcon$4, {
            name: 'expand',
          }),
        ),
        /*#__PURE__*/ React.createElement(
          DropDownMenu$4,
          {
            $isOpen: isOpen,
            'aria-label': 'Choose an option',
            id: uniqueId,
            role: 'listbox',
          },
          allOptions &&
            allOptions.map(function (option, index) {
              itemRefs.current[index] =
                itemRefs.current[index] || /*#__PURE__*/ createRef()
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
var getNodes$g = function getNodes(view) {
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

var _templateObject$m,
  _templateObject2$k,
  _templateObject3$i,
  _templateObject4$i
var Wrapper$9 = styled.div(
  _templateObject$m || (_templateObject$m = _taggedTemplateLiteral([''])),
)
var DropDownButton$3 = styled.button(
  _templateObject2$k ||
    (_templateObject2$k = _taggedTemplateLiteral([
      '\n  background: #fff;\n  border: none;\n  color: #000;\n  cursor: ',
      ';\n  opacity: ',
      ';\n  display: flex;\n  position: relative;\n  width: 160px;\n\n  span {\n    position: relative;\n    top: 2px;\n  }\n',
    ])),
  function (props) {
    return props.$disabled ? 'not-allowed' : 'pointer'
  },
  function (props) {
    return props.$disabled ? '0.4' : '1'
  },
)
var DropDownMenu$3 = styled.div(
  _templateObject3$i ||
    (_templateObject3$i = _taggedTemplateLiteral([
      '\n  visibility: ',
      ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 10px auto auto;\n  position: absolute;\n  width: 170px;\n  max-height: 150px;\n  overflow-y: auto;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
    ])),
  function (props) {
    return props.$isOpen ? 'visible' : 'hidden'
  },
)
var StyledIcon$3 = styled(Icon)(
  _templateObject4$i ||
    (_templateObject4$i = _taggedTemplateLiteral([
      '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n',
    ])),
)
var TestModeDropDownComponent = function TestModeDropDownComponent(_ref) {
  _ref.getPos
  var node = _ref.node
  _ref.view
  var uniqueId = _ref.uniqueId
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
    var allNodes = getNodes$f(main)
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
    }

    // arrow up
    if (e.keyCode === 38) {
      if (
        index === 0 &&
        itemRefs.current[itemRefs.current.length - 1].current
      ) {
        itemRefs.current[itemRefs.current.length - 1].current.focus()
      } else {
        itemRefs.current[index - 1].current.focus()
      }
    }

    // enter
    if (e.keyCode === 13) {
      itemRefs.current[index].current.click()
    }

    // ESC
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
        Wrapper$9,
        {
          $disabled: isDisabled,
          ref: wrapperRef,
        },
        /*#__PURE__*/ React.createElement(
          DropDownButton$3,
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
          /*#__PURE__*/ React.createElement(StyledIcon$3, {
            name: 'expand',
          }),
        ),
        /*#__PURE__*/ React.createElement(
          DropDownMenu$3,
          {
            $isOpen: isOpen,
            'aria-label': 'Choose an option',
            id: uniqueId,
            role: 'listbox',
          },
          node.attrs.options.map(function (option, index) {
            itemRefs.current[index] =
              itemRefs.current[index] || /*#__PURE__*/ createRef()
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
var getNodes$f = function getNodes(view) {
  return DocumentHelpers.findInlineNodes(view.state.doc)
}

var _templateObject$l,
  _templateObject2$j,
  _templateObject3$h,
  _templateObject4$h,
  _templateObject5$d,
  _templateObject6$c,
  _templateObject7$9,
  _templateObject8$5
var Option$1 = styled.div(
  _templateObject$l ||
    (_templateObject$l = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: row;\n  padding-bottom: 10px;\n  width: 100%;\n',
    ])),
)
var ButtonsContainer = styled.div(
  _templateObject2$j ||
    (_templateObject2$j = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  width: 7%;\n',
    ])),
)
var DropDownContainer = styled.div(
  _templateObject3$h ||
    (_templateObject3$h = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n',
    ])),
)
var ActionButton$6 = styled.button(
  _templateObject4$h ||
    (_templateObject4$h = _taggedTemplateLiteral([
      '\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  height: 24px;\n  padding-left: 0;\n',
    ])),
)
var StyledIconAction$6 = styled(Icon)(
  _templateObject5$d ||
    (_templateObject5$d = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var AnswerContainer$6 = styled.div(
  _templateObject6$c ||
    (_templateObject6$c = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  margin-left: 10px;\n',
    ])),
)
var CorrectAnswer$1 = styled.span(
  _templateObject7$9 ||
    (_templateObject7$9 = _taggedTemplateLiteral([
      '\n  span {\n    color: #008000;\n  }\n',
    ])),
)
var Answer$3 = styled.span(
  _templateObject8$5 ||
    (_templateObject8$5 = _taggedTemplateLiteral([
      '\n  span {\n    color: ',
      ';\n  }\n',
    ])),
  function (props) {
    return props.$isCorrect ? '#008000' : '#FF3030'
  },
)
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
    Option$1,
    null,
    !readOnly &&
      /*#__PURE__*/ React.createElement(
        ButtonsContainer,
        null,
        /*#__PURE__*/ React.createElement(
          ActionButton$6,
          {
            'aria-label': 'add new option',
            onClick: addAnswer,
            type: 'button',
          },
          /*#__PURE__*/ React.createElement(StyledIconAction$6, {
            name: 'plusSquare',
          }),
        ),
        !node.attrs.isfirst &&
          /*#__PURE__*/ React.createElement(
            ActionButton$6,
            {
              'aria-label': 'delete this option',
              onClick: removeAnswer,
              type: 'button',
            },
            /*#__PURE__*/ React.createElement(StyledIconAction$6, {
              name: 'deleteOutlined',
            }),
          ),
      ),
    /*#__PURE__*/ React.createElement(EditorComponent, {
      getPos: getPos,
      node: node,
      view: view,
    }),
    /*#__PURE__*/ React.createElement(
      DropDownContainer,
      null,
      (!readOnly || (readOnly && !testMode && !showFeedBack)) &&
        /*#__PURE__*/ React.createElement(DropComponent$1, {
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
          AnswerContainer$6,
          null,
          /*#__PURE__*/ React.createElement(
            CorrectAnswer$1,
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
            Answer$3,
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
    _this = _callSuper(this, MatchingService, [].concat(args))
    _this.name = 'MatchingService'
    return _this
  }
  _inherits(MatchingService, _Service)
  return _createClass(MatchingService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('MatchingQuestion').to(MatchingQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          matching_wrapper: mathcingWrapperNode$1,
        })
        createNode({
          matching_container: matchingContainerNode,
        })
        createNode({
          matching_option: matchingOptionNode,
        })
        createNode({
          feedback_prompt: feedbackNode,
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
        addPortal({
          nodeView: FeedbackNodeView,
          component: FeedbackComponentNew,
          context: this.app,
        })
      },
    },
  ])
})(Service)

var _dec$8, _class$8
var MultipleDropDownQuestion =
  ((_dec$8 = injectable()),
  _dec$8(
    (_class$8 = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(this, MultipleDropDownQuestion, [].concat(args))
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
          state.doc.nodesBetween(from, to, function (node) {
            if (node.type.groups.includes('questions')) {
              status = false
            }
          })
          return status
        }
        return _this
      }
      _inherits(MultipleDropDownQuestion, _Tools)
      return _createClass(MultipleDropDownQuestion, [
        {
          key: 'run',
          get: function get() {
            return function (main, context) {
              helpers.checkifEmpty(main)
              var state = main.state,
                dispatch = main.dispatch
              var _state$selection2 = state.selection,
                from = _state$selection2.from,
                to = _state$selection2.to
              var container =
                state.config.schema.nodes.multiple_drop_down_container.create(
                  {
                    id: v4(),
                  },
                  Fragment.empty,
                )
              var feedback = state.config.schema.nodes.feedback_prompt.create(
                {
                  id: v4(),
                },
                Fragment.empty,
              )
              var wrapper =
                state.config.schema.nodes.multiple_drop_down_wrapper.create(
                  {
                    id: v4(),
                  },
                  Fragment.from([container, feedback]),
                )
              var tr = state.tr
              tr.replaceWith(from, to, wrapper)
              dispatch(tr)
              setTimeout(function () {
                helpers.createEmptyParagraph(context, container.attrs.id)
                context.pmViews[container.attrs.id].focus()
              }, 150)
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
            return function () {}
          },
        },
      ])
    })(Tools)),
  ) || _class$8)

var MultipleDropDownContainerNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
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
    _this = _callSuper(this, MultipleDropDownContainerNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(MultipleDropDownContainerNodeView, _QuestionsNodeView)
  return _createClass(
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
  content: 'block+',
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

var mathcingWrapperNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'multiple-drop-down-wrapper',
    },
  },
  group: 'block questions',
  atom: true,
  content: 'block+',
  parseDOM: [
    {
      tag: 'div.multiple-drop-down-wrapper',
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

var _dec$7, _class$7
var CreateDropDown =
  ((_dec$7 = injectable()),
  _dec$7(
    (_class$7 = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(this, CreateDropDown, [].concat(args))
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
      _inherits(CreateDropDown, _Tools)
      return _createClass(CreateDropDown, [
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
                tr.selection.anchor - tr.selection.$anchor.nodeBefore.nodeSize,
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
    })(Tools)),
  ) || _class$7)

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
    _this = _callSuper(this, MultipleDropDownNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(MultipleDropDownNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var _templateObject$k,
  _templateObject2$i,
  _templateObject3$g,
  _templateObject4$g
var Wrapper$8 = styled.div(
  _templateObject$k ||
    (_templateObject$k = _taggedTemplateLiteral([
      '\n  display: inline-flex;\n',
    ])),
)
var DropDownButton$2 = styled.button(
  _templateObject2$i ||
    (_templateObject2$i = _taggedTemplateLiteral([
      '\n  background: #fff;\n  border: 1px solid rgb(204, 204, 204);\n  color: #000;\n  cursor: ',
      ';\n  display: inline-flex;\n  opacity: ',
      ';\n  padding: 8px 4px 4px 4px;\n  position: relative;\n  width: 165px;\n\n  span {\n    position: relative;\n    top: 2px;\n  }\n  &focus {\n    outline: 0;\n  }\n',
    ])),
  function (props) {
    return props.$disabled ? 'not-allowed' : 'pointer'
  },
  function (props) {
    return props.$disabled ? '0.4' : '1'
  },
)
var DropDownMenu$2 = styled.div(
  _templateObject3$g ||
    (_templateObject3$g = _taggedTemplateLiteral([
      '\n  visibility: ',
      ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 35px auto auto;\n  position: absolute;\n  width: 170px;\n  max-height: 150px;\n  overflow-y: auto;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
    ])),
  function (props) {
    return props.$isOpen ? 'visible' : 'hidden'
  },
)
var StyledIcon$2 = styled(Icon)(
  _templateObject4$g ||
    (_templateObject4$g = _taggedTemplateLiteral([
      '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n',
    ])),
)
var DropComponent = function DropComponent(_ref) {
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
    var allNodes = getNodes$e(main)
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
    }

    // arrow up
    if (e.keyCode === 38) {
      if (
        index === 0 &&
        itemRefs.current[itemRefs.current.length - 1].current
      ) {
        itemRefs.current[itemRefs.current.length - 1].current.focus()
      } else {
        itemRefs.current[index - 1].current.focus()
      }
    }

    // enter
    if (e.keyCode === 13) {
      itemRefs.current[index].current.click()
    }

    // ESC
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
        Wrapper$8,
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
            itemRefs.current[index] =
              itemRefs.current[index] || /*#__PURE__*/ createRef()
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
var getNodes$e = function getNodes(view) {
  return DocumentHelpers.findInlineNodes(view.state.doc)
}

var _templateObject$j,
  _templateObject2$h,
  _templateObject3$f,
  _templateObject4$f,
  _templateObject5$c,
  _templateObject6$b,
  _templateObject7$8
var activeStylesContainer = css(
  _templateObject$j ||
    (_templateObject$j = _taggedTemplateLiteral([
      '\n  background: #535e76;\n  border-radius: 2px;\n',
    ])),
)
var activeStylesSvg = css(
  _templateObject2$h ||
    (_templateObject2$h = _taggedTemplateLiteral(['\n  fill: white;\n'])),
)
var StyledIconActionContainer = styled.span(
  _templateObject3$f ||
    (_templateObject3$f = _taggedTemplateLiteral([
      '\n  display: inline-block;\n  height: 24px;\n  width: 24px;\n  cursor: pointer;\n  ',
      '\n',
    ])),
  function (props) {
    return props.$isActive && activeStylesContainer
  },
)
var StyledIconAction$5 = styled(Icon)(
  _templateObject4$f ||
    (_templateObject4$f = _taggedTemplateLiteral(['\n  ', '\n'])),
  function (props) {
    return props.$isActive && activeStylesSvg
  },
)
var AnswerContainer$5 = styled.div(
  _templateObject5$c ||
    (_templateObject5$c = _taggedTemplateLiteral([
      '\n  display: inline-block;\n  border: ',
      ';\n  padding: 2px 4px 2px 4px;\n',
    ])),
  function (props) {
    return props.$isCorrect ? '1px solid #008000;' : '1px solid #FF3030'
  },
)
var CorrectAnswer = styled.span(
  _templateObject6$b || (_templateObject6$b = _taggedTemplateLiteral([''])),
)
var Answer$2 = styled.span(
  _templateObject7$8 || (_templateObject7$8 = _taggedTemplateLiteral([''])),
)
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
      /*#__PURE__*/ React.createElement(StyledIconAction$5, {
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
      AnswerContainer$5,
      {
        $isCorrect: isCorrect,
      },
      'Correct:',
      correct &&
        /*#__PURE__*/ React.createElement(
          CorrectAnswer,
          null,
          ' ',
          correct.label,
          ' | \xA0',
        ),
      'Answer: ',
      answer &&
        /*#__PURE__*/ React.createElement(Answer$2, null, ' ', answer.label),
    )
  }
  return /*#__PURE__*/ React.createElement(DropComponent, {
    getPos: getPos,
    node: node,
    uniqueId: v4(),
  })
}

var _templateObject$i, _templateObject2$g
var CheckContainer = styled.label(
  _templateObject$i ||
    (_templateObject$i = _taggedTemplateLiteral([
      '\n  display: block;\n  position: relative;\n  padding-left: 20px;\n  margin-bottom: 5px;\n  cursor: pointer;\n  user-select: none;\n\n  input {\n    position: absolute;\n    opacity: 0;\n    cursor: pointer;\n    height: 0;\n    width: 0;\n  }\n\n  &:hover input ~ span {\n    background-color: #ccc;\n  }\n\n  input:checked ~ span {\n    background-color: #535e76;\n  }\n\n  input:checked ~ .span:after {\n    display: block;\n  }\n\n  span:after {\n    top: 9px;\n    left: 9px;\n    width: 8px;\n    height: 8px;\n    border-radius: 50%;\n    background: white;\n  }\n',
    ])),
)
var RadioBtn = styled.span(
  _templateObject2$g ||
    (_templateObject2$g = _taggedTemplateLiteral([
      "\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 15px;\n  width: 15px;\n  background-color: #eee;\n  border-radius: 50%;\n\n  &:after {\n    content: '';\n    position: absolute;\n    display: none;\n  }\n",
    ])),
)
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

var _templateObject$h,
  _templateObject2$f,
  _templateObject3$e,
  _templateObject4$e,
  _templateObject5$b,
  _templateObject6$a
var TriangleTop = styled.div(
  _templateObject$h ||
    (_templateObject$h = _taggedTemplateLiteral([
      '\n  width: 0;\n  height: 0;\n  margin: 0px auto;\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-bottom: 10px solid #535e76;\n',
    ])),
)
var DropDownComponent$1 = styled.div(
  _templateObject2$f ||
    (_templateObject2$f = _taggedTemplateLiteral([
      '\n  width: 174px;\n  height: 150px;\n  background: white;\n  border: 1px solid #535e76;\n  display: flex;\n  flex-direction: column;\n  padding: 5px;\n',
    ])),
)
var Options = styled.div(
  _templateObject3$e ||
    (_templateObject3$e = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  height: 100px;\n  font-size: 11px;\n  overflow-y: auto;\n',
    ])),
)
var Option = styled.div(
  _templateObject4$e ||
    (_templateObject4$e = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: row;\n  width: 96%;\n',
    ])),
)
var AddOption = styled.div(
  _templateObject5$b ||
    (_templateObject5$b = _taggedTemplateLiteral([
      '\n  display: flex;\n  margin-top: auto;\n  input {\n    border: none;\n    border-bottom: 1px solid black;\n    width: 160px;\n    &:focus {\n      outline: none;\n    }\n\n    ::placeholder {\n      color: rgb(170, 170, 170);\n      font-style: italic;\n      font-size: 10px;\n    }\n  }\n  button {\n    border: 1px solid #535e76;\n    cursor: pointer;\n    color: #535e76;\n    margin-left: 20px;\n    background: #fff;\n    padding: 4px 8px 4px 8px;\n    &:hover {\n      border: 1px solid #535e76;\n      cursor: pointer;\n      color: #535e76;\n      margin-right: 10px;\n      background: #fff;\n      background: #535e76;\n      color: #fff;\n      padding: 4px 8px 4px 8px;\n    }\n  }\n',
    ])),
)
var IconRemove = styled(Icon)(
  _templateObject6$a ||
    (_templateObject6$a = _taggedTemplateLiteral([
      '\n  cursor: pointer;\n  position: relative;\n  top: 2px;\n  left: 6px;\n  height: 16px;\n  width: 16px;\n',
    ])),
)
var previousNode = ''
var DropDownComponent$2 = function (_ref) {
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
        DropDownComponent$1,
        null,
        /*#__PURE__*/ React.createElement(
          Options,
          null,
          options.map(function (value) {
            return /*#__PURE__*/ React.createElement(
              Option,
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
          AddOption,
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

var _dec$6, _class$6
var MultipleDropDown =
  ((_dec$6 = injectable()),
  _dec$6(
    (_class$6 = /*#__PURE__*/ (function (_ToolGroup) {
      function MultipleDropDown(CreateDropDown) {
        var _this
        _classCallCheck(this, MultipleDropDown)
        _this = _callSuper(this, MultipleDropDown)
        _this.tools = []
        _this.tools = [CreateDropDown]
        return _this
      }
      MultipleDropDown =
        inject('CreateDropDown')(MultipleDropDown, undefined, 0) ||
        MultipleDropDown
      _inherits(MultipleDropDown, _ToolGroup)
      return _createClass(MultipleDropDown)
    })(ToolGroup)),
  ) || _class$6)

var MultipleDropDownToolGroupService = /*#__PURE__*/ (function (_Service) {
  function MultipleDropDownToolGroupService() {
    _classCallCheck(this, MultipleDropDownToolGroupService)
    return _callSuper(this, MultipleDropDownToolGroupService, arguments)
  }
  _inherits(MultipleDropDownToolGroupService, _Service)
  return _createClass(MultipleDropDownToolGroupService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('MultipleDropDown').to(MultipleDropDown)
      },
    },
  ])
})(Service)

var CreateDropDownService = /*#__PURE__*/ (function (_Service) {
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
    _this = _callSuper(this, CreateDropDownService, [].concat(args))
    _this.name = 'CreateDropDownService'
    _this.dependencies = [new MultipleDropDownToolGroupService()]
    return _this
  }
  _inherits(CreateDropDownService, _Service)
  return _createClass(CreateDropDownService, [
    {
      key: 'boot',
      value: function boot() {
        var createOverlay = this.container.get('CreateOverlay')
        createOverlay(
          DropDownComponent$2,
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
})(Service)

var _templateObject$g
var EditorWrapper = styled.div(
  _templateObject$g ||
    (_templateObject$g = _taggedTemplateLiteral([
      "\n  position: relative;\n  height: 100%;\n\n  > .ProseMirror {\n    padding: 5px !important;\n\n    &:focus {\n      outline: none;\n    }\n\n    img[class='ProseMirror-separator'] {\n      display: inline !important;\n    }\n\n    p.empty-node:first-child::before {\n      content: attr(data-content);\n    }\n\n    .empty-node::before {\n      color: rgb(170, 170, 170);\n      float: left;\n      font-style: italic;\n      height: 0px;\n      pointer-events: none;\n    }\n  }\n",
    ])),
)
var WaxOverlays = function WaxOverlays() {
  return true
}
var ContainerEditor = function ContainerEditor(_ref) {
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
    }
    // LISTS
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
    WaxOverlays = ComponentPlugin('waxOverlays')
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
    )

    // Set Each note into Wax's Context
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
        for (var j = 0; j < steps.length; j++)
          outerTr.step(steps[j].map(offsetMap))
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
    EditorWrapper,
    null,
    /*#__PURE__*/ React.createElement('div', {
      ref: editorRef,
    }),
    /*#__PURE__*/ React.createElement(WaxOverlays, {
      activeViewId: questionId,
      group: 'questions',
    }),
  )
}

var _templateObject$f,
  _templateObject2$e,
  _templateObject3$d,
  _templateObject4$d,
  _templateObject5$a
var MultipleDropDownpWrapper = styled.div(
  _templateObject$f || (_templateObject$f = _taggedTemplateLiteral([''])),
)
var MultipleDropDownContainerTool = styled.div(
  _templateObject2$e ||
    (_templateObject2$e = _taggedTemplateLiteral([
      '\n  span {\n    position: relative;\n    top: 3px;\n  }\n',
    ])),
)
var MultipleDropDownpContainer = styled.div(
  _templateObject3$d ||
    (_templateObject3$d = _taggedTemplateLiteral([
      '\n  border-block: 3px solid #f5f5f7;\n  margin-bottom: 30px;\n',
    ])),
)
var ActionButton$5 = styled.button(
  _templateObject4$d ||
    (_templateObject4$d = _taggedTemplateLiteral([
      '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n  border: none;\n  position: relative;\n  bottom: 14px;\n  left: -11px;\n  float: right;\n',
    ])),
)
var StyledIconActionRemove$1 = styled(Icon)(
  _templateObject5$a ||
    (_templateObject5$a = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var MultipleDropDownContainerComponent = function (_ref) {
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
  var removeQuestion = function removeQuestion() {
    var allNodes = getNodes$d(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      var _singleNode$node$cont
      var containerId =
        (_singleNode$node$cont = singleNode.node.content.content.find(function (
          n,
        ) {
          return n.type.name === 'multiple_drop_down_container'
        })) === null || _singleNode$node$cont === void 0
          ? void 0
          : _singleNode$node$cont.attrs.id
      if (containerId === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr['delete'](
            singleNode.pos,
            singleNode.pos + singleNode.node.nodeSize,
          ),
        )
      }
    })
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
            ActionButton$5,
            {
              'aria-label': 'delete this question',
              onClick: removeQuestion,
              type: 'button',
            },
            /*#__PURE__*/ React.createElement(StyledIconActionRemove$1, {
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
      /*#__PURE__*/ React.createElement(ContainerEditor, {
        getPos: getPos,
        node: node,
        view: view,
      }),
    ),
  )
}
var getNodes$d = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleDropContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'multiple_drop_down_wrapper') {
      multipleDropContainerNodes.push(node)
    }
  })
  return multipleDropContainerNodes
}

var MultipleDropDownService = /*#__PURE__*/ (function (_Service) {
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
    _this = _callSuper(this, MultipleDropDownService, [].concat(args))
    _this.name = 'MultipleDropDownService'
    _this.dependencies = [new CreateDropDownService()]
    return _this
  }
  _inherits(MultipleDropDownService, _Service)
  return _createClass(MultipleDropDownService, [
    {
      key: 'register',
      value: function register() {
        this.container
          .bind('MultipleDropDownQuestion')
          .to(MultipleDropDownQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          multiple_drop_down_wrapper: mathcingWrapperNode,
        })
        createNode({
          multiple_drop_down_container: multipleDropDownContainerNode,
        })
        createNode({
          feedback_prompt: feedbackNode,
        })
        addPortal({
          nodeView: MultipleDropDownContainerNodeView,
          component: MultipleDropDownContainerComponent,
          context: this.app,
        })
        addPortal({
          nodeView: FeedbackNodeView,
          component: FeedbackComponentNew,
          context: this.app,
        })
      },
    },
  ])
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

var NumericalWrapperNode = {
  attrs: {
    id: {
      default: '',
    },
    class: {
      default: 'numerical-wrapper',
    },
  },
  group: 'block questions',
  atom: true,
  content: 'block+',
  parseDOM: [
    {
      tag: 'div.numerical-wrapper',
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

var _dec$5, _class$5
var NumericalAnswerQuestion =
  ((_dec$5 = injectable()),
  _dec$5(
    (_class$5 = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(this, NumericalAnswerQuestion, [].concat(args))
        _this.title = 'Numerical Answer Question'
        _this.icon = ''
        _this.name = 'Numerical Answer'
        return _this
      }
      _inherits(NumericalAnswerQuestion, _Tools)
      return _createClass(NumericalAnswerQuestion, [
        {
          key: 'run',
          get: function get() {
            return function (main, context) {
              helpers.checkifEmpty(main)
              var state = main.state,
                dispatch = main.dispatch
              var _state$selection = state.selection,
                from = _state$selection.from,
                to = _state$selection.to
              var container =
                state.config.schema.nodes.numerical_answer_container.create(
                  {
                    id: v4(),
                  },
                  Fragment.empty,
                )
              var feedback = state.config.schema.nodes.feedback_prompt.create(
                {
                  id: v4(),
                },
                Fragment.empty,
              )
              var wrapper = state.config.schema.nodes.numerical_wrapper.create(
                {
                  id: v4(),
                },
                Fragment.from([container, feedback]),
              )
              var tr = state.tr
              tr.replaceWith(from, to, wrapper)
              dispatch(tr)
              setTimeout(function () {
                helpers.createEmptyParagraph(context, container.attrs.id)
              }, 150)
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

          // select = (state, activeViewId, activeView) => {};
        },
      ])
    })(Tools)),
  ) || _class$5)

var NumericalAnswerContainerNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
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
    _this = _callSuper(this, NumericalAnswerContainerNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(NumericalAnswerContainerNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var _templateObject$e,
  _templateObject2$d,
  _templateObject3$c,
  _templateObject4$c
var Wrapper$7 = styled.div(
  _templateObject$e ||
    (_templateObject$e = _taggedTemplateLiteral([
      '\n  opacity: ',
      ';\n  z-index: 999;\n',
    ])),
  function (props) {
    return props.$disabled ? '0.4' : '1'
  },
)
var DropDownButton$1 = styled.button(
  _templateObject2$d ||
    (_templateObject2$d = _taggedTemplateLiteral([
      '\n  background: #fff;\n  border: 1px solid #f4f4f4;\n  color: #000;\n  cursor: ',
      ';\n  display: flex;\n  position: relative;\n  top: 2px;\n  left: 3px;\n  width: 235px;\n  height: 26px;\n\n  span {\n    position: relative;\n    top: 4px;\n  }\n',
    ])),
  function (props) {
    return props.$disabled ? 'not-allowed' : 'pointer'
  },
)
var DropDownMenu$1 = styled.div(
  _templateObject3$c ||
    (_templateObject3$c = _taggedTemplateLiteral([
      '\n  visibility: ',
      ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 2px auto auto;\n  position: absolute;\n  width: 235px;\n  max-height: 150px;\n  overflow-y: auto;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    border-bottom: 1px solid #f4f4f4;\n    font-size: 11px;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
    ])),
  function (props) {
    return props.$isOpen ? 'visible' : 'hidden'
  },
)
var StyledIcon$1 = styled(Icon)(
  _templateObject4$c ||
    (_templateObject4$c = _taggedTemplateLiteral([
      '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n  position: relative;\n  top: 1px;\n',
    ])),
)
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
    var isDisabled = !isEditable
    // if (activeView.props?.type !== 'NumericalAnswer') isDisabled = true;

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
      // arrow down
      if (e.keyCode === 40) {
        if (index === itemRefs.current.length - 1) {
          itemRefs.current[0].current.focus()
        } else {
          itemRefs.current[index + 1].current.focus()
        }
      }

      // arrow up
      if (e.keyCode === 38) {
        if (index === 0) {
          itemRefs.current[itemRefs.current.length - 1].current.focus()
        } else {
          itemRefs.current[index - 1].current.focus()
        }
      }

      // enter
      if (e.keyCode === 13) {
        itemRefs.current[index].current.click()
      }

      // ESC
      if (e.keyCode === 27) {
        setIsOpen(false)
      }
    }
    var SaveTypeToNode = function SaveTypeToNode(option) {
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
          Wrapper$7,
          {
            $disabled: isDisabled,
            ref: wrapperRef,
          },
          /*#__PURE__*/ React.createElement(
            DropDownButton$1,
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
            /*#__PURE__*/ React.createElement(StyledIcon$1, {
              name: 'expand',
            }),
          ),
          /*#__PURE__*/ React.createElement(
            DropDownMenu$1,
            {
              $isOpen: isOpen,
              'aria-label': 'Choose an item type',
              id: 'numerical-list',
              role: 'menu',
            },
            dropDownOptions.map(function (option, index) {
              itemRefs.current[index] =
                itemRefs.current[index] || /*#__PURE__*/ createRef()
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

var _templateObject$d,
  _templateObject2$c,
  _templateObject3$b,
  _templateObject4$b,
  _templateObject5$9,
  _templateObject6$9,
  _templateObject7$7
var AnswerContainer$4 = styled.div(
  _templateObject$d ||
    (_templateObject$d = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n',
    ])),
)
var ValueContainer$2 = styled.div(
  _templateObject2$c ||
    (_templateObject2$c = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  margin-right: 25px;\n\n  label {\n    font-size: 12px;\n  }\n\n  input:focus {\n    outline: none;\n  }\n',
    ])),
)
var ValueInnerContainer$2 = styled.div(
  _templateObject3$b ||
    (_templateObject3$b = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n',
    ])),
)
var ResultContainer$2 = styled.div(
  _templateObject4$b ||
    (_templateObject4$b = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n',
    ])),
)
var FinalResult$2 = styled.span(
  _templateObject5$9 ||
    (_templateObject5$9 = _taggedTemplateLiteral([
      '\n  color: ',
      ';\n  font-weight: 999;\n',
    ])),
  function (props) {
    return props.$isCorrect ? ' #008000' : 'red'
  },
)
var StyledIconCorrect$4 = styled(Icon)(
  _templateObject6$9 ||
    (_templateObject6$9 = _taggedTemplateLiteral([
      '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
var StyledIconWrong$4 = styled(Icon)(
  _templateObject7$7 ||
    (_templateObject7$7 = _taggedTemplateLiteral([
      '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
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
    var allNodes = getNodes$b(context.pmViews.main)
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
                answerExact: onlyNumbers(exactStudentRef.current.value),
              },
            ),
          ),
        )
      }
    })
  }

  // SUBMIT
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
              htmlFor: 'exactAnswer',
            },
            /*#__PURE__*/ React.createElement(
              ValueInnerContainer$2,
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
          ValueContainer$2,
          null,
          /*#__PURE__*/ React.createElement(
            'label',
            {
              htmlFor: 'errorAnswer',
            },
            /*#__PURE__*/ React.createElement(
              ValueInnerContainer$2,
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
        ResultContainer$2,
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
            FinalResult$2,
            {
              $isCorrect: isCorrect,
            },
            exactStudent,
            ' ',
            isCorrect &&
              /*#__PURE__*/ React.createElement(StyledIconCorrect$4, {
                name: 'done',
              }),
            !isCorrect &&
              /*#__PURE__*/ React.createElement(StyledIconWrong$4, {
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

var _templateObject$c,
  _templateObject2$b,
  _templateObject3$a,
  _templateObject4$a,
  _templateObject5$8,
  _templateObject6$8,
  _templateObject7$6
var AnswerContainer$3 = styled.div(
  _templateObject$c ||
    (_templateObject$c = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n',
    ])),
)
var ValueContainer$1 = styled.div(
  _templateObject2$b ||
    (_templateObject2$b = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  margin-right: 25px;\n\n  label {\n    font-size: 12px;\n  }\n\n  input:focus {\n    outline: none;\n  }\n',
    ])),
)
var ValueInnerContainer$1 = styled.div(
  _templateObject3$a ||
    (_templateObject3$a = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n',
    ])),
)
var ResultContainer$1 = styled.div(
  _templateObject4$a ||
    (_templateObject4$a = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n',
    ])),
)
var FinalResult$1 = styled.span(
  _templateObject5$8 ||
    (_templateObject5$8 = _taggedTemplateLiteral([
      '\n  color: ',
      ';\n  font-weight: 999;\n',
    ])),
  function (props) {
    return props.$isCorrect ? ' #008000' : 'red'
  },
)
var StyledIconCorrect$3 = styled(Icon)(
  _templateObject6$8 ||
    (_templateObject6$8 = _taggedTemplateLiteral([
      '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
var StyledIconWrong$3 = styled(Icon)(
  _templateObject7$6 ||
    (_templateObject7$6 = _taggedTemplateLiteral([
      '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
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
    var allNodes = getNodes$a(context.pmViews.main)
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
              /*#__PURE__*/ React.createElement(StyledIconCorrect$3, {
                name: 'done',
              }),
            !isCorrect &&
              /*#__PURE__*/ React.createElement(StyledIconWrong$3, {
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

var _templateObject$b,
  _templateObject2$a,
  _templateObject3$9,
  _templateObject4$9,
  _templateObject5$7,
  _templateObject6$7,
  _templateObject7$5
var AnswerContainer$2 = styled.div(
  _templateObject$b ||
    (_templateObject$b = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n',
    ])),
)
var ValueContainer = styled.div(
  _templateObject2$a ||
    (_templateObject2$a = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  margin-right: 25px;\n\n  label {\n    font-size: 12px;\n  }\n\n  input:focus {\n    outline: none;\n  }\n',
    ])),
)
var ValueInnerContainer = styled.div(
  _templateObject3$9 ||
    (_templateObject3$9 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n',
    ])),
)
var ResultContainer = styled.div(
  _templateObject4$9 ||
    (_templateObject4$9 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n',
    ])),
)
var FinalResult = styled.span(
  _templateObject5$7 ||
    (_templateObject5$7 = _taggedTemplateLiteral([
      '\n  color: ',
      ';\n  font-weight: 999;\n',
    ])),
  function (props) {
    return props.$isCorrect ? ' #008000' : 'red'
  },
)
var StyledIconCorrect$2 = styled(Icon)(
  _templateObject6$7 ||
    (_templateObject6$7 = _taggedTemplateLiteral([
      '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
var StyledIconWrong$2 = styled(Icon)(
  _templateObject7$5 ||
    (_templateObject7$5 = _taggedTemplateLiteral([
      '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
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
    var allNodes = getNodes$9(context.pmViews.main)
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
                answerRange: onlyNumbers(rangeStudentRef.current.value),
              },
            ),
          ),
        )
      }
    })
  }

  // SUBMIT
  var castExactStudent = ['-', '-.', '.'].includes(rangeStudentValue)
    ? 0
    : Number(rangeStudentValue)
  var isCorrect = !!(
    castExactStudent <= Number(maxValue) && castExactStudent >= Number(minValue)
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
              htmlFor: 'minAnswer',
            },
            /*#__PURE__*/ React.createElement(
              ValueInnerContainer,
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
          ValueContainer,
          null,
          /*#__PURE__*/ React.createElement(
            'label',
            {
              htmlFor: 'maxAnswer',
            },
            /*#__PURE__*/ React.createElement(
              ValueInnerContainer,
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
        ResultContainer,
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
            FinalResult,
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

var _templateObject$a,
  _templateObject2$9,
  _templateObject3$8,
  _templateObject4$8,
  _templateObject5$6,
  _templateObject6$6,
  _templateObject7$4,
  _templateObject8$4
var NumericalAnswerContainer = styled.div(
  _templateObject$a ||
    (_templateObject$a = _taggedTemplateLiteral([
      '\n  border-bottom: 3px solid #f5f5f7;\n  margin-bottom: 30px;\n',
    ])),
)
var NumericalAnswerContainerTool = styled.div(
  _templateObject2$9 ||
    (_templateObject2$9 = _taggedTemplateLiteral([
      '\n  /* border: 3px solid #f5f5f7;\n  border-bottom: none; */\n  height: 33px;\n  display: flex;\n  flex-direction: row;\n',
    ])),
)
var NumericalAnswerOption = styled.div(
  _templateObject3$8 ||
    (_templateObject3$8 = _taggedTemplateLiteral(['\n  padding: 8px;\n'])),
)
var ActionButton$4 = styled.button(
  _templateObject4$8 ||
    (_templateObject4$8 = _taggedTemplateLiteral([
      '\n  background: transparent;\n  cursor: pointer;\n  border: none;\n  margin-left: auto;\n  z-index: 999;\n',
    ])),
)
var StyledIconContainer = styled.span(
  _templateObject5$6 ||
    (_templateObject5$6 = _taggedTemplateLiteral([
      '\n  float: right;\n  position: relative;\n  top: 3px;\n',
    ])),
)
var StyledIconAction$4 = styled(Icon)(
  _templateObject6$6 ||
    (_templateObject6$6 = _taggedTemplateLiteral([
      '\n  position: relative;\n  right: 4px;\n  cursor: pointer;\n  height: 24px;\n  width: 24px;\n  z-index: 999;\n',
    ])),
)
var InfoMsg = styled.div(
  _templateObject7$4 ||
    (_templateObject7$4 = _taggedTemplateLiteral([
      '\n  color: #fff;\n  display: none;\n  user-select: none;\n  position: absolute;\n  width: 100%;\n\n  span {\n    background: ',
      ';\n    bottom: 35px;\n    border-radius: 4px;\n    float: right;\n    right: 162px;\n    padding: 4px;\n    position: relative;\n  }\n',
    ])),
  th('colorPrimary'),
)
var StyledIconActionRemove = styled(Icon)(
  _templateObject8$4 ||
    (_templateObject8$4 = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
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
    _getUpdatedNode9
  var node = _ref.node,
    view = _ref.view,
    getPos = _ref.getPos
  var context = useContext(WaxContext)
  var main = context.pmViews.main
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
  var removeQuestion = function removeQuestion() {
    var allNodes = getNodesToDelete(context.pmViews.main)
    allNodes.forEach(function (singleNode) {
      var _singleNode$node$cont
      var containerId =
        (_singleNode$node$cont = singleNode.node.content.content.find(function (
          n,
        ) {
          return n.type.name === 'numerical_answer_container'
        })) === null || _singleNode$node$cont === void 0
          ? void 0
          : _singleNode$node$cont.attrs.id
      if (containerId === node.attrs.id) {
        context.pmViews.main.dispatch(
          context.pmViews.main.state.tr['delete'](
            singleNode.pos,
            singleNode.pos + singleNode.node.nodeSize,
          ),
        )
      }
    })
  }

  // useEffect(() => {
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
    var allNodes = getNodes$8(context.pmViews.main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }
  return /*#__PURE__*/ React.createElement(
    'div',
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
            ActionButton$4,
            {
              'aria-label': 'delete this question',
              onClick: removeQuestion,
              type: 'button',
            },
            /*#__PURE__*/ React.createElement(StyledIconActionRemove, {
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
              StyledIconContainer,
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
            InfoMsg,
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
    ),
  )
}
var getNodes$8 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var numericalAnswerpContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'numerical_answer_container') {
      numericalAnswerpContainerNodes.push(node)
    }
  })
  return numericalAnswerpContainerNodes
}
var getNodesToDelete = function getNodesToDelete(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var numericalAnswerpContainerNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'numerical_wrapper') {
      numericalAnswerpContainerNodes.push(node)
    }
  })
  return numericalAnswerpContainerNodes
}

var NumericalAnswerService = /*#__PURE__*/ (function (_Service) {
  function NumericalAnswerService() {
    _classCallCheck(this, NumericalAnswerService)
    return _callSuper(this, NumericalAnswerService, arguments)
  }
  _inherits(NumericalAnswerService, _Service)
  return _createClass(NumericalAnswerService, [
    {
      key: 'register',
      value: function register() {
        this.container
          .bind('NumericalAnswerQuestion')
          .to(NumericalAnswerQuestion)
        var createNode = this.container.get('CreateNode')
        var addPortal = this.container.get('AddPortal')
        createNode({
          numerical_wrapper: NumericalWrapperNode,
        })
        createNode({
          numerical_answer_container: NumericalAnswerContainerNode,
        })
        createNode({
          feedback_prompt: feedbackNode,
        })
        addPortal({
          nodeView: NumericalAnswerContainerNodeView,
          component: NumericalAnswerContainerComponent,
          context: this.app,
        })
        addPortal({
          nodeView: FeedbackNodeView,
          component: FeedbackComponentNew,
          context: this.app,
        })
      },
    },
  ])
})(Service)

var _templateObject$9,
  _templateObject2$8,
  _templateObject3$7,
  _templateObject4$7
var Wrapper$6 = styled.div(
  _templateObject$9 ||
    (_templateObject$9 = _taggedTemplateLiteral(['\n  opacity: ', ';\n'])),
  function (props) {
    return props.$disabled ? '0.4' : '1'
  },
)
var DropDownButton = styled.button(
  _templateObject2$8 ||
    (_templateObject2$8 = _taggedTemplateLiteral([
      '\n  background: #fff;\n  border: none;\n  color: #000;\n  cursor: ',
      ';\n  display: flex;\n  position: relative;\n  width: 215px;\n  height: 100%;\n\n  span {\n    position: relative;\n    top: 12px;\n  }\n',
    ])),
  function (props) {
    return props.$disabled ? 'not-allowed' : 'pointer'
  },
)
var DropDownMenu = styled.div(
  _templateObject3$7 ||
    (_templateObject3$7 = _taggedTemplateLiteral([
      '\n  visibility: ',
      ';\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid #ddd;\n  border-radius: 0.25rem;\n  box-shadow: 0 0.2rem 0.4rem rgb(0 0 0 / 10%);\n  margin: 2px auto auto;\n  position: absolute;\n  width: 220px;\n  max-height: 150px;\n  overflow-y: scroll;\n  z-index: 2;\n\n  span {\n    cursor: pointer;\n    padding: 8px 10px;\n  }\n\n  span:focus,\n  span:hover {\n    background: #f2f9fc;\n    outline: 2px solid #f2f9fc;\n  }\n',
    ])),
  function (props) {
    return props.$isOpen ? 'visible' : 'hidden'
  },
)
var StyledIcon = styled(Icon)(
  _templateObject4$7 ||
    (_templateObject4$7 = _taggedTemplateLiteral([
      '\n  height: 18px;\n  width: 18px;\n  margin-left: auto;\n  position: relative;\n  top: 10px;\n',
    ])),
)
var DropDownComponent = function DropDownComponent(_ref) {
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
    e.preventDefault()
    // arrow down
    if (e.keyCode === 40) {
      if (index === itemRefs.current.length - 1) {
        itemRefs.current[0].current.focus()
      } else {
        itemRefs.current[index + 1].current.focus()
      }
    }

    // arrow up
    if (e.keyCode === 38) {
      if (index === 0) {
        itemRefs.current[itemRefs.current.length - 1].current.focus()
      } else {
        itemRefs.current[index - 1].current.focus()
      }
    }

    // enter
    if (e.keyCode === 13) {
      itemRefs.current[index].current.click()
    }

    // ESC
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
        Wrapper$6,
        {
          $disabled: isDisabled,
          ref: wrapperRef,
        },
        /*#__PURE__*/ React.createElement(
          DropDownButton,
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
          /*#__PURE__*/ React.createElement(StyledIcon, {
            name: 'expand',
          }),
        ),
        /*#__PURE__*/ React.createElement(
          DropDownMenu,
          {
            $isOpen: isOpen,
            'aria-label': 'Choose an item type',
            id: 'questions-list',
            role: 'menu',
          },
          dropDownOptions.map(function (option, index) {
            itemRefs.current[index] =
              itemRefs.current[index] || /*#__PURE__*/ createRef()
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

var _dec$4, _class$4
var QuestionsDropDown =
  ((_dec$4 = injectable()),
  _dec$4(
    (_class$4 = /*#__PURE__*/ (function (_ToolGroup) {
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
        _this = _callSuper(this, QuestionsDropDown)
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
      _inherits(QuestionsDropDown, _ToolGroup)
      return _createClass(QuestionsDropDown, [
        {
          key: 'renderTools',
          value: function renderTools(view) {
            var _this2 = this
            if (isEmpty(view)) return null
            var MultipleDropDown = useMemo(function () {
              return /*#__PURE__*/ React.createElement(DropDownComponent, {
                key: v4(),
                tools: _this2._tools,
                view: view,
              })
            }, [])
            return MultipleDropDown
          },
        },
      ])
    })(ToolGroup)),
  ) || _class$4)

var QuestionsDropDownToolGroupService = /*#__PURE__*/ (function (_Service) {
  function QuestionsDropDownToolGroupService() {
    _classCallCheck(this, QuestionsDropDownToolGroupService)
    return _callSuper(this, QuestionsDropDownToolGroupService, arguments)
  }
  _inherits(QuestionsDropDownToolGroupService, _Service)
  return _createClass(QuestionsDropDownToolGroupService, [
    {
      key: 'register',
      value: function register() {
        this.container.bind('QuestionsDropDown').to(QuestionsDropDown)
      },
    },
  ])
})(Service)

var _templateObject$8, _templateObject2$7
var activeStyles = css(
  _templateObject$8 ||
    (_templateObject$8 = _taggedTemplateLiteral([
      '\n  pointer-events: none;\n',
    ])),
)
var StyledButton = styled(MenuButton)(
  _templateObject2$7 ||
    (_templateObject2$7 = _taggedTemplateLiteral(['\n  ', '\n'])),
  function (props) {
    return props.active && activeStyles
  },
)
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

var _dec$3, _class$3
var MultipleChoiceQuestion =
  ((_dec$3 = injectable()),
  _dec$3(
    (_class$3 = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(this, MultipleChoiceQuestion, [].concat(args))
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
      _inherits(MultipleChoiceQuestion, _Tools)
      return _createClass(MultipleChoiceQuestion, [
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
                view.state.config.schema.nodes.feedback_prompt,
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
      ])
    })(Tools)),
  ) || _class$3)

var multipleChoiceNode = {
  attrs: {
    class: {
      default: 'multiple-choice-option',
    },
    id: {
      default: v4(),
    },
    correct: {
      default: false,
    },
    answer: {
      default: false,
    },
    // feedback: { default: '' },
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
          // feedback: dom.getAttribute('feedback'),
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
      default: v4(),
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

function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {}
  var t = {}
  for (var n in r)
    if ({}.hasOwnProperty.call(r, n)) {
      if (-1 !== e.indexOf(n)) continue
      t[n] = r[n]
    }
  return t
}

function _objectWithoutProperties(e, t) {
  if (null == e) return {}
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t)
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e)
    for (r = 0; r < n.length; r++)
      (o = n[r]),
        -1 === t.indexOf(o) &&
          {}.propertyIsEnumerable.call(e, o) &&
          (i[o] = e[o])
  }
  return i
}

var _excluded = ['className', 'label', 'labelPosition', 'onChange', 'text']
var _templateObject$7,
  _templateObject2$6,
  _templateObject3$6,
  _templateObject4$6
var Wrapper$5 = styled.span(
  _templateObject$7 ||
    (_templateObject$7 = _taggedTemplateLiteral([
      '\n  button {\n    width: 55px;\n  }\n\n  .rc-switch-inner {\n    left: 31px;\n  }\n\n  .rc-switch-checked {\n    border: 1px solid #008000;\n    background-color: #008000;\n\n    .rc-switch-inner {\n      left: 6px;\n    }\n\n    &:after {\n      left: 33px;\n    }\n  }\n',
    ])),
)
var Label = styled.label(
  _templateObject2$6 ||
    (_templateObject2$6 = _taggedTemplateLiteral([
      '\n  ',
      '\n\n  ',
      '\n    cursor: pointer;\n',
    ])),
  function (props) {
    return (
      props.$labelPosition === 'left' &&
      css(
        _templateObject3$6 ||
          (_templateObject3$6 = _taggedTemplateLiteral([
            '\n      margin-right: ',
            ';\n    ',
          ])),
        grid(2),
      )
    )
  },
  function (props) {
    return (
      props.$labelPosition === 'right' &&
      css(
        _templateObject4$6 ||
          (_templateObject4$6 = _taggedTemplateLiteral([
            '\n      margin-left: ',
            ';\n    ',
          ])),
        grid(2),
      )
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
    rest = _objectWithoutProperties(props, _excluded)
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

var _templateObject$6,
  _templateObject2$5,
  _templateObject3$5,
  _templateObject4$5,
  _templateObject5$5,
  _templateObject6$5
var StyledSwitch$1 = styled(SwitchComponent)(
  _templateObject$6 ||
    (_templateObject$6 = _taggedTemplateLiteral([
      '\n  display: flex;\n  margin-left: auto;\n',
    ])),
)
var AnswerContainer$1 = styled.span(
  _templateObject2$5 ||
    (_templateObject2$5 = _taggedTemplateLiteral(['\n  margin-left: auto;\n'])),
)
var Correct$1 = styled.span(
  _templateObject3$5 ||
    (_templateObject3$5 = _taggedTemplateLiteral([
      '\n  margin-right: 10px;\n\n  span {\n    color: #008000;\n  }\n',
    ])),
)
var Answer$1 = styled.span(
  _templateObject4$5 ||
    (_templateObject4$5 = _taggedTemplateLiteral([
      '\n  margin-right: 10px;\n\n  span {\n    color: ',
      ';\n  }\n',
    ])),
  function (props) {
    return props.$isCorrect ? ' #008000' : 'red'
  },
)
var StyledIconCorrect$1 = styled(Icon)(
  _templateObject5$5 ||
    (_templateObject5$5 = _taggedTemplateLiteral([
      '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
var StyledIconWrong$1 = styled(Icon)(
  _templateObject6$5 ||
    (_templateObject6$5 = _taggedTemplateLiteral([
      '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
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
      AnswerContainer$1,
      null,
      /*#__PURE__*/ React.createElement(
        Correct$1,
        null,
        'Correct:',
        /*#__PURE__*/ React.createElement('span', null, correct),
      ),
      /*#__PURE__*/ React.createElement(
        Answer$1,
        {
          $isCorrect: isCorrect,
        },
        'Answer: ',
        /*#__PURE__*/ React.createElement('span', null, answer),
      ),
      isCorrect &&
        /*#__PURE__*/ React.createElement(StyledIconCorrect$1, {
          name: 'done',
        }),
      !isCorrect &&
        /*#__PURE__*/ React.createElement(StyledIconWrong$1, {
          name: 'close',
        }),
    )
  }
  return /*#__PURE__*/ React.createElement(StyledSwitch$1, {
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
      var allNodes = getNodes$7(main)
      allNodes.forEach(function (singNode) {
        if (singNode.node.attrs.id === node.attrs.id) {
          setChecked(singNode.node.attrs.correct)
          setCheckedAnswerMode(singNode.node.attrs.answer)
        }
      })
    },
    [getNodes$7(main)],
  )
  var handleChange = function handleChange() {
    setChecked(!checked)
    setCheckedAnswerMode(!checkedAnswerMode)
    var key = isEditable ? 'correct' : 'answer'
    var value = isEditable ? !checked : !checkedAnswerMode
    var allNodes = getNodes$7(main)
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
    var allNodes = getNodes$7(main)
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
var getNodes$7 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'multiple_choice') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var _templateObject$5,
  _templateObject2$4,
  _templateObject3$4,
  _templateObject4$4,
  _templateObject5$4,
  _templateObject6$4,
  _templateObject7$3,
  _templateObject8$3,
  _templateObject9$3,
  _templateObject0$3
var Wrapper$4 = styled(Box)(
  _templateObject$5 ||
    (_templateObject$5 = _taggedTemplateLiteral([
      '\n  --s1: 20px;\n  display: flex;\n  flex-direction: row;\n  padding-bottom: 0;\n',
    ])),
)
var InfoRow$3 = styled.div(
  _templateObject2$4 ||
    (_templateObject2$4 = _taggedTemplateLiteral([
      '\n  color: black;\n  display: flex;\n  flex-direction: row;\n  padding: 10px 0px 4px 0px;\n',
    ])),
)
var QuestionNunber$3 = styled.span(
  _templateObject3$4 ||
    (_templateObject3$4 = _taggedTemplateLiteral([
      "\n  &:before {\n    content: 'Answer ' counter(question-item-multiple);\n    counter-increment: question-item-multiple;\n  }\n",
    ])),
)
var QuestionControlsWrapper$3 = styled.div(
  _templateObject4$4 ||
    (_templateObject4$4 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n',
    ])),
)
var QuestionWrapper$3 = styled.div(
  _templateObject5$4 ||
    (_templateObject5$4 = _taggedTemplateLiteral([
      '\n  border: 1px solid #a5a1a2;\n  border-bottom: none;\n  border-radius: 4px 4px 0 0;\n  color: black;\n  display: flex;\n  flex: 2 1 auto;\n  flex-direction: column;\n  padding: 10px;\n\n  ',
      '\n',
    ])),
  function (props) {
    return (
      props.$testMode &&
      css(
        _templateObject6$4 ||
          (_templateObject6$4 = _taggedTemplateLiteral([
            '\n      border-radius: 4px;\n      border-bottom: 1px solid #a5a1a2;\n      margin-bottom: 20px;\n    ',
          ])),
      )
    )
  },
)
var IconsWrapper$3 = styled.div(
  _templateObject7$3 ||
    (_templateObject7$3 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  justify-content: end;\n  margin: 20px -20px 0 0;\n\n  button {\n    border: none;\n    box-shadow: none;\n  }\n\n  span {\n    cursor: pointer;\n  }\n',
    ])),
)
var QuestionData$3 = styled.div(
  _templateObject8$3 ||
    (_templateObject8$3 = _taggedTemplateLiteral([
      "\n  align-items: normal;\n  display: flex;\n  flex-direction: row;\n\n  .ProseMirror {\n    :empty::before {\n      content: 'Type option';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n  }\n",
    ])),
)
var ActionButton$3 = styled.button(
  _templateObject9$3 ||
    (_templateObject9$3 = _taggedTemplateLiteral([
      '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n',
    ])),
)
var StyledIconAction$3 = styled(Icon)(
  _templateObject0$3 ||
    (_templateObject0$3 = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var AnswerComponent$3 = function (_ref) {
  var _getUpdatedNode$node, _getUpdatedNode$node2
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
            var optionSize = sinlgeNode.nodeSize
            // Also delete the following feedback_prompt sibling
            var nextPos = getPos() + optionSize
            var nextNode = main.state.doc.nodeAt(nextPos)
            var feedbackSize =
              nextNode && nextNode.type.name === 'feedback_prompt'
                ? nextNode.nodeSize
                : 0
            main.dispatch(
              main.state.tr.deleteRange(
                getPos(),
                getPos() + optionSize + feedbackSize,
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
    var newFeedbackId = v4()
    main.state.doc.descendants(function (editorNode, index) {
      if (editorNode.type.name === 'multiple_choice') {
        if (editorNode.attrs.id === nodeId) {
          // Insert after the feedback_prompt sibling that follows this option
          var feedbackPos = editorNode.nodeSize + index
          var feedbackNode = main.state.doc.nodeAt(feedbackPos)
          var insertPos =
            feedbackNode && feedbackNode.type.name === 'feedback_prompt'
              ? feedbackPos + feedbackNode.nodeSize
              : feedbackPos
          main.dispatch(
            main.state.tr.setSelection(
              new TextSelection(main.state.tr.doc.resolve(insertPos)),
            ),
          )
          var answerOption =
            main.state.config.schema.nodes.multiple_choice.create(
              {
                id: newAnswerId,
              },
              Fragment.empty,
            )
          var feedbackOption =
            main.state.config.schema.nodes.feedback_prompt.create(
              {
                id: newFeedbackId,
              },
              Fragment.empty,
            )
          main.dispatch(main.state.tr.replaceSelectionWith(answerOption))
          main.dispatch(
            main.state.tr.setSelection(
              TextSelection.create(
                main.state.tr.doc,
                insertPos + answerOption.nodeSize,
              ),
            ),
          )
          main.dispatch(main.state.tr.replaceSelectionWith(feedbackOption))
          setTimeout(function () {
            helpers.createEmptyParagraph(context, newAnswerId)
            helpers.createEmptyParagraph(context, newFeedbackId)
          }, 200)
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
  var getUpdatedNode = function getUpdatedNode() {
    var nodeFound = node
    var allNodes = getNodes$6(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }
  return /*#__PURE__*/ React.createElement(
    Wrapper$4,
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
        QuestionWrapper$3,
        {
          $testMode: testMode,
        },
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
      ),
    ),
    /*#__PURE__*/ React.createElement(
      IconsWrapper$3,
      null,
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$3,
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
          /*#__PURE__*/ React.createElement(StyledIconAction$3, {
            name: 'plusSquare',
          }),
        ),
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$3,
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
          /*#__PURE__*/ React.createElement(StyledIconAction$3, {
            name: 'deleteOutlined',
          }),
        ),
    ),
  )
}
var getNodes$6 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'multiple_choice') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var _templateObject$4
var Wrapper$3 = styled.div(
  _templateObject$4 ||
    (_templateObject$4 = _taggedTemplateLiteral([
      '\n  > div:has(> .ProseMirror) {\n    padding: 10px;\n  }\n',
    ])),
)
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
  return /*#__PURE__*/ React.createElement(
    Wrapper$3,
    null,
    /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
      getPos: getPos,
      node: node,
      showDelete: !testMode && isEditable,
      view: view,
    }),
  )
}

var MultipleChoiceNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
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
    _this = _callSuper(this, MultipleChoiceNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(MultipleChoiceNodeView, _QuestionsNodeView)
  return _createClass(
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
          return innerView && innerView.dom.contains(event.target)
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
})(QuestionsNodeView)

var QuestionNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
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
    _this = _callSuper(this, QuestionNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(QuestionNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var _dec$2, _class$2
var MultipleChoiceSingleCorrectQuestion =
  ((_dec$2 = injectable()),
  _dec$2(
    (_class$2 = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(
          this,
          MultipleChoiceSingleCorrectQuestion,
          [].concat(args),
        )
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
      _inherits(MultipleChoiceSingleCorrectQuestion, _Tools)
      return _createClass(MultipleChoiceSingleCorrectQuestion, [
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
                view.state.config.schema.nodes.feedback_prompt,
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
      ])
    })(Tools)),
  ) || _class$2)

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
    // feedback: { default: '' },
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
          // feedback: dom.getAttribute('feedback'),
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
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  var customProps = main.props.customValues
  useEffect(
    function () {
      var allNodes = getNodes$5(main)
      allNodes.forEach(function (singNode) {
        if (singNode.node.attrs.id === node.attrs.id) {
          setChecked(singNode.node.attrs.correct)
          setCheckedAnswerMode(singNode.node.attrs.answer)
        }
      })
    },
    [getNodes$5(main)],
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
    var allNodes = getNodes$5(main)
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
var getNodes$5 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'multiple_choice_single_correct') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var _templateObject$3,
  _templateObject2$3,
  _templateObject3$3,
  _templateObject4$3,
  _templateObject5$3,
  _templateObject6$3,
  _templateObject7$2,
  _templateObject8$2,
  _templateObject9$2,
  _templateObject0$2
var Wrapper$2 = styled(Box)(
  _templateObject$3 ||
    (_templateObject$3 = _taggedTemplateLiteral([
      '\n  --s1: 20px;\n  display: flex;\n  flex-direction: row;\n  padding-bottom: 0;\n',
    ])),
)
var InfoRow$2 = styled.div(
  _templateObject2$3 ||
    (_templateObject2$3 = _taggedTemplateLiteral([
      '\n  color: black;\n  display: flex;\n  flex-direction: row;\n  padding: 10px 0px 4px 0px;\n',
    ])),
)
var QuestionNunber$2 = styled.span(
  _templateObject3$3 ||
    (_templateObject3$3 = _taggedTemplateLiteral([
      "\n  &:before {\n    content: 'Answer ' counter(question-item-multiple);\n    counter-increment: question-item-multiple;\n  }\n",
    ])),
)
var QuestionControlsWrapper$2 = styled.div(
  _templateObject4$3 ||
    (_templateObject4$3 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n',
    ])),
)
var QuestionWrapper$2 = styled.div(
  _templateObject5$3 ||
    (_templateObject5$3 = _taggedTemplateLiteral([
      '\n  border: 1px solid #a5a1a2;\n  border-bottom: none;\n  border-radius: 4px 4px 0 0;\n  color: black;\n  display: flex;\n  flex: 2 1 auto;\n  flex-direction: column;\n  padding: 10px;\n\n  ',
      '\n',
    ])),
  function (props) {
    return (
      props.$testMode &&
      css(
        _templateObject6$3 ||
          (_templateObject6$3 = _taggedTemplateLiteral([
            '\n      border-radius: 4px;\n      border-bottom: 1px solid #a5a1a2;\n      margin-bottom: 20px;\n    ',
          ])),
      )
    )
  },
)
var IconsWrapper$2 = styled.div(
  _templateObject7$2 ||
    (_templateObject7$2 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  justify-content: end;\n  margin: 20px -20px 0 0;\n\n  button {\n    border: none;\n    box-shadow: none;\n  }\n\n  span {\n    cursor: pointer;\n  }\n',
    ])),
)
var QuestionData$2 = styled.div(
  _templateObject8$2 ||
    (_templateObject8$2 = _taggedTemplateLiteral([
      "\n  align-items: normal;\n  display: flex;\n  flex-direction: row;\n\n  .ProseMirror {\n    :empty::before {\n      content: 'Type option';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n  }\n",
    ])),
)
var ActionButton$2 = styled.button(
  _templateObject9$2 ||
    (_templateObject9$2 = _taggedTemplateLiteral([
      '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n',
    ])),
)
var StyledIconAction$2 = styled(Icon)(
  _templateObject0$2 ||
    (_templateObject0$2 = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var AnswerComponent$2 = function (_ref) {
  var _getUpdatedNode, _getUpdatedNode$node, _getUpdatedNode$node2
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
            var optionSize = sinlgeNode.nodeSize
            // Also delete the following feedback_prompt sibling
            var nextPos = getPos() + optionSize
            var nextNode = main.state.doc.nodeAt(nextPos)
            var feedbackSize =
              nextNode && nextNode.type.name === 'feedback_prompt'
                ? nextNode.nodeSize
                : 0
            main.dispatch(
              main.state.tr.deleteRange(
                getPos(),
                getPos() + optionSize + feedbackSize,
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
    var newFeedbackId = v4()
    main.state.doc.descendants(function (editorNode, index) {
      if (editorNode.type.name === 'multiple_choice_single_correct') {
        if (editorNode.attrs.id === nodeId) {
          // Insert after the feedback_prompt sibling that follows this option
          var feedbackPos = editorNode.nodeSize + index
          var feedbackNode = main.state.doc.nodeAt(feedbackPos)
          var insertPos =
            feedbackNode && feedbackNode.type.name === 'feedback_prompt'
              ? feedbackPos + feedbackNode.nodeSize
              : feedbackPos
          main.dispatch(
            main.state.tr.setSelection(
              new TextSelection(main.state.tr.doc.resolve(insertPos)),
            ),
          )
          var answerOption =
            main.state.config.schema.nodes.multiple_choice_single_correct.create(
              {
                id: newAnswerId,
              },
              Fragment.empty,
            )
          var feedbackOption =
            main.state.config.schema.nodes.feedback_prompt.create(
              {
                id: newFeedbackId,
              },
              Fragment.empty,
            )
          main.dispatch(main.state.tr.replaceSelectionWith(answerOption))
          main.dispatch(
            main.state.tr.setSelection(
              TextSelection.create(
                main.state.tr.doc,
                insertPos + answerOption.nodeSize,
              ),
            ),
          )
          main.dispatch(main.state.tr.replaceSelectionWith(feedbackOption))
          // create Empty Paragraph
          setTimeout(function () {
            helpers.createEmptyParagraph(context, newAnswerId)
            helpers.createEmptyParagraph(context, newFeedbackId)
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
    var allNodes = getNodes$4(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }
  var readOnly = !isEditable
  return /*#__PURE__*/ React.createElement(
    Wrapper$2,
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
        QuestionWrapper$2,
        {
          $testMode: testMode,
        },
        /*#__PURE__*/ React.createElement(
          QuestionData$2,
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
      ),
    ),
    /*#__PURE__*/ React.createElement(
      IconsWrapper$2,
      null,
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$2,
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
          /*#__PURE__*/ React.createElement(StyledIconAction$2, {
            name: 'plusSquare',
          }),
        ),
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$2,
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
          /*#__PURE__*/ React.createElement(StyledIconAction$2, {
            name: 'deleteOutlined',
          }),
        ),
    ),
  )
}
var getNodes$4 = function getNodes(view) {
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
    _this = _callSuper(this, MultipleChoiceSingleCorrectNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(MultipleChoiceSingleCorrectNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var QuestionMultipleSingleNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
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
    _this = _callSuper(this, QuestionMultipleSingleNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(QuestionMultipleSingleNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var MultipleChoiceSingleCorrectQuestionService = /*#__PURE__*/ (function (
  _Service,
) {
  function MultipleChoiceSingleCorrectQuestionService() {
    _classCallCheck(this, MultipleChoiceSingleCorrectQuestionService)
    return _callSuper(
      this,
      MultipleChoiceSingleCorrectQuestionService,
      arguments,
    )
  }
  _inherits(MultipleChoiceSingleCorrectQuestionService, _Service)
  return _createClass(MultipleChoiceSingleCorrectQuestionService, [
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
          feedback_prompt: feedbackNode,
        })
        createNode({
          multiple_choice_single_correct: multipleChoiceSingleCorrectNode,
        })
        createNode({
          question_node_multiple_single: questionSingleNode,
        })
        addPortal({
          nodeView: QuestionMultipleSingleNodeView,
          component: QuestionComponent,
          context: this.app,
        })
        addPortal({
          nodeView: MultipleChoiceSingleCorrectNodeView,
          component: AnswerComponent$2,
          context: this.app,
        })
        addPortal({
          nodeView: FeedbackNodeView,
          component: FeedbackComponentNew,
          context: this.app,
        })
      },
    },
  ])
})(Service)

var _dec$1, _class$1
var TrueFalseQuestion =
  ((_dec$1 = injectable()),
  _dec$1(
    (_class$1 = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(this, TrueFalseQuestion, [].concat(args))
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
      _inherits(TrueFalseQuestion, _Tools)
      return _createClass(TrueFalseQuestion, [
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
                view.state.config.schema.nodes.feedback_prompt,
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
      ])
    })(Tools)),
  ) || _class$1)

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
    // feedback: { default: '' },
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
          // feedback: dom.getAttribute('feedback'),
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

var _templateObject$2,
  _templateObject2$2,
  _templateObject3$2,
  _templateObject4$2,
  _templateObject5$2,
  _templateObject6$2
var StyledSwitch = styled(SwitchComponent)(
  _templateObject$2 ||
    (_templateObject$2 = _taggedTemplateLiteral([
      '\n  display: flex;\n  margin-left: auto;\n\n  button {\n    width: 65px;\n  }\n\n  .rc-switch-inner {\n    font-size: 14px;\n    left: 25px;\n  }\n\n  .rc-switch-checked {\n    background-color: #008000;\n    border: 1px solid #008000;\n\n    .rc-switch-inner {\n      left: 6px;\n    }\n\n    &::after {\n      left: 42px;\n    }\n  }\n',
    ])),
)
var AnswerContainer = styled.span(
  _templateObject2$2 ||
    (_templateObject2$2 = _taggedTemplateLiteral(['\n  margin-left: auto;\n'])),
)
var Correct = styled.span(
  _templateObject3$2 ||
    (_templateObject3$2 = _taggedTemplateLiteral([
      '\n  margin-right: 10px;\n\n  span {\n    color: #008000;\n  }\n',
    ])),
)
var Answer = styled.span(
  _templateObject4$2 ||
    (_templateObject4$2 = _taggedTemplateLiteral([
      '\n  margin-right: 10px;\n\n  span {\n    color: ',
      ';\n  }\n',
    ])),
  function (props) {
    return props.$isCorrect ? ' #008000' : 'red'
  },
)
var StyledIconCorrect = styled(Icon)(
  _templateObject5$2 ||
    (_templateObject5$2 = _taggedTemplateLiteral([
      '\n  fill: #008000;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
var StyledIconWrong = styled(Icon)(
  _templateObject6$2 ||
    (_templateObject6$2 = _taggedTemplateLiteral([
      '\n  fill: red;\n  height: 24px;\n  pointer-events: none;\n  width: 24px;\n',
    ])),
)
var TrueFalseSwitch = function TrueFalseSwitch(_ref) {
  var customProps = _ref.customProps,
    node = _ref.node.node,
    isEditable = _ref.isEditable,
    handleChange = _ref.handleChange,
    checked = _ref.checked,
    checkedAnswerMode = _ref.checkedAnswerMode
  var testMode = customProps.testMode,
    showFeedBack = customProps.showFeedBack
  if (showFeedBack && node) {
    var correct = node.attrs.correct ? 'TRUE' : 'FALSE'
    var answer = node.attrs.answer ? 'TRUE' : 'FALSE'
    var isCorrect = node.attrs.correct === node.attrs.answer
    return /*#__PURE__*/ React.createElement(
      AnswerContainer,
      null,
      /*#__PURE__*/ React.createElement(
        Correct,
        null,
        'Correct:',
        /*#__PURE__*/ React.createElement('span', null, correct),
      ),
      /*#__PURE__*/ React.createElement(
        Answer,
        {
          $isCorrect: isCorrect,
        },
        'Answer: ',
        /*#__PURE__*/ React.createElement('span', null, answer),
      ),
      isCorrect &&
        /*#__PURE__*/ React.createElement(StyledIconCorrect, {
          name: 'done',
        }),
      !isCorrect &&
        /*#__PURE__*/ React.createElement(StyledIconWrong, {
          name: 'close',
        }),
    )
  }
  return /*#__PURE__*/ React.createElement(StyledSwitch, {
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
  var customProps = main.props.customValues
  var isEditable = main.props.editable(function (editable) {
    return editable
  })
  useEffect(
    function () {
      var allNodes = getNodes$3(main)
      allNodes.forEach(function (singNode) {
        if (singNode.node.attrs.id === node.attrs.id) {
          setChecked(singNode.node.attrs.correct)
          setCheckedAnswerMode(singNode.node.attrs.answer)
        }
      })
    },
    [getNodes$3(main)],
  )
  var handleChange = function handleChange() {
    setChecked(!checked)
    setCheckedAnswerMode(!checkedAnswerMode)
    var key = isEditable ? 'correct' : 'answer'
    var value = isEditable ? !checked : !checkedAnswerMode
    var allNodes = getNodes$3(main)
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
    var allNodes = getNodes$3(main)
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
var getNodes$3 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'true_false') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var _templateObject$1,
  _templateObject2$1,
  _templateObject3$1,
  _templateObject4$1,
  _templateObject5$1,
  _templateObject6$1,
  _templateObject7$1,
  _templateObject8$1,
  _templateObject9$1,
  _templateObject0$1
var Wrapper$1 = styled(Box)(
  _templateObject$1 ||
    (_templateObject$1 = _taggedTemplateLiteral([
      '\n  --s1: 20px;\n  display: flex;\n  flex-direction: row;\n  padding-bottom: 0;\n',
    ])),
)
var InfoRow$1 = styled.div(
  _templateObject2$1 ||
    (_templateObject2$1 = _taggedTemplateLiteral([
      '\n  color: black;\n  display: flex;\n  flex-direction: row;\n  padding: 10px 0px 4px 0px;\n',
    ])),
)
var QuestionNunber$1 = styled.span(
  _templateObject3$1 ||
    (_templateObject3$1 = _taggedTemplateLiteral([
      "\n  &:before {\n    content: 'Answer ' counter(question-item-multiple);\n    counter-increment: question-item-multiple;\n  }\n",
    ])),
)
var QuestionControlsWrapper$1 = styled.div(
  _templateObject4$1 ||
    (_templateObject4$1 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n',
    ])),
)
var QuestionWrapper$1 = styled.div(
  _templateObject5$1 ||
    (_templateObject5$1 = _taggedTemplateLiteral([
      '\n  border: 1px solid #a5a1a2;\n  border-bottom: none;\n  border-radius: 4px 4px 0 0;\n  color: black;\n  display: flex;\n  flex: 2 1 auto;\n  flex-direction: column;\n  padding: 10px;\n\n  ',
      '\n',
    ])),
  function (props) {
    return (
      props.$testMode &&
      css(
        _templateObject6$1 ||
          (_templateObject6$1 = _taggedTemplateLiteral([
            '\n      border-radius: 4px;\n      border-bottom: 1px solid #a5a1a2;\n      margin-bottom: 20px;\n    ',
          ])),
      )
    )
  },
)
var IconsWrapper$1 = styled.div(
  _templateObject7$1 ||
    (_templateObject7$1 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  justify-content: end;\n  margin: 20px -20px 0 0;\n\n  button {\n    border: none;\n    box-shadow: none;\n  }\n\n  span {\n    cursor: pointer;\n  }\n',
    ])),
)
var QuestionData$1 = styled.div(
  _templateObject8$1 ||
    (_templateObject8$1 = _taggedTemplateLiteral([
      "\n  align-items: normal;\n  display: flex;\n  flex-direction: row;\n\n  .ProseMirror {\n    :empty::before {\n      content: 'Type option';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n  }\n",
    ])),
)
var ActionButton$1 = styled.button(
  _templateObject9$1 ||
    (_templateObject9$1 = _taggedTemplateLiteral([
      '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n',
    ])),
)
var StyledIconAction$1 = styled(Icon)(
  _templateObject0$1 ||
    (_templateObject0$1 = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var AnswerComponent$1 = function (_ref) {
  var _getUpdatedNode$node, _getUpdatedNode$node2
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
            var optionSize = sinlgeNode.nodeSize
            // Also delete the following feedback_prompt sibling
            var nextPos = getPos() + optionSize
            var nextNode = main.state.doc.nodeAt(nextPos)
            var feedbackSize =
              nextNode && nextNode.type.name === 'feedback_prompt'
                ? nextNode.nodeSize
                : 0
            main.dispatch(
              main.state.tr.deleteRange(
                getPos(),
                getPos() + optionSize + feedbackSize,
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
    var newFeedbackId = v4()
    main.state.doc.descendants(function (editorNode, index) {
      if (editorNode.type.name === 'true_false') {
        if (editorNode.attrs.id === nodeId) {
          // Insert after the feedback_prompt sibling that follows this option
          var feedbackPos = editorNode.nodeSize + index
          var feedbackNode = main.state.doc.nodeAt(feedbackPos)
          var insertPos =
            feedbackNode && feedbackNode.type.name === 'feedback_prompt'
              ? feedbackPos + feedbackNode.nodeSize
              : feedbackPos
          main.dispatch(
            main.state.tr.setSelection(
              new TextSelection(main.state.tr.doc.resolve(insertPos)),
            ),
          )
          var answerOption = main.state.config.schema.nodes.true_false.create(
            {
              id: newAnswerId,
            },
            Fragment.empty,
          )
          var feedbackOption =
            main.state.config.schema.nodes.feedback_prompt.create(
              {
                id: newFeedbackId,
              },
              Fragment.empty,
            )
          main.dispatch(main.state.tr.replaceSelectionWith(answerOption))
          main.dispatch(
            main.state.tr.setSelection(
              TextSelection.create(
                main.state.tr.doc,
                insertPos + answerOption.nodeSize,
              ),
            ),
          )
          main.dispatch(main.state.tr.replaceSelectionWith(feedbackOption))
          // create Empty Paragraph
          setTimeout(function () {
            helpers.createEmptyParagraph(context, newAnswerId)
            helpers.createEmptyParagraph(context, newFeedbackId)
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
    var allNodes = getNodes$2(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }
  var readOnly = !isEditable
  return /*#__PURE__*/ React.createElement(
    Wrapper$1,
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
        QuestionWrapper$1,
        {
          $testMode: testMode,
        },
        /*#__PURE__*/ React.createElement(
          QuestionData$1,
          null,
          /*#__PURE__*/ React.createElement(QuestionEditorComponent, {
            getPos: getPos,
            node: node,
            placeholderText: 'Type option',
            view: view,
          }),
        ),
      ),
    ),
    /*#__PURE__*/ React.createElement(
      IconsWrapper$1,
      null,
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$1,
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
          /*#__PURE__*/ React.createElement(StyledIconAction$1, {
            name: 'plusSquare',
          }),
        ),
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton$1,
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
          /*#__PURE__*/ React.createElement(StyledIconAction$1, {
            name: 'deleteOutlined',
          }),
        ),
    ),
  )
}
var getNodes$2 = function getNodes(view) {
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
    _this = _callSuper(this, TrueFalseNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(TrueFalseNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var QuestionTrueFalseNodeView = /*#__PURE__*/ (function (_QuestionsNodeView) {
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
    _this = _callSuper(this, QuestionTrueFalseNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(QuestionTrueFalseNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var TrueFalseQuestionService = /*#__PURE__*/ (function (_Service) {
  function TrueFalseQuestionService() {
    _classCallCheck(this, TrueFalseQuestionService)
    return _callSuper(this, TrueFalseQuestionService, arguments)
  }
  _inherits(TrueFalseQuestionService, _Service)
  return _createClass(TrueFalseQuestionService, [
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
          feedback_prompt: feedbackNode,
        })
        createNode({
          true_false: trueFalseNode,
        })
        createNode({
          question_node_true_false: questionTrueFalseNode$1,
        })
        addPortal({
          nodeView: QuestionTrueFalseNodeView,
          component: QuestionComponent,
          context: this.app,
        })
        addPortal({
          nodeView: TrueFalseNodeView,
          component: AnswerComponent$1,
          context: this.app,
        })
        addPortal({
          nodeView: FeedbackNodeView,
          component: FeedbackComponentNew,
          context: this.app,
        })
      },
    },
  ])
})(Service)

var _dec, _class
var TrueFalseSingleCorrectQuestion =
  ((_dec = injectable()),
  _dec(
    (_class = /*#__PURE__*/ (function (_Tools) {
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
        _this = _callSuper(
          this,
          TrueFalseSingleCorrectQuestion,
          [].concat(args),
        )
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
      _inherits(TrueFalseSingleCorrectQuestion, _Tools)
      return _createClass(TrueFalseSingleCorrectQuestion, [
        {
          key: 'run',
          get: function get() {
            return function (view, context) {
              helpers.createOptions(
                view,
                context,
                view.state.config.schema.nodes
                  .true_false_single_correct_container,
                view.state.config.schema.nodes.question_node_true_false_single,
                view.state.config.schema.nodes.true_false_single_correct,
                view.state.config.schema.nodes.feedback_prompt,
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
                  state.config.schema.nodes.true_false_single_correct_container,
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
      ])
    })(Tools)),
  ) || _class)

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
    // feedback: { default: '' },
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
          // feedback: dom.getAttribute('feedback'),
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

var questionTrueFalseNode = {
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
      var allNodes = getNodes$1(main)
      allNodes.forEach(function (singNode) {
        if (singNode.node.attrs.id === node.attrs.id) {
          setChecked(singNode.node.attrs.correct)
          setCheckedAnswerMode(singNode.node.attrs.answer)
        }
      })
    },
    [getNodes$1(main)],
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
    var allNodes = getNodes$1(main)
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
var getNodes$1 = function getNodes(view) {
  var allNodes = DocumentHelpers.findBlockNodes(view.state.doc)
  var multipleChoiceNodes = []
  allNodes.forEach(function (node) {
    if (node.node.type.name === 'true_false_single_correct') {
      multipleChoiceNodes.push(node)
    }
  })
  return multipleChoiceNodes
}

var _templateObject,
  _templateObject2,
  _templateObject3,
  _templateObject4,
  _templateObject5,
  _templateObject6,
  _templateObject7,
  _templateObject8,
  _templateObject9,
  _templateObject0
var Wrapper = styled(Box)(
  _templateObject ||
    (_templateObject = _taggedTemplateLiteral([
      '\n  --s1: 20px;\n  display: flex;\n  flex-direction: row;\n  padding-bottom: 0;\n',
    ])),
)
var InfoRow = styled.div(
  _templateObject2 ||
    (_templateObject2 = _taggedTemplateLiteral([
      '\n  color: black;\n  display: flex;\n  flex-direction: row;\n  padding: 10px 0px 4px 0px;\n',
    ])),
)
var QuestionNunber = styled.span(
  _templateObject3 ||
    (_templateObject3 = _taggedTemplateLiteral([
      "\n  &:before {\n    content: 'Answer ' counter(question-item-multiple);\n    counter-increment: question-item-multiple;\n  }\n",
    ])),
)
var QuestionControlsWrapper = styled.div(
  _templateObject4 ||
    (_templateObject4 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n',
    ])),
)
var QuestionWrapper = styled.div(
  _templateObject5 ||
    (_templateObject5 = _taggedTemplateLiteral([
      '\n  border: 1px solid #a5a1a2;\n  border-bottom: none;\n  border-radius: 4px 4px 0 0;\n  color: black;\n  display: flex;\n  flex: 2 1 auto;\n  flex-direction: column;\n  padding: 10px;\n\n  ',
      '\n',
    ])),
  function (props) {
    return (
      props.$testMode &&
      css(
        _templateObject6 ||
          (_templateObject6 = _taggedTemplateLiteral([
            '\n      border-radius: 4px;\n      border-bottom: 1px solid #a5a1a2;\n      margin-bottom: 20px;\n    ',
          ])),
      )
    )
  },
)
var IconsWrapper = styled.div(
  _templateObject7 ||
    (_templateObject7 = _taggedTemplateLiteral([
      '\n  display: flex;\n  flex-direction: column;\n  justify-content: end;\n  margin: 20px -20px 0 0;\n\n  button {\n    border: none;\n    box-shadow: none;\n  }\n\n  span {\n    cursor: pointer;\n  }\n',
    ])),
)
var QuestionData = styled.div(
  _templateObject8 ||
    (_templateObject8 = _taggedTemplateLiteral([
      "\n  align-items: normal;\n  display: flex;\n  flex-direction: row;\n\n  .ProseMirror {\n    :empty::before {\n      content: 'Type option';\n      color: #aaa;\n      float: left;\n      font-style: italic;\n      pointer-events: none;\n    }\n  }\n",
    ])),
)
var ActionButton = styled.button(
  _templateObject9 ||
    (_templateObject9 = _taggedTemplateLiteral([
      '\n  background: transparent;\n  cursor: pointer;\n  margin-top: 16px;\n',
    ])),
)
var StyledIconAction = styled(Icon)(
  _templateObject0 ||
    (_templateObject0 = _taggedTemplateLiteral([
      '\n  height: 24px;\n  width: 24px;\n',
    ])),
)
var AnswerComponent = function (_ref) {
  var _getUpdatedNode$node, _getUpdatedNode$node2
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
            var optionSize = sinlgeNode.nodeSize
            // Also delete the following feedback_prompt sibling
            var nextPos = getPos() + optionSize
            var nextNode = main.state.doc.nodeAt(nextPos)
            var feedbackSize =
              nextNode && nextNode.type.name === 'feedback_prompt'
                ? nextNode.nodeSize
                : 0
            main.dispatch(
              // main.state.tr.deleteRange(getPos(), getPos() + sinlgeNode.nodeSize),
              main.state.tr.deleteRange(
                getPos(),
                getPos() + optionSize + feedbackSize,
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
    var newFeedbackId = v4()
    main.state.doc.descendants(function (editorNode, index) {
      if (editorNode.type.name === 'true_false_single_correct') {
        if (editorNode.attrs.id === nodeId) {
          // Insert after the feedback_prompt sibling that follows this option
          var feedbackPos = editorNode.nodeSize + index
          var feedbackNode = main.state.doc.nodeAt(feedbackPos)
          var insertPos =
            feedbackNode && feedbackNode.type.name === 'feedback_prompt'
              ? feedbackPos + feedbackNode.nodeSize
              : feedbackPos
          main.dispatch(
            main.state.tr.setSelection(
              new TextSelection(main.state.tr.doc.resolve(insertPos)),
            ),
          )
          var answerOption =
            main.state.config.schema.nodes.true_false_single_correct.create(
              {
                id: newAnswerId,
              },
              Fragment.empty,
            )
          var feedbackOption =
            main.state.config.schema.nodes.feedback_prompt.create(
              {
                id: newFeedbackId,
              },
              Fragment.empty,
            )
          main.dispatch(main.state.tr.replaceSelectionWith(answerOption))
          main.dispatch(
            main.state.tr.setSelection(
              TextSelection.create(
                main.state.tr.doc,
                insertPos + answerOption.nodeSize,
              ),
            ),
          )
          main.dispatch(main.state.tr.replaceSelectionWith(feedbackOption))
          // create Empty Paragraph
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
    var allNodes = getNodes(main)
    allNodes.forEach(function (singNode) {
      if (singNode.node.attrs.id === node.attrs.id) {
        nodeFound = singNode
      }
    })
    return nodeFound
  }
  var readOnly = !isEditable
  return /*#__PURE__*/ React.createElement(
    Wrapper,
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
        QuestionWrapper,
        {
          $testMode: testMode,
        },
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
      ),
    ),
    /*#__PURE__*/ React.createElement(
      IconsWrapper,
      null,
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton,
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
          /*#__PURE__*/ React.createElement(StyledIconAction, {
            name: 'plusSquare',
          }),
        ),
      !readOnly &&
        /*#__PURE__*/ React.createElement(
          ActionButton,
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
          /*#__PURE__*/ React.createElement(StyledIconAction, {
            name: 'deleteOutlined',
          }),
        ),
    ),
  )
}
var getNodes = function getNodes(view) {
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
    _this = _callSuper(this, TrueFalseSingleCorrectNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(TrueFalseSingleCorrectNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var QuestionTrueFalseSingleNodeView = /*#__PURE__*/ (function (
  _QuestionsNodeView,
) {
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
    _this = _callSuper(this, QuestionTrueFalseSingleNodeView, [
      node,
      view,
      getPos,
      decorations,
      createPortal,
      Component,
      context,
    ])
    _this.node = node
    _this.outerView = view
    _this.getPos = getPos
    _this.context = context
    return _this
  }
  _inherits(QuestionTrueFalseSingleNodeView, _QuestionsNodeView)
  return _createClass(
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
})(QuestionsNodeView)

var TrueFalseSingleCorrectQuestionService = /*#__PURE__*/ (function (_Service) {
  function TrueFalseSingleCorrectQuestionService() {
    _classCallCheck(this, TrueFalseSingleCorrectQuestionService)
    return _callSuper(this, TrueFalseSingleCorrectQuestionService, arguments)
  }
  _inherits(TrueFalseSingleCorrectQuestionService, _Service)
  return _createClass(TrueFalseSingleCorrectQuestionService, [
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
          feedback_prompt: feedbackNode,
        })
        createNode({
          question_node_true_false_single: questionTrueFalseNode,
        })
        createNode({
          true_false_single_correct: trueFalseSingleCorrectNode,
        })
        addPortal({
          nodeView: QuestionTrueFalseSingleNodeView,
          component: QuestionComponent,
          context: this.app,
        })
        addPortal({
          nodeView: TrueFalseSingleCorrectNodeView,
          component: AnswerComponent,
          context: this.app,
        })
        addPortal({
          nodeView: FeedbackNodeView,
          component: FeedbackComponentNew,
          context: this.app,
        })
      },
    },
  ])
})(Service)

var MultipleChoiceQuestionService = /*#__PURE__*/ (function (_Service) {
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
    _this = _callSuper(this, MultipleChoiceQuestionService, [].concat(args))
    _this.dependencies = [
      new MultipleChoiceSingleCorrectQuestionService(),
      new TrueFalseQuestionService(),
      new TrueFalseSingleCorrectQuestionService(),
    ]
    return _this
  }
  _inherits(MultipleChoiceQuestionService, _Service)
  return _createClass(MultipleChoiceQuestionService, [
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
          question_node_multiple: questionNode,
        })
        createNode({
          multiple_choice: multipleChoiceNode,
        })
        createNode({
          feedback_prompt: feedbackNode,
        })
        addPortal({
          nodeView: QuestionNodeView,
          component: QuestionComponent,
          context: this.app,
        })
        addPortal({
          nodeView: MultipleChoiceNodeView,
          component: AnswerComponent$3,
          context: this.app,
        })
        addPortal({
          nodeView: FeedbackNodeView,
          component: FeedbackComponentNew,
          context: this.app,
        })
      },
    },
  ])
})(Service)

var QuestionsService = /*#__PURE__*/ (function (_Service) {
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
    _this = _callSuper(this, QuestionsService, [].concat(args))
    _this.name = 'QuestionsService'
    _this.dependencies = [
      new MultipleChoiceQuestionService(),
      new EssayService(),
      new FillTheGapQuestionService(),
      new MatchingService(),
      new MultipleDropDownService(),
      new NumericalAnswerService(),
      new QuestionsDropDownToolGroupService(),
    ]
    return _this
  }
  _inherits(QuestionsService, _Service)
  return _createClass(QuestionsService)
})(Service)

export { QuestionsService }
