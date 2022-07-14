import { VFC } from 'react';
import PageWrapper from '../../components/PageUtils/PageWrapper';
import ResetPasswordContent from '../../components/Auth/ResetPasswordContent';

const ResetPassword: VFC = () => {
  return (
    <PageWrapper
      srcHeaderImageLigth='./assets/header-login-light.svg'
      srcHeaderImageDark='./assets/header-login-dark.svg'
    >
      <ResetPasswordContent />
    </PageWrapper>
  );
};

export default ResetPassword;
