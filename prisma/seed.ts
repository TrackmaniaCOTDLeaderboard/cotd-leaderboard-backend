import { PrismaClient } from "@prisma/client";
import { updateZones } from "../src/services/zones";

const prisma = new PrismaClient();

const main = async () => {
    await updateZones();
}

main()
    .then(async _ => await prisma.$disconnect())
    .catch(async error => {
        await prisma.$disconnect();
        process.exit();
    })