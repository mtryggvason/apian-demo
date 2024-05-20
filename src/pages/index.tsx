import { auth, signIn } from '@/remote/authenticationService';
import GoogleButton from 'react-google-button';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

export default function Home() { 
  return <div className=" h-screen w-screen flex flex-col items-center justify-center ">
      <h1 className="text-5xl mb-10 text-black font-bold">Apian Task</h1>
  </div>;
};
