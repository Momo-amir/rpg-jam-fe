import { getSession } from "@/lib/session";

export default async function Dashboard() {
  const user = await getSession();

  return (
    <main className='container'>
      {" "}
      <div className='my-20'>
        <h2>
          {user ? ` ${user.displayName}'s Dashboard` : "How did you get here?"}
        </h2>
        <p></p>
      </div>{" "}
    </main>
  );
}
