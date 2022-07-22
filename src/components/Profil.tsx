import { Fragment, useReducer, useState, VFC } from 'react';
import type { PopoverState } from '../types/types';
// Redux Store
import { useAppSelector } from '../store/hooks';
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
  iceCreamOutline,
  informationCircle,
  mailOutline,
  navigateOutline,
  refreshCircleOutline,
} from 'ionicons/icons';
import ProfilUpdate from './ProfilUpdate';
import Spinner from './Spinner';
import CommentsBlock from './Comments/CommentsBlock';
import FlavorsList from './Comments/FlavorsList';
import { hasNameProperty, isString } from '../types/typeguards';

interface Props {
  onCloseProfil: () => void;
}

// TODO: Popover Styling

const Profil: VFC<Props> = ({ onCloseProfil }) => {
  const { isAuth, user } = useAppSelector((state) => state.user);
  const { successMessage: successMsg } = useAppSelector((state) => state.app);
  const { locations } = useAppSelector((state) => state.locations);

  const [showUpdateProfil, toggleUpdateProfil] = useReducer(
    (prevShowUpdateProfil) => !prevShowUpdateProfil,
    false
  );

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
            <IonButton slot='end' fill='clear' onClick={onCloseProfil}>
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
              <IonItem className='item--card-header-background' lines='none'>
                <IonCardTitle className='me-2 my-3 ion-text-wrap'>{user.name}</IonCardTitle>
                <IonButton
                  fill='clear'
                  className='button--update ms-auto'
                  onClick={toggleUpdateProfil}
                >
                  <IonIcon className='pe-1' icon={refreshCircleOutline} />
                  Update
                </IonButton>
              </IonItem>

              {showUpdateProfil && (
                <ProfilUpdate
                  toggleUpdateProfil={toggleUpdateProfil}
                  onCloseProfil={onCloseProfil}
                />
              )}

              {successMsg && (
                <IonItem className='text--success text-center' lines='full'>
                  {successMsg}
                </IonItem>
              )}

              <IonItem className='item--card-background' lines='full'>
                <IonIcon icon={mailOutline} slot='start' />
                <IonLabel>{user.email}</IonLabel>
              </IonItem>
              <IonItem className='item--card-background' lines='full'>
                <IonIcon icon={navigateOutline} slot='start' />
                <IonLabel>
                  {user?.home_city?.city ? user.home_city.city : 'keinen Ort angegeben'}
                </IonLabel>
                <div>
                  <IonIcon
                    className='info-icon'
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
                  <div className='info-popover__content'>
                    Dieser Ort wird dir immer beim ersten Öffnen der Karte angezeigt.
                  </div>
                </IonPopover>
              </IonItem>
              <IonItemGroup>
                <IonItem
                  className='item--card-background'
                  lines={!showUserComments ? 'full' : 'none'}
                >
                  <IonIcon
                    slot='start'
                    color='primary'
                    icon={showUserComments ? caretDownCircle : caretForwardCircle}
                    onClick={toggleComments}
                  />
                  <IonLabel>Meine Bewertungen</IonLabel>
                  <div className='comment__number' onClick={toggleComments}>
                    {user.comments_list.length || '0'}
                  </div>
                </IonItem>

                {showUserComments &&
                  user.comments_list.map((comment) => {
                    return (
                      <Fragment key={comment._id}>
                        <div className='locationTitle mx-3 mt-3'>
                          {hasNameProperty(comment.location_id) && comment.location_id.name}
                          <div className='underlining'></div>
                        </div>
                        <CommentsBlock
                          comment={comment}
                          authorIdOfComment={
                            isString(comment.user_id) ? comment.user_id : comment.user_id._id
                          }
                        />
                      </Fragment>
                    );
                  })}

                <IonItem className='item--card-background' lines='none'>
                  <IonIcon
                    className={showFlavors ? 'icon--rotate90Forward' : 'icon--rotate90Back'}
                    slot='start'
                    color='primary'
                    icon={iceCreamOutline}
                    onClick={() => setShowFlavors((prev) => !prev)}
                  />
                  <IonLabel>Meine Eissorten</IonLabel>
                  <div>
                    <IonIcon
                      className='info-icon'
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
                    <div className='info-popover__content'>Angaben aus deinen Bewertungen</div>
                  </IonPopover>
                </IonItem>

                {showFlavors && user.favorite_flavors.length > 0 && (
                  <FlavorsList flavorsList={user.favorite_flavors} />
                )}
              </IonItemGroup>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    )
  );
};

export default Profil;
