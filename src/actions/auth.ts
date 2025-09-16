"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const returnUrl = formData.get("returnUrl") as string;

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("Login error:", error);
    const errorParam = encodeURIComponent(error.message);
    const returnParam = returnUrl ? `&returnUrl=${encodeURIComponent(returnUrl)}` : "";
    redirect(`/auth/login?error=${errorParam}${returnParam}`);
  }

  revalidatePath("/", "layout");

  // Redirect to returnUrl if provided, otherwise to campaigns
  redirect(returnUrl || "/campaigns");
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error("Registration error:", error);
    redirect(`/auth/register?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/auth/login?message=Check your email to confirm your account");
}

export async function signOutAction() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    return;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// Client-side compatible versions that return results
export async function loginWithResult(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function registerWithResult(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
