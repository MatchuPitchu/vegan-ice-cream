import { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../context/Context";
import { IonButton, IonCard, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonPopover, IonSlide, IonSlides, isPlatform } from '@ionic/react';
import { add, addCircle, create, gift, iceCream, logIn, logoPaypal, star } from 'ionicons/icons';
import SearchTopLocations from '../components/SearchTopLocations';
import TopLocations from '../components/TopLocations';


const Home = () => {
  const {
    user,
    toggle, 
    cityName,
    topLocations,
    noTopLoc,
    setNewLocation,
    setAutocompleteModal,
  } = useContext(Context);
  const [show, setShow] = useState(false);
  const [popoverShow, setPopoverShow] = useState({ show: false, event: undefined });
  const contentRef = useRef(null);

  useEffect(() => {    
    // (number) means duration
    setTimeout(() => contentRef.current && contentRef.current.scrollToBottom(500), 500);
  }, [topLocations])

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/header-home-dark.svg" : "./assets/header-home-light.svg"}`} />
      </IonHeader>
      <IonContent 
        className={`home ${show && "fabOpen"}`}
        ref={contentRef}
        scrollEvents
        style={{backgroundImage: `url(./assets/images/${toggle ? 'ice-cream-red-dark-pablo-merchan-montes-unsplash.jpg' : 'ice-cream-yellow-light-wesual-click-unsplash.jpg'})`}}
      >
        <div className="run-text">
          <h1 className="title">
            veganes Eis<br />
            <div className="run-text-wrapper">
              <div className="run-text-words" aria-hidden="true">
                <strong className="run-text-word">entdecken</strong>
                <strong className="run-text-word">genießen</strong>
                <strong className="run-text-word">eintragen</strong>
              </div>
              <div className="run-text-final">entdecken</div>
              <div className="run-text-final">genießen</div>
              <div className="run-text-final">eintragen</div>
            </div>
          </h1>
          <div className={`${toggle ? "overlay" : "overlay-light"}`}>
            <IonIcon className="startIceIcon" icon={iceCream} />
          </div>
          <IonButton
            className="start-btn-wrapper" 
            routerLink={`${user ? "/entdecken" : ""}`}
            fill="clear"
            onClick={(e) => {
              if(user) {
                setNewLocation(null);
                setAutocompleteModal(true);
              } else { 
                e.persist();
                setPopoverShow({ show: true, event: e })
              }
            }} 
          >
            <div className="start-btn-container">
              <a>
                <span className="btn-ring"></span>
                <span className="btn-border"></span>
                <span className="btn-text">
                  <IonIcon icon={add}/><br/>Eisladen<br/>eintragen
                </span>
              </a>
            </div>
          </IonButton>
          <IonPopover
            color="primary"
            cssClass='info-popover'
            event={popoverShow.event}
            isOpen={popoverShow.show}
            onDidDismiss={() => setPopoverShow({ show: false, event: undefined })}
            >
            <div className="my-2">
              <div>Nur für eingeloggte User</div>
              <IonButton routerLink='/login' fill="solid" className="click-btn mt-2">
                <IonLabel>Login</IonLabel>
                <IonIcon className="pe-1" icon={logIn} />
              </IonButton>
              <IonButton routerLink='/register' fill="solid" className="click-btn">
                <IonLabel>Registrieren</IonLabel>
                <IonIcon className="pe-1" icon={create} />
              </IonButton>
            </div>
          </IonPopover>
        </div>

        <SearchTopLocations />

        {noTopLoc && (
          <div className="container text-center">
            <IonCard>
              <div className="noTopLocCard">
                Noch keine Top Eisläden mit 3+
                <IonIcon size="small" color="primary" icon={star}/>
                <br/>
                in <span className="highlightSpan">{cityName}</span> gefunden.
                <br/>
              </div>
            </IonCard>
          </div>
        )}

        {topLocations.length ? <TopLocations /> : null}

      </IonContent>

      <IonFab className="me-2" vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => setShow(prev => !prev)} size="small">
          <IonIcon icon={gift} />
        </IonFabButton>
        <IonFabList color="dark" side="start">
          <IonFabButton
            className="donate-btn"
            href="https://paypal.me/eismitstil"
            target="_blank"
            routerDirection="forward"
            color="primary"
          >
            <div className="d-flex flex-column align-items-center mt-3">
              <div className="mx-3 ion-text-wrap">Gefällt dir die App?</div>
              <div className="mx-3 ion-text-wrap">Ich bin dankbar für jede Unterstützung, um die Betriebskosten decken und die App weiterentwickeln zu können.</div>
              <IonIcon className="mt-2 donateIcon" icon={logoPaypal} />
            </div>
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </IonPage>
  );
};

export default Home;