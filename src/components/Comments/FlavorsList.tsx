import { VFC } from 'react';
import type { Flavor } from '../../types/types';
import { IceCreamCone } from '../IceCreamCone';

interface Props {
  flavorsList: Flavor[] | string[];
}

const isLoadedFlavorsList = (flavorsList: string[] | Flavor[]): flavorsList is Flavor[] => {
  return (flavorsList as Flavor[])[0].name !== undefined;
};

const FlavorsList: VFC<Props> = ({ flavorsList }) => {
  return isLoadedFlavorsList(flavorsList) ? (
    <div className='ice-cream-list'>
      {flavorsList.map((flavor) => {
        return (
          <div key={flavor._id}>
            <IceCreamCone color={flavor.color} />
            <div className='ice-cream-list__label'>{flavor.name}</div>
          </div>
        );
      })}
    </div>
  ) : null;
};

export default FlavorsList;
