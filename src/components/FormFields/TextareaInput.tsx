import { IonTextarea } from '@ionic/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormTextAreaProps<TFieldValues extends FieldValues> =
  UseControllerProps<TFieldValues>;

const TextareaInput = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
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
      <IonTextarea
        className='pb-2'
        name={name}
        ref={ref}
        value={value}
        autoGrow={true}
        rows={1}
        onIonChange={(event) => onChange(event.detail.value)}
      />
      {/* TODO: Error component styling */}
      {error && <p>{error.message}</p>}
    </>
  );
};

export default TextareaInput;
