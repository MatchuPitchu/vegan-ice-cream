import { VFC } from 'react';
import SetNewPasswordContent from '../../components/Auth/SetNewPasswordContent';
import PageWrapper from '../../components/PageUtils/PageWrapper';

const SetNewPassword: VFC = () => {
  return (
    <PageWrapper
      srcHeaderImageLigth='./assets/header-login-light.svg'
      srcHeaderImageDark='./assets/header-login-dark.svg'
    >
      <SetNewPasswordContent />
    </PageWrapper>
  );
};

export default SetNewPassword;
