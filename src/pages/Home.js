import { useContext, useEffect, useRef } from "react";
import { Context } from "../context/Context";
import { IonButton, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonLabel, IonPage, IonSlides } from '@ionic/react';
import { gift, iceCream, logoPaypal } from 'ionicons/icons';
import SearchTopLocations from '../components/SearchTopLocations';
import TopLocations from '../components/TopLocations';


const Home = () => {
  const { toggle, cities, topLocations } = useContext(Context);
  const contentRef = useRef(null);

  useEffect(() => {
    const scrollDown = () => {
      // (number) means duration
      contentRef.current && contentRef.current.scrollToBottom(1000);
    };

    setTimeout(() => scrollDown(), 500);
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
          <IonSlides key={topLocations.length} className="slideContainer" pager={true} options={slideOpts}>
            <TopLocations /> 
          </IonSlides> 
        ): null}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton size="small">
            <IonIcon icon={gift} />
          </IonFabButton>
          <IonFabList side="start">
            <IonFabButton
              className="donate-btn"
              routerDirection="forward"
              color="primary"
            >
              <IonIcon className="donateIcon" icon={logoPaypal} />
              <IonLabel className="ms-1">Donate</IonLabel>
            </IonFabButton>
          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
