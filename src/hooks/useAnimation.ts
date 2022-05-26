import { createAnimation } from '@ionic/react';

export const useAnimation = () => {
  // animations modal
  const enterAnimationFromBottom = (modal: HTMLIonModalElement) => {
    // darkened background
    const backdropAnimation = createAnimation()
      .addElement(modal.querySelector('ion-backdrop') as HTMLIonBackdropElement)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    // animates modal
    const wrapperAnimation = createAnimation()
      .addElement(modal.querySelector('.modal-wrapper') as HTMLIonBackdropElement)
      .keyframes([
        { offset: 0, opacity: '1', transform: 'translateY(300px)' },
        { offset: 1, opacity: '1', transform: 'translateY(0)' },
      ]);

    return createAnimation()
      .addElement(modal)
      .easing('ease-out')
      .duration(200)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimationToBottom = (modal: HTMLIonModalElement) => {
    return enterAnimationFromBottom(modal).direction('reverse');
  };

  const enterAnimationFromLeft = (modal: HTMLIonModalElement) => {
    // darkened background
    const backdropAnimation = createAnimation()
      .addElement(modal.querySelector('ion-backdrop') as HTMLIonBackdropElement)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    // animates modal
    const wrapperAnimation = createAnimation()
      .addElement(modal.querySelector('.modal-wrapper') as HTMLIonModalElement)
      .keyframes([
        { offset: 0, opacity: '1', transform: 'translateX(-300px)' },
        { offset: 1, opacity: '1', transform: 'translateX(0)' },
      ]);

    return createAnimation()
      .addElement(modal)
      .easing('ease-out')
      .duration(200)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimationToLeft = (modal: HTMLIonModalElement) => {
    return enterAnimationFromLeft(modal).direction('reverse');
  };

  return {
    enterAnimationFromBottom,
    leaveAnimationToBottom,
    enterAnimationFromLeft,
    leaveAnimationToLeft,
  };
};
