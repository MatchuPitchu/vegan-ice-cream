import { IonContent, IonHeader, IonPage } from '@ionic/react';
import { FC } from 'react';
import { useThemeContext } from '../../context/ThemeContext';

interface Props {
  showIonHeader?: boolean;
  showIonContent?: boolean;
  srcHeaderImageLigth?: string;
  srcHeaderImageDark?: string;
}

const PageWrapper: FC<Props> = ({
  showIonHeader = true,
  showIonContent = true,
  srcHeaderImageLigth,
  srcHeaderImageDark,
  children,
}) => {
  const { isDarkTheme } = useThemeContext();

  return (
    <IonPage>
      {showIonHeader && (
        <IonHeader>
          <img
            className='header-image--map'
            src={`${isDarkTheme ? srcHeaderImageDark : srcHeaderImageLigth}`}
            alt='header'
          />
        </IonHeader>
      )}
      {showIonContent ? <IonContent>{children}</IonContent> : <>{children}</>}
    </IonPage>
  );
};

export default PageWrapper;
