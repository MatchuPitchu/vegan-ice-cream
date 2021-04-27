// import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
// import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';
// import '@reach/combobox/styles.css';


// const Search = () => {
//   const {
//     ready, 
//     value, 
//     suggestions: { status, data }, 
//     setValue, 
//     clearSuggestions 
//   } = usePlacesAutoComplete({
//     requestOptions: {
//       // Prefere locations that are near to this point
//       location: { lat: () => 52.524, lng: () => 13.410 },
//       // Search radius in meters
//       radius: 20 * 1000,
//     }
//   });

//   return (
//     <div className="searchbarMap">
//       {/* <Combobox onSelect={(address) => console.log(address)}> */}
//         <input
//           type="text"
//           value={value} 
//           onChange={e => { setValue(e.target.value)}}
//           placeholder="Enter an adress"
//           />
//       {/* </Combobox>   */}
//     </div>
//   )
// }

// export default Search
