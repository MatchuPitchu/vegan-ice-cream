import { IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type SelectProps = {
  label: string;
  labelPosition?: 'stacked' | 'floating';
  options: { value: string; label: string }[];
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormSelectProps<TFieldValues extends FieldValues> = SelectProps &
  UseControllerProps<TFieldValues>;

const Select = <TFieldValues extends FieldValues>({
  label,
  labelPosition = 'stacked',
  control,
  name,
  rules,
  options,
}: ReactHookFormSelectProps<TFieldValues>) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController<TFieldValues>({
    control,
    name,
    rules,
  });

  return (
    <>
      <IonLabel position={labelPosition} className='ion-text-wrap mb-2' color={error && 'danger'}>
        {label}
      </IonLabel>
      <IonSelect
        ref={ref}
        cancelText='Abbrechen'
        placeholder='Auswahl'
        mode='ios'
        value={value}
        onIonChange={({ detail: { value } }) => onChange(value)}
      >
        {options.map((option) => (
          <IonSelectOption key={option.value} value={option.value}>
            {option.label}
          </IonSelectOption>
        ))}
      </IonSelect>
      {/* TODO: Error component styling */}
      {error && <p className='paragraph--error-small'>{error.message}</p>}
    </>
  );
};

export default Select;
