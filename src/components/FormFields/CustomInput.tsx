import { IonInput, IonLabel, useIonViewDidEnter } from '@ionic/react';
import { KeyboardEvent, ReactNode, useEffect, useRef } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type InputProps = {
  label?: string | ReactNode;
  labelPosition?: 'stacked' | 'floating';
  type?: 'text' | 'number' | 'password';
  inputmode?: 'text' | 'numeric' | 'url' | 'email';
  maxlength?: number;
  placeholder?: string;
  isFocusedOnMount?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLIonInputElement>) => void;
  onInputChange?: (value: string) => void;
  externalValue?: string;
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
  isFocusedOnMount = false,
  onKeyDown,
  onInputChange,
  externalValue,
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

  // not working inside of IonModal, only on pages
  useIonViewDidEnter(() => {
    if (isFocusedOnMount && inputRef?.current) {
      inputRef.current.setFocus();
    }
  });

  useEffect(() => {
    if (error && inputRef?.current) {
      inputRef.current.setFocus();
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
        value={externalValue ?? value}
        type={type}
        inputmode={inputmode}
        maxlength={maxlength}
        onIonChange={({ detail: { value } }) => {
          if (externalValue === value) return;
          onChange(value);
          onInputChange && onInputChange(value as string);
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
      {error && <p className='paragraph--error-small'>{error.message}</p>}
    </>
  );
};
