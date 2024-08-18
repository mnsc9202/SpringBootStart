"use client";

import RegisterForm from "@/app/_layout/registerForm";
import { boardFetcher } from "@/app/api/boardService";

export default function BoardRegister() {
  return (
    <>
      <RegisterForm
        fectcher={(body: string) =>
          boardFetcher(
            `${process.env.NEXT_PUBLIC_API_HOST}/board`,
            "POST",
            body
          )
        }
      />
    </>
  );
}
