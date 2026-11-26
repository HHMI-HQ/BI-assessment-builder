/* stylelint-disable string-quotes */
import React from "react";
import styled from "styled-components";
import { grid, th, darken } from "@coko/client";
import { Tabs as AntTabs } from "antd";

const TabsStyled = styled(AntTabs)`
  /* the colors will be based on $activebg prop by default */
  --bg-active: ${(p) => p.activebg || th("colorBackgroundHue")};
  --bg-inactive: ${(p) =>
    p.inactiveBgColor || darken(p.activeBg || "colorBackgroundHue", 0.5)};
  --color-active: ${(p) => p.activecolor || th("colorPrimary")};
  --color-inactive: ${(p) => p.inactivecolor || p.activecolor || "#999"};
  /* --border: ${(p) => p.border || `1px solid ${th("colorBorder")}}`}; */
  --border: ${(p) => p.border || `1px solid #999`};
  height: 100%;
  width: 100%;

  .ant-tabs-nav {
    background-color: ${th("colorBackground")};
    display: flex;
    margin: 0;
    padding: 0 ${grid(3)};
    text-transform: uppercase;

    &::before {
      border-bottom: 1px solid #999;
    }

    > .ant-tabs-nav-wrap {
      padding: 0.5rem 0 0;
    }
  }

  .ant-tabs-body {
    height: 100%;

    [role="tabpanel"] {
      height: 100%;
      margin: auto;
    }
  }

  .ant-tabs-nav-list .ant-tabs-tab,
  .ant-tabs-nav-list .ant-tabs-tab [role="tab"] {
    border-radius: ${th("borderRadius")} ${th("borderRadius")} 0 0;
    margin: 0 0.1rem;
    padding: 0.3rem 1rem 0.2rem;
    transform-origin: bottom;
    transition: all 0.15s ease-out;

    &:focus {
      color: var(--color-active);
    }

    &[aria-selected="false"] {
      color: var(--color-inactive);
    }

    &[aria-selected="true"] {
      color: var(--color-active);
    }

    &.ant-tabs-tab.ant-tabs-tab-active {
      background-color: var(--bg-active);
      border-bottom: 1px solid var(--bg-active);

      filter: grayscale(0);
      transform: scale(1);
      /* opacity: 1; */
    }

    &:not([role="tab"]) {
      background-color: var(--bg-active);
      border: var(--border);
      /* background-color: var(--bg-inactive); */
      filter: brightness(92%);
      transform: scale(0.98);
      /* opacity: 0.8; */
    }

    &:hover:not([role="tab"]):not(.ant-tabs-tab-active) {
      background-color: ${th("colorBackgroundHue")};
    }
  }

  .ant-tabs-content-holder {
    .ant-tabs-content {
      height: 100%;

      .ant-tabs-tabpane {
        height: 100%;
        margin: auto;
      }
    }
  }

  /* @media screen and (max-width: 800px) {
    .ant-tabs-nav {
      margin: 0;
      padding: 0 ${grid(1)};
      text-transform: uppercase;

      > .ant-tabs-nav-wrap {
        padding: 0.5rem 0 0;
      }

      .ant-tabs-nav-list .ant-tabs-tab,
      .ant-tabs-nav-list .ant-tabs-tab [role="tab"] {
        font-size: ${th("fontSizeBaseSmall")};
        padding: 0.1rem 0.3rem;
      }
    }
  } */
`;

const Tabs = (props) => {
  return <TabsStyled {...props} />;
};

export default Tabs;
