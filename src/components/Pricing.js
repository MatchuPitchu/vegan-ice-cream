const Pricing = ({ loc }) => {
  return (
    <div className='pricingInfo'>
      <div>Eiskugel</div>
      <div className='priceStyling'>
        {loc.pricing[loc.pricing.length - 1].toFixed(2).replace(/\./g, ' ')} €
      </div>
    </div>
  );
};

export default Pricing;
