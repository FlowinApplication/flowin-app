import { SignIn } from "@clerk/nextjs";

export default function LogIn({ searchParams }: { searchParams: { redirect_url?: string } }) {

  const redirect = searchParams?.redirect_url ?? "/";
  
  return (
    <div className="min-h-screen grid place-items-center">
      <SignIn redirectUrl={redirect} />
    </div>
  );
}