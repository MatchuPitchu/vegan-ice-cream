export const GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
// fetch results are restricted to countries DE, AT, CH, LI
export const GOOGLE_API_URL_CONFIG = `&components=country:DE|country:AT|country:CH|country:LI&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
