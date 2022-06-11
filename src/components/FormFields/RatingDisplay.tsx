import { useState, VFC } from 'react';
import { Rating } from 'react-simple-star-rating';
import { factorToConvertRatingScale } from '../../utils/variables-and-functions';
import { fillColorArray } from './RatingInput';

type FormRatingProps = {
  initialValue: number;
  className?: string;
};

const RatingOnlyShow: VFC<FormRatingProps> = ({ initialValue, className }) => {
  const [value, setValue] = useState(initialValue * factorToConvertRatingScale);

  return (
    <div className={`react-star react-stars--only-show ${className && className}`}>
      <Rating
        ratingValue={value}
        onClick={(rate: number) => setValue(rate)}
        initialValue={initialValue}
        iconsCount={5}
        size={15}
        allowHalfIcon={true}
        allowHover={true}
        transition={true}
        readonly={true}
        fillColorArray={fillColorArray}
        emptyColor='#cccccc90'
        fillColor='var(--ion-color-primary)'
      />
    </div>
  );
};

export default RatingOnlyShow;
