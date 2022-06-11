import { IonToggle } from '@ionic/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type ToggleArgument = { name: string; value: boolean };

type CheckboxProps = {
  onToggleClick: (object: ToggleArgument) => void;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormCheckboxProps<TFieldValues extends FieldValues> = CheckboxProps &
  UseControllerProps<TFieldValues>;

const Checkbox = <TFieldValues extends FieldValues>({
  control,
  name,
  onToggleClick,
}: ReactHookFormCheckboxProps<TFieldValues>) => {
  const {
    field: { onChange, value, ref },
  } = useController<TFieldValues>({
    control,
    name,
  });

  return (
    <IonToggle
      onIonChange={({ detail }) => {
        onToggleClick({
          name,
          value: detail.checked,
        });
        onChange(detail.checked);
      }}
      checked={value}
      ref={ref}
    />
  );
};

export default Checkbox;
