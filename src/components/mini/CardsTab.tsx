import { useState } from "react";
import { Copy, Plus, Snowflake, Wifi } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { haptic, hapticSuccess } from "@/lib/telegram";

type Country = {
  id: string;
  flag: string;
  name: string;
  bank: string;
  price: string;
  delivery: string;
  limit: string;
};

const COUNTRIES: Country[] = [
  { id: "kz", flag: "🇰🇿", name: "Казахстан", bank: "Freedom Bank · Visa", price: "4 900 ₽", delivery: "1–2 дня", limit: "до 10 000 $/мес" },
  { id: "tr", flag: "🇹🇷", name: "Турция", bank: "Ziraat · Mastercard", price: "7 500 ₽", delivery: "3–5 дней", limit: "до 15 000 $/мес" },
  { id: "kg", flag: "🇰🇬", name: "Киргизия", bank: "MBank · Visa", price: "3 900 ₽", delivery: "1 день", limit: "до 5 000 $/мес" },
  { id: "ae", flag: "🇦🇪", name: "ОАЭ", bank: "Wio · Mastercard", price: "19 900 ₽", delivery: "7–10 дней", limit: "без лимита" },
];

export function CardsTab() {
  const [tab, setTab] = useState<"my" | "new">("my");
  const [frozen, setFrozen] = useState(false);
  const [sheet, setSheet] = useState<null | "topup" | "details">(null);
  const [order, setOrder] = useState<Country | null>(null);
  const [ordered, setOrdered] = useState(false);

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Карты</h1>
        <p className="mt-1 text-sm text-muted-foreground">Зарубежные карты для оплаты по всему миру</p>
      </header>

      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
        {(["my", "new"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              haptic();
              setTab(t);
            }}
            className={`rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t === "my" ? "Мои карты" : "Выпустить новую"}
          </button>
        ))}
      </div>

      {tab === "my" ? (
        <div className="space-y-4">
          <div
            className={`relative overflow-hidden rounded-3xl p-5 text-white shadow-xl transition-all ${
              frozen ? "opacity-60 saturate-0" : ""
            }`}
            style={{
              background:
                "linear-gradient(135deg, oklch(0.42 0.16 265) 0%, oklch(0.28 0.12 285) 55%, oklch(0.22 0.06 250) 100%)",
            }}
          >
            <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-white/60">Баланс</div>
                <div className="mt-1 text-3xl font-semibold">1 248,60 $</div>
              </div>
              <Wifi className="h-5 w-5 rotate-90 text-white/70" />
            </div>
            <div className="mt-8 font-mono text-lg tracking-[0.2em]">•••• •••• •••• 1234</div>
            <div className="mt-4 flex items-end justify-between text-xs text-white/70">
              <div>
                <div>Владелец</div>
                <div className="text-sm text-white">MANUCHEHR T.</div>
              </div>
              <div>
                <div>Срок</div>
                <div className="text-sm text-white">08/29</div>
              </div>
              <div className="text-base font-semibold italic text-white">VISA</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Action icon={<Plus className="h-5 w-5" />} label="Пополнить" onClick={() => { haptic(); setSheet("topup"); }} />
            <Action icon={<Copy className="h-5 w-5" />} label="Реквизиты" onClick={() => { haptic(); setSheet("details"); }} />
            <Action
              icon={<Snowflake className="h-5 w-5" />}
              label={frozen ? "Разморозить" : "Заморозить"}
              active={frozen}
              onClick={() => {
                haptic("medium");
                setFrozen((f) => !f);
              }}
            />
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="mb-3 text-sm font-semibold text-foreground">Последние операции</div>
            {[
              { t: "Netflix", d: "Подписка · 12 сен", a: "−15,49 $" },
              { t: "Пополнение", d: "USDT · 11 сен", a: "+300,00 $" },
              { t: "Steam", d: "Игры · 9 сен", a: "−59,99 $" },
            ].map((op) => (
              <div key={op.t} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium text-foreground">{op.t}</div>
                  <div className="text-xs text-muted-foreground">{op.d}</div>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    op.a.startsWith("+") ? "text-emerald-500" : "text-foreground"
                  }`}
                >
                  {op.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {COUNTRIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                haptic();
                setOrder(c);
              }}
              className="flex w-full items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 text-left shadow-sm active:scale-[0.98]"
            >
              <span className="text-3xl">{c.flag}</span>
              <span className="flex-1">
                <span className="block font-semibold text-foreground">{c.name}</span>
                <span className="block text-xs text-muted-foreground">{c.bank}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Выпуск {c.delivery} · {c.limit}
                </span>
              </span>
              <span className="text-sm font-semibold text-foreground">{c.price}</span>
            </button>
          ))}
        </div>
      )}

      <BottomSheet open={sheet === "topup"} onClose={() => setSheet(null)} title="Пополнение карты">
        <div className="space-y-3 text-sm">
          {["С баланса USDT", "Переводом СБП", "Наличными в офисе"].map((m) => (
            <div key={m} className="rounded-2xl bg-muted/60 px-4 py-3 font-medium text-foreground">
              {m}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            hapticSuccess();
            setSheet(null);
          }}
          className="mt-5 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground active:scale-[0.98]"
        >
          Пополнить
        </button>
      </BottomSheet>

      <BottomSheet open={sheet === "details"} onClose={() => setSheet(null)} title="Реквизиты карты">
        <div className="space-y-2 text-sm">
          <Detail label="Номер" value="4149 2201 5566 1234" />
          <Detail label="Срок" value="08/29" />
          <Detail label="CVV" value="•••" />
          <Detail label="Держатель" value="MANUCHEHR T." />
          <Detail label="Банк" value="Freedom Bank Kazakhstan" />
        </div>
      </BottomSheet>

      <BottomSheet open={!!order} onClose={() => setOrder(null)} title={`Карта · ${order?.name ?? ""}`}>
        {order ? (
          <div className="space-y-4">
            <div className="space-y-1.5 rounded-2xl bg-muted/60 p-4 text-sm">
              <Detail label="Банк" value={order.bank} />
              <Detail label="Срок выпуска" value={order.delivery} />
              <Detail label="Лимиты" value={order.limit} />
              <Detail label="Стоимость" value={order.price} />
            </div>
            <button
              onClick={() => {
                hapticSuccess();
                setOrder(null);
                setOrdered(true);
              }}
              className="w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground active:scale-[0.98]"
            >
              Оформить за {order.price}
            </button>
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet open={ordered} onClose={() => setOrdered(false)} title="Заявка принята">
        <p className="text-center text-sm text-muted-foreground">
          Менеджер напишет в чат и запросит документы для выпуска карты.
        </p>
        <button
          onClick={() => setOrdered(false)}
          className="mt-5 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground active:scale-[0.98]"
        >
          Понятно
        </button>
      </BottomSheet>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function Action({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl border border-border/60 p-3 text-xs font-medium transition-colors active:scale-95 ${
        active ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
