import { FaGithubAlt, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';

import { checkIfFollowingUser } from '../api/github';
import type { GithubUser } from '../types';

const UserCard = ({ user }: { user: GithubUser }) => {
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ['followingStatus', user.login],
    queryFn: () => checkIfFollowingUser(user.login),
    enabled: !!user.login,
  });

  return (
    <div className='user-card'>
      <img src={user.avatar_url} alt={user.name} className='avatar' />
      <h2>{user.name || user.login}</h2>
      <p className='bio'>{user.bio}</p>

      <div className='user-card buttons'>

        <button className={`follow-btn ${isFollowing ? 'following' : ''} `}>
      {isFollowing ? (
        <>
        <FaUserMinus className='follow-icon' /> Following
        </>
      ) : (
        <>
          <FaUserPlus className='follow-icon' /> Follow User
        </>
      )}
        </button>
        <a
          href={user.html_url}
          target='_blank'
          rel='noopener noreferrer'
          className='profile-btn'
        >
          <FaGithubAlt /> View Github Profile
        </a>
      </div>
    </div>
  );
};

export default UserCard;
