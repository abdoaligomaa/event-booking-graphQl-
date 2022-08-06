const {PrismaClient}=require('@prisma/client')
const prisma=new PrismaClient()
const bcrypt=require("bcryptjs")

const SeedingDb=async()=>{
  await prisma.bookEvent.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  const password1 =await bcrypt.hash("abdo1Password", 10);
  const password2 =await bcrypt.hash("abdo2Password", 10);
  const password3 =await bcrypt.hash("abdo3Password", 10);
  // const password4 = bcrypt.hash("abdo4Password", 10);

  const userOne = await prisma.user.create({
    data: {
      name: "abdo1",
      email: "abdo1@gmail.com",
      password: password1,
      createdEvents: {
        createMany: {
          data: [
            {
              title: "title one by abdo one",
              description: "description one by abdo one",
            },
            {
              title: "title two by abdo one",
              description: "description two by abdo one",
            },
            {
              title: "title Tree by abdo one",
              description: "description Tree by abdo one",
            },
            {
              title: "title four by abdo one",
              description: "description four by abdo one",
            },
          ],
        },
      },
    },
  });
  // create user two
  const userTwo = await prisma.user.create({
    data: {
      name: "abdo2",
      email: "abdo2@gmail.com",
      password: password2,
      createdEvents: {
        createMany: {
          data: [
            {
              title: "title one by abdo Two",
              description: "description one by abdo Two",
            },
            {
              title: "title two by abdo Two",
              description: "description two by abdo Two",
            },
            {
              title: "title Tree by abdo Two",
              description: "description Tree by abdo Two",
            },
            {
              title: "title four by abdo Two",
              description: "description four by abdo Two",
            },
          ],
        },
      },
    },
  });
  // create user tree
  // create user two
  const userTree = await prisma.user.create({
    data: {
      name: "abdo3",
      email: "abdo3@gmail.com",
      password: password3,
      createdEvents: {
        createMany: {
          data: [
            {
              title: "title one by abdo Tree",
              description: "description one by abdo Tree",

            },
            {
              title: "title two by abdo Tree",
              description: "description two by abdo Tree",
            },
            {
              title: "title Tree by abdo Tree",
              description: "description Tree by abdo Tree",
            },
            {
              title: "title four by abdo Tree",
              description: "description four by abdo Tree",
            },
          ],
        },
      },
    },
  });
  console.log(userOne)
  console.log(userTwo)
  console.log(userTree);
}
SeedingDb().then(console.log("seeding done")).catch(console.log('error in seeding'))