import { useContext } from 'react';
import { Context } from "../context/Context";

const Toggle = () => {
  const {
    toggle,
    handleToggleDN
  } = useContext(Context);
  
  return (
    <div onClick={handleToggleDN} className={`toggle${toggle ? " night" : ""}`}>
      <div className="moon">
        <div className="crater" />
        <div className="crater" />
      </div>
      <div>
        <div className="shape sm" />
        <div className="shape sm" /> 
        <div className="shape md" />
        <div className="shape lg" />
      </div>
    </div>
  )
}

export default Toggle;
