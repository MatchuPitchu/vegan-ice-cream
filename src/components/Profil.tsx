import { Fragment, useReducer, VFC } from 'react';
// Redux Store
import { useAppSelector } from '../store/hooks';
// Context
import { useThemeContext } from '../context/ThemeContext';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonCard,
  IonCardTitle,
  IonIcon,
  IonLabel,
  IonItem,
  IonItemGroup,
} from '@ionic/react';
import {
  caretForwardCircleOutline,
  closeCircleOutline,
  iceCreamOutline,
  mailOutline,
  navigateOutline,
  refreshCircleOutline,
} from 'ionicons/icons';
import ProfilUpdate from './ProfilUpdate';
import Spinner from './Spinner';
import CommentsBlock from './Comments/CommentsBlock';
import FlavorsList from './Comments/FlavorsList';
import { hasNameProperty, isString } from '../types/typeguards';
import Popover from './Popover';

interface Props {
  onCloseProfil: () => void;
}

const Profil: VFC<Props> = ({ onCloseProfil }) => {
  const { isAuth, user } = useAppSelector((state) => state.user);
  const { successMessage } = useAppSelector((state) => state.app);
  const { locations } = useAppSelector((state) => state.locations);

  const { isDarkTheme } = useThemeContext();

  const [showUpdateProfil, toggleUpdateProfil] = useReducer((prevShow) => !prevShow, false);
  const [showUserComments, toggleComments] = useReducer((prevShow) => !prevShow, false);
  const [showFlavors, toggleFlavors] = useReducer((prevShow) => !prevShow, false);

  if (!isAuth && !user && !locations) return <Spinner />;

  return (
    user && (
      <>
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

              {successMessage && (
                <IonItem className='text--success text-center' lines='full'>
                  {successMessage}
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
                <Popover>
                  <div className='info-popover__content'>
                    Dieser Ort wird dir immer beim Öffnen der Karte angezeigt.
                  </div>
                </Popover>
              </IonItem>
              <IonItemGroup>
                <IonItem
                  className='item--card-background'
                  lines={!showUserComments ? 'full' : 'none'}
                >
                  <IonIcon
                    slot='start'
                    color='primary'
                    className={showUserComments ? 'icon--rotate90Forward' : 'icon--rotateBack'}
                    icon={caretForwardCircleOutline}
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
                    className={showFlavors ? 'icon--rotateForward' : 'icon--rotateBack'}
                    slot='start'
                    color='primary'
                    icon={iceCreamOutline}
                    onClick={toggleFlavors}
                  />
                  <IonLabel>Meine Eissorten</IonLabel>
                  <Popover>
                    <div className='info-popover__content'>Alle von dir bewerteten Eissorten</div>
                  </Popover>
                </IonItem>

                {showFlavors && user.favorite_flavors.length > 0 && (
                  <FlavorsList flavorsList={user.favorite_flavors} />
                )}
              </IonItemGroup>
            </IonCard>
          </div>
        </IonContent>
      </>
    )
  );
};

export default Profil;
