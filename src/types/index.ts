interface Address {
  city: string;
  country: string;
  geo: {
    lat: number;
    lng: number;
  };
  number: number;
  street: string;
  zipcode: string;
}

export interface Flavour {
  flavor_id: string;
  color: {
    primary: string;
    secondary: string;
  };
  name: string;
  type_cream: boolean;
  type_fruit: boolean;
}

export interface Location {
  location_id: string;
  name: string;
  address: Address;
  comments_list: string[];
  flavors_listed: string[];
  location_num: number;
  location_rating_quality: number;
  location_rating_vegan_offer: number;
  location_url: string;
  pricing: number[];
}

export interface Comment {
  user_id: string;
  location_id: string;
  flavors_referred: Partial<Flavour>[];
  text: string;
  rating_vegan_offer: number;
  rating_quality: number;
  bio: boolean;
  vegan: boolean;
  lactose_free: boolean;
  not_specified: boolean;
  date: Date;
}

export interface User {
  name: string;
  email: string;
  confirmed: boolean;
  home_city: Pick<Address, 'city' | 'geo'>;
  comments_list: Comment[];
  favorite_locations: Location[];
  favorite_flavors: Flavour[];
  needs_reset: boolean;
  num_loc_last_visit: number;
  resetToken: string;
}
