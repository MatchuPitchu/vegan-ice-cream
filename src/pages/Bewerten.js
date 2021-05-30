import { useContext, useState, useEffect, useRef } from 'react';
import { Context } from "../context/Context";
import ReactStars from "react-rating-stars-component";
import { CirclePicker } from "react-color";
import { Controller, useForm } from 'react-hook-form';
import { IonButton, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonPopover, IonSearchbar, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToggle, IonToolbar } from '@ionic/react';
import { add, bulb, colorPaletteOutline, informationCircle, search } from 'ionicons/icons';
import showError from '../components/showError';
import Search from '../components/Search';
import SearchFlavors from '../components/SearchFlavors';
import LoadingError from '../components/LoadingError';
import Spinner from '../components/Spinner';

const Bewerten = () => {
  const { 
    isAuth,
    toggle,
    setLoading,
    setError,
    user,
    searchSelected, setSearchSelected,
    setSearchText,
    setNewComment,
    searchFlavor, setSearchFlavor,
    flavor
  } = useContext(Context);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });
  const [popoverInfo, setPopoverInfo] = useState({ show: false, event: undefined });
  const [showColorPicker, setShowColorPicker] = useState({field1: false, field2: false});
  const flav1Ref = useRef(null);
  const flav2Ref = useRef(null);

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
  
  const defaultValues = { 
    name: undefined,
    type_cream: false,
    type_fruit: false,
    color1: undefined,
    color2: undefined,
    text: '',
    rating_quality: 0,
    bio: false,
    vegan: false,
    lactose_free: false,
    not_specified: false,
    rating_vegan_offer: 0,
  }

  // Schema Validation via JOI is supported - siehe https://react-hook-form.com/get-started
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues
  });

  useEffect(() => {
    setValue("name", flavor.name ? searchFlavor : undefined);
    setValue("type_fruit", flavor.name ? flavor.type_fruit : undefined);
    setValue("type_cream", flavor.name ? flavor.type_cream : undefined);
    setValue("color1", flavor.name ? flavor.color.primary : undefined);
    setValue("color2", flavor.name ? flavor.color.secondary : undefined);
  }, [flavor]);

  const unCheckToggles = () => {
    setValue("bio", false);
    setValue("vegan", false);
    setValue("lactose_free", false);
  }

  const unCheckNotSpecified = () => {
    setValue("not_specified", false);
  }

  const createFlavor = (data, comment) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const uploadFlavor = async (name, type_fruit, type_cream, primary, secondary) => {
        const body = {
          location_id: searchSelected._id,
          user_id: user._id,
          name,
          type_fruit,
          type_cream,
          color: {
            primary,
            secondary
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
        
        const res = await fetch(`${process.env.REACT_APP_API_URL}/flavors/${comment._id}`, options);
        await res.json();
      }

      const { name, type_fruit, type_cream, color1, color2 } = data
      uploadFlavor(name, type_fruit, type_cream, color1, color2);
      
    } catch (error) {
      console.log(error);
      setError('Fehler beim Eintragen. Bitte versuch es später nochmal.');
      setTimeout(() => setError(null), 5000);
    };

    setNewComment(comment);
    setSearchText('');
    setSearchFlavor('');
    setSearchSelected(null);
    reset(defaultValues);
  };

  const onSubmit = async (data) => {
    if(!searchSelected) {
      setError('Der Name des Eisladens fehlt.');
      setTimeout(() => setError(null), 5000);
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const body = {
        user_id: user._id,
        text: data.text, 
        rating_quality: data.rating_quality,
        bio: data.bio,
        vegan: data.vegan,
        lactose_free: data.lactose_free,
        not_specified: data.not_specified,
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
      createFlavor(data, newComment);

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
          <IonItem lines="full">
            <IonLabel position='stacked' htmlFor="location">Name des Eisladens</IonLabel>
            <IonInput 
              readonly
              type="text"
              placeholder="Nutze die obere Suche"
              value={searchSelected ? searchSelected.name : ''}
            />
          </IonItem>

          <IonItem lines="full">
            <IonIcon icon={bulb} color="warning"/>
            <IonLabel className="ion-text-wrap ms-1" color="warning">
              Beziehe deine Bewertung bitte nur auf 1 Eissorte
            </IonLabel>
            
            <IonIcon
              className="warningIcon ms-3"
              color="warning"
              button 
              onClick={e => {
                e.persist();
                setPopoverInfo({ show: true, event: e })
              }}
              icon={informationCircle} 
            />
            <IonPopover
              color="primary"
              cssClass='info-popover'
              event={popoverInfo.event}
              isOpen={popoverInfo.show}
              onDidDismiss={() => setPopoverInfo({ show: false, event: undefined })}
            >
              Damit eine Bewertung fix abzusenden ist, bezieht sie sich immer auf 1 Eissorte. Hast du mehrere Sorten probiert, kannst du natürlich weitere Bewertungen abgeben.
            </IonPopover>
          </IonItem>

          <IonItem lines="none">
            <IonLabel htmlFor="name1">Eissorte</IonLabel>
            <IonIcon
              className="infoIcon ms-auto"
              color="primary"
              slot="end"
              button 
              onClick={e => {
                e.persist();
                setPopoverShow({ show: true, event: e })
              }}
              icon={informationCircle} 
            />
            <IonPopover
              color="primary"
              cssClass='info-popover'
              event={popoverShow.event}
              isOpen={popoverShow.show}
              onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
            >
              Du siehst keine Vorschläge oder die Vorschläge passen nicht zu deiner Eissorte? Dann tippe einfach den vollständigen Namen der neuen Eissorte ein.
            </IonPopover>
          </IonItem>

          <SearchFlavors />
          
          {/* Hide Input Item because it only doubles searchbar value */}
          <IonItem hidden lines="none">
            <Controller 
              control={control}
              render={({ field: { onChange, value } }) => (
                <IonInput
                  readonly
                  autocapitalize='words'
                  type="text"
                  value={value = searchFlavor}
                  onIonChange={e => {
                    onChange(e.detail.value)
                  }} 
                />
              )}
              name="name"
              rules={{ required: true }}
            />
          </IonItem>
          {showError("name", errors)}

          <IonItem lines="none">
            <div className="row">
              <div className="col">
                <IonLabel position='stacked' htmlFor="type_fruit">Fruchteis</IonLabel>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonToggle
                      disabled={flavor.name ? true : false}
                      onIonChange={e => onChange(e.detail.checked)} 
                      checked={value} />
                    )}
                  name="type_fruit"
                />
              </div>
              <div className="col">
                <IonLabel position='stacked' htmlFor="type_cream">Cremeeis</IonLabel>
                <Controller 
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonToggle 
                      disabled={flavor.name ? true : false}
                      onIonChange={e => onChange(e.detail.checked)} 
                      checked={value} 
                    />
                  )}
                  name="type_cream"
                />
              </div>
            </div>
            {showError("type_cream", errors)}
          </IonItem>

          <IonItem lines="none">
            <IonLabel ref={flav1Ref} className="mb-1" position='stacked' htmlFor="color1">Farbmischung deiner Eiskugel</IonLabel>
            <Controller
              control={control}
              render={( { field: { onChange, value } }) => (
                <>
                  <IonButton color="primary" fill="clear" onClick={() => setShowColorPicker(prev => ({ ...prev, field1: !prev.field1 }))}>
                    <IonIcon icon={colorPaletteOutline} />
                    <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                  </IonButton>
                  {showColorPicker.field1 && (
                    <div className="colorPicker ion-padding">
                      <CirclePicker
                        colors={colorArr}
                        circleSpacing={15}
                        circleSize={25} 
                        onChangeComplete={e => {
                          onChange(e.hex); 
                          flav1Ref.current.scrollIntoView(); 
                          setShowColorPicker(prev => ({ ...prev, field1: !prev.field1 })) 
                        }}
                      />
                    </div>
                  )}
                </>
              )}
              name="color1"
              rules={{ required: true }}
            />
          </IonItem>
          {showError("ice-color", errors)}

          <IonItem lines="none" className="mb-1">
            <IonLabel ref={flav2Ref} className="mb-1" position='stacked' htmlFor="color2"></IonLabel>
            <Controller
              control={control}
              render={( { field: { onChange, value } }) => (
                <>
                  <IonButton className="mb-3" color="primary" fill="clear" onClick={() => setShowColorPicker(prev => ({ field1: false, field2: !prev.field2 }))}>
                    <IonIcon icon={colorPaletteOutline} />
                    <div className="ms-1" style={{width: "20px", height: "20px", borderRadius: "100%", backgroundColor: value}}></div>
                  </IonButton>
                  {showColorPicker.field2 && (
                    <div className="colorPicker ion-padding">
                      <CirclePicker
                        colors={colorArr}
                        circleSpacing={15}
                        circleSize={25}
                        onChangeComplete={e => { onChange(e.hex); flav2Ref.current.scrollIntoView(); setShowColorPicker(prev => ({  field1: false, field2: !prev.field2 })) }}
                        />
                    </div>
                  )}
                </>
              )}
              name="color2"
            />
          </IonItem>
          {showError("ice-color", errors)}
          
          <IonItem lines="none" className="my-1">
            <IonLabel position='floating' htmlFor="text">Kommentar</IonLabel>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <IonTextarea
                  className="pb-3"
                  autoGrow={true} 
                  value={value} 
                  onIonChange={e => onChange(e.detail.value)} 
                />
              )}
              name="text"
              rules={{ required: true }}
            />
          </IonItem>
          {searchSelected && showError("text", errors)}
          
          <IonItem lines="none">
            <IonLabel position='stacked' htmlFor="rating_quality">Eis-Erlebnis</IonLabel>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
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
    
          {/* NEU CHECKEN MIT ERROR HANDLUNG UND BACKEND -> SOLL ALS ERGÄNZUNG ZU COMMENT GESPEICHERT WERDEN, NICHT IN FLAVOR */}
          <IonItem lines="full">
            <IonLabel position='stacked'>Mein Eis-Erlebnis war ...</IonLabel>
            <div className="row">
              <div className="col">
                <IonLabel position='stacked' htmlFor="bio">bio</IonLabel>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonToggle
                      onIonChange={e => {
                        onChange(e.detail.checked);
                        e.detail.checked && unCheckNotSpecified();
                      }} 
                      checked={value} />
                    )}
                  name="bio"
                />
              </div>
              <div className="col">
                <IonLabel position='stacked' htmlFor="vegan">vegan</IonLabel>
                <Controller 
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonToggle 
                      onIonChange={e => {
                        onChange(e.detail.checked);
                        e.detail.checked && unCheckNotSpecified();
                      }} 
                      checked={value} 
                    />
                  )}
                  name="vegan"
                />
              </div>
              <div className="col">
                <IonLabel position='stacked' htmlFor="lactose_free">laktosefrei</IonLabel>
                <Controller 
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonToggle 
                      onIonChange={e => {
                        onChange(e.detail.checked);
                        e.detail.checked && unCheckNotSpecified();
                      }} 
                      checked={value} 
                    />
                  )}
                  name="lactose_free"
                />
              </div>
              <div className="col">
                <IonLabel position='stacked' htmlFor="not_specified ">weiß nicht</IonLabel>
                <Controller 
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <IonToggle 
                      onIonChange={e => {
                        onChange(e.detail.checked);
                        e.detail.checked && unCheckToggles();
                      }} 
                      checked={value} 
                    />
                  )}
                  name="not_specified"
                />
              </div>
            </div>
          </IonItem>

          <IonItem lines="none" className="mb-1">
            <IonLabel position='stacked' htmlFor="rating_vegan_offer">Veganes Angebot des Eisladens</IonLabel>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
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