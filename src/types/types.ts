interface Address {
  city: string;
  country: string;
  geo: {
    lat: number | null;
    lng: number | null;
  };
  number: number | null;
  street: string;
  zipcode: string;
}

export interface Flavor {
  _id: string;
  color: {
    primary: string;
    secondary: string;
  };
  name: string;
  type_cream: boolean;
  type_fruit: boolean;
}

export interface IceCreamLocation {
  _id: string;
  name: string;
  address: Address;
  comments_list: Comment[] | string[];
  flavors_listed: Flavor[] | string[];
  location_num: number | null;
  location_rating_quality: number | null;
  location_rating_vegan_offer: number | null;
  location_url: string;
  pricing: number[];
}

export interface Comment {
  _id: string;
  user_id: Pick<User, '_id' | 'name'> | User['_id'];
  location_id: Pick<IceCreamLocation, '_id' | 'name'> | IceCreamLocation['_id'];
  flavors_referred: Pick<Flavor, '_id' | 'name'>[];
  text: string;
  rating_vegan_offer: number | null;
  rating_quality: number | null;
  bio: boolean;
  vegan: boolean;
  lactose_free: boolean;
  not_specified: boolean;
  date: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  confirmed: boolean;
  home_city: Pick<Address, 'city' | 'geo'>;
  comments_list: Comment[] | string[];
  favorite_locations: IceCreamLocation[] | string[];
  favorite_flavors: Flavor[] | string[];
  needs_reset: boolean;
  num_loc_last_visit: number | null;
  resetToken: string;
}

export interface PopoverState {
  showPopover: boolean;
  event: any | undefined;
}
