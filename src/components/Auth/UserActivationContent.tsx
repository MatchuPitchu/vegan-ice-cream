import { useEffect, VFC } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { useActivateUserMutation } from '../../store/api/auth-api-slice';
import Spinner from '../Spinner';

const UserActivationContent: VFC = () => {
  const { activateAccountMessage } = useAppSelector((state) => state.app);

  const { id } = useParams<{ id: string }>();

  const [triggerActivateUser] = useActivateUserMutation();

  useEffect(() => {
    const activateUser = async () => await triggerActivateUser(id);
    if (activateAccountMessage === 'init') activateUser();
  }, [id, activateAccountMessage, triggerActivateUser]);

  if (activateAccountMessage === 'Aktivierung des Mail-Accounts erfolgreich')
    return <Redirect exact to='/login' />;

  return activateAccountMessage === 'init' ? <Spinner /> : null;
};

export default UserActivationContent;
