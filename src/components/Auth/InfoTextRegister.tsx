import { VFC } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline, keyOutline } from 'ionicons/icons';
import { FieldError } from 'react-hook-form';

type Props = {
  passwordErrors: FieldError | undefined;
};

const InfoTextRegister: VFC<Props> = ({ passwordErrors }) => {
  return (
    <>
      <IonItem lines='full'>
        <IonLabel className='text-center ion-text-wrap'>Hinweise zur Wahl des Passworts</IonLabel>
      </IonItem>
      <IonItem lines='inset' className='item-text--small'>
        <IonLabel>mindestens eine Ziffer [0-9]</IonLabel>
        {passwordErrors?.types?.number ? (
          <IonIcon color='danger' icon={closeCircleOutline} />
        ) : (
          <IonIcon color='success' icon={checkmarkCircleOutline} />
        )}
      </IonItem>
      <IonItem lines='inset' className='item-text--small'>
        <IonLabel>mindestens einen kleinen Buchstaben [a-z]</IonLabel>
        {passwordErrors?.types?.lowerCase ? (
          <IonIcon color='danger' icon={closeCircleOutline} />
        ) : (
          <IonIcon color='success' icon={checkmarkCircleOutline} />
        )}
      </IonItem>
      <IonItem lines='inset' className='item-text--small'>
        <IonLabel>mindestens einen großen Buchstaben [A-Z]</IonLabel>
        {passwordErrors?.types?.upperCase ? (
          <IonIcon color='danger' icon={closeCircleOutline} />
        ) : (
          <IonIcon color='success' icon={checkmarkCircleOutline} />
        )}
      </IonItem>
      <IonItem lines='full' className='item-text--small'>
        <IonLabel>mindestens 6 Stellen lang, maximal 32</IonLabel>
        {passwordErrors?.types?.length ? (
          <IonIcon color='danger' icon={closeCircleOutline} />
        ) : (
          <IonIcon color='success' icon={checkmarkCircleOutline} />
        )}
      </IonItem>
      <IonItem
        lines='none'
        className='item--card-background text--small-grey text-center py-2 mb-3'
      >
        Dein Passwort wird verschlüsselt in der Datenbank gespeichert und ist für niemanden
        einzusehen. Nach der Registrierung kannst du neue Eisläden eintragen, bewerten und zu deinen
        Favoriten hinzufügen.
      </IonItem>
      <p className='text--small-light text-center'>
        Hier findest du die Datenschutzhinweise, denen du mit der Registrierung zustimmst
      </p>
      <IonButton
        fill='clear'
        className='button--check button--check-light button--check-large my-3 mx-5'
        routerLink='/datenschutz'
        expand='block'
      >
        <IonIcon className='pe-1' icon={keyOutline} />
        <IonLabel>Datenschutz</IonLabel>
      </IonButton>
    </>
  );
};

export default InfoTextRegister;
