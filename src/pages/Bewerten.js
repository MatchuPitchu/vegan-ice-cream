import { useContext, useState } from 'react';
import { Context } from "../context/Context";
import ReactStars from "react-rating-stars-component";
import { CirclePicker } from "react-color";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToggle, IonToolbar } from '@ionic/react';
import { add, colorPalette, colorPaletteOutline, mailUnread } from 'ionicons/icons';
import showError from '../components/showError';
import Search from '../components/Search';

const Bewerten = () => {
  const { 
    toggle,
    error, setError,
    user,
    locations, setLocations,
    newLocation, setNewLocation,
    selected, setSelected,
    setShowNewLocModal
  } = useContext(Context);
  
  const [newComment, setNewComment] = useState();

  const colorArr = [
    "#b71c1c", "#d32f2f", "#f44336", "#e57373", "#ffcdd2",
    "#880e4f", "#c2185b", "#e91e63", "#f06292", "#f8bbd0",
    "#4a148c", "#7b1fa2", "#9c27b0", "#ba68c8", "#e1bee7",
    "#0d47a1", "#1976d2", "#2196f3", "#64b5f6", "#bbdefb",
    "#004d40", "#00796b", "#009688", "#4db6ac", "#b2dfdb",
    "#194d33", "#388e3c", "#4caf50", "#81c784", "#c8e6c9",
    "#827717", "#afb42b", "#cddc39", "#dce775", "#f0f4c3",
    "#f57f17", "#fbc02d", "#ffeb3b", "#fff176", "#fff9c4",
    "#e65100", "#f57c00", "#ff9800", "#ffb74d", "#ffe0b2",
    "#bf360c", "#e64a19", "#ff5722", "#ff8a65", "#ffccbc",
    "#3e2723", "#5d4037", "#795548", "#a1887f", "#d7ccc8",
    "#000000", "#231509", "#4d2119", "#693e18", "#ffffff",
  ]

  const defaultValues = { 
    flavors_referred: '',
    text: '',
    rating_quality: null,
    rating_vegan_offer: null,
    date: ''
  }
  
  // Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started
  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({defaultValues});

  console.log('Watch:', watch()); 
  console.log('Errors:', errors);

  const onSubmit = (data) => {
    console.log('Output', data.date.toISOString)
    // const duplicate = locations.find(loc => loc.address.geo.lat === newLocation.address.geo.lat)
    // console.log(duplicate)
    // if(duplicate) {
    //   setError('Diese Adresse gibt es schon.');
    //   return setNewLocation(null)
    // }
    
    // const body = {
    //   user_id: user._id,
    //   flavors_referred: [], 
    //   text: data.text, 
    //   rating_quality: data.rating_quality, 
    //   rating_vegan_offer: data.rating_vegan_offer, 
    //   date: data.date
    // };

    // const options = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    //   credentials: "include",
    // };
    // try {
    //   const res = await fetch(`${process.env.REACT_APP_API_URL}/comments/${selected.loc._id}`, options);
    //   const newLocation = await res.json();
    //   if (!newLocation) {
    //     setError('Fehler beim Eintragen. Bitte versuch es später nochmal.');
    //     return () => setTimeout(setError(null), 5000);
    //   }
    //   setLocations([...locations, newLocation])
    //   reset(defaultValues);
    // } catch (error) {
    //   setError(error)
    //   setTimeout(() => setError(null), 5000);
    // };
    // setShowNewLocModal(false);
    // setNewLocation(null)
  };

  const [showColorPicker, setShowColorPicker] = useState({field1: false, field2: false});
  const [selectedColor, setSelectedColor] = useState();

  // console.log('newComment state:', newComment);

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      </IonHeader>
      <IonContent className="ion-padding">
        
        {/* <Search /> */}

        {/* <div>
          <IonButton
            color="medium"
            fill="outline"
            onClick={() => setDisplayColorPicker(true)}
            style={{ margin: "1rem" }}
          >
            Click to select Base Color
          </IonButton>
          {selectedColor ? (
            <div>
              Base Color:
              <div
                style={{
                  height: "4rem",
                  backgroundColor: `${selectedColor}`,
                  margin: "1rem",
                }}
              ></div>
            </div>
          ) : null}
          {displayColorPicker ? (
            <div>
              <CirclePicker
                colors={colorArr}
                circleSpacing={20}
                circleSize={30} 
                onChangeComplete={() => {setDisplayColorPicker(false)}}>
              </CirclePicker>
            </div>
          ) : null}
        </div> */}


        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem lines="none">
            <IonLabel position='stacked' htmlFor="name1">1. Eissort</IonLabel>
            <Controller 
              control={control}
              render={({ field: { onChange, value } }) => (
                <IonInput 
                  type="text" 
                  inputmode="text"
                  placeholder="Welche Kugel hast du gegessen?"
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
                  render={({ field: { onChange, value } }) => (
                      <IonToggle onIonChange={e => onChange(e.detail.checked)} checked={value} />
                    )}
                  name="name1_type_fruit_ice"
                  rules={{ required: true }}
                />
              </div>
              <div className="col">
                <IonLabel position='stacked' htmlFor="name1_type_cream_ice">Milch- oder Cremeeis</IonLabel>
                <Controller 
                  control={control}
                  render={({ field: { onChange, value } }) => (
                      <IonToggle onIonChange={e => onChange(e.detail.checked)} checked={value} />
                    )}
                  name="name1_type_cream_ice"
                  rules={{ required: true }}
                />
              </div>
            </div>
          </IonItem>
          {showError("type_cream_ice", errors)}

          <IonItem lines="none">
            <IonLabel className="mb-1" position='stacked' htmlFor="name1color1">Farbe 1</IonLabel>
            <Controller
                control={control}
                render={( { field: { onChange, value } }) => (
                  <>
                    <IonButton color="primary" fill="clear" onClick={() => setShowColorPicker(prev => ({ ...prev, field1: !prev.field1}))}>
                      <IonIcon icon={colorPaletteOutline} />
                      <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                    </IonButton>
                    {showColorPicker.field1 && (
                      <div className="colorPicker ion-padding">
                        <CirclePicker
                          colors={colorArr}
                          circleSpacing={25}
                          circleSize={25} 
                          onChangeComplete={e => { onChange(e.hex); setShowColorPicker({field1: false, field2: false}) }}
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

          <IonItem lines="full">
            <IonLabel className="mb-1" position='stacked' htmlFor="name1color2">Farbe 2</IonLabel>
            <Controller
                control={control}
                render={( { field: { onChange, value } }) => (
                  <>
                    <IonButton className="mb-3" color="primary" fill="clear" onClick={() => setShowColorPicker(prev => ({ ...prev, field2: !prev.field2}))}>
                      <IonIcon icon={colorPaletteOutline} />
                      <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                    </IonButton>
                    {showColorPicker.field2 && (
                      <div className="colorPicker ion-padding">
                        <CirclePicker
                          colors={colorArr}
                          circleSpacing={25}
                          circleSize={25} 
                          onChangeComplete={e => { onChange(e.hex); setShowColorPicker({field1: false, field2: false}) }}
                          />
                      </div>
                    )}
                  </>
                )}
                name="name1color2"
                rules={{ required: true }}
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
                  placeholder="Welche Kugel hast du gegessen?"
                  value={value} 
                  onIonChange={e => onChange(e.detail.value)} 
                />
                )}
                name="name2"
                rules={{ required: true }}
                />
          </IonItem>
          {showError("name", errors)}

          <IonItem lines="none">
            <div className="row">
              <div className="col">
                <IonLabel position='stacked' htmlFor="name2_type_fruit_ice">Fruchteis</IonLabel>
                <Controller 
                  control={control}
                  render={({ field: { onChange, value } }) => (
                      <IonToggle onIonChange={e => onChange(e.detail.checked)} checked={value} />
                    )}
                  name="name2_type_fruit_ice"
                  rules={{ required: true }}
                />
              </div>
              <div className="col">
                <IonLabel position='stacked' htmlFor="name2_type_cream_ice">Milch- oder Cremeeis</IonLabel>
                <Controller 
                  control={control}
                  render={({ field: { onChange, value } }) => (
                      <IonToggle onIonChange={e => onChange(e.detail.checked)} checked={value} />
                    )}
                  name="name2_type_cream_ice"
                  rules={{ required: true }}
                />
              </div>
            </div>
          </IonItem>
          {showError("type_cream_ice", errors)}

          <IonItem lines="none">
            <IonLabel className="mb-1" position='stacked' htmlFor="name2color1">Farbe 1</IonLabel>
            <Controller
                control={control}
                render={( { field: { onChange, value } }) => (
                  <>
                    <IonButton color="primary" fill="clear" onClick={() => setShowColorPicker(prev => ({ ...prev, field1: !prev.field1}))}>
                      <IonIcon icon={colorPaletteOutline} />
                      <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                    </IonButton>
                    {showColorPicker.field1 && (
                      <div className="colorPicker ion-padding">
                        <CirclePicker
                          colors={colorArr}
                          circleSpacing={25}
                          circleSize={25} 
                          onChangeComplete={e => { onChange(e.hex); setShowColorPicker({field1: false, field2: false}) }}
                        />
                      </div>
                    )}
                  </>
                )}
                name="name2color1"
                rules={{ required: true }}
              />
          </IonItem>
          {showError("ice-color", errors)}

          <IonItem lines="full">
            <IonLabel className="mb-1" position='stacked' htmlFor="name2color2">Farbe 2</IonLabel>
            <Controller
                control={control}
                render={( { field: { onChange, value } }) => (
                  <>
                    <IonButton className="mb-3" color="primary" fill="clear" onClick={() => setShowColorPicker(prev => ({ ...prev, field2: !prev.field2}))}>
                      <IonIcon icon={colorPaletteOutline} />
                      <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                    </IonButton>
                    {showColorPicker.field2 && (
                      <div className="colorPicker ion-padding">
                        <CirclePicker
                          colors={colorArr}
                          circleSpacing={25}
                          circleSize={25} 
                          onChangeComplete={e => { onChange(e.hex); setShowColorPicker({field1: false, field2: false}) }}
                          />
                      </div>
                    )}
                  </>
                )}
                name="name2color2"
                rules={{ required: true }}
                />
          </IonItem>
          {showError("ice-color", errors)}


          <IonItem lines="full">
            <IonLabel position='floating' htmlFor="text">Text</IonLabel>
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
    
          <IonItem lines="full">
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
                  max="2022"
                  monthNames='Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember'
                  displayFormat="D. MMMM YYYY"
                  value={value} 
                  onIonChange={e => onChange(e.detail.value)}
                  cancelText='Zurück'
                  doneText='Speichern'
                />
              )}
              name="date"
              rules={{ required: false }}
            />
          </IonItem>
          {showError("date", errors)}

          <IonButton className="my-3" type="submit" expand="block"><IonIcon className="pe-1"icon={add}/>Bewertung abgeben</IonButton>
        </form>

        <IonToast 
          isOpen={error ? true : false} 
          message={error} 
          onDidDismiss={() => setError('')}
          duration={6000} 
        />
      </IonContent>
    </IonPage>
  );
};

export default Bewerten;

