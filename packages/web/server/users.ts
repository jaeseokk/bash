import { getPrismaClientDbMain } from "@/server/prisma";
import { AVATAR_FALLBACK_BACKGROUNDS } from "@/constants/profile";

const prisma = getPrismaClientDbMain();

export interface CreateUserInput {
  phoneNumber: string;
  username: string;
}

export const createUser = async (input: CreateUserInput) => {
  const avatarFallbackIndex = Math.floor(
    Math.random() * AVATAR_FALLBACK_BACKGROUNDS.length,
  );
  const avatarFallback = AVATAR_FALLBACK_BACKGROUNDS[avatarFallbackIndex];

  const newUser = await prisma.user.upsert({
    where: {
      phoneNumber: input.phoneNumber,
    },
    update: {
      username: input.username,
    },
    create: {
      phoneNumber: input.phoneNumber,
      username: input.username,
      avatarFallback,
    },
  });

  return newUser;
};
