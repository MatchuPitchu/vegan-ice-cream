import { VFC } from 'react';

interface Props {
  pricing: number[];
}

const Pricing: VFC<Props> = ({ pricing }) => {
  return (
    <div className='pricing-info'>
      <div>Eiskugel</div>
      <div className='priceStyling'>
        {pricing[pricing.length - 1].toFixed(2).replace(/\./g, ' ')} €
      </div>
    </div>
  );
};

export default Pricing;
