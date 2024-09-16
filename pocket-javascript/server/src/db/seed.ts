import dayjs from "dayjs";
import { client, db } from ".";
import { goalCompletions, goals } from "./schema";

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: "Wake Up at 5:00 AM", desiredWeeklyFrequency: 5 },
      { title: "Do 30 Push Ups", desiredWeeklyFrequency: 6 },
      { title: "Read a Book", desiredWeeklyFrequency: 7 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, "day").toDate() },
  ]);
}

// Run this after finishing querying or not the seed
seed().finally(() => {
  client.end();
});
