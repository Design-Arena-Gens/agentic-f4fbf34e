"use client";

import { useActionState, useMemo, useState } from "react";
import { shareToTelegram } from "@/app/actions";
import type { CarArticle } from "@/lib/carSources";

type Props = {
  articles: CarArticle[];
  sources: Array<{ id: string; name: string }>;
};

type ShareState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const initialState: ShareState = { status: "idle" };

export function NewsDashboard({ articles, sources }: Props) {
  const [activeSources, setActiveSources] = useState(() =>
    sources.map((source) => source.id),
  );
  const [keyword, setKeyword] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (!activeSources.includes(article.sourceId)) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const haystack = `${article.title} ${article.summary}`.toLowerCase();
      return haystack.includes(keyword.toLowerCase());
    });
  }, [articles, activeSources, keyword]);

  return (
    <div className="space-y-8">
      <header className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Car Intelligence Relay
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Curated news from globally recognized automotive publications with
            one-click delivery into your Telegram channel.
          </p>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {sources.map((source) => {
              const isActive = activeSources.includes(source.id);
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => {
                    setActiveSources((prev) =>
                      isActive
                        ? prev.filter((id) => id !== source.id)
                        : [...prev, source.id],
                    );
                  }}
                  className={`rounded-full border px-4 py-1 text-sm font-medium transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                  }`}
                >
                  {source.name}
                </button>
              );
            })}
          </div>
          <label className="relative block w-full md:w-72">
            <span className="sr-only">Filter by keyword</span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search keywords (e.g. EV, SUV, Ferrari)"
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>
      </header>
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
        {filteredArticles.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <p className="text-base font-medium text-slate-700">
              Nothing matches your filters yet.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try re-enabling more sources or loosening your search keywords.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function ArticleCard({ article }: { article: CarArticle }) {
  const [state, formAction, isPending] = useActionState<ShareState, FormData>(
    shareToTelegram,
    initialState,
  );

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {article.image ? (
        <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {article.sourceName}
          </span>
          <h2 className="text-lg font-semibold text-slate-900">
            <a
              href={article.link}
              target="_blank"
              className="transition hover:text-slate-600"
              rel="noopener noreferrer"
            >
              {article.title}
            </a>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {article.summary}
          </p>
        </div>
        <div className="mt-auto space-y-2">
          {article.publishedAt ? (
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {new Date(article.publishedAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          ) : null}
          <form action={formAction} className="space-y-2">
            <input type="hidden" name="title" value={article.title} />
            <input type="hidden" name="url" value={article.link} />
            <input type="hidden" name="source" value={article.sourceName} />
            <input type="hidden" name="summary" value={article.summary} />
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isPending ? "Sharing…" : "Send to Telegram"}
            </button>
          </form>
          {state.status === "success" ? (
            <p className="text-xs font-medium text-emerald-600">
              {state.message}
            </p>
          ) : null}
          {state.status === "error" ? (
            <p className="text-xs font-medium text-rose-600">{state.message}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
