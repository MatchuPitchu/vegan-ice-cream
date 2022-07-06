import { VFC } from 'react';

interface Props {
  url: string;
}

const WebsiteBlock: VFC<Props> = ({ url }) => {
  const href = url.includes('http') ? url : `//${url}`;

  return (
    <a className='link--website' href={href} target='_blank' rel='noopener noreferrer'>
      {url}
    </a>
  );
};

export default WebsiteBlock;
