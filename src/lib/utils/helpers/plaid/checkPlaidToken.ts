import { cookies } from "next/headers";
import { notFound } from "next/navigation";

 const checkPlaidToken = async () => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/plaid/check`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
    }
  );

  const reqJSON = await req.json();

  if (reqJSON.linked === false) {
    return false;
  } else if (reqJSON.linked === true) {
    return true;
  }

  if (!req.ok) {
    console.error("Failed to check bank link status:", reqJSON.error);
    return notFound();
  }
};

export default checkPlaidToken;