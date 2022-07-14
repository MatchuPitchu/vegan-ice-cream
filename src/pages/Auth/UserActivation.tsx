import { VFC } from 'react';
import UserActivationContent from '../../components/Auth/UserActivationContent';
import PageWrapper from '../../components/PageUtils/PageWrapper';

const UserActivation: VFC = () => {
  return (
    <PageWrapper showIonHeader={false} showIonContent={false}>
      <UserActivationContent />
    </PageWrapper>
  );
};

export default UserActivation;
