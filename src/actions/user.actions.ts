"use server";

import prisma from "@/lib/prisma";

import { auth,currentUser } from "@clerk/nextjs/server";

export async function syncUser(){

    try {

        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            console.log("No userId or user found");
            return;
        }

        //Verificar si el usuario ya existe en la base de datos
        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            }
        });
        
        if (existingUser) {
            return existingUser;
        }

        // Validar que exista emailAddresses
        if (!user.emailAddresses || user.emailAddresses.length === 0) {
            console.log("No email addresses found for user");
            return;
        }

        const email = user.emailAddresses[0].emailAddress;
        const username = user.username ?? email.split('@')[0];
        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || null;

        const dbUser = await prisma.user.create({
            data: {
                clerkId: userId,
                name: name,
                username: username,
                email: email,
                image: user.imageUrl,
            }
        })

        console.log("User synced successfully:", dbUser.id);
        return dbUser;
        
    } catch (error) {
        console.error("Error syncing user:", error);
        throw error; // Re-lanzar el error para que se pueda manejar en el componente
    }

};

export async function getUserByClerkId(clerkId: string) {
    return prisma.user.findUnique({
        where: {
            clerkId,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true,
                },
            },
        },
    });
}

export async function getDbUserId() {
    const {userId:clerkId} = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const user = await getUserByClerkId(clerkId);

    if (!user) throw new Error("User not found");

    return user.id;
}
