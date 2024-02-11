import LoginForm from "@/components/user/LoginForm";


import AllCookies from "@/components/user/testpurposes_cookies";//---------------------------------------------------------------------------------------


export default function Home() {
  return (
    <main className="flex flex-col max-w-7xl items-center justify-between p-24">
      <AllCookies/>
      <LoginForm />
    </main>
  );
}
