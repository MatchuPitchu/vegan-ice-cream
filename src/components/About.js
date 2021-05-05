import { useContext } from 'react';
import { Context } from "../context/Context";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { bulb, closeCircleOutline, codeWorking, helpCircle, logoCss3, logoHtml5, logoIonic, logoJavascript, logoNodejs, logoReact, mail } from 'ionicons/icons';

const About = () => {
  const { setShowAbout, toggle } = useContext(Context);

  return (
    <IonPage>
      <IonItem lines="none">
        <IonLabel color="primary">About</IonLabel>
        <IonButton slot="end" fill="clear" onClick={() => setShowAbout(false)}><IonIcon icon={closeCircleOutline}/></IonButton>
      </IonItem>
      <img className="headerMap" src={`${toggle ? "./assets/map-header-graphic-ice-dark.svg" : "./assets/map-header-graphic-ice-light.svg"}`} />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Über die App</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
          <IonItem lines="none">
            <IonIcon icon={helpCircle} slot="start" />
            <IonLabel>... warum diese App?</IonLabel>
          </IonItem>
            <p className="mb-2">
              Regelmäßige - und nicht nur im Sommer - begebe ich mich auf die Suche nach veganem Eis. 
              Egal an welchem Ort ich mich befinde. Ich liebe veganes Eis. Damit meine ich aber nicht 
              dieses von manchen Eisläden einfach als 'vegan' bezeichnete Sorbet-Wasser-Gemisch.
            </p>
            <p className="mb-2">
              Nein: Ich möchte richtiges veganes Eis und mich nicht nur mit diesem gefrorenen Wasser abspeisen lassen.
            </p>
            <p className="mb-2">
              Doch die Suche war für mich immer beschwerlich. Ich musste mich durch Google mit allerlei Suchbegriffen quälen.
              Auch auf Google Maps stellten sich viele vegane Eis-"Fundstellen" als falsch heraus.
            </p>
            <p className="mb-2">
              Dies war der Anstoß, eine eigene Plattform aufzubauen, auf der veganes Eis gefunden, eingetragen und bewertet werden kann.
            </p>
            <p className="mb-2">Macht mit und genießt das Eis!</p> 
          </IonCardContent>
          <IonItem lines="full">
            <IonLabel className="ion-text-wrap">... genutzte Sprachen, Frameworks und Libraries</IonLabel>
          </IonItem>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel color="secondary">HTML5</IonLabel>
                <IonIcon color="primary" slot="start" icon={logoHtml5} />
              </IonItem>
              <IonItem>
                <IonLabel color="secondary">CSS und Bootstrap 5</IonLabel>
                <IonIcon color="primary" slot="start" icon={logoCss3} />
              </IonItem>
              <IonItem>
                <IonLabel color="secondary">JavaScript</IonLabel>
                <IonIcon color="primary" slot="start" icon={logoJavascript} />
              </IonItem>
              <IonItem>
                <IonLabel color="secondary">ReactJS</IonLabel>
                <IonIcon color="primary" slot="start" icon={logoReact} />
              </IonItem>
              <IonItem>
                <IonLabel color="secondary">Ionic</IonLabel>
                <IonIcon color="primary" slot="start" icon={logoIonic} />
              </IonItem>
              <IonItem>
                <IonLabel color="secondary">NodeJS mit Express</IonLabel>
                <IonIcon color="primary" slot="start" icon={logoNodejs} />
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Über mich</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="none">
            <IonIcon icon={bulb} slot="start" />
            <IonLabel>... ein persönlicher Gedanke</IonLabel>
          </IonItem>
            <p className="mb-2">
              Seit vielen Jahren beschäftige ich mich mit Nachhaltigkeit und versuche, in meinem eigenen Leben kleine Schritte nach vorne zu gehen, 
              um meinen ökologischen Fußabdruck auf diesem Planeten möglichst klein zu halten.
            </p>
            <p className="mb-2">
              Aber zugleich bin ich auch nur ein Mensch und als solcher möchte ich das Leben genießen. 
            </p>
            <p className="mb-2">
              Ich bin ich davon überzeugt, dass absoluter Verzicht und Trübsal auf dem Weg zu einer anderen Welt uns ebenso wenig ans Ziel bringen 
              wie die ausschließliche Fixierung auf Wirtschaftswachstum und Effizienzstrategien - über das richtige Maß und eine globale Perspektive nachzudenken dagegen schon eher.
            </p>
          </IonCardContent>
        </IonCard>       
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Impressum</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Michael Flohr</p>
            <p className="mb-2">Ehrenfelsstraße 13, 10318 Berlin</p>
            <p>Telefonnummer: +49 1577 536 22 85</p>
            <p className="mb-2">E-Mail: matchu.pitchu.wbs@gmail.com</p>
            <p>Umsatzsteuer-Identifikationsnummer:</p>
            <p className="mb-2">Ich bin gemäß §19 UStG nicht umsatzsteuerpflichtig.</p>
            <p>V.i.S.d § 55 Abs. 2 RStV:</p>
            <p>Michael Flohr</p>
            <p>Ehrenfelsstraße 13, 10318 Berlin</p>
          </IonCardContent>
        </IonCard>       
      </IonContent>
    </IonPage>
  );
};

export default About