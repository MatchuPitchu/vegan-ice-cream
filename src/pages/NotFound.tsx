import { VFC } from 'react';
import { css } from '@emotion/core';
import { RingLoader } from 'react-spinners';
import PageWrapper from '../components/PageUtils/PageWrapper';

const override = css`
  display: flex;
  margin: 20px auto;
  background-color: transparent;
  opacity: 0.8;
`;

const NotFound: VFC = () => {
  return (
    <PageWrapper showIonHeader={false}>
      <div className='d-flex flex-column align-items-center text-center'>
        <RingLoader color='var(--ion-color-primary)' css={override} size={50} />
        <h3 style={{ fontSize: '1.2em' }} className='display-3'>
          404
        </h3>
        <p>Page not found</p>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
