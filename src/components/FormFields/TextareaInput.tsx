import { IonLabel, IonTextarea } from '@ionic/react';
import { ReactNode } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type TextAreaProps = {
  label?: string;
  labelPosition?: 'stacked' | 'floating';
  placeholder?: string;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormTextAreaProps<TFieldValues extends FieldValues> = TextAreaProps &
  UseControllerProps<TFieldValues> & { children?: ReactNode };

const TextareaInput = <TFieldValues extends FieldValues>({
  label,
  labelPosition = 'stacked',
  control,
  name,
  rules,
  children,
}: ReactHookFormTextAreaProps<TFieldValues>) => {
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
      <IonLabel position={labelPosition} color={error && 'danger'}>
        {label}
      </IonLabel>
      {children}
      <IonTextarea
        color={error && 'danger'}
        className='pb-2'
        name={name}
        ref={ref}
        value={value}
        autoGrow={true}
        rows={1}
        onIonChange={({ detail }) => onChange(detail.value)}
      />
      {error && <p className='paragraph--error-small'>{error.message}</p>}
    </>
  );
};

export default TextareaInput;
