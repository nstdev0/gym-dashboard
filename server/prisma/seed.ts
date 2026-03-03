import "dotenv/config";
import { Role } from "@/domain/enums/role.enum";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    const existingDefaultUser = await prisma.user.findUnique({
        where: { email: process.env.DEFAULT_USER_EMAIL! }
    })

    if (existingDefaultUser) {
        console.log("Default user already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_USER_PASSWORD!, 10);

    await prisma.user.create({
        data: {
            firstName: process.env.DEFAULT_USER_FIRSTNAME!,
            lastName: process.env.DEFAULT_USER_LASTNAME!,
            email: process.env.DEFAULT_USER_EMAIL!,
            password: hashedPassword,
            role: process.env.DEFAULT_USER_ROLE! as Role,
        },
    });

    console.log("Default user created successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });