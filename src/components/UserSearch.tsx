import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { fetchGithubUser, searchGithubUser } from '../api/github';
import UserCard from './UserCard';
import RecentSearches from './RecentSearches';
import SuggestionDropdown from './SuggestionDropdown';
import type { GithubUser } from '../types';

const UserSearch = () => {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem('recentUsers');

    return stored ? JSON.parse(stored) : [];
  });

  const [debouncedUsername] = useDebounce(username, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Query to fetch specific user
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername,
  });

  // Query to fetch user suggestions
  const { data: suggestions } = useQuery({
    queryKey: ['github-user-suggestions', debouncedUsername],
    queryFn: () => searchGithubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) return;

    setSubmittedUsername(trimmedUsername);
    setUsername('');

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
        <div className='dropdown-wrapper'>
          <input
            type='text'
            placeholder='Enter Github Username...'
            value={username}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestions(val.trim().length > 1);
            }}
          />

          {showSuggestions && suggestions?.length > 0 && (
            <SuggestionDropdown
              suggestions={suggestions}
              show={showSuggestions}
              onSelect={(selected) => {
                setUsername(selected);
                setShowSuggestions(false);

                if (submittedUsername !== selected) {
                  setSubmittedUsername(selected);
                } else {
                  refetch();
                }

                setRecentUsers((prev) => {
                  const updated = [
                    selected,
                    ...prev.filter((user) => user !== selected),
                  ];
                  return updated.slice(0, 5);
                });
              }}
            />
          )}
        </div>
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
