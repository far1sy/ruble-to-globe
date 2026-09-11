import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeftRight, CreditCard, Sparkles } from "lucide-react";
import { useTelegram, haptic } from "@/lib/telegram";
import { ExchangeTab } from "@/components/mini/ExchangeTab";
import { SubscriptionsTab } from "@/components/mini/SubscriptionsTab";
import { CardsTab } from "@/components/mini/CardsTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neobank — обмен валют, подписки и зарубежные карты" },
      {
        name: "description",
        content:
          "Telegram Mini App: обмен валют по выгодному курсу, оплата зарубежных подписок и выпуск иностранных банковских карт.",
      },
      { property: "og:title", content: "Neobank — финансовый хаб в Telegram" },
      {
        property: "og:description",
        content:
          "Обмен валют, подписки Spotify, Netflix, ChatGPT и зарубежные карты Казахстана, Турции, ОАЭ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MiniApp,
});

const TABS = [
  { id: "exchange", label: "Обмен", icon: ArrowLeftRight },
  { id: "subs", label: "Подписки", icon: Sparkles },
  { id: "cards", label: "Карты", icon: CreditCard },
] as const;

type TabId = (typeof TABS)[number]["id"];

function MiniApp() {
  useTelegram();
  const [tab, setTab] = useState<TabId>("exchange");

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <main key={tab} className="mx-auto max-w-md px-4 pb-28 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {tab === "exchange" ? <ExchangeTab /> : null}
        {tab === "subs" ? <SubscriptionsTab /> : null}
        {tab === "cards" ? <CardsTab /> : null}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-md">
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  haptic("light");
                  setTab(id);
                }}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`rounded-xl px-4 py-1.5 transition-colors ${
                    active ? "bg-primary/12" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
