import { useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { haptic, hapticSuccess } from "@/lib/telegram";

type Service = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  tone: string;
  note: string;
};

const SERVICES: Service[] = [
  { id: "spotify", name: "Spotify", emoji: "🎧", price: 400, tone: "from-emerald-500/25 to-emerald-500/5", note: "Individual / Family" },
  { id: "netflix", name: "Netflix", emoji: "🎬", price: 890, tone: "from-red-500/25 to-red-500/5", note: "Standard 1080p" },
  { id: "youtube", name: "YouTube Premium", emoji: "▶️", price: 320, tone: "from-rose-500/25 to-rose-500/5", note: "Без рекламы" },
  { id: "chatgpt", name: "ChatGPT Plus", emoji: "🤖", price: 2190, tone: "from-teal-500/25 to-teal-500/5", note: "GPT-5, приоритет" },
  { id: "psn", name: "PlayStation Plus", emoji: "🎮", price: 750, tone: "from-blue-500/25 to-blue-500/5", note: "Extra / Deluxe" },
  { id: "appstore", name: "App Store & iCloud", emoji: "", price: 290, tone: "from-slate-400/25 to-slate-400/5", note: "Пополнение баланса" },
  { id: "discord", name: "Discord Nitro", emoji: "💬", price: 540, tone: "from-indigo-500/25 to-indigo-500/5", note: "Полный Nitro" },
  { id: "midjourney", name: "Midjourney", emoji: "🖼️", price: 1290, tone: "from-violet-500/25 to-violet-500/5", note: "Basic plan" },
];

const PERIODS = [
  { months: 1, label: "1 мес", discount: 0 },
  { months: 3, label: "3 мес", discount: 0.05 },
  { months: 6, label: "6 мес", discount: 0.1 },
  { months: 12, label: "12 мес", discount: 0.18 },
];

const rub = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;

export function SubscriptionsTab() {
  const [active, setActive] = useState<Service | null>(null);
  const [months, setMonths] = useState(1);
  const [paid, setPaid] = useState(false);

  const period = PERIODS.find((p) => p.months === months)!;
  const base = active ? active.price * months : 0;
  const discount = base * period.discount;
  const fee = 99;
  const total = base - discount + fee;

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Подписки</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Зарубежные сервисы без карты и VPN
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              haptic();
              setMonths(1);
              setActive(s);
            }}
            className={`rounded-2xl border border-border/60 bg-gradient-to-br ${s.tone} p-4 text-left shadow-sm transition-transform active:scale-[0.97]`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/70 text-xl backdrop-blur">
              {s.emoji}
            </div>
            <div className="mt-3 line-clamp-1 font-semibold text-foreground">{s.name}</div>
            <div className="text-xs text-muted-foreground">{s.note}</div>
            <div className="mt-2 text-sm font-medium text-foreground">
              от {s.price} ₽/мес
            </div>
          </button>
        ))}
      </div>

      <BottomSheet open={!!active} onClose={() => setActive(null)} title={active?.name}>
        {active ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p.months}
                  onClick={() => {
                    haptic();
                    setMonths(p.months);
                  }}
                  className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
                    months === p.months
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 rounded-2xl bg-muted/60 p-4 text-sm">
              <Line label={`${active.price} ₽ × ${months} мес`} value={rub(base)} />
              {discount > 0 ? (
                <Line label={`Скидка ${Math.round(period.discount * 100)}%`} value={`−${rub(discount)}`} accent />
              ) : null}
              <Line label="Сервисный сбор" value={rub(fee)} />
              <div className="mt-2 flex justify-between border-t border-border/60 pt-2 text-base font-semibold text-foreground">
                <span>Итого</span>
                <span>{rub(total)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                hapticSuccess();
                setActive(null);
                setPaid(true);
              }}
              className="w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground active:scale-[0.98]"
            >
              Оплатить {rub(total)}
            </button>
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet open={paid} onClose={() => setPaid(false)} title="Оплачено">
        <p className="text-center text-sm text-muted-foreground">
          Доступ активируется в течение 10 минут, данные придут в чат.
        </p>
        <button
          onClick={() => setPaid(false)}
          className="mt-5 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground active:scale-[0.98]"
        >
          Готово
        </button>
      </BottomSheet>
    </div>
  );
}

function Line({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-medium text-emerald-500" : "font-medium text-foreground"}>
        {value}
      </span>
    </div>
  );
}
