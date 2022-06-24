import { IonInput, IonLabel } from '@ionic/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type InputProps = {
  label?: string;
  labelPosition?: 'stacked' | 'floating';
  type?: 'text' | 'number';
  inputmode?: 'text' | 'numeric' | 'url';
  maxlength?: number;
  placeholder?: string;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormProps<TFieldValues extends FieldValues> = InputProps &
  UseControllerProps<TFieldValues>;

const Input = <TFieldValues extends FieldValues>({
  label,
  labelPosition = 'stacked',
  control,
  name,
  rules,
  type = 'text',
  inputmode = 'text',
  maxlength,
  placeholder,
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
      <IonLabel position={labelPosition}>{label}</IonLabel>
      <IonInput
        ref={ref}
        name={name}
        value={value}
        type={type}
        inputmode={inputmode}
        maxlength={maxlength}
        onIonChange={({ detail: { value } }) => onChange(value)}
        placeholder={placeholder}
      />
      {error && <p>{error.message}</p>}
    </>
  );
};

export default Input;
