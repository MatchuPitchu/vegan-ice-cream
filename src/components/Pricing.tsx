import { VFC } from 'react';

interface Props {
  pricing: number[];
}

const Pricing: VFC<Props> = ({ pricing }) => {
  return (
    <div className='pricing-info'>
      <div>Eiskugel</div>
      <div className='priceStyling'>
        {pricing[pricing.length - 1].toLocaleString('de-DE', {
          style: 'currency',
          currency: 'EUR',
          currencyDisplay: 'symbol',
        })}
      </div>
    </div>
  );
};

export default Pricing;
