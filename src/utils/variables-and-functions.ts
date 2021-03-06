export const GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
// fetch results are restricted to countries DE, AT, CH, LI
export const GOOGLE_API_URL_CONFIG = `&components=country:DE|country:AT|country:CH|country:LI&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

export const factorToConvertRatingScale = 20;
export const convertIntoNumberFrom0To100 = (numberFrom0To5: number) =>
  numberFrom0To5 * factorToConvertRatingScale;
export const convertIntoNumberFrom0To5 = (numberFrom0To100: number) =>
  numberFrom0To100 / factorToConvertRatingScale;

export const handleChangeFlavorTypeToggleGroup = (
  setValue: (fieldName: 'bio' | 'vegan' | 'lactose_free' | 'not_specified', value: boolean) => void,
  {
    name,
    value,
  }: {
    name: string;
    value: boolean;
  }
) => {
  switch (name) {
    case 'bio':
      if (value) {
        setValue('not_specified', false);
      }
      break;
    case 'vegan':
      if (value) {
        setValue('not_specified', false);
        setValue('lactose_free', value);
      }
      break;
    case 'lactose_free':
      if (value) {
        setValue('not_specified', false);
      }
      break;
    case 'not_specified':
      if (value) {
        setValue('bio', false);
        setValue('vegan', false);
        setValue('lactose_free', false);
      }
      break;
  }
};

export const colorPickerColors = [
  'TRANSPARENT',
  '#b71c1c',
  '#f44336',
  '#e57373',
  '#ffcdd2',
  '#880e4f',
  '#c2185b',
  '#e91e63',
  '#f06292',
  '#f8bbd0',
  '#4a148c',
  '#7b1fa2',
  '#9c27b0',
  '#ba68c8',
  '#e1bee7',
  '#0d47a1',
  '#1976d2',
  '#2196f3',
  '#64b5f6',
  '#bbdefb',
  '#004d40',
  '#00796b',
  '#009688',
  '#4db6ac',
  '#b2dfdb',
  '#194d33',
  '#388e3c',
  '#4caf50',
  '#81c784',
  '#c8e6c9',
  '#f57f17',
  '#fbc02d',
  '#ffeb3b',
  '#fff176',
  '#fff9c4',
  '#e65100',
  '#f57c00',
  '#ff9800',
  '#ffb74d',
  '#ffe0b2',
  '#bf360c',
  '#e64a19',
  '#ff5722',
  '#ff8a65',
  '#ffccbc',
  '#3e2723',
  '#5d4037',
  '#795548',
  '#a1887f',
  '#d7ccc8',
  '#000000',
  '#4d2119',
  '#693e18',
  '#c98850',
  '#ffffff',
];
