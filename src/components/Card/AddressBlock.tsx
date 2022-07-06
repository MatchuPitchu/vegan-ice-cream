import { VFC } from 'react';
import type { Address } from '../../types/types';

interface Props {
  address: Address;
}

const AddressBlock: VFC<Props> = ({ address: { street, number, zipcode, city } }) => {
  return (
    <>
      <div className='address'>
        {street && street} {number && number}
      </div>
      <div className='address'>
        {zipcode && zipcode} {city && city}
      </div>
    </>
  );
};

export default AddressBlock;
