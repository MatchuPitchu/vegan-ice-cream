import { VFC } from 'react';
import Search from '../components/Search';
import EntdeckenMap from '../components/EntdeckenMap';
import PageWrapper from '../components/PageUtils/PageWrapper';

const Entdecken: VFC = () => {
  return (
    <PageWrapper showIonHeader={false}>
      <Search />
      <EntdeckenMap />
    </PageWrapper>
  );
};

export default Entdecken;
