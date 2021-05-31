import { useContext, useEffect, useRef } from "react";
import { Context } from "../context/Context";
import { getPlatforms, IonButton, IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonSlides, isPlatform } from '@ionic/react';
import { gift, iceCream, logoPaypal, star } from 'ionicons/icons';
import SearchTopLocations from '../components/SearchTopLocations';
import TopLocations from '../components/TopLocations';


const Home = () => {
  const { 
    toggle, 
    cities,
    cityName,
    topLocations,
    noTopLoc,
  } = useContext(Context);
  const contentRef = useRef(null);

  useEffect(() => {    
    // (number) means duration
    setTimeout(() => contentRef.current && contentRef.current.scrollToBottom(500), 500);
  }, [topLocations])

  const slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  return (
    <IonPage>
      <IonHeader>
        <img className="headerMap" src={`${toggle ? "./assets/header-home-dark.svg" : "./assets/header-home-light.svg"}`} />
      </IonHeader>
      <IonContent 
        className="home ion-content"
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
          <IonButton className="start-btn-wrapper" routerLink="/entdecken" fill="clear">
            <div className="start-btn-container">
              <a role="button">
                <span className="btn-ring"></span>
                <span className="btn-border"></span>
                <span className="btn-text">Start</span>
              </a>
            </div>
          </IonButton>
        </div>

        {cities ? <SearchTopLocations /> : null}

        {topLocations.length ? (
          <IonSlides 
            key={topLocations.length} 
            className={`${isPlatform('desktop') ? 'slideDesktop' : 'slideMobile'}`} 
            pager={true} 
            options={slideOpts}
          >
            <TopLocations /> 
          </IonSlides> 
        ): null}

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

        <IonFab className="me-2" vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton size="small">
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
                <div className="mx-3 ion-text-wrap">Gefällt dir die App? Ich bin dankbar für jede kleine Unterstützung, um die Betriebskosten decken und die App weiterentwickeln zu können.</div>
                <IonIcon className="mt-2 donateIcon" icon={logoPaypal} />
              </div>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;