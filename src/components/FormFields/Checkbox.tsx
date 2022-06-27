import { IonToggle } from '@ionic/react';
import { useRef } from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

type ToggleArgument = { name: string; value: boolean };

type CheckboxProps = {
  label: string;
  onToggleClick?: (object: ToggleArgument) => void;
  disabled?: boolean;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormCheckboxProps<TFieldValues extends FieldValues> = CheckboxProps &
  UseControllerProps<TFieldValues>;

const Checkbox = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  onToggleClick,
  disabled,
}: ReactHookFormCheckboxProps<TFieldValues>) => {
  const {
    field: { onChange, value, ref },
  } = useController<TFieldValues>({
    control,
    name,
  });

  return (
    <div className='checkbox'>
      <label className='checkbox_label item-text--small'>{label}</label>
      <IonToggle
        ref={ref}
        checked={value}
        onIonChange={({ detail }) => {
          onToggleClick &&
            onToggleClick({
              name,
              value: detail.checked,
            });
          onChange(detail.checked);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default Checkbox;
