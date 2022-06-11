import { VFC } from 'react';

interface Props {
  pricing: number[];
}

const Pricing: VFC<Props> = ({ pricing }) => {
  return (
    <div className='pricing-info'>
      <div>Eiskugel</div>
      <div className='price-info__number'>
        {pricing[pricing.length - 1]
          .toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol',
          })
          .split(',')}
      </div>
    </div>
  );
};

export default Pricing;
