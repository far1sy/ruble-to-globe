import { useMemo, useState } from "react";
import { ArrowDownUp, ChevronDown, ShieldCheck, Timer } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { haptic, hapticSuccess } from "@/lib/telegram";

type Currency = {
  code: string;
  name: string;
  flag: string;
  /** Стоимость 1 единицы в рублях */
  rub: number;
};

const CURRENCIES: Currency[] = [
  { code: "RUB", name: "Российский рубль", flag: "🇷🇺", rub: 1 },
  { code: "USDT", name: "Tether", flag: "💵", rub: 92.4 },
  { code: "USD", name: "Доллар США", flag: "🇺🇸", rub: 94.1 },
  { code: "EUR", name: "Евро", flag: "🇪🇺", rub: 101.6 },
  { code: "KZT", name: "Казахстанский тенге", flag: "🇰🇿", rub: 0.19 },
  { code: "TRY", name: "Турецкая лира", flag: "🇹🇷", rub: 2.71 },
  { code: "AED", name: "Дирхам ОАЭ", flag: "🇦🇪", rub: 25.6 },
];

const byCode = (code: string) => CURRENCIES.find((c) => c.code === code)!;

const fmt = (n: number) =>
  n >= 1000
    ? n.toLocaleString("ru-RU", { maximumFractionDigits: 2 })
    : n.toLocaleString("ru-RU", { maximumFractionDigits: 4 });

export function ExchangeTab() {
  const [from, setFrom] = useState("RUB");
  const [to, setTo] = useState("USDT");
  const [amount, setAmount] = useState("50000");
  const [picker, setPicker] = useState<null | "from" | "to">(null);
  const [done, setDone] = useState(false);

  const rate = useMemo(() => byCode(from).rub / byCode(to).rub, [from, to]);
  const value = Number(amount.replace(",", ".")) || 0;
  const receive = value * rate * 0.995;

  const swap = () => {
    haptic("medium");
    setFrom(to);
    setTo(from);
  };

  const choose = (code: string) => {
    haptic();
    if (picker === "from") setFrom(code === to ? from : code);
    else setTo(code === from ? to : code);
    setPicker(null);
  };

  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Обмен валют</h1>
        <p className="mt-1 text-sm text-muted-foreground">Курс обновлён 12 секунд назад</p>
      </header>

      <div className="relative space-y-2">
        <Field
          label="Отдаёте"
          currency={byCode(from)}
          value={amount}
          onValue={setAmount}
          onPick={() => {
            haptic();
            setPicker("from");
          }}
        />
        <button
          onClick={swap}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-4 border-background bg-primary p-3 text-primary-foreground shadow-lg transition-transform active:scale-90"
          aria-label="Поменять валюты местами"
        >
          <ArrowDownUp className="h-4 w-4" />
        </button>
        <Field
          label="Получаете"
          currency={byCode(to)}
          value={receive ? fmt(receive) : ""}
          readOnly
          onPick={() => {
            haptic();
            setPicker("to");
          }}
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-4 text-sm backdrop-blur">
        <Row label={`Курс`} value={`1 ${from} = ${fmt(rate)} ${to}`} />
        <Row label="Комиссия сервиса" value="0,5%" />
        <Row label="Время зачисления" value="5–15 минут" />
      </div>

      <div className="flex items-center gap-4 px-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" /> Гарантия сделки
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Timer className="h-4 w-4" /> Курс фиксируется на 10 мин
        </span>
      </div>

      <button
        onClick={() => {
          hapticSuccess();
          setDone(true);
        }}
        className="w-full rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-lg transition-transform active:scale-[0.98]"
      >
        Продолжить
      </button>

      <BottomSheet
        open={picker !== null}
        onClose={() => setPicker(null)}
        title="Выберите валюту"
      >
        <div className="space-y-1">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => choose(c.code)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors active:bg-muted"
            >
              <span className="text-2xl">{c.flag}</span>
              <span className="flex-1">
                <span className="block font-medium text-foreground">{c.code}</span>
                <span className="block text-xs text-muted-foreground">{c.name}</span>
              </span>
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet open={done} onClose={() => setDone(false)} title="Заявка создана">
        <p className="text-center text-sm text-muted-foreground">
          Вы получите {fmt(receive)} {to}. Оператор свяжется с вами в чате в течение минуты.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-5 w-full rounded-2xl bg-primary py-4 font-semibold text-primary-foreground active:scale-[0.98]"
        >
          Хорошо
        </button>
      </BottomSheet>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function Field({
  label,
  currency,
  value,
  onValue,
  onPick,
  readOnly,
}: {
  label: string;
  currency: Currency;
  value: string;
  onValue?: (v: string) => void;
  onPick: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="flex items-center gap-3">
        <input
          inputMode="decimal"
          value={value}
          readOnly={readOnly}
          placeholder="0"
          onChange={(e) => onValue?.(e.target.value.replace(/[^\d.,]/g, ""))}
          className="min-w-0 flex-1 bg-transparent text-2xl font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
        />
        <button
          onClick={onPick}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-sm font-semibold text-foreground active:scale-95"
        >
          <span className="text-base">{currency.flag}</span>
          {currency.code}
          <ChevronDown className="h-4 w-4 opacity-60" />
        </button>
      </div>
    </div>
  );
}
