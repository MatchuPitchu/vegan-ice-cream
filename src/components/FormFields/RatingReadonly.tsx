import { useState, VFC } from 'react';
import { Rating } from 'react-simple-star-rating';
import { factorToConvertRatingScale } from '../../utils/variables-and-functions';
import { fillColorArray } from './RatingInput';

type FormRatingProps = {
  initialValue: number;
  className?: string;
};

const RatingReadonly: VFC<FormRatingProps> = ({ initialValue, className }) => {
  const [value, setValue] = useState(initialValue * factorToConvertRatingScale);

  return (
    <div className={`react-stars react-stars--only-show ${className && className}`}>
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

export default RatingReadonly;
