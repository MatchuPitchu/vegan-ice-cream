// import { useContext } from 'react';
// import { Context } from '../context/Context';
// import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
// import { IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonSearchbar } from '@ionic/react'

// const Searchbar = () => {
//   const { searchText, setSearchText } = useContext(Context);

//   const { 
//     placePredictions,
//     getPlacePredictions,
//     isPlacePredictionsLoading,
//   } = useGoogle({
//     apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     debounce: 3000,
//     options: {
//       bounds: {
//         north: 55.1,
//         south: 47.1,
//         west: 5.8,
//         east: 15.1,
//       }
//     }
//   });

//   return (
//     <div className="container">
//       <IonSearchbar 
//         className="searchbar container" 
//         type="search" 
//         placeholder="Debounce 3s" 
//         showCancelButton="always" 
//         cancel-button-text=""
//         value={searchText}
//         onIonChange={e => {
//           getPlacePredictions({ input: e.detail.value});
//           setSearchText(e.detail.value);
//         }}
//         // loading={isPlacePredictionsLoading}
//       />
//       {!isPlacePredictionsLoading && (
//         <IonList className="listSearch">
//           {placePredictions.map((item, i) => (
//             <IonItemSliding key={i}>
//               <IonItem button onClick={() => setSearchText(item.description)}>
//                 <IonLabel>{item.description}</IonLabel>
//               </IonItem>
//               <IonItemOptions side="end">
//                 <IonItemOption onClick={() => {}}>Unread</IonItemOption>
//               </IonItemOptions>
//             </IonItemSliding>
//           ))}
//         </IonList>
//       )}
//     </div>
//   )
// }

// export default Searchbar;