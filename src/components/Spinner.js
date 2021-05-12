import { useContext,useState } from "react";
import { Context } from "../context/Context";
// import spinner
import { css } from "@emotion/core";
import { RingLoader } from "react-spinners";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: flex;
  margin: 30px auto;
  background-color: transparent;
  opacity: 0.8;
`;

const Spinner = () => {
  const { isAuth } = useContext(Context);
  const [color] = useState("var(--ion-color-primary)");

  return (
    <div>
      <RingLoader color={color} css={override} size={200} />
      <h3
        style={{ fontSize: "2em", textAlign: "center" }}
        className="display-3"
      >
        {isAuth ? 'Loading ...' : 'Nur für eingeloggte Nutzer:innen anzusehen'} 
      </h3>
    </div>
  );
};

export default Spinner;