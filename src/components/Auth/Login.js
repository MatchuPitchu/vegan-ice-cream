import { IonContent, IonInput, IonItem, IonLabel, IonList, IonButton, IonPage, IonHeader } from "@ionic/react";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import { Redirect } from "react-router-dom";

const Login = () => {
  const { isAuth, setIsAuth, error, setError, toggle } = useContext(Context);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formState;

  // IMPLEMENT REACT FORM HOOK
  const onSubmit = async e => {
    e.preventDefault();
    for (const field in formState) {
      if (!formState[field]) return alert(`Please fill in your ${field}`);
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
      credentials: "include",
    };
    try {
      const res = await fetch(
        "https://colin-color-inspirator.herokuapp.com/user/login",
        options
      );
      const { token, message } = await res.json();
      //set this to session storage
      if (message) {
        setError(message);
        console.log(message);
        return () => setTimeout(setError(""), 5000);
      };
      if (token) {
        localStorage.setItem("token", token);
        setIsAuth(true);
      };
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = e => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  if (isAuth) return <Redirect to="/" />;

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent>
        <h3>Please log in to save color combinations or submit new themes</h3>
        <form onSubmit={onSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position="floating" htmlFor="email">
                E-Mail
              </IonLabel>
              <IonInput
                type="email"
                name="email"
                value={email}
                onIonChange={onChange}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating" htmlFor="password">
                Password
              </IonLabel>
              <IonInput
                type="password"
                name="password"
                value={password}
                onIonChange={onChange}
              ></IonInput>
            </IonItem>
          </IonList>
          <IonButton
            type="submit"
            onClick={e => console.log("clicked")}
            style={{ marginTop: "2rem", marginBottom: "2rem" }}
          >
            Login
          </IonButton>
          {/* Could be prettier */}
          {error && <div>{error}</div>}
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;