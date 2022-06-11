import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import { Rating } from 'react-simple-star-rating';

export const tooltipArray = [
  'nie wieder',
  'mangelhaft',
  'ganz schlecht',
  'schlecht',
  'unterdurchschnittlich',
  'durchschnittlich',
  'gut',
  'sehr gut',
  'hervorragend',
  'traumhaft',
];

export const fillColorArray = [
  '#f17a45',
  '#f17a45',
  '#f19745',
  '#f19745',
  '#f1a545',
  '#f1a545',
  '#f1b345',
  '#f1b345',
  'var(--ion-color-primary-tint',
  'var(--ion-color-primary)',
];

type FormRatingProps = {
  className?: string;
  readonly?: boolean;
  initialValue?: number;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormRatingProps<TFieldValues extends FieldValues> = FormRatingProps &
  UseControllerProps<TFieldValues>;

const RatingInput = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  className,
  readonly = false,
  initialValue,
}: ReactHookFormRatingProps<TFieldValues>) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
  });

  return (
    <div className={`react-star ${className && className}`}>
      {/* TODO: Validation does NOT work */}
      <Rating
        ratingValue={value}
        initialValue={initialValue}
        onClick={(rate: number) => onChange(rate)}
        iconsCount={5}
        size={15}
        allowHalfIcon={true}
        allowHover={true}
        transition={true}
        readonly={readonly}
        showTooltip={true}
        tooltipClassName='react-stars__tooltip'
        tooltipDefaultText='Bewertung'
        tooltipArray={tooltipArray}
        fillColorArray={fillColorArray}
        emptyColor='#cccccc90'
        fillColor='var(--ion-color-primary)'
      />
      {error && <p>{error.message}</p>}
    </div>
  );
};

export default RatingInput;
