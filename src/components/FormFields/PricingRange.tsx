import { IonIcon, IonItem, IonLabel, IonRange } from '@ionic/react';
import { logoEuro } from 'ionicons/icons';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type PricingRangeProps = {
  className?: string;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormPricingRangeProps<TFieldValues extends FieldValues> = PricingRangeProps &
  UseControllerProps<TFieldValues>;

const PricingRange = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  className,
}: ReactHookFormPricingRangeProps<TFieldValues>) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController<TFieldValues>({
    control,
    name,
    rules,
  });

  return (
    <IonItem className={`${className} mb-1`} lines='none'>
      <IonLabel position='stacked' className='pb-1'>
        Preis Eiskugel
      </IonLabel>
      <div className='pricing__info'>
        {value !== 0 &&
          value.toLocaleString('de-DE', {
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'symbol',
          })}
      </div>
      <IonRange
        className='px-0'
        name={name}
        ref={ref}
        value={value}
        onIonChange={({ detail }) => onChange(detail.value)}
        min={0.0}
        max={4.0}
        step={0.1}
        snaps={true}
        ticks={false}
      >
        <IonIcon slot='start' size='small' icon={logoEuro} />
        <IonIcon slot='end' size='large' icon={logoEuro} />
      </IonRange>
      {/* TODO: Error message component styling */}
      {error && <span>{error.message}</span>}
    </IonItem>
  );
};

export default PricingRange;
