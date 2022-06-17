import type { Comment } from '../../types/types';
// Redux Store
import { useAppSelector } from '../../store/hooks';
import { IonIcon } from '@ionic/react';
import { chatboxEllipses, iceCream } from 'ionicons/icons';
import Ratings from '../Ratings';
import ButtonsEditDelete from './ButtonsEditDelete';
import UpdateComment from './UpdateComment';
import { VFC } from 'react';
import { hasNameProperty } from '../../types/typeguards';

type Props = { comment: Comment; authorIdOfComment: string };

const CommentsBlock: VFC<Props> = ({ comment, authorIdOfComment }) => {
  const { user } = useAppSelector((state) => state.user);

  const { showEditSectionComment } = useAppSelector((state) => state.show);

  // if user clicks on edit btn than updateComment component is displayed
  if (showEditSectionComment.state && showEditSectionComment.comment_id === comment._id) {
    return <UpdateComment comment={comment} />;
  }

  return (
    user && (
      <div className='px-3 py-2 borderBottom'>
        <div className='commentText'>
          <IonIcon slot='start' className='me-2' color='text-color' icon={chatboxEllipses} />
          {comment.text}
        </div>
        {(comment.bio || comment.vegan || comment.lactose_free) && (
          <div className='d-flex mt-3'>
            {comment.bio ? <div className='tag-comment'>bio</div> : null}
            {comment.vegan ? <div className='tag-comment'>vegan</div> : null}
            {comment.lactose_free ? <div className='tag-comment'>laktosefrei</div> : null}
          </div>
        )}
        <div className='d-flex align-items-center'>
          <Ratings
            rating_vegan_offer={comment.rating_vegan_offer as number}
            rating_quality={comment.rating_quality as number}
            showNum={false}
          />
          {user && user._id === authorIdOfComment && <ButtonsEditDelete comment={comment} />}
        </div>
        {comment.flavors_referred.map((flavor) => {
          return (
            <div
              key={flavor._id}
              className='flavor-btn mt-2 d-flex align-items-center justify-content-center'
            >
              <IonIcon className='coneIcon pe-1' size='small' icon={iceCream} />
              {flavor.name}
            </div>
          );
        })}
        <div className='text--small-grey mt-2'>
          {`${
            comment.user_id // if false, than user account is deleted
              ? hasNameProperty(comment.user_id)
                ? comment.user_id.name // Comments Block in App
                : user.name // Profil Section
              : 'User mit deaktiviertem Konto'
          }`}{' '}
          am {comment.date.replace('T', ' um ').slice(0, 19)} Uhr
        </div>
      </div>
    )
  );
};

export default CommentsBlock;
