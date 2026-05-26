import { useParams } from 'react-router-dom';

export const ProfilePage = () => {
  const { username } = useParams();
  return (
    <section>
      <h1 className="text-2xl font-bold">@{username}</h1>
      <p>Public profile with authored notes and favorites.</p>
    </section>
  );
};
