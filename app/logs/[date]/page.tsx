import { getLogByDate } from "@/app/actions";
import { notFound } from "next/navigation";

export default async function LogDetailPage({ params }: { params: { date: string } }) {
  const date = params.date;
  const log = await getLogByDate(date);

  if (!log) return notFound();

  return (
    <main>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{date} の記録</h1>

      <section style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>体重/歩数</h2>
        <div>体重: {log.weightKg ?? "-"} kg</div>
        <div>体脂肪: {log.bodyFatPct ?? "-"} %</div>
        <div>歩数: {log.steps ?? "-"}</div>
      </section>

      <section style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>食事</h2>
        {log.meals.length === 0 ? (
          <div style={{ opacity: 0.7 }}>記録なし</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            {log.meals
              .slice()
              .sort((a, b) => String(a.type).localeCompare(String(b.type)))
              .map((m) => (
                <li key={m.id}>
                  <b>{m.type}</b>: {m.text}
                </li>
              ))}
          </ul>
        )}
      </section>

      <section style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>運動</h2>
        {log.workouts.length === 0 ? (
          <div style={{ opacity: 0.7 }}>記録なし</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            {log.workouts.map((w) => (
              <li key={w.id}>
                {w.activity} / {w.minutes}分 {w.intensity ? `(${w.intensity})` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>メモ</h2>
        <div style={{ whiteSpace: "pre-wrap" }}>{log.note ?? "（なし）"}</div>
      </section>

      <div style={{ marginTop: 14 }}>
        <a href="/today">今日の入力へ</a> / <a href="/logs">一覧へ</a>
      </div>
    </main>
  );
}
