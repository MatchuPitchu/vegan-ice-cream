import { IonInput, IonLabel } from '@ionic/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type InputProps = {
  label?: string;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormProps<TFieldValues extends FieldValues> = InputProps &
  UseControllerProps<TFieldValues>;

const Input = <TFieldValues extends FieldValues>({
  label,
  control,
  name,
  rules,
}: ReactHookFormProps<TFieldValues>) => {
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
      <IonLabel position='stacked'>{label}</IonLabel>
      <IonInput
        ref={ref}
        name={name}
        value={value}
        type='text'
        inputmode='text'
        onIonChange={({ detail: { value } }) => onChange(value)}
      />
      {error && <p>{error.message}</p>}
    </>
  );
};

export default Input;
