import { ensureTodayLog, getLogByDate, upsertToday } from "@/app/actions";

function pickMeal(meals: any[], type: string) {
  const m = meals?.find((x) => x.type === type);
  return m?.text ?? "";
}

export default async function TodayPage() {
  const date = await ensureTodayLog();
  const log = await getLogByDate(date);

  const meals = log?.meals ?? [];
  const workouts = log?.workouts ?? [];
  const workout = workouts[0];

  return (
    <main>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>今日の入力</h1>
      <p style={{ opacity: 0.7, marginBottom: 16 }}>date: {date}</p>

      <form action={upsertToday} style={{ display: "grid", gap: 16 }}>
        <input type="hidden" name="date" value={date} />

        <section style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>体重</h2>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr 1fr" }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>体重(kg)</span>
              <input
                name="weightKg"
                inputMode="decimal"
                defaultValue={log?.weightKg ?? ""}
                placeholder="例: 85.5"
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>体脂肪(%)</span>
              <input
                name="bodyFatPct"
                inputMode="decimal"
                defaultValue={log?.bodyFatPct ?? ""}
                placeholder="例: 24.0"
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>歩数</span>
              <input
                name="steps"
                inputMode="numeric"
                defaultValue={log?.steps ?? ""}
                placeholder="例: 8000"
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
          </div>
        </section>

        <section style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>食事（テキストでOK）</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>朝</span>
              <textarea
                name="meal_breakfast"
                defaultValue={pickMeal(meals, "breakfast")}
                rows={2}
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>昼</span>
              <textarea
                name="meal_lunch"
                defaultValue={pickMeal(meals, "lunch")}
                rows={2}
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>夜</span>
              <textarea
                name="meal_dinner"
                defaultValue={pickMeal(meals, "dinner")}
                rows={2}
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>間食</span>
              <textarea
                name="meal_snack"
                defaultValue={pickMeal(meals, "snack")}
                rows={2}
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
          </div>
        </section>

        <section style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>運動</h2>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "2fr 1fr 1fr" }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span>種目</span>
              <input
                name="workout_activity"
                defaultValue={workout?.activity ?? ""}
                placeholder="例: ランニング"
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>分</span>
              <input
                name="workout_minutes"
                inputMode="numeric"
                defaultValue={workout?.minutes ?? ""}
                placeholder="例: 30"
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span>強度(任意)</span>
              <input
                name="workout_intensity"
                defaultValue={workout?.intensity ?? ""}
                placeholder="低/中/高 など"
                style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
              />
            </label>
          </div>
        </section>

        <section style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>メモ</h2>
          <textarea
            name="note"
            defaultValue={log?.note ?? ""}
            rows={3}
            placeholder="睡眠/体調/飲酒など（任意）"
            style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
          />
        </section>

        <button
          type="submit"
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          保存する
        </button>
      </form>
    </main>
  );
}
