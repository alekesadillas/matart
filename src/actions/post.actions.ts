"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.actions";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, imageUrl: string) {
    try {
        const userId = await getDbUserId();

        const post = await prisma.post.create({
            data:{
                content,
                image: imageUrl,
                authorId: userId,
            }
        })

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error al crear el post:", error);
        return { success: false, error: "Error al crear el post" };

    }
}   