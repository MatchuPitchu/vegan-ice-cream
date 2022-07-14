import { VFC } from 'react';
import LogoutContent from '../../components/Auth/LogoutContent';
import PageWrapper from '../../components/PageUtils/PageWrapper';

const Logout: VFC = () => {
  return (
    <PageWrapper
      srcHeaderImageLigth='./assets/header-home-light.svg'
      srcHeaderImageDark='./assets/header-home-dark.svg'
    >
      <LogoutContent />
    </PageWrapper>
  );
};

export default Logout;
