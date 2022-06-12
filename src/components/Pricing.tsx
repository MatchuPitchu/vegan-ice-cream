import { VFC } from 'react';

interface Props {
  pricing: number[];
}

const Pricing: VFC<Props> = ({ pricing }) => {
  return (
    <div className='pricing-indication'>
      <div>Eiskugel</div>
      <div className='pricing-indication__number'>
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
