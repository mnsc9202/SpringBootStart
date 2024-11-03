"use server";
import { revalidatePath } from "next/cache";

// route cache 초기화
export async function resetRouteCache() {
  revalidatePath("/main", "page");
  revalidatePath("/main", "layout");
  revalidatePath("/sub", "page");
  revalidatePath("/sub", "layout");
}
