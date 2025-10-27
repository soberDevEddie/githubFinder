import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchGitubUser } from '../api/github';
import UserCard from './UserCard';
import RecentSearches from './RecentSearches';

const UserSearch = () => {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [recentUsers, setRecentUsers] = useState<string[]>(()=> {
    const stored = localStorage.getItem('recentUsers');

    return stored ? JSON.parse(stored) : [];
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users', submittedUsername],
    queryFn: () => fetchGitubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    setSubmittedUsername(trimmedUsername);

    setRecentUsers((prev) => {
      const updated = [
        trimmedUsername,
        ...prev.filter((user) => user !== trimmedUsername),
      ];
      return updated.slice(0, 5);
    });
  };

  useEffect(() => {
    localStorage.setItem('recentUsers', JSON.stringify(recentUsers));
  }, [recentUsers]);

  return (
    <>
      <form onSubmit={handleSubmit} className='form'>
        <input
          type='text'
          placeholder='Enter Github Username...'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>

      {isLoading && <p className='status'>Loading</p>}
      {isError && <p className='status error'>{error.message}</p>}

      {data && <UserCard user={data} />}

      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(username) => {
            setUsername(username);
            setSubmittedUsername(username);
          }}
        />
      )}
    </>
  );
};

export default UserSearch;
