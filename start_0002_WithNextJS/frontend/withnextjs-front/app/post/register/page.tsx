"use client";

import RegisterForm from "@/app/_layout/registerForm";
import { postFetcher } from "@/app/api/postService";
import { useSearchParams } from "next/navigation";

export default function PostRegister() {
  /******************** info ********************/
  const searchParams = useSearchParams(); // param

  return (
    <>
      <RegisterForm
        fectcher={(body: string) =>
          postFetcher(`${process.env.NEXT_PUBLIC_API_HOST}/post`, "POST", body)
        }
        boardId={searchParams.get("boardId") ?? undefined}
      />
    </>
  );
}
