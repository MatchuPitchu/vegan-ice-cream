import { useState, createContext, FC, useContext, Dispatch, SetStateAction } from 'react';

interface MapContextInterface {
  map: any;
  setMap: Dispatch<SetStateAction<any>>;
}

export const MapContext = createContext({} as MapContextInterface);

// custom hook to check whether you are inside a provider AND it returns context data object
export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error('useMapContext must be used within MapContextProvider');
  return context;
};

const MapProvider: FC = ({ children }) => {
  const [map, setMap] = useState<any>(null);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
