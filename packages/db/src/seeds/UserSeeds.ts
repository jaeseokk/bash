import type { PrismaDbMain as Prisma } from "../";
import { AbstractSeed } from "../lib/AbstractSeed";

const userData: Prisma.UserCreateInput[] = [
  {
    username: "Jaeseok Kang",
    phoneNumber: "01012345678",
  },
];

export class UserSeeds extends AbstractSeed {
  execute = async (): Promise<void> => {
    for (const u of userData) {
      const { phoneNumber, username, ...userNonUnique } = u;
      const user = await this.prisma.user.upsert({
        where: { phoneNumber },
        update: userNonUnique,
        create: u,
      });
      this.log(
        "UPSERT",
        `User ${user.id} - ${user.phoneNumber} - ${user.password}`,
      );
    }
  };
}
