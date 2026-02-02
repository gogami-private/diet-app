"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { MealType } from "@prisma/client";

function todayYmd(): string {
  // サーバーのTZに依存したくなければ、後でAsia/Tokyo固定にしてもOK
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseNullableFloat(v: string | null): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseNullableInt(v: string | null): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function parseMealType(v: string): MealType {
  if (v === "breakfast" || v === "lunch" || v === "dinner" || v === "snack") return v;
  return "snack";
}

export async function getLogByDate(date: string) {
  return prisma.dailyLog.findUnique({
    where: { date },
    include: { meals: true, workouts: true },
  });
}

export async function listLogs() {
  return prisma.dailyLog.findMany({
    orderBy: { date: "desc" },
    select: { date: true, weightKg: true, bodyFatPct: true, steps: true, updatedAt: true },
  });
}

export async function upsertToday(formData: FormData) {
  const date = (formData.get("date") as string) || todayYmd();

  const weightKg = parseNullableFloat(formData.get("weightKg") as string | null);
  const bodyFatPct = parseNullableFloat(formData.get("bodyFatPct") as string | null);
  const steps = parseNullableInt(formData.get("steps") as string | null);
  const noteRaw = (formData.get("note") as string | null) ?? null;
  const note = noteRaw && noteRaw.trim().length > 0 ? noteRaw.trim() : null;

  const breakfast = ((formData.get("meal_breakfast") as string | null) ?? "").trim();
  const lunch = ((formData.get("meal_lunch") as string | null) ?? "").trim();
  const dinner = ((formData.get("meal_dinner") as string | null) ?? "").trim();
  const snack = ((formData.get("meal_snack") as string | null) ?? "").trim();

  const workoutActivity = ((formData.get("workout_activity") as string | null) ?? "").trim();
  const workoutMinutes = parseNullableInt(formData.get("workout_minutes") as string | null);
  const workoutIntensity = ((formData.get("workout_intensity") as string | null) ?? "").trim();

  // まずDailyLogを作る/更新する
  const log = await prisma.dailyLog.upsert({
    where: { date },
    create: { date, weightKg, bodyFatPct, steps, note },
    update: { weightKg, bodyFatPct, steps, note },
    select: { id: true, date: true },
  });

  // Mealは「その日のtypeごとに1件」に寄せる（MVP簡易）
  // 空欄なら削除、入力ありなら upsert 的に更新
  async function upsertMeal(type: MealType, text: string) {
    const existing = await prisma.mealEntry.findFirst({
      where: { dailyLogId: log.id, type },
      select: { id: true },
    });

    if (!text) {
      if (existing) await prisma.mealEntry.delete({ where: { id: existing.id } });
      return;
    }
    if (existing) {
      await prisma.mealEntry.update({ where: { id: existing.id }, data: { text, date: log.date } });
    } else {
      await prisma.mealEntry.create({
        data: { dailyLogId: log.id, type, text, date: log.date },
      });
    }
  }

  await upsertMeal("breakfast", breakfast);
  await upsertMeal("lunch", lunch);
  await upsertMeal("dinner", dinner);
  await upsertMeal("snack", snack);

  // WorkoutはMVPなので「その日1件」扱い（複数対応は後で）
  const existingWorkout = await prisma.workoutEntry.findFirst({
    where: { dailyLogId: log.id },
    select: { id: true },
  });

  const shouldHaveWorkout = !!workoutActivity && !!workoutMinutes && workoutMinutes > 0;

  if (!shouldHaveWorkout) {
    if (existingWorkout) await prisma.workoutEntry.delete({ where: { id: existingWorkout.id } });
  } else {
    if (existingWorkout) {
      await prisma.workoutEntry.update({
        where: { id: existingWorkout.id },
        data: {
          date: log.date,
          activity: workoutActivity,
          minutes: workoutMinutes!,
          intensity: workoutIntensity || null,
        },
      });
    } else {
      await prisma.workoutEntry.create({
        data: {
          dailyLogId: log.id,
          date: log.date,
          activity: workoutActivity,
          minutes: workoutMinutes!,
          intensity: workoutIntensity || null,
        },
      });
    }
  }

  revalidatePath("/today");
  revalidatePath("/logs");
  revalidatePath(`/logs/${date}`);
  return { ok: true, date };
}

export async function ensureTodayLog(): Promise<string> {
  const date = todayYmd();
  await prisma.dailyLog.upsert({
    where: { date },
    create: { date },
    update: {},
  });
  return date;
}
