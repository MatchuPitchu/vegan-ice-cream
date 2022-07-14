import { VFC } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  isPlatform,
} from '@ionic/react';
import { helpCircle } from 'ionicons/icons';
import PageWrapper from '../components/PageUtils/PageWrapper';

const Datenschutz: VFC = () => (
  <PageWrapper showIonHeader={false}>
    <IonCard className={`${isPlatform('desktop') ? 'card--ionic' : ''}`}>
      <IonCardHeader>
        <IonCardTitle style={{ fontSize: '1.2rem' }}>Datenschutzerklärung</IonCardTitle>
      </IonCardHeader>
      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Persönlich Vorbemerkung</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Ich habe die Datenschutzerklärung nach bestem Wissen und Gewissen mit einem mir online zur
          Verfügung stehenden Generator erstellt und leicht an meine App angepasst.
        </p>
        <p className='mb-2'>
          Die Vegan Ice Cream App "Eis mit Stil" ist ein <strong>nicht-kommerzielles</strong>{' '}
          Herzensprojekt von mir. Grundsätzliche Kriterien waren für mich:
        </p>
        <ul>
          <li>
            <strong>Datensparsamkeit:</strong> Ich habe kein Interesse an Ihren persönlichen Daten
            und erfasse Sie nur wirklich dort wie bei der Registrierung, wo es mir geboten scheint,
            um Missbrauch wie z.B. bewusst falsche Bewertungen und Eingaben von Eisläden
            vorzubeugen.
          </li>
          <li>
            <strong>Nutzungsfreundlichkeit:</strong> Wir leben in einer Welt, wo verschiedene
            Dienste im Internet die Nutzung von Websites und Apps deutlich erleichtern. Die
            besonders attraktiv für die Nutzung oder kostenfrei erscheinenden Dienste sind jedoch
            zumeist damit verbunden, dass diese Unternehmen Daten erfassen und kommerzialisieren. So
            nutzen wir verschiedene wie z.B. Google Maps Dienste (Map, Autocomplete-Funktion,
            Geolocation, Places ID), Google Fonts, MongoDB (Datenbank), netlify (Hosting Web App),
            Google Playstore (Verteilung Android App), damit Sie angenehm diese App nutzen können.
          </li>
        </ul>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Offizielle Vorbemerkung</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Mit dieser Datenschutzerklärung möchten wir Sie über Art, Umfang und Zweck der
          Verarbeitung von personenbezogenen Daten (im Folgenden auch nur als "Daten" bezeichnet)
          aufklären. Personenbezogene Daten sind alle Daten, die einen persönlichen Bezug zu Ihnen
          aufweisen, z. B. Name, Adresse, E-Mail-Adresse oder Ihr Nutzerverhalten. Die
          Datenschutzerklärung gilt für alle von uns vorgenommene Daten-Verarbeitungsvorgänge sowohl
          im Rahmen unserer Kerntätigkeit als auch für die von uns vorgehaltenen Online-Medien.
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Verantworlich für die Datenverarbeitung</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Michael Flohr
          <br />
          Ehrenfelsstraße 13
          <br />
          10318 Berlin
          <br />
          Deutschland
          <br />
          matchu.pitchu.wbs@gmail.com
          <br />
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Ihre Rechte nach der DSGVO</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Nach der DSGVO stehen Ihnen die nachfolgend aufgeführten Rechte zu, die Sie jederzeit bei
          dem oben dieser Datenschutzerklärung genannten Verantwortlichen geltend machen können:
        </p>
        <ul>
          <li>
            <strong>Recht auf Auskunft:</strong> Sie haben das Recht, von uns Auskunft darüber zu
            verlangen, ob und welche Daten wir von Ihnen verarbeiten.
          </li>
          <li>
            <strong>Recht auf Berichtigung:</strong> Sie haben das Recht, die Berichtigung
            unrichtiger oder Vervollständigung unvollständiger Daten zu verlangen.
          </li>
          <li>
            <strong>Recht auf Löschung:</strong> Sie haben das Recht, die Löschung Ihrer Daten zu
            verlangen.
          </li>
          <li>
            <strong>Recht auf Einschränkung:</strong> Sie haben in bestimmten Fällen das Recht zu
            verlangen, dass wir Ihre Daten nur noch eingeschränkt bearbeiten.
          </li>
          <li>
            <strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht zu verlangen, dass
            wir Ihnen oder einem anderen Verantwortlichen Ihre Daten in einem strukturierten,
            gängigen und maschinenlesebaren Format übermitteln.
          </li>
          <li>
            <strong>Beschwerderecht</strong>: Sie haben das Recht, sich bei einer Aufsichtsbehörde
            zu beschweren. Zuständig ist die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes, Ihres
            Arbeitsplatzes oder unseres Firmensitzes.
          </li>
        </ul>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Widerrufsrecht</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Sie haben das Recht, die von Ihnen erteilte Einwilligung zur Datenverarbeitung jederzeit
          zu widerrufen.
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Widerspruchsrecht</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Sie haben das Recht, die von Ihnen erteilte Einwilligung zur Datenverarbeitung jederzeit
          zu widerrufen.
        </p>
        <p className='mb-2'>
          Sie haben das Recht, jederzeit gegen die Verarbeitung Ihrer Daten, die wir auf unser
          berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO stützen, Widerspruch einzulegen.
          Sofern Sie von Ihrem Widerspruchsrecht Gebrauch machen, bitten wir Sie um die Darlegung
          der Gründe. Wir werden Ihre personenbezogenen Daten dann nicht mehr verarbeiten, es sei
          denn, wir können Ihnen gegenüber nachweisen, dass zwingende schutzwürdige Gründe an der
          Datenverarbeitung Ihre Interessen und Rechte überwiegen.
        </p>
        <p className='mb-2'>
          <span>
            <strong>
              Unabhängig vom vorstehend Gesagten, haben Sie das jederzeitige Recht, der Verarbeitung
              Ihrer personenbezogenen Daten für Zwecke der Werbung und Datenanalyse zu
              widersprechen.
            </strong>
          </span>
        </p>
        <p className='mb-2'>
          Ihren Widerspruch richten Sie bitte an die oben angegebene Kontaktadresse des
          Verantwortlichen.
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Wann löschen wir Ihre Daten?</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Wir löschen Ihre Daten dann, wenn wir diese nicht mehr brauchen oder Sie uns dies mit
          einer E-Mail an matchu.pitchu.wbs@gmail.de vorgeben. Dass bedeutet, dass - sofern sich aus
          den einzelnen Datenschutzhinweisen dieser Datenschutzerklärung nichts anderes ergibt - wir
          Ihre Daten löschen,
        </p>
        <ul>
          <li>
            wenn der Zweck der Datenverarbeitung weggefallen ist und damit die jeweilige in den
            einzelnen Datenschutzhinweisen genannte Rechtsgrundlage nicht mehr besteht, also bspw.
            <ul>
              <li>
                nach Beendigung der zwischen uns bestehenden vertraglichen oder mitgliedschaftlichen
                Beziehungen (Art. 6 Abs. 1 lit. a DSGVO) oder
              </li>
              <li>
                nach Wegfall unseres berechtigten Interesses an der weiteren Verarbeitung oder
                Speicherung Ihrer Daten (Art. 6 Abs. 1 lit. f DSGVO),
              </li>
            </ul>
          </li>
          <li>
            wenn Sie von Ihrem Widerrufsrecht Gebrauch machen und keine anderweitige gesetzliche
            Rechtsgrundlage für die Verarbeitung im Sinne von Art. 6 Abs. 1 lit. b-f DSGVO
            eingreift,
          </li>
          <li>
            wenn Sie vom Ihrem Widerspruchsrecht Gebrauch machen und der Löschung keine zwingenden
            schutzwürdigen Gründe entgegenstehen.
          </li>
        </ul>
        <p className='mb-2'>
          Sofern wir (bestimmte Teile) Ihre(r) Daten jedoch noch für andere Zwecke vorhalten müssen,
          weil dies etwa steuerliche Aufbewahrungsfristen (in der Regel 6 Jahre für
          Geschäftskorrespondenz bzw. 10 Jahre für Buchungsbelege) oder die Geltendmachung, Ausübung
          oder Verteidigung von Rechtsansprüchen aus vertraglichen Beziehungen (bis zu vier Jahren)
          erforderlich machen oder die Daten zum Schutz der Rechte einer anderen natürlichen oder
          juristischen Person gebraucht werden, löschen wir (den Teil) Ihre(r) Daten erst nach
          Ablauf dieser Fristen. Bis zum Ablauf dieser Fristen beschränken wir die Verarbeitung
          dieser Daten jedoch auf diese Zwecke (Erfüllung der Aufbewahrungspflichten).
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Clouddienste</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>Wir nutzen Clouddienste insbesondere</p>
        <ul>
          <li>zur Speicherung und Bearbeitung von Dokumenten,</li>
          <li>
            zum Versenden von Dokumenten per E-Mail bzw. zum Austausch von Dateien jeglicher Art,
          </li>
          <li>für unsere kalendarische Terminverwaltung,</li>
          <li>zur Vorbereitung und Ausführung von Präsentationen und Tabellenkalkulationen,</li>
          <li>zur Veröffentlichung von Dateien jeglicher Art,</li>
          <li>
            für die interne und externe Kommunikation mittels Chats, Audio- und Videokonferenzen.
          </li>
        </ul>
        <p className='mb-2'>
          Die Softwareanwendungen, die wir zu diesen Zwecken einsetzen, stellen uns der/die unten
          genannten Anbieter auf deren Servern zur Verfügung. Auf diese Server greifen wir über das
          Internet zu. Soweit Sie uns Ihre Daten im Rahmen der Kommunikation mit uns bzw. in
          anderweitigen von uns mittels dieser Datenschutzerklärung erläuterten Vorgängen
          übermitteln, verarbeiten wir diese Daten in dem von uns genutzten Clouddienst. Das
          bedeutet, dass Ihre Daten auf den Servern des Clouddient-Drittanbieters gespeichert
          werden. Die Drittanbieter verarbeiten zur Sicherung ihrer Server sowie zur Optimierung
          ihrer Dienstleistungen Nutzungs- und Metadaten. Wir verarbeiten und speichern insbesondere
          Ihre Kontakt-, Kunden- und Vertragsdaten.
        </p>
        <p className='mb-2'>
          Sollten wir mittels des von uns genutzten Clouddienstes Dateien jeglicher Art öffentlich
          über unsere Interenetpräsenz zur Verfügung stellen, kann der jeweilige Drittanbieter des
          Clouddienstes Cookies auf Ihrem Computersystem speichern, sofern Sie auf diese Dateien
          zugreifen. Der Dienstanbieter kann die so erhobenen Daten verarbeiten, um Ihr
          Nutzungsverhalten bzw. Ihre Browser-Einstellungen zu analysieren.
          <br />
          <br />
          Wir weisen darauf hin, dass je nach Sitzland des nachstehend genannten Diensteanbieters
          die nachfolgend näher benannten Daten auf Server außerhalb des Raumes der Europäischen
          Union übertragen und verarbeitet werden können. Es besteht in diesem Fall das Risiko, dass
          das von der DSGVO vorgeschriebene Datenschutzniveau nicht eingehalten und die Durchsetzung
          Ihrer Rechte nicht oder nur erschwert erfolgen kann. Sofern der von uns eingesetzte
          Diensteanbieter das Verarbeiten der Daten ausschließlich innerhalb der EU anbietet,
          beabsichtigen wir - sofern derzeit ohnehin nicht bereits umgesetzt - Ihre Daten
          ausschließlich dort zu verarbeiten.
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Betroffene Daten</IonLabel>
      </IonItem>
      <IonCardContent>
        <ul>
          <li>
            Bestandsdaten (Name, Stadtname) - den Namen und der Stadtname in Ihrem Profil können Sie
            frei wählen; sie müssen nicht der Wahrheit entsprechen
          </li>
          <li>
            Kontaktdaten (E-Mail-Adressen) - Ihre Mailadresse wird im Rahmen der Registrierung über
            eine Bestätigungsmail verifiziert
          </li>
          <li>
            Inhaltsdaten (bspw. Text, Fotos) - Ihre Eintragungen und Bewertungen von Eisläden als
            eingeloggter User sowie Ihre persönliche Favoritenliste von Eisläden
          </li>
          <li>
            Nutzungsdaten (bspw. Zeiten der Zugriffe, besuchte Internetpräsenzen, Interesse an
            Inhalten),
          </li>
          <li>Metadaten (bspw. IP-Adresse, Computersystem-Informationen)</li>
        </ul>
        <p className='mb-2'>
          <strong>Betroffene Personen:</strong> Interessenten, Kommunikationspartner, Kunden,
          Beschäftigte (bspw. Bewerber, aktuelle und ehemalige Mitarbeiter)
        </p>
        <p className='mb-2'>
          <strong>Verarbeitungszweck: </strong>Organisation der Büro- und Administrationsaufgaben
        </p>
        <p className='mb-2'>
          <strong>Rechtsgrundlage:</strong> Einwilligung, Art. 6 Abs. 1 lit. a DSGVO,
          Vertragserfüllung und vorvertragliche Anfragen, Art. 6 Abs. 1 lit. b DSGVO, berechtigtes
          Interesse, Art. 6 Abs. 1 lit. f DSGVO
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Eingesetze Cloud-Dienstleister</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          <strong>Webhosting</strong>
        </p>
        <p className='mb-2'>
          Wir bedienen uns zum Vorhalten unserer Internetseiten eines Anbieters, auf dessen Server
          unsere Internetseiten gespeichert und für den Abruf im Internet verfügbar gemacht werden
          (Hosting). Hierbei können von dem Anbieter all diejenigen über den von Ihnen genutzten
          Browser übertragenen Daten verarbeitet werden, die bei der Nutzung unserer Internetseiten
          anfallen. Hierzu gehören insbesondere Ihre IP-Adresse, die der Anbieter benötigt, um unser
          Online-Angebot an den von Ihnen genutzten Browser ausliefern zu können sowie sämtliche von
          Ihnen über unsere Internetseite getätigten Eingaben. Daneben kann der von uns genutzte
          Anbieter&nbsp;&nbsp;
        </p>
        <ul>
          <li>das Datum und die Uhrzeit des Zugriffs auf unsere Internetseite</li>
          <li>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</li>
          <li>Zugriffsstatus (HTTP-Status)</li>
          <li>die übertragene Datenmenge</li>
          <li>der Internet-Service-Provider des zugreifenden Systems</li>
          <li>der von Ihnen verwendete Browsertyp und dessen Version</li>
          <li>das von Ihnen verwendete Betriebssystem</li>
          <li>
            die Internetseite, von welcher Sie gegebenenfalls auf unsere Internetseite gelangt sind
          </li>
          <li>die Seiten bzw. Unterseiten, welche Sie auf unserer Internetseite besuchen.</li>
        </ul>
        <p className='mb-2'>
          erheben. Die vorgenannten Daten werden als Logfiles auf den Servern unseres Anbieters
          gespeichert. Dies ist erforderlich, um die Stabilität und Sicherheit des Betriebs unserer
          Internetseite zu gewährleisten.
        </p>
        <p className='mb-2'>
          <strong>Betroffene Daten:</strong>
        </p>
        <ul>
          <li>Inhaltsdaten (bspw. Posts, Fotos, Videos)</li>
          <li>Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)</li>
          <li>Kommunikationsdaten (bspw. Informationen über das genutzte Gerät, IP-Adresse)</li>
        </ul>
        <p className='mb-2'>
          <strong>Betroffene Personen: </strong>Nutzer:innen unserer Internetpräsenz
        </p>
        <p className='mb-2'>
          <strong>Verarbeitungszweck: </strong>Ausspielen unserer Internetseiten, Gewährleistung des
          Betriebs unserer Internetseiten
        </p>
        <p className='mb-2'>
          <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO
        </p>
        <p className='mb-2'>
          <strong>
            Von uns beauftragte(r) Webhoster: netlify für https://eis-mit-stil.netlify.app und
            Google Playstore für die Android App
            https://play.google.com/store/apps/details?id=eismitstil.app
          </strong>
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Eingesetze Cloud-Dienstleister</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          <strong>netlify</strong>
        </p>
        <p className='mb-2'>
          Dienstanbieter: netlify
          <br />
          Internetseite: San Francisco, USA
          <br />
          Datenschutzerklärung:{' '}
          <a href='https://www.netlify.com/privacy' target='_blank' rel='noopener noreferrer'>
            https://www.netlify.com/privacy
          </a>
        </p>
        <p className='mb-2'>
          <strong>MongoDB</strong>
        </p>
        <p className='mb-2'>
          Dienstanbieter: MongoDB Inc.
          <br />
          MongoDB is ein globales Unternehmen, dass einen Cloud-Service für Datenbanken zur
          Verfügung stellt, und seine US-Zentrale in New York City und seine internationale Zentrale
          in Dublin hat.
          <br />
          Datenschutzerklärung:{' '}
          <a
            href='https://www.mongodb.com/legal/privacy-policy'
            target='_blank'
            rel='noopener noreferrer'
          >
            https://www.mongodb.com/legal/privacy-policy
          </a>
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Content-Delivery-Network</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Wir benutzen zum Ausspielen unserer Internetseiten ein Content-Delivery-Network (CDN). Ein
          CDN ist ein Netz regional verteilter und über das Internet verbundener Server. Über das
          CDN werden skalierende Speicher- und Auslieferungskapazitäten zur Verfügung gestellt.
          Hierdurch werden die Ladezeiten unserer Internetseiten optimiert und auch bei großen
          Lastspitzen ein optimaler Datendurchsatz gewährleistet. Nutzeranfragen auf unseren
          Internetseiten werden über Server des CDN geleitet. Aus diesen Datenströmen werden
          Statistiken erstellt. Dies dient zum einen dazu, potentielle Bedrohungen für unsere
          Internetseiten durch Schadsoftware frühzeitig zu erkennen und zum anderen unser Angebot
          stetig zu verbessern und unsere Internetseiten für Sie als Nutzer nutzerfreundlicher
          auszugestalten.
        </p>
        <p className='mb-2'>
          Wir möchten Sie darauf hinweisen, dass je nach Sitzland des unten genannten
          Diensteanbieters die über den Dienst erfassten Daten außerhalb des Raumes der Europäischen
          Union übertragen und verarbeitet werden können. Es besteht in diesem Fall das Risiko, dass
          das von der DSGVO vorgeschriebene Datenschutzniveau nicht eingehalten und die Durchsetzung
          Ihrer Rechte nicht oder nur erschwert erfolgen kann.
        </p>
        <p className='mb-2'>
          <strong>Betroffene Daten:</strong>
        </p>
        <ul>
          <li>Inhaltsdaten (bspw. Bewertungen, Posts, Fotos)</li>
          <li>Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)</li>
          <li>Kommunikationsdaten (bspw. Informationen über das genutzte Gerät, IP-Adresse)</li>
        </ul>
        <p className='mb-2'>
          <strong>Verarbeitungszweck: </strong>Technische Optimierung der Internetpräsenz, Analyse
          von Fehlern und Nutzerverhalten
        </p>
        <p className='mb-2'>
          <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO
        </p>
        <p className='mb-2'>
          <strong>
            Eingesetze CDN-Dienstleister: Bootstrap 5 CSS-Abruf zum Styling der App
            https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js und
            EmailJS Kontaktformular Provider
            https://cdn.jsdelivr.net/npm/emailjs-com@2/dist/email.min.js
          </strong>
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Kontaktaufnahme</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Soweit Sie uns über E-Mail, Soziale Medien, Telefon, Post, unser Kontaktformular oder
          sonstwie ansprechen und uns hierbei personenbezogene Daten wie Ihren Namen, Ihre
          Telefonnummer oder Ihre E-Mail-Adresse zur Verfügung stellen oder weitere Angaben zur
          Ihrer Person oder Ihrem Anliegen machen, verarbeiten wir diese Daten zur Beantwortung
          Ihrer Anfrage im Rahmen des zwischen uns bestehenden vorvertraglichen oder vertraglichen
          Beziehungen.
        </p>
        <p className='mb-2'>
          <strong>Betroffene Daten:</strong>
        </p>
        <ul>
          <li>Bestandsdaten (bspw. Namen, Adressen)</li>
          <li>Kontakdaten (bspw. E-Mail-Adresse, Telefonnummer, Postanschrift)</li>
          <li>Inhaltsdaten (Texte, Fotos, Videos)</li>
          <li>Vertragsdaten (bspw. Vertragsgegenstand, Vertragsdauer)</li>
        </ul>
        <p className='mb-2'>
          <strong>Betroffene Personen: </strong>Interessenten, Kunden, Geschäfts- und
          Vertragspartner
        </p>
        <p className='mb-2'>
          <strong>Verarbeitungszweck: </strong>Kommunikation sowie Beantwortung von Kontaktanfragen,
          Büro und Organisationsverfahren
        </p>
        <p className='mb-2'>
          <strong>Rechtsgrundlage:</strong> Vertragserfüllung und vorvertragliche Anfragen, Art. 6
          Abs. 1 lit. b DSGVO, berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>
          Angaben zu dem von uns genutzten Drittanbieter
        </IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          <strong>Registrierung, Anmeldung und Nutzerkonto</strong>
        </p>
        <p className='mb-2'>
          Sie haben die Möglichkeit sich auf unserem Online-Medium zu registrieren, um dort ein
          Nutzerkonto anzulegen. Hierzu ist die Angabe personenbezogener Daten notwendig, die sich
          aus der Eingabemaske ergeben. Zu den dort abgefragten Daten gehören insbesondere Ihr Name,
          Ihre E-Mail-Adresse, ggfls. ein Nutzername sowie das Passwort. Diese Daten werden von uns
          gespeichert und verarbeitet, um für Sie ein Nutzerkonto einzurichten und die (wiederholte)
          Anmeldung zu ermöglichen. Die Daten können jederzeit durch Sie geändert oder gelöscht
          werden. Die Daten werden nicht an Dritte weitergegeben außer dies dient der technischen
          und organisatorischen Abwicklung des zwischen uns bestehenden Nutzungsvertrages. Um Sie
          und uns vor missbräuchlichen Registrierungen zu schützen, ist eine E-Mail-Bestätigung
          notwendig, wodurch Ihre Mailadresse als die Ihre bestätigt wird.
        </p>
        <p className='mb-2'>
          <strong>Betroffene Daten:</strong>
        </p>
        <ul>
          <li>
            Bestandsdaten (Name, Stadtname) - den Namen und der Stadtname in Ihrem Profil können Sie
            frei wählen; sie müssen nicht der Wahrheit entsprechen
          </li>
          <li>
            Kontaktdaten (E-Mail-Adressen) - Ihre Mailadresse wird im Rahmen der Registrierung über
            eine Bestätigungsmail verifiziert
          </li>
          <li>
            Inhaltsdaten (bspw. Text, Fotos) - Ihre Eintragungen und Bewertungen von Eisläden als
            eingeloggter User sowie Ihre persönliche Favoritenliste von Eisläden
          </li>
          <li>
            Nutzungsdaten (bspw. Zeiten der Zugriffe, besuchte Internetpräsenzen, Interesse an
            Inhalten),
          </li>
          <li>Metadaten (bspw. IP-Adresse, Computersystem-Informationen)</li>
        </ul>
        <p className='mb-2'>
          <strong>Verarbeitungszweck: </strong>Abwicklung vertraglicher Leistungen, Kommunikation
          sowie Beantwortung von Kontaktanfragen, Sicherheitsmaßnahmen.
        </p>
        <p className='mb-2'>
          <strong>Rechtsgrundlage:</strong> Vertragserfüllung und vorvertragliche Anfragen, Art. 6
          Abs. 1 lit. b DSGVO, rechtliche Verpflichtung, Art. 6 Abs. 1 lit. c DSGVO, berechtigtes
          Interesse, Art. 6 Abs. 1 lit. f DSGVO
        </p>
        <p className='mb-2'>
          <strong>Löschung:</strong> Siehe hierzu den Punkt:{' '}
          <strong>"Wann löschen wir Ihre Daten?"</strong>. Daneben möchten wir Sie darauf aufmerksam
          machen, dass wir die im Rahmen der Registrierung erhobenen Daten sowie die in dem Account
          hinterlegten Inhaltsdaten vorbehaltlich entgegenstehender gesetzlicher
          Aufbewahrungspflichten löschen, sobald Sie Ihren Account löschen. Wir bitten Sie daher,
          sofern Sie auf die in Ihrem Account hinterlegten Inhaltsdaten auch nach der Löschung Ihres
          Account zugreifen wollen oder müssen, diese vor der Löschung des Accounts anderweitig zu
          sichern.
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Ihre Kommentare oder Bewertungen</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Sie haben die Möglichkeit, auf den dafür vorgesehenen Bereichen unserer Internetpräsenz
          Eisläden als eingeloggter User zu bewerten, Ihre Meinung zu äußern oder Content
          einzustellen. Da wir für rechtsverletzende Inhalte Ihres Kommentars (Beleidigung,
          Schmähkritik, Volksverhetzung, verbotene Gewaltdarstellung etc.) unter Umständen selbst in
          Haftung genommen werden können, speichern wir Ihre IP-Adresse für die Dauer von 7 Tagen,
          um gegebenenfalls hierüber Ihre Identität ermitteln zu können.
        </p>
        <p className='mb-2'>
          <strong>Rechtsgrundlage</strong>: Art. 6 Abs. 1 lit. f DSGVO
        </p>
        <p className='mb-2'>
          <strong>Betroffene Daten:</strong>
        </p>
        <ul>
          <li>Bestandsdaten (bspw. Namen, Adressen)</li>
          <li>Inhaltsdaten (bspw. Posts, Fotos, Videos)</li>
          <li>Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)</li>
          <li>Kommunikationsdaten (bspw. Informationen über das genutzte Gerät, IP-Adresse)</li>
        </ul>
        <p className='mb-2'>
          <strong>Verarbeitungszweck: </strong>Leistungserfüllung vertraglicher Verpflichtungen,
          Kommunikation und Abwicklung von Anfragen, Einholen von Feedback, Sicherheitsmaßnahmen.
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Content-Dienste</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Wir nutzen bestimmte Dienste, um über unsere Internetpräsenz bestimmte Inhalte oder
          Grafiken (Videos, Bilder, Musik, Schriftarten, Kartenmaterial) ausspielen zu können. Dabei
          verarbeiten die von uns eingesetzten Dienste die Ihnen zum Zeitpunkt Ihres Besuchs auf
          unseren Internetseiten zugeordnete IP-Adresse, da nur so der jeweilige Inhalt in dem von
          Ihnen verwendeten Browser dargestellt werden kann. Darüber hinaus können die Anbieter
          dieser Dienste weitere Cookies auf Ihr Endgerät setzen, über die Informationen über Ihr
          Nutzungsverhalten, Ihre Interessen, das von Ihnen verwendete Gerät und den verwendeten
          Browser sowie Zeitpunkt und Dauer Ihrer Sitzung erhoben werden. Diese Daten verwenden die
          Anbieter regelmäßig für Analyse-, Statistik- und Marketingzwecke. Zudem können diese
          Informationen können auch mit Informationen aus anderen Quellen verbunden werden. Dies
          gilt insbesondere dann, wenn Sie selbst einen Account bei dem Dienstanbieter unterhalten
          und zum Zeitpunkt der Sitzung dort eingeloggt sind.
        </p>
        <p className='mb-2'>
          Wir weisen darauf hin, dass je nach Sitzland des nachstehend genannten Diensteanbieters
          die nachfolgend näher benannten Daten auf Server außerhalb des Raumes der Europäischen
          Union übertragen und verarbeitet werden können. Es besteht in diesem Fall das Risiko, dass
          das von der DSGVO vorgeschriebene Datenschutzniveau nicht eingehalten und die Durchsetzung
          Ihrer Rechte nicht oder nur erschwert erfolgen kann.
        </p>
        <p className='mb-2'>
          <strong>Betroffene Daten:</strong>
        </p>
        <ul>
          <li>Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)</li>
          <li>Kommunikationsdaten (bspw. Informationen über das genutzte Gerät, IP-Adresse)</li>
        </ul>
        <p className='mb-2'>
          <strong>Betroffene Personen: </strong>Nutzer unserer Internetpräsenz
        </p>
        <p className='mb-2'>
          <strong>Verarbeitungszweck: </strong>Ausspielen unserer Internetseiten, Anbieten von
          Inhalten, Gewährleistung des Betriebs unserer Internetseiten
        </p>
        <p className='mb-2'>
          <strong>Rechtsgrundlage:</strong> Einwilligung über Cookie-Consent-Banner, Art. 6 Abs. 1
          lit. a DSGVO, berechtigte Interessen, Art. 6 Abs. 1 lit. f DSGVO
        </p>
        <p className='mb-2'>
          <strong>Wir nutzen folgende Content-Dienste:</strong>
        </p>

        <p className='mb-2'>
          <strong>Google Maps</strong>
        </p>
        <p className='mb-2'>
          Wir nutzen auf unserer Internetpräsenz Google Maps. Hierbei wird durch Google die
          IP-Adresse des Besuchers erhoben und verarbeitet. Wenn Sie eine Internetseite besuchen,
          auf der Google Maps eingebunden ist, wird unabhängig davon, ob die Nutzung von Google Maps
          tatsächlich erfolgt oder Sie in Ihrem Google Account eingeloggt sind Ihre IP-Adresse sowie
          Ihre Standortdaten (letztere in der Regel nicht ohne Ihre Einwilligung) an Google
          übermittelt. Ihre IP-Adresse wird Ihrem Google Account zugeordnet, sofern Sie bei dem
          Besuch unserer Internetpräsenz dort eingeloggt sind.
        </p>
        <p className='mb-2'>
          Dienstanbieter: Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA
          <br />
          Sitz in der EU: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
          <br />
          Internetseite: <a href='https://www.google.de/maps'>https://www.google.de/maps</a>
          <br />
          Datenschutzerklärung:{' '}
          <a href='https://policies.google.com/privacy'>https://policies.google.com/privacy</a>
          <br />
          <strong>Opt-Out-Möglichkeit:</strong>{' '}
          <a
            href='https://tools.google.com/dlpage/gaoptout?hl=de'
            target='_blank'
            rel='noopener noreferrer'
          >
            https://tools.google.com/dlpage/gaoptout?hl=de
          </a>
        </p>

        <p className='mb-2'>
          <strong>Google Web Fonts</strong>
        </p>
        <p className='mb-2'>
          Mit Google Web Fonts können wir Schriftarten (Web Fonts) in das Design unserer Webseite
          einbinden und diese bei der Darstellung unserer Internetseiten in Ihrem Browser korrekt
          ausgeben. Die Einbindung dieser Web Fonts erfolgt durch einen Serveraufruf bei Google. Von
          dort aus werden die Schriftarten komprimiert an Ihren Browser weitergegeben und dort
          entpackt. Regelmäßig befindet sich dieser Server in den USA. Besuchen Sie eine unserer
          Seiten auf denen wir Google Fonts einbinden, wird an Google übermittelt, welche unserer
          Internetseiten Sie besucht haben.
        </p>
        <p className='mb-2'>
          Dienstanbieter: Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA
          <br />
          Sitz in der EU: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
          <br />
          Internetseite: <a href='https://fonts.google.com/'>https://fonts.google.com/</a>
          <br />
          Datenschutzerklärung:{' '}
          <a href='https://policies.google.com/privacy'>https://policies.google.com/privacy</a>
        </p>
      </IonCardContent>

      <IonItem lines='none'>
        <IonIcon icon={helpCircle} slot='start' />
        <IonLabel className='ion-text-wrap'>Sicherheitsmaßnahmen</IonLabel>
      </IonItem>
      <IonCardContent>
        <p className='mb-2'>
          Wir treffen im Übrigen technische und organisatorische Sicherheitsmaßnahmen nach dem Stand
          der Technik, um die Vorschriften der Datenschutzgesetze einzuhalten und Ihre Daten gegen
          zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust,
          Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen.
        </p>
        <p className='mb-2'>
          <strong>Aktualität und Änderung dieser Datenschutzerklärung</strong>
        </p>
        <p className='mb-2'>
          Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Juni 2021. Aufgrund
          geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese
          Datenschutzerklärung anzupassen.
        </p>
        <p className='mb-2'>
          <strong>
            Diese Datenschutzerklärung wurde mit Hilfe des Datenschutz-Generators von SOS Recht
            erstellt. SOS Recht ist ein Angebot der Mueller.legal Rechtsanwälte Partnerschaft mit
            Sitz in Berlin.
          </strong>
        </p>
      </IonCardContent>
    </IonCard>
  </PageWrapper>
);

export default Datenschutz;
