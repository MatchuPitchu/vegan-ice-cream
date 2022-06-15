import { IonButton, IonIcon, IonItem } from '@ionic/react';
import { colorPaletteOutline } from 'ionicons/icons';
import { useState } from 'react';
import { CirclePicker } from 'react-color';
import { FieldValues, Path, useController, UseControllerProps } from 'react-hook-form';
import { colorPickerColors } from '../../utils/variables-and-functions';

type ColorPickerProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  onSelectColor: () => void;
  disabled: boolean;
};

// Types React Hook Form useController in child component: https://dev.to/texmeijin/component-design-idea-using-react-hook-form-v7-ie0
type ReactHookFormColorPickerProps<TFieldValues extends FieldValues> =
  ColorPickerProps<TFieldValues> & UseControllerProps<TFieldValues>;

const ColorPicker = <TFieldValues extends FieldValues>({
  control,
  name,
  rules,
  onSelectColor,
  disabled,
}: ReactHookFormColorPickerProps<TFieldValues>) => {
  const {
    field: { onChange, value },
  } = useController<TFieldValues>({
    name,
    control,
    rules,
  });

  const [showColorPicker, setShowColorPicker] = useState(true);

  return (
    <>
      <IonItem lines='none' className='item--card-background'>
        <IonButton
          className='color-picker__button'
          color='primary'
          type='button'
          fill='clear'
          disabled={disabled}
          onClick={() => setShowColorPicker((prev) => !prev)}
        >
          <IonIcon icon={colorPaletteOutline} />
          <div
            className='color-picker__result'
            style={{
              backgroundColor: value,
            }}
          />
        </IonButton>
      </IonItem>
      {showColorPicker && !disabled && (
        <IonItem lines='none' className='item--card-background'>
          <CirclePicker
            colors={colorPickerColors}
            circleSpacing={15}
            circleSize={20}
            onChangeComplete={({ hex }) => {
              onChange(hex);
              onSelectColor();
              setShowColorPicker(false);
            }}
            width='100%'
          />
        </IonItem>
      )}
    </>
  );
};

export default ColorPicker;
