import { useContext, useState, useRef } from 'react';
import { Context } from "../context/Context";
import ReactStars from "react-rating-stars-component";
import { CirclePicker } from "react-color";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToggle, IonToolbar } from '@ionic/react';
import { add, colorPaletteOutline } from 'ionicons/icons';
import showError from '../components/showError';
import Search from '../components/Search';
import LoadingError from '../components/LoadingError';
import Spinner from '../components/Spinner';

const Bewerten = () => {
  const { 
    isAuth,
    toggle,
    loading, setLoading,
    error, setError,
    user,
    searchSelected,
    newComment, setNewComment
  } = useContext(Context);
  
  const [colorPicker1, setColorPicker1] = useState({field1: false, field2: false});
  const [colorPicker2, setColorPicker2] = useState({field1: false, field2: false});
  const name1Ref = useRef(null);
  const name2Ref = useRef(null);

  const colorArr = [
    "TRANSPARENT", "#b71c1c", "#f44336", "#e57373", "#ffcdd2",
    "#880e4f", "#c2185b", "#e91e63", "#f06292", "#f8bbd0",
    "#4a148c", "#7b1fa2", "#9c27b0", "#ba68c8", "#e1bee7",
    "#0d47a1", "#1976d2", "#2196f3", "#64b5f6", "#bbdefb",
    "#004d40", "#00796b", "#009688", "#4db6ac", "#b2dfdb",
    "#194d33", "#388e3c", "#4caf50", "#81c784", "#c8e6c9",
    "#f57f17", "#fbc02d", "#ffeb3b", "#fff176", "#fff9c4",
    "#e65100", "#f57c00", "#ff9800", "#ffb74d", "#ffe0b2",
    "#bf360c", "#e64a19", "#ff5722", "#ff8a65", "#ffccbc",
    "#3e2723", "#5d4037", "#795548", "#a1887f", "#d7ccc8",
    "#000000", "#4d2119", "#693e18", "#c98850", "#ffffff",
  ]
  
  // Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({});

  // console.log('Watch:', watch()); 
  // console.log('Errors:', errors);

  const createFlavor = async (data, commentID, comment) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      if(data.name1) {
        const body = {
          user_id: user._id,
          name: data.name1,
          type_fruit_ice: data.name1_type_fruit_ice,
          type_cream_ice: data.name1_type_cream_ice,
          ice_color: {
            color_primary: data.name1color1,
            color_secondary: data.name1color2
          },
        };
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token
          },
          body: JSON.stringify(body),
          credentials: "include",
        };
        const res = await fetch(`${process.env.REACT_APP_API_URL}/flavors/${commentID}`, options);
        const newFlavor1 = await res.json();
        console.log(newFlavor1);
        if (!newFlavor1) {
          setError('Fehler beim Eintragen. Bitte versuch es später nochmal.');
          return () => setTimeout(setError(null), 5000);
        }
      }

      if(data.name2) {
        const body = {
          name: data.name2,
          type_fruit_ice: data.name2_type_fruit_ice,
          type_cream_ice: data.name2_type_cream_ice,
          ice_color: {
            color_primary: data.name2color1,
            color_secondary: data.name2color2 ? data.name2color2 : null,
          },
        };
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token
          },
          body: JSON.stringify(body),
          credentials: "include",
        };
        const res = await fetch(`${process.env.REACT_APP_API_URL}/flavors/${commentID}`, options);
        const newFlavor2 = await res.json();
        if (!newFlavor2) {
          setError('Fehler beim Eintragen. Bitte versuch es später nochmal.');
          return () => setTimeout(setError(null), 5000);
        }
      }
      reset();
    } catch (error) {
      setError(error)
      setTimeout(() => setError(null), 5000);
    };
    setNewComment(comment);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const body = {
        user_id: user._id,
        text: data.text, 
        rating_quality: data.rating_quality, 
        rating_vegan_offer: data.rating_vegan_offer, 
        date: data.date ? data.date : undefined,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token
        },
        body: JSON.stringify(body),
        credentials: "include",
      };
      const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${searchSelected._id}`, options);
      const newComment = await res.json();
      if (!newComment) {
        setError('Fehler beim Eintragen. Bitte versuch es später nochmal.');
        setTimeout(() => setError(null), 5000);
      }
      createFlavor(data, newComment._id, newComment);
      // reset();
    } catch (error) {
      setError(error)
      setTimeout(() => setError(null), 5000);
    };
    setLoading(false)
  };

  return isAuth && user ? (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/header-bewerten-dark.svg" : "./assets/header-bewerten-light.svg"}`} />
      </IonHeader>
      <IonContent className="ion-padding">
        
        <div className="container">
          <Search />
        </div>

        <form className="container" onSubmit={handleSubmit(onSubmit)}>
          <IonItem lines="none">
            <IonLabel position='stacked' htmlFor="location">Name des Eisladens</IonLabel>
            <IonInput 
              disabled={true}
              type="text"
              inputmode="text"
              placeholder="Nutze die obere Suche"
              value={searchSelected ? searchSelected.name : ''}  
              onIonChange={() => {}} 
            />
          </IonItem>

          <IonItem lines="none">
            <IonLabel ref={name1Ref} position='stacked' htmlFor="name1">1. Eissorte</IonLabel>
            <Controller 
              control={control}
              render={({ field: { onChange, value } }) => (
                <IonInput 
                  type="text" 
                  inputmode="text"
                  placeholder="Was hast du probiert?"
                  value={value} 
                  onIonChange={e => onChange(e.detail.value)} 
                />
                )}
                name="name1"
                rules={{ required: true }}
                />
          </IonItem>
          {showError("name", errors)}

          <IonItem lines="none">
            <div className="row">
              <div className="col">
                <IonLabel position='stacked' htmlFor="name1_type_fruit_ice">Fruchteis</IonLabel>
                <Controller
                  control={control}
                  defaultValue={false}
                  render={({ field: { onChange, value } }) => (
                      <IonToggle onIonChange={e => onChange(e.detail.checked)} checked={value} />
                    )}
                  name="name1_type_fruit_ice"
                />
              </div>
              <div className="col">
                <IonLabel position='stacked' htmlFor="name1_type_cream_ice">Milch- oder Cremeeis</IonLabel>
                <Controller 
                  control={control}
                  defaultValue={false}
                  render={({ field: { onChange, value } }) => (
                      <IonToggle onIonChange={e => onChange(e.detail.checked)} checked={value} />
                    )}
                  name="name1_type_cream_ice"
                />
              </div>
            </div>
          </IonItem>
          {showError("type_cream_ice", errors)}

          <IonItem lines="none">
            <IonLabel className="mb-1" position='stacked' htmlFor="name1color1">Farbmischung deiner Eiskugel</IonLabel>
            <Controller
                control={control}
                render={( { field: { onChange, value } }) => (
                  <>
                    <IonButton color="primary" fill="clear" onClick={() => setColorPicker1(prev => ({ ...prev, field1: !prev.field1 }))}>
                      <IonIcon icon={colorPaletteOutline} />
                      <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                    </IonButton>
                    {colorPicker1.field1 && (
                      <div className="colorPicker ion-padding">
                        <CirclePicker
                          colors={colorArr}
                          circleSpacing={15}
                          circleSize={25} 
                          onChangeComplete={e => { onChange(e.hex); name1Ref.current.scrollIntoView(); setColorPicker1(prev => ({ ...prev, field1: !prev.field1 })) }}
                        />
                      </div>
                    )}
                  </>
                )}
                name="name1color1"
                rules={{ required: true }}
              />
          </IonItem>
          {showError("ice-color", errors)}

          <IonItem lines="none" className="mb-1">
            <IonLabel ref={name2Ref} className="mb-1" position='stacked' htmlFor="name1color2"></IonLabel>
            <Controller
                control={control}
                render={( { field: { onChange, value } }) => (
                  <>
                    <IonButton className="mb-3" color="primary" fill="clear" onClick={() => setColorPicker1(prev => ({ field1: false, field2: !prev.field2 }))}>
                      <IonIcon icon={colorPaletteOutline} />
                      <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                    </IonButton>
                    {colorPicker1.field2 && (
                      <div className="colorPicker ion-padding">
                        <CirclePicker
                          colors={colorArr}
                          circleSpacing={15}
                          circleSize={25}
                          onChangeComplete={e => { onChange(e.hex); name1Ref.current.scrollIntoView(); setColorPicker1(prev => ({  field1: false, field2: !prev.field2 })) }}
                          />
                      </div>
                    )}
                  </>
                )}
                name="name1color2"
                />
          </IonItem>
          {showError("ice-color", errors)}

          
          <IonItem lines="none">
            <IonLabel position='stacked' htmlFor="name2">2. Eissorte</IonLabel>
            <Controller 
              control={control}
              render={({ field: { onChange, value } }) => (
                <IonInput 
                  type="text" 
                  inputmode="text"
                  placeholder="Was hast du probiert?"
                  value={value} 
                  onIonChange={e => onChange(e.detail.value)} 
                />
                )}
                name="name2"
                />
          </IonItem>
          {showError("name", errors)}

          <IonItem lines="none">
            <div className="row">
              <div className="col">
                <IonLabel position='stacked' htmlFor="name2_type_fruit_ice">Fruchteis</IonLabel>
                <Controller 
                  control={control}
                  defaultValue={false}
                  render={({ field: { onChange, value } }) => (
                      <IonToggle onIonChange={e => onChange(e.detail.checked)} checked={value} />
                    )}
                  name="name2_type_fruit_ice"
                />
              </div>
              <div className="col">
                <IonLabel position='stacked' htmlFor="name2_type_cream_ice">Milch- oder Cremeeis</IonLabel>
                <Controller 
                  control={control}
                  defaultValue={false}
                  render={({ field: { onChange, value } }) => (
                      <IonToggle onIonChange={e => onChange(e.detail.checked)} checked={value} />
                    )}
                  name="name2_type_cream_ice"
                />
              </div>
            </div>
          </IonItem>
          {showError("type_cream_ice", errors)}

          <IonItem lines="none">
            <IonLabel className="mb-1" position='stacked' htmlFor="name2color1">Farbmischung deiner Eiskugel</IonLabel>
            <Controller
                control={control}
                render={( { field: { onChange, value } }) => (
                  <>
                    <IonButton color="primary" fill="clear" onClick={() => setColorPicker2(prev => ({ field1: !prev.field1, field2: false }))}>
                      <IonIcon icon={colorPaletteOutline} />
                      <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                    </IonButton>
                    {colorPicker2.field1 && (
                      <div className="colorPicker ion-padding">
                        <CirclePicker
                          colors={colorArr}
                          circleSpacing={15}
                          circleSize={25}
                          onChangeComplete={e => { onChange(e.hex); name2Ref.current.scrollIntoView(); setColorPicker2(prev => ({ field1: !prev.field1, field2: false })) }}
                        />
                      </div>
                    )}
                  </>
                )}
                name="name2color1"
              />
          </IonItem>
          {showError("ice-color", errors)}

          <IonItem lines="none" className="mb-1">
            <IonLabel className="mb-1" position='stacked' htmlFor="name2color2"></IonLabel>
            <Controller
                control={control}
                render={( { field: { onChange, value } }) => (
                  <>
                    <IonButton className="mb-3" color="primary" fill="clear" onClick={() => setColorPicker2(prev => ({ ...prev, field2: !prev.field2 }))}>
                      <IonIcon icon={colorPaletteOutline} />
                      <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                    </IonButton>
                    {colorPicker2.field2 && (
                      <div className="colorPicker ion-padding">
                        <CirclePicker
                          colors={colorArr}
                          circleSpacing={15}
                          circleSize={25}
                          onChangeComplete={e => { onChange(e.hex); name2Ref.current.scrollIntoView(); setColorPicker2(prev => ({ ...prev, field2: !prev.field2 })) }}
                          />
                      </div>
                    )}
                  </>
                )}
                name="name2color2"
                />
          </IonItem>
          {showError("ice-color", errors)}


          <IonItem lines="none" className="mb-1">
            <IonLabel position='floating' htmlFor="text">Kommentar</IonLabel>
            <Controller
                control={control}
                render={({ 
                  field: { onChange, value },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                  <IonTextarea rows={6} value={value} onIonChange={e => onChange(e.detail.value)} />
                )}
                name="text"
                rules={{ required: true }}
              />
          </IonItem>
          {showError("text", errors)}
          
          <IonItem lines="none">
            <IonLabel position='stacked' htmlFor="rating_quality">Eis-Qualität</IonLabel>
            <Controller
              control={control}
              render={({ 
                field: { onChange, value },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
              <ReactStars
                count={5}
                value={value}
                onChange={e => onChange(e)}
                edit={true}
                size={30}
                color='#9b9b9b'
                activeColor='#de9c01'
              />
              )}
              name="rating_quality"
              rules={{ required: true }}
            />
          </IonItem>
          {showError("rating_quality", errors)}
    
          <IonItem lines="none" className="mb-1">
            <IonLabel position='stacked' htmlFor="rating_vegan_offer">Veganes Angebot des Eisladens</IonLabel>
            <Controller
              control={control}
              render={({ 
                field: { onChange, value },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
              <ReactStars
                count={5}
                value={value}
                onChange={e => onChange(e)}
                edit={true}
                size={30}
                color='#9b9b9b'
                activeColor='#de9c01'
              />
              )}
              name="rating_vegan_offer"
              rules={{ required: true }}
            />
          </IonItem>
          {showError("rating_vegan_offer", errors)}

          <IonItem lines="none" className="mb-1">
            <IonLabel position='floating' htmlFor="date">Datum</IonLabel>
            <Controller
              control={control}
              render={({ 
                field: { onChange, value },
                fieldState: { invalid, isTouched, isDirty, error },
              }) => (
                <IonDatetime
                  min="2021"
                  max="2023"
                  monthNames='Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember'
                  displayFormat="D. MMMM YYYY"
                  value={value} 
                  onIonChange={e => onChange(e.detail.value)}
                  cancelText='Zurück'
                  doneText='OK'
                />
              )}
              name="date"
            />
          </IonItem>
          {showError("date", errors)}

          <IonButton fill="solid" className="check-btn my-3" type="submit">
            <IonIcon className="pe-1" icon={add}/>Bewertung abgeben
          </IonButton>
        </form>

        <LoadingError />
        
      </IonContent>
    </IonPage>
   ) : (
    <IonPage>
      <Spinner />;
    </IonPage>
  )
};

export default Bewerten;

