import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { GOOGLE_API_URL, GOOGLE_API_URL_CONFIG } from '../../utils/variables-and-functions';
import type { GoogleGeocodingResult } from '../locationsSlice';

interface ReturnTypeGeoCoding {
  results: [
    {
      address_components: GoogleGeocodingResult[];
      formatted_address: string;
      geometry: {
        location: {
          lat: 37.4224428;
          lng: -122.0842467;
        };
        location_type: string;
        viewport: {
          northeast: {
            lat: number;
            lng: number;
          };
          southwest: {
            lat: number;
            lng: number;
          };
        };
      };
      place_id: string;
      plus_code: {
        compound_code: string;
        global_code: string;
      };
      types: string[];
    }
  ];
  status: 'OK';
}

export const googleApi = createApi({
  reducerPath: 'googleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${GOOGLE_API_URL}`,
  }),
  endpoints: (builder) => {
    return {
      getGeoCodingResult: builder.query<ReturnTypeGeoCoding, string>({
        query: (city) => {
          const uri = encodeURI(city);
          return {
            url: `${uri}${GOOGLE_API_URL_CONFIG}`,
            method: 'GET',
          };
        },
      }),
    };
  },
});

export const { useGetGeoCodingResultQuery } = googleApi;
