import { useContext, useEffect } from 'react';
// Redux Store
import { useAppSelector } from '../store/hooks';
// Context
import { Context } from '../context/Context';
import { useThemeContext } from '../context/ThemeContext';
import {
  IonButton,
  IonCard,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonModal,
  isPlatform,
} from '@ionic/react';
import {
  add,
  caretDownCircle,
  caretForwardCircle,
  closeCircleOutline,
  iceCream,
} from 'ionicons/icons';
import CommentsBlock from './Comments/CommentsBlock';
import BtnFavLoc from './Comments/BtnFavLoc';
import FlavorsBlock from './Comments/FlavorsBlock';
import Ratings from './Ratings';
import LoadingError from './LoadingError';
import Pricing from './Pricing';

const SelectedMarker = () => {
  const { user } = useAppSelector((state) => state.user);

  const {
    setLoading,
    setError,
    selected,
    setSelected,
    setSearchSelected,
    openComments,
    setOpenComments,
    infoModal,
    setInfoModal,
    enterAnimation,
    leaveAnimation,
  } = useContext(Context);
  const { isDarkTheme } = useThemeContext();

  useEffect(() => {
    // no need to fetch if no comments ids available or if detailed comments already fetched
    if (selected.comments_list.length === 0 || selected.comments_list[0].text) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/locations/${selected._id}/all-comments-flavors`
        );
        const { comments_list, flavors_listed } = await res.json();
        setSelected({
          ...selected,
          comments_list,
          flavors_listed,
        });
      } catch (err) {
        console.log(err);
        setError('Ups, schief gelaufen. Versuche es später nochmal.');
        setTimeout(() => setError(null), 5000);
      }
    };
    fetchData();
    setLoading(false);
  }, [selected, setError, setLoading, setSelected]);

  return (
    <IonModal
      cssClass='mapModal'
      isOpen={infoModal}
      swipeToClose={true}
      backdropDismiss={true}
      onDidDismiss={() => {
        setOpenComments(false);
        setSelected(null);
        setInfoModal(false);
      }}
      enterAnimation={enterAnimation}
      leaveAnimation={leaveAnimation}
    >
      <IonItem lines='full'>
        <IonLabel>{selected.name}</IonLabel>
        {user ? <BtnFavLoc selectedLoc={selected} /> : null}
        <IonButton
          className='hoverTransparentBtn'
          fill='clear'
          onClick={() => {
            setOpenComments(false);
            setSelected(null);
            setInfoModal(false);
          }}
        >
          <IonIcon icon={closeCircleOutline} />
        </IonButton>
      </IonItem>

      <IonContent>
        {/* IonImg uses lazy loading */}
        <IonImg
          className='modalImage'
          src='./assets/images/ice-cream-chocolate-sm-mae-mu-unsplash.jpg'
        />

        <div
          style={isDarkTheme ? { backgroundColor: '#23303399' } : { backgroundColor: '#ffffff99' }}
        >
          <IonItemGroup>
            <IonItem className='modalItem' lines='full'>
              <IonLabel className='ion-text-wrap'>
                {selected.address.street} {selected.address.number}
                <br />
                {selected.address.zipcode} {selected.address.city}
                <br />
                <a
                  className='websiteLink'
                  href={
                    selected.location_url.includes('http')
                      ? selected.location_url
                      : `//${selected.location_url}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {selected.location_url}
                </a>
              </IonLabel>
              {selected.pricing.length > 0 && <Pricing loc={selected} />}
            </IonItem>

            <IonItem
              button
              onClick={() => {
                setSearchSelected(selected);
                setOpenComments(false);
                setSelected(null);
                setInfoModal(false);
              }}
              routerLink='/preis'
              routerDirection='forward'
              className='modalItemSmall itemTextSmall'
              lines='full'
              detail='false'
            >
              <IonLabel>
                {selected.pricing.length === 0
                  ? 'Kugelpreis eintragen'
                  : 'Kugelpreis aktualisieren'}
              </IonLabel>
              <IonButton fill='clear'>
                <IonIcon icon={add} />
              </IonButton>
            </IonItem>

            <IonItem
              button
              onClick={() => {
                setSearchSelected(selected);
                setOpenComments(false);
                setSelected(null);
                setInfoModal(false);
              }}
              routerLink='/bewerten'
              routerDirection='forward'
              className='modalItemSmall itemTextSmall'
              lines='full'
              detail='false'
            >
              <IonLabel>Bewerten</IonLabel>
              <IonButton fill='clear'>
                <IonIcon icon={add} />
              </IonButton>
            </IonItem>
          </IonItemGroup>
        </div>

        <IonCard className={`${isPlatform('desktop') ? 'cardIonic' : ''}`}>
          <div style={{ backgroundColor: 'var(--ion-item-background)' }}>
            {selected.comments_list.length ? (
              <IonItemGroup>
                <div className='px-3 py-1 borderBottom'>
                  <Ratings
                    rating_vegan_offer={selected.location_rating_vegan_offer}
                    rating_quality={selected.location_rating_quality}
                    showNum={true}
                  />
                </div>

                {selected.comments_list[0].text ? (
                  <>
                    <IonItem
                      color='background-color'
                      className={`${!openComments && 'borderBottom'}`}
                      lines='none'
                    >
                      <IonIcon
                        className='me-2'
                        color='primary'
                        icon={openComments ? caretDownCircle : caretForwardCircle}
                        button
                        onClick={() => {
                          setOpenComments((prev) => !prev);
                        }}
                      />
                      <IonLabel>Bewertungen</IonLabel>
                      <IonButton
                        fill='solid'
                        className='commentNum'
                        onClick={() => setOpenComments((prev) => !prev)}
                      >
                        {selected.comments_list.length}
                      </IonButton>
                    </IonItem>

                    {openComments
                      ? selected.comments_list
                          .reverse()
                          .map((comment) => <CommentsBlock comment={comment} key={comment._id} />)
                      : null}

                    <IonItem lines='none'>
                      <IonIcon className='me-2' color='primary' icon={iceCream} />
                      <IonLabel>Bewertete Eissorten</IonLabel>
                    </IonItem>

                    <FlavorsBlock flavorsList={selected.flavors_listed} />
                  </>
                ) : null}
              </IonItemGroup>
            ) : (
              <IonItem
                button
                onClick={() => {
                  setSearchSelected(selected);
                  setOpenComments(false);
                  setSelected(null);
                  setInfoModal(false);
                }}
                routerLink='/bewerten'
                routerDirection='forward'
                className='itemTextSmall'
                lines='none'
                detail='false'
              >
                ... wartet auf die erste Bewertung
              </IonItem>
            )}
          </div>
        </IonCard>

        <LoadingError />
      </IonContent>
    </IonModal>
  );
};

export default SelectedMarker;
