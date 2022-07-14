import { VFC } from 'react';
import PageWrapper from '../../components/PageUtils/PageWrapper';
import LoginContent from '../../components/Auth/LoginContent';

const Login: VFC = () => {
  return (
    <PageWrapper
      srcHeaderImageLigth='./assets/header-login-light.svg'
      srcHeaderImageDark='./assets/header-login-dark.svg'
    >
      <LoginContent />
    </PageWrapper>
  );
};

export default Login;
