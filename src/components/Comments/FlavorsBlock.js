const FlavorsBlock = ({ flavorsList }) => {
  return (
    <div className='d-flex justify-content-around flex-wrap px-3 py-2'>
      {flavorsList.map((flavor) => {
        return (
          <div key={flavor._id}>
            <div className='iceContainer'>
              <div
                className='icecream'
                style={{
                  background: `linear-gradient(to bottom, ${flavor.color?.primary}, ${
                    flavor.color?.secondary ? flavor.color?.secondary : flavor.color?.primary
                  })`,
                }}
              ></div>
              <div className='icecreamBottom' style={{ background: flavor.color?.primary }}></div>
              <div className='cone'></div>
            </div>
            <div className='labelFlavor'>{flavor.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default FlavorsBlock;
