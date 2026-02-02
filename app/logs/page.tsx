import { listLogs } from "@/app/actions";

export default async function LogsPage() {
  const logs = await listLogs();

  return (
    <main>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>日別一覧</h1>

      <div style={{ display: "grid", gap: 10 }}>
        {logs.map((l) => (
          <a
            key={l.date}
            href={`/logs/${l.date}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              border: "1px solid #e5e5e5",
              borderRadius: 12,
              padding: 12,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "grid", gap: 4 }}>
              <div style={{ fontWeight: 700 }}>{l.date}</div>
              <div style={{ opacity: 0.7, fontSize: 13 }}>
                更新: {new Date(l.updatedAt).toLocaleString()}
              </div>
            </div>

            <div style={{ textAlign: "right", opacity: 0.9 }}>
              <div>体重: {l.weightKg ?? "-"} kg</div>
              <div>体脂肪: {l.bodyFatPct ?? "-"} %</div>
              <div>歩数: {l.steps ?? "-"}</div>
            </div>
          </a>
        ))}
        {logs.length === 0 && <p style={{ opacity: 0.7 }}>まだ記録がありません。/today から入力してください。</p>}
      </div>
    </main>
  );
}
