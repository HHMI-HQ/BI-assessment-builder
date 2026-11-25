import { Collapse as AntCollapse } from "antd";
import styled from "styled-components";
import { th } from "@coko/client";

const StyledCollapse = styled(AntCollapse)`
  .ant-collapse-item > .ant-collapse-header {
    margin: 1px;
    outline: 1px solid rgba(4 4 4 / 0.06);
    transition: outline 0s;

    &:focus {
      color: ${th("colorPrimary")};
      outline: 1px solid ${th("colorPrimary")};
    }
  }
`;

export default StyledCollapse;
