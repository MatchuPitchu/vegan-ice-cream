import { IonDatetime } from '@ionic/react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormDatePickerProps<TFieldValues extends FieldValues> =
  UseControllerProps<TFieldValues>;

const DatePicker = <TFieldValues extends FieldValues>({
  control,
  name,
}: ReactHookFormDatePickerProps<TFieldValues>) => {
  const {
    field: { onChange, value, ref },
  } = useController<TFieldValues>({
    control,
    name,
  });

  return (
    <IonDatetime
      ref={ref}
      min='2021'
      max='2025'
      value={value}
      monthNames='Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember'
      displayFormat='DD.MMMM.YYYY'
      onIonChange={({ detail }) => onChange(detail.value)}
      cancelText='Zurück'
      doneText='OK'
    />
  );
};

export default DatePicker;
