import { VFC } from 'react';
// Redux Store
import { useAppDispatch } from '../store/hooks';
import { showActions } from '../store/showSlice';
// Context
import { useThemeContext } from '../context/ThemeContext';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
} from '@ionic/react';
import { bulb, closeCircleOutline, helpCircle } from 'ionicons/icons';

const logoHTML5 = '/assets/logos/logo-HTML5.svg';
const logoCSS3 = '/assets/logos/logo-CSS3.svg';
const logoJavaScript = '/assets/logos/logo-javascript.svg';
const logoTypeScript = '/assets/logos/logo-typescript.svg';
const logoReact = '/assets/logos/logo-react.svg';
const logoIonic = '/assets/logos/logo-ionic.svg';
const logoNodejs = '/assets/logos/logo-nodejs.svg';
const logoMongoDB = '/assets/logos/logo-mongodb.svg';
const logoIllustrator = '/assets/logos/logo-adobe-illustrator.svg';

const usedTechStack = [
  { tech: 'HTML5', icon: logoHTML5 },
  { tech: 'CSS und Bootstrap 5', icon: logoCSS3 },
  { tech: 'JavaScript', icon: logoJavaScript },
  { tech: 'TypeScript', icon: logoTypeScript },
  { tech: 'React', icon: logoReact },
  { tech: 'Ionic', icon: logoIonic },
  { tech: 'NodeJS mit Express', icon: logoNodejs },
  { tech: 'MongoDB mit Mongoose', icon: logoMongoDB },
  { tech: 'Adobe Illustrator', icon: logoIllustrator },
];

const About: VFC = () => {
  const dispatch = useAppDispatch();
  const { isDarkTheme } = useThemeContext();

  return (
    <IonPage>
      <IonHeader>
        <IonItem color='background-color' lines='none'>
          <IonLabel color='primary'>About</IonLabel>
          <IonButton
            slot='end'
            fill='clear'
            onClick={() => dispatch(showActions.setShowAbout(false))}
          >
            <IonIcon icon={closeCircleOutline} />
          </IonButton>
        </IonItem>
        <img
          className='header-image--map'
          src={`${
            isDarkTheme ? './assets/header-about-dark.svg' : './assets/header-about-light.svg'
          }`}
          alt=''
        />
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Über die App</IonCardTitle>
          </IonCardHeader>
          <IonItem lines='none'>
            <IonIcon icon={helpCircle} slot='start' />
            <IonLabel className='ion-text-wrap'>... warum diese App?</IonLabel>
          </IonItem>
          <IonCardContent>
            <p className='my-2'>
              Regelmäßig - und nicht nur im Sommer - begebe ich mich auf die Suche nach veganem Eis.
              Egal an welchem Ort ich mich befinde. Ich liebe veganes Eis. Damit meine ich aber
              nicht dieses von manchen Eisläden einfach als 'vegan' bezeichnete
              Sorbet-Wasser-Gemisch.
            </p>
            <p className='mb-2'>
              Nein: Ich mag richtig cremiges veganes Eis - allein mit gefrorenem Wasser lasse ich
              mich nur ungern abspeisen.
            </p>
            <p className='mb-2'>
              Doch die Suche war für mich immer beschwerlich. Ich musste mich durch Google mit
              allerlei Suchbegriffen quälen. Auch auf Google Maps stellten sich viele vegane
              Eis-"Fundstellen" als unzutreffend heraus.
            </p>
            <p className='mb-2'>
              Dies gab mir den Impuls, eine eigene Plattform aufzubauen, auf der veganes Eis
              gefunden, eingetragen und bewertet werden kann.
            </p>
            <p className='mb-2'>
              Natürlich seid ihr eingeladen, alle möglichen Eisläden eintragen - aber neben der
              Qualität des Eises soll auch stets das vegane Angebot bewertet werden.
            </p>
            <p className='mb-2'>Macht mit und genießt das Eis!</p>
          </IonCardContent>

          <IonItem lines='none'>
            <IonLabel className='ion-text-wrap'>
              ... genutzte Sprachen, Frameworks, Libraries und Tools
            </IonLabel>
          </IonItem>

          <IonList>
            {usedTechStack.map((item) => (
              <IonItem key={item.tech}>
                <IonLabel color='primary' className='ion-text-wrap'>
                  {item.tech}
                </IonLabel>
                <IonIcon color='primary' slot='start' icon={item.icon} />
              </IonItem>
            ))}
          </IonList>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Über mich</IonCardTitle>
          </IonCardHeader>
          <IonItem lines='none'>
            <IonIcon icon={bulb} slot='start' />
            <IonLabel className='ion-text-wrap'>... ein persönlicher Gedanke</IonLabel>
          </IonItem>
          <IonCardContent>
            <p className='my-2'>
              Seit vielen Jahren beschäftige ich mich mit Nachhaltigkeit und versuche, in meinem
              eigenen Leben kleine Schritte nach vorne zu gehen, um meinen ökologischen Fußabdruck
              möglichst klein zu halten.
            </p>
            <p className='mb-2'>
              Aber zugleich bin ich auch nur ein Mensch und als solcher möchte ich das Leben
              genießen.
            </p>
            <p className='mb-2'>
              Ich bin ich davon überzeugt, dass absoluter Verzicht und Trübsal auf dem Weg zu einer
              anderen Welt uns ebenso wenig ans Ziel bringen wie die ausschließliche Fixierung auf
              Wirtschaftswachstum und Effizienzstrategien - über das richtige Maß und eine globale
              Perspektive nachzudenken dagegen schon eher.
            </p>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Impressum</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Michael Flohr</p>
            <p className='mb-2'>Ehrenfelsstraße 13, 10318 Berlin</p>
            <p>Telefonnummer: +49 1577 536 22 85</p>
            <p className='mb-2'>E-Mail: matchu.pitchu.wbs@gmail.com</p>
            <p>Umsatzsteuer-Identifikationsnummer:</p>
            <p className='mb-2'>Ich bin gemäß §19 UStG nicht umsatzsteuerpflichtig.</p>
            <p>V.i.S.d § 55 Abs. 2 RStV:</p>
            <p>Michael Flohr</p>
            <p>Ehrenfelsstraße 13, 10318 Berlin</p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default About;
