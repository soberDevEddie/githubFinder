import { FaGithubAlt, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  checkIfFollowingUser,
  followGithubUser,
  unfollowGithubUser,
} from '../api/github';
import type { GithubUser } from '../types';

const UserCard = ({ user }: { user: GithubUser }) => {
  // Query to check if following the user
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ['followingStatus', user.login],
    queryFn: () => checkIfFollowingUser(user.login),
    enabled: !!user.login,
  });

  // Mutation to follow the user
  const followMutation = useMutation({
    mutationFn: () => followGithubUser(user.login),
    onSuccess: () => {
      toast.success(`You are now following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  // Mutation to unfollow the user
  const unfollowMutation = useMutation({
    mutationFn: () => unfollowGithubUser(user.login),
    onSuccess: () => {
      toast.success(`You are no longer following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <div className='user-card'>
      <img src={user.avatar_url} alt={user.name} className='avatar' />
      <h2>{user.name || user.login}</h2>
      <p className='bio'>{user.bio}</p>

      <div className='user-card buttons'>
        <button
          disabled={followMutation.isPending || unfollowMutation.isPending}
          onClick={handleFollow}
          className={`follow-btn ${isFollowing ? 'following' : ''} `}
        >
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
