const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const SeedingDb = async () => {
  await prisma.bookEvent.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  const password1 = await bcrypt.hash("abdo1Password", 10);
  const password2 = await bcrypt.hash("abdo2Password", 10);
  const password3 = await bcrypt.hash("abdo3Password", 10);
  const password4 = await bcrypt.hash("abdo4Password", 10);
  const usersData = [
    { name: "abdo1", email: "abdo1@gmail.com", password: password1 },
    { name: "abdo2", email: "abdo2@gmail.com", password: password2 },
    { name: "abdo3", email: "abdo3@gmail.com", password: password3 },
    { name: "abdo4", email: "abdo4@gmail.com", password: password4 },
  ];

  const EventData = [
    [
      {
        title: "title one by abdo one",
        description: "description one by abdo one",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title two by abdo one",
        description: "description two by abdo one",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title Tree by abdo one",
        description: "description Tree by abdo one",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title four by abdo one",
        description: "description four by abdo one",
        date: "2022-07-28T16:22:09.560Z",
      },
    ],
    [
      {
        title: "title one by abdo Two",
        description: "description one by abdo Two",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title two by abdo Two",
        description: "description two by abdo Two",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title Tree by abdo Two",
        description: "description Tree by abdo Two",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title four by abdo Two",
        description: "description four by abdo Two",
        date: "2022-07-28T16:22:09.560Z",
      },
    ],
    [
      {
        title: "title one by abdo Tree",
        description: "description one by abdo Tree",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title two by abdo Tree",
        description: "description two by abdo Tree",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title Tree by abdo Tree",
        description: "description Tree by abdo Tree",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title four by abdo Tree",
        description: "description four by abdo Tree",
        date: "2022-07-28T16:22:09.560Z",
      },
    ],
    [
      {
        title: "title one by abdo four",
        description: "description one by abdo four",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title two by abdo four",
        description: "description two by abdo four",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title Tree by abdo four",
        description: "description Tree by abdo four",
        date: "2022-07-28T16:22:09.560Z",
      },
      {
        title: "title four by abdo four",
        description: "description four by abdo four",
        date: "2022-07-28T16:22:09.560Z",
      },
    ],
  ];
  // const password4 = bcrypt.hash("abdo4Password", 10);

  for (let i = 0; i < usersData.length; i++) {
    await prisma.user.create({
      data: {
        name: usersData[i].name,
        email: usersData[i].email,
        password: usersData[i].password,
        createdEvents: {
          createMany: { data: EventData[i] },
        },
      },
    });
  }
  // get array of users ids
  let usersId = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  usersId = usersId.map((user) => {
    return user.id;
  });
  // get array of ids of abdo1 events
  let abdo1Ids = await prisma.event.findMany({
    where: {
      createId: usersId[0],
    },
  });
  abdo1Ids = abdo1Ids.map((event) => {
    return event.id;
  });
  // get array of ids of abdo1 events
  let abdo2Ids = await prisma.event.findMany({
    where: {
      createId: usersId[1],
    },
  });
  abdo2Ids = abdo2Ids.map((event) => {
    return event.id;
  });
  // get array of ids of abdo1 events
  let abdo3Ids = await prisma.event.findMany({
    where: {
      createId: usersId[2],
    },
  });
  abdo3Ids = abdo3Ids.map((event) => {
    return event.id;
  });
  // get array of ids of abdo1 events
  let abdo4Ids = await prisma.event.findMany({
    where: {
      createId: usersId[3],
    },
  });
  abdo4Ids = abdo4Ids.map((event) => {
    return event.id;
  });
  

  // arrays of the booked events for each user
  const bookedByAbdo1 = [abdo2Ids[1], abdo2Ids[2], abdo3Ids[3], abdo4Ids[3]];
  const bookedByAbdo2 = [
    abdo1Ids[0],
    abdo1Ids[3],
    abdo3Ids[3],
    abdo4Ids[3],
    abdo4Ids[2],
    abdo4Ids[0],
  ];
  const bookedByAbdo3 = [
    abdo2Ids[0],
    abdo2Ids[2],
    abdo4Ids[2],
    abdo4Ids[3],
    abdo1Ids[1],
  ];
  
  // booked events by abdo1
  for (let i = 0; i < bookedByAbdo1.length; i++) {
    await prisma.bookEvent.create({
      data: {
        userId: usersId[0],
        eventId: bookedByAbdo1[i],
      },
    });
  }
  // booked events by abdo2
  for (let i = 0; i < bookedByAbdo2.length; i++) {
    await prisma.bookEvent.create({
      data: {
        userId: usersId[1],
        eventId: bookedByAbdo2[i],
      },
    });
  }
  // booked events by abdo1
  for (let i = 0; i < bookedByAbdo3.length; i++) {
    await prisma.bookEvent.create({
      data: {
        userId: usersId[2],
        eventId: bookedByAbdo3[i],
      },
    });
  }
  
};

SeedingDb()
  .then(console.log("seeding done"))
  .catch(console.log("error in seeding"));
