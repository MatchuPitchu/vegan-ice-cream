import { IonTextarea } from '@ionic/react';
import { FieldPath, FieldValues, useController, UseControllerProps } from 'react-hook-form';

interface TextAreaProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>
  extends UseControllerProps<TFieldValues, TName> {}

// NOT WORKING WITH REACT HOOK FORM -> error message, but works inside parent component - no idea why

const InputTextarea = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  rules,
}: TextAreaProps<TFieldValues, TName>) => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    control,
    rules,
    name,
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

export default InputTextarea;
