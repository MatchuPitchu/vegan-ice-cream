import { Fragment, useState, VFC } from 'react';
import type { PopoverState } from '../types/types';
// Redux Store
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { showActions } from '../store/showSlice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import {
  IonButton,
  IonContent,
  IonPage,
  IonHeader,
  IonCard,
  IonCardTitle,
  IonIcon,
  IonLabel,
  IonItem,
  IonItemGroup,
  IonPopover,
} from '@ionic/react';
import {
  caretDownCircle,
  caretForwardCircle,
  closeCircleOutline,
  iceCream,
  informationCircle,
  mail,
  refreshCircle,
  trailSign,
} from 'ionicons/icons';
import ProfilUpdate from './ProfilUpdate';
import Spinner from './Spinner';
import CommentsBlock from './Comments/CommentsBlock';
import FlavorsList from './Comments/FlavorsList';
import { isCommentsList } from '../types/typeguards';

const Profil: VFC = () => {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.user);
  const { showUpdateProfil } = useAppSelector((state) => state.show);
  const { successMsg } = useAppSelector((state) => state.app);
  const { locations } = useAppSelector((state) => state.locations);

  const { isDarkTheme } = useThemeContext();

  const [showUserComments, setShowUserComments] = useState(false);
  const [showFlavors, setShowFlavors] = useState(false);
  const [popoverShow, setPopoverShow] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });
  const [popoverCity, setPopoverCity] = useState<PopoverState>({
    showPopover: false,
    event: undefined,
  });

  const toggleComments = () => setShowUserComments((prev) => !prev);

  if (!isAuth && !user && !locations) return <Spinner />;

  return (
    user && (
      <IonPage>
        <IonHeader>
          <IonItem color='background-color' lines='none'>
            <IonLabel color='primary'>Profil</IonLabel>
            <IonButton
              slot='end'
              fill='clear'
              onClick={() => dispatch(showActions.setShowProfil(false))}
            >
              <IonIcon icon={closeCircleOutline} />
            </IonButton>
          </IonItem>
          <img
            className='headerImg'
            src={`${
              isDarkTheme ? './assets/header-profil-dark.svg' : './assets/header-profil-light.svg'
            }`}
            alt=''
          />
        </IonHeader>
        <IonContent>
          <div className='mt-3'>
            <IonCard>
              <IonItem className='d-flex align-items-center' lines='full'>
                <IonCardTitle className='me-2 my-3 ion-text-wrap'>{user.name}</IonCardTitle>
                <IonButton
                  className='update-btn ms-auto'
                  onClick={() => dispatch(showActions.toggleShowUpdateProfil())}
                >
                  <IonIcon className='me-1' icon={refreshCircle} />
                  Update
                </IonButton>
              </IonItem>

              {showUpdateProfil && <ProfilUpdate />}

              {successMsg && (
                <IonItem className='successMsg text-center' lines='full'>
                  {successMsg}
                </IonItem>
              )}

              <IonItem color='background-color' className='borderBottom' lines='none'>
                <IonIcon icon={mail} slot='start' />
                <IonLabel>{user.email}</IonLabel>
              </IonItem>
              <IonItem color='background-color' className='borderBottom' lines='none'>
                <IonIcon icon={trailSign} slot='start' />
                <IonLabel>
                  {user?.home_city?.city ? user.home_city.city : 'keinen Ort angegeben'}
                </IonLabel>
                <div>
                  <IonIcon
                    className='infoIcon'
                    color='primary'
                    onClick={(event) => {
                      event.persist();
                      setPopoverCity({ showPopover: true, event });
                    }}
                    icon={informationCircle}
                  />
                </div>
                <IonPopover
                  cssClass='info-popover'
                  event={popoverCity.event}
                  isOpen={popoverCity.showPopover}
                  onDidDismiss={() => setPopoverCity({ showPopover: false, event: undefined })}
                >
                  Dieser Ort wird dir immer beim ersten Öffnen der Karte angezeigt.
                </IonPopover>
              </IonItem>
              <IonItemGroup>
                <IonItem
                  color='background-color'
                  className={`${!showUserComments && 'borderBottom'}`}
                  lines='none'
                >
                  <IonIcon
                    slot='start'
                    color='primary'
                    icon={showUserComments ? caretDownCircle : caretForwardCircle}
                    onClick={toggleComments}
                  />
                  <IonLabel>Meine Bewertungen</IonLabel>
                  <IonButton fill='solid' className='commentNum me-0' onClick={toggleComments}>
                    {user.comments_list.length || '0'}
                  </IonButton>
                </IonItem>

                {showUserComments &&
                  isCommentsList(user.comments_list) &&
                  user.comments_list.map((comment) => {
                    return (
                      <Fragment key={comment._id}>
                        <div className='locationTitle mx-3 mt-3'>
                          {comment.location_id.name}
                          <div className='underlining'></div>
                        </div>
                        <CommentsBlock comment={comment} authorIdOfComment={comment.user_id} />
                      </Fragment>
                    );
                  })}

                <IonItem color='background-color' lines='none'>
                  <IonIcon
                    className={showFlavors ? 'rotateIcon90Forward' : 'rotateIcon90Back'}
                    slot='start'
                    color='primary'
                    icon={iceCream}
                    onClick={() => setShowFlavors((prev) => !prev)}
                  />
                  <IonLabel>Meine Eissorten</IonLabel>
                  <div>
                    <IonIcon
                      className='infoIcon'
                      color='primary'
                      onClick={(event) => {
                        event.persist();
                        setPopoverShow({ showPopover: true, event });
                      }}
                      icon={informationCircle}
                    />
                  </div>
                  <IonPopover
                    cssClass='info-popover'
                    event={popoverShow.event}
                    isOpen={popoverShow.showPopover}
                    onDidDismiss={() => setPopoverShow({ showPopover: false, event: undefined })}
                  >
                    Angaben aus deinen Bewertungen
                  </IonPopover>
                </IonItem>

                {showFlavors && user.favorite_flavors.length ? (
                  <FlavorsList flavorsList={user.favorite_flavors} />
                ) : null}
              </IonItemGroup>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    )
  );
};

export default Profil;
