import { useState } from "react";
// import spinner
import { css } from "@emotion/core";
import { RingLoader } from "react-spinners";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: flex;
  margin: 70px auto;
  background-color: transparent;
  opacity: 0.8;
`;

const Spinner = () => {
  const [color] = useState("var(--ion-color-primary)");

  return (
    <div>
      <RingLoader color={color} css={override} size={200} />
      <h3
        style={{ fontSize: "2em", textAlign: "center" }}
        className="display-3"
      >
        Loading ...
      </h3>
    </div>
  );
};

export default Spinner;