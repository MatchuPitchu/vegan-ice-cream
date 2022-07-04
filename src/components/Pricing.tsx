import { VFC } from 'react';

interface Props {
  pricing: number[];
  className?: string;
}

const Pricing: VFC<Props> = ({ pricing, className }) => {
  return (
    <div className={`pricing-indication ${className}`}>
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
