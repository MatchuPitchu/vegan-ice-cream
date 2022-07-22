import { IonLabel } from '@ionic/react';
import { ReactNode } from 'react';
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
  label?: string;
  labelPosition?: 'stacked' | 'floating';
  className?: string;
  readonly?: boolean;
  initialValue?: number;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormRatingProps<TFieldValues extends FieldValues> = FormRatingProps &
  UseControllerProps<TFieldValues> & { children?: ReactNode };

const RatingInput = <TFieldValues extends FieldValues>({
  label,
  labelPosition = 'stacked',
  control,
  name,
  rules,
  className,
  readonly = false,
  initialValue,
  children,
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
    <>
      <IonLabel position={labelPosition} color={error && 'danger'}>
        {label}
      </IonLabel>
      {children}
      <div className={className}>
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
      </div>
      {error && <p className='paragraph--error-small'>{error.message}</p>}
    </>
  );
};

export default RatingInput;
