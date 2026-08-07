"use server";
import { signIn } from "@/lib/auth";

export const login = async (data) => {
    await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirectTo: "/dashboard",
    });
}