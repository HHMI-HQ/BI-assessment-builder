/* eslint-disable react/prop-types */

import React, { useContext } from "react";
import styled, { ThemeProvider } from "styled-components";
import { WaxContext, ComponentPlugin, WaxView } from "wax-prosemirror-core";
import { grid } from "@coko/client";
import theme from "../../../theme";
// import EditorElements from "./DashboardEditorElements";
import commonStyles from "./commonWaxStyles";
/* Katex css */
// import '~../../katex/dist/katex.min.css'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${commonStyles};
  overflow-y: auto;
  width: 100%;

  * {
    box-sizing: border-box;
  }
`;

const Main = styled.div`
  display: flex;
  flex-grow: 1;
  height: 100%;
  justify-content: center;
`;

const EditorArea = styled.div`
  background: inherit;
  display: flex;
  flex-grow: 1;
  height: 100%;
  justify-content: flex-start;
  overflow-y: auto;
`;

const WaxSurfaceScroll = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;

  /* PM styles  for main content */
  /* stylelint-disable-next-line order/properties-alphabetical-order */
  /* ${EditorElements} */

  .ProseMirror .wax-selection-marker {
    background-color: ${th("colorSelection")};
    opacity: 0.8;
  }

  div[contenteditable="false"] {
    .math-src {
      pointer-events: none;
      user-select: none;
    }
  }

  ul,
  ol {
    padding-left: 30px;
  }

  blockquote {
    border-left: 3px solid #eee;
    margin-left: 0;
    margin-right: 0;
    padding-left: 1em;
  }

  figure {
    display: none;
  }

  sup,
  sub {
    line-height: 0;
  }

  strong {
    font-weight: bold;
  }

  /* Tables */

  table {
    display: none;
  }

  /* invisible characters */
  .invisible {
    pointer-events: none;
    user-select: none;
  }

  .invisible:before {
    caret-color: inherit;
    color: gray;
    display: inline-block;
    font-weight: 400;
    font-style: normal;
    line-height: 1em;
    width: 0;
  }

  .invisible--space:before {
    content: "·";
  }

  .invisible--break:before {
    content: "¬";
  }

  .invisible--par:after {
    content: "¶";
  }

  /* == Math Nodes ======================================== */

  .math-node {
    min-width: 1em;
    min-height: 1em;
    font-size: 0.95em;
    font-family: "Consolas", "Ubuntu Mono", monospace;
    cursor: auto;
    .ProseMirror {
      box-shadow: none;
      min-height: 100%;
      padding: 0;
      background: #eee;
      color: rgb(132, 33, 162);
    }
  }

  .math-node.empty-math .math-render::before {
    content: "(empty)";
    color: red;
  }

  .math-node .math-render.parse-error::before {
    content: "(math error)";
    color: red;
    cursor: help;
  }

  .math-node.ProseMirror-selectednode {
    outline: none;
  }

  .math-node .math-src {
    color: rgb(132, 33, 162);
    display: none;
    tab-size: 4;
  }

  .math-node.ProseMirror-selectednode .math-src {
    display: flex;
  }
  .math-node.ProseMirror-selectednode .math-render {
    display: none;
  }

  /* -- Inline Math --------------------------------------- */

  math-inline {
    display: inline;
    white-space: nowrap;
  }

  math-inline .math-render {
    display: inline-block;
    font-size: 0.85em;
    cursor: pointer;
  }

  math-inline .math-src .ProseMirror {
    display: inline;
  }

  math-inline .math-src::after,
  math-inline .math-src::before {
    content: "$";
    color: #b0b0b0;
  }

  /* -- Block Math ---------------------------------------- */

  math-display {
    display: block;
  }

  math-display .math-render {
    display: block;
  }

  math-display.ProseMirror-selectednode {
    background-color: #eee;
  }

  math-display .math-src .ProseMirror {
    width: 100%;
    display: block;
  }

  math-display .math-src::after,
  math-display .math-src::before {
    content: "$$";
    text-align: left;
    color: #b0b0b0;
  }

  math-display .katex-display {
    margin: 0;
  }
  /* -- THIS IS A TEMP FIX FURTHER INVESTIGATION IN WAX? ---------------------------------------- */
  .katex-html {
    display: none;
  }
  /* -- Selection Plugin ---------------------------------- */

  /* p::selection,
  p > *::selection {
    background-color: #c0c0c0;
  }
  .katex-html *::selection {
    background-color: none !important;
  } */

  .math-node.math-select .math-render {
    background-color: #c0c0c0ff;
  }
  math-inline.math-select .math-render {
    padding-top: 2px;
  }

  .transform-icon {
    transform: rotate(40deg);
  }

  /* -- Questions ---------------------------------- */

  /* -- Multiple Choice ---------------------------------- */

  .multiple-choice,
  .multiple-choice-single-correct,
  .true-false,
  .true-false-single-correct {
    display: none;
  }

  .fill-the-gap {
    display: none;
  }

  &:hover {
    background-color: inherit;
  }
`;

const EditorContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  > div {
    width: 100%;
  }

  .ProseMirror {
    background-color: inherit;
    /* box-shadow: 0 0 8px #ecedf1; */
    margin-right: 0;
    min-height: 100%;
    /* padding-top: ${grid(10)}; */
    /* text-align: justify; */
    transition: background-color 0.15s ease-in-out;
    width: 100%;

    p {
      margin-bottom: 0;
      margin-top: 0;
    }
  }
`;

// const MainMenuToolBar = ComponentPlugin('mainMenuToolBar')
const WaxOverlays = ComponentPlugin("waxOverlays");

const DashboardLayout = (props) => {
  const { options } = useContext(WaxContext);

  let fullScreenStyles = {};

  if (options.fullScreen) {
    fullScreenStyles = {
      backgroundColor: "#fff",
      height: "100%",
      left: "0",
      margin: "0",
      padding: "0",
      position: "fixed",
      top: "0",
      width: "100%",
      zIndex: "99999",
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <Wrapper style={fullScreenStyles}>
        <Main>
          <EditorArea>
            <WaxSurfaceScroll>
              <EditorContainer>
                <WaxView {...props} />
              </EditorContainer>
            </WaxSurfaceScroll>
          </EditorArea>
        </Main>
        <WaxOverlays />
      </Wrapper>
    </ThemeProvider>
  );
};

export default DashboardLayout;
