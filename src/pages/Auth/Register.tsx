import { VFC } from 'react';
import RegisterContent from '../../components/Auth/RegisterContent';
import PageWrapper from '../../components/PageUtils/PageWrapper';

const Register: VFC = () => {
  return (
    <PageWrapper
      srcHeaderImageLigth='./assets/header-login-light.svg'
      srcHeaderImageDark='./assets/header-login-dark.svg'
    >
      <RegisterContent />
    </PageWrapper>
  );
};

export default Register;
