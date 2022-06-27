import { IonInput, IonLabel } from '@ionic/react';
import { ReactNode, useEffect, useRef } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type InputProps = {
  label?: string | ReactNode;
  labelPosition?: 'stacked' | 'floating';
  type?: 'text' | 'number' | 'password';
  inputmode?: 'text' | 'numeric' | 'url';
  maxlength?: number;
  placeholder?: string;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormProps<TFieldValues extends FieldValues> = InputProps &
  UseControllerProps<TFieldValues>;

export const CustomInput = <TFieldValues extends FieldValues>({
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
    field: { onChange, value },
    fieldState: { error },
  } = useController<TFieldValues>({
    control,
    name,
    rules,
  });

  const inputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    if (error) {
      inputRef.current!.setFocus();
    }
  }, [error, name]);

  return (
    <>
      <IonLabel position={labelPosition} color={error && 'danger'}>
        {label}
      </IonLabel>
      <IonInput
        ref={inputRef}
        name={name}
        value={value}
        type={type}
        inputmode={inputmode}
        maxlength={maxlength}
        onIonChange={({ detail: { value } }) => onChange(value)}
        placeholder={placeholder}
      />
      {error && <p className='paragraph--error-small'>{error.message}</p>}
    </>
  );
};
