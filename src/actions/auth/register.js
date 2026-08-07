import clientPromise from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";

export const register = async (data) => {
    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME);
    const users = db.collection("users");
    const exists = await users.findOne({
        email: data.email,
    });
    if (exists)
        throw new Error("Email already exists.");
    const password = await hashPassword(data.password);
    await users.insertOne({
        name: data.name,
        email: data.email,
        password,
        role: "user",
        createdAt: new Date(),
    });
}