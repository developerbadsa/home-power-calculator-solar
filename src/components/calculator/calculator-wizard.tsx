"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { getAppliance } from "@/data/appliances";
import { TEMPLATES, type Template } from "@/data/templates";
import { calculate, defaultSettings } from "@/domain/calculations/recommendations";
import type { BackupTier, CalculationSettings } from "@/domain/calculations/types";
import type { SurgeCategory as EngineSurgeCategory } from "@/domain/config/assumptions";
import { encodeShareState, decodeShareState } from "@/lib/share";
import { validateAppliance } from "@/lib/validation";
import { formatWatts, formatEnergy } from "@/lib/formatting";
import { AppliancePicker } from "./appliance-picker";
import { ApplianceRow } from "./appliance-row";
import { BackupStep } from "./backup-step";
import { ResultView } from "./result-view";

export interface WizardItem {
  uid: string;
  applianceId: string; // catalog id or "custom"
  isCustom: boolean;
  watts: number;
  quantity: number;
  hoursPerDay: number;
  typicalWatts?: number;
  minWatts?: number;
  maxWatts?: number;
  surgeCategory?: EngineSurgeCategory;
  surgeFactor?: number;
  /** Display name — only stored for custom appliances. */
  name?: string;
}

type Step = "appliances" | "backup" | "result";

interface ShareItem {
  i: string;
  n?: string;
  w: number;
  q: number;
  h: number;
}

interface ShareSnapshot {
  v: 1;
  a: ShareItem[];
  b: number;
  t: BackupTier;
  s?: Partial<CalculationSettings>;
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function clampNumber(n: unknown, min: number, max: number, fallback: number): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.min(max, Math.max(min, v));
}

const STEPS: Step[] = ["appliances", "backup", "result"];

export function CalculatorWizard() {
  const { lang, t } = useI18n();

  // ── Restore a shared result from the URL (§28) — lazy initializers so
  // nothing is re-decoded or set in an effect. ───────────────────────────
  const [shared] = useState<ShareSnapshot | null>(() => {
    if (typeof window === "undefined") return null;
    const encoded = new URLSearchParams(window.location.search).get("r");
    if (!encoded) return null;
    const snap = decodeShareState<ShareSnapshot>(encoded);
    if (!snap || !Array.isArray(snap.a) || snap.a.length === 0) return null;
    return snap;
  });

  const [step, setStep] = useState<Step>(() => (shared ? "result" : "appliances"));
  const [items, setItems] = useState<WizardItem[]>(() =>
    shared
      ? shared.a.map((s) => {
          const spec = getAppliance(s.i);
          return {
            uid: uid(),
            applianceId: s.i,
            isCustom: s.i === "custom",
            name: s.i === "custom" ? s.n ?? "Custom" : undefined,
            watts: clampNumber(s.w, 1, 50000, spec?.typicalWatts ?? 100),
            quantity: clampNumber(s.q, 1, 50, 1),
            hoursPerDay: clampNumber(s.h, 0, 24, spec?.defaultHoursPerDay ?? 6),
            typicalWatts: spec?.typicalWatts,
            minWatts: spec?.minWatts,
            maxWatts: spec?.maxWatts,
            surgeCategory: spec?.surgeCategory,
            surgeFactor: spec?.surgeFactor,
          };
        })
      : [],
  );
  const [backupHours, setBackupHours] = useState(() =>
    shared && shared.b >= 0.5 && shared.b <= 24 ? shared.b : 2,
  );
  const [tier, setTier] = useState<BackupTier>(() =>
    shared && (shared.t === "budget" || shared.t === "heavy") ? shared.t : "recommended",
  );
  const [settings, setSettings] = useState<CalculationSettings>(() =>
    shared?.s ? { ...defaultSettings(), ...shared.s } : defaultSettings(),
  );

  // ── Sync the URL so the share button always has fresh state ───────────
  const snapshot = useMemo<ShareSnapshot | null>(() => {
    if (items.length === 0) return null;
    return {
      v: 1,
      a: items.map((it) => ({
        i: it.applianceId,
        n: it.isCustom ? it.name : undefined,
        w: it.watts,
        q: it.quantity,
        h: it.hoursPerDay,
      })),
      b: backupHours,
      t: tier,
      s: settings,
    };
  }, [items, backupHours, tier, settings]);

  useEffect(() => {
    if (step !== "result" || !snapshot || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("r", encodeShareState(snapshot));
    window.history.replaceState(null, "", url.toString());
  }, [snapshot, step]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined" || !snapshot) return "";
    const url = new URL(window.location.href);
    url.searchParams.set("r", encodeShareState(snapshot));
    return url.toString();
  }, [snapshot]);

  // ── Engine mapping ────────────────────────────────────────────────────
  const displayItems = useMemo(() => {
    return items.map((item) => {
      const spec = item.isCustom ? undefined : getAppliance(item.applianceId);
      const name = item.isCustom
        ? item.name ?? "Custom"
        : lang === "bn"
          ? spec?.nameBn ?? item.applianceId
          : spec?.name ?? item.applianceId;
      return { item, name };
    });
  }, [items, lang]);

  const engineInput = useMemo(() => {
    return {
      appliances: displayItems.map(({ item, name }) => ({
        id: item.applianceId,
        name,
        watts: item.watts,
        quantity: item.quantity,
        hoursPerDay: item.hoursPerDay,
        typicalWatts: item.typicalWatts,
        surgeCategory: item.surgeCategory,
        surgeFactor: item.surgeFactor,
      })),
      backupHours,
      tier,
      settings,
    };
  }, [displayItems, backupHours, tier, settings]);

  const result = useMemo(() => calculate(engineInput), [engineInput]);

  // Auto-scroll to selected items when a new appliance is added
  const prevCountRef = useRef(items.length);
  useEffect(() => {
    const prevCount = prevCountRef.current;
    if (items.length > prevCount && step === "appliances") {
      const timer = setTimeout(() => {
        document.getElementById("selected-items")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      prevCountRef.current = items.length;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = items.length;
  }, [items.length, step]);

  // Live summary (§ competitor's instant-feedback bar, simplified): totals
  // update the moment an appliance is added/removed/edited.
  const liveSummary = useMemo(() => {
    const load = items.reduce((s, it) => s + it.watts * it.quantity, 0);
    const energy = items.reduce(
      (s, it) => s + it.watts * it.quantity * it.hoursPerDay,
      0,
    );
    return { load, energy };
  }, [items]);

  const rowIssues = useMemo(() => {
    const map = new Map<string, ReturnType<typeof validateAppliance>>();
    for (const item of items) {
      map.set(
        item.uid,
        validateAppliance({
          watts: item.watts,
          quantity: item.quantity,
          hoursPerDay: item.hoursPerDay,
          typicalWatts: item.typicalWatts,
        }),
      );
    }
    return map;
  }, [items]);

  const hasBlockingIssues = useMemo(
    () => [...rowIssues.values()].some((issues) => issues.some((i) => i.blocking)),
    [rowIssues],
  );

  const canContinue =
    step === "appliances"
      ? items.length > 0 && !hasBlockingIssues
      : Number.isFinite(backupHours) && backupHours >= 0.5 && backupHours <= 24;

  const goToResult = () => {
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onContinue = () => {
    if (step === "appliances") {
      setStep("backup");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      goToResult();
    }
  };

  // ── Mutations ─────────────────────────────────────────────────────────
  const addItem = useCallback((item: WizardItem) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItem = useCallback((targetUid: string, patch: Partial<WizardItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.uid === targetUid ? { ...it, ...patch } : it)),
    );
  }, []);

  const removeItem = useCallback((targetUid: string) => {
    setItems((prev) => prev.filter((it) => it.uid !== targetUid));
  }, []);

  const applyTemplate = (template: Template) => {
    setItems(
      template.appliances.map((ta) => {
        const spec = getAppliance(ta.id);
        return {
          uid: uid(),
          applianceId: ta.id,
          isCustom: false,
          watts: spec?.typicalWatts ?? 100,
          quantity: ta.quantity,
          hoursPerDay: spec?.defaultHoursPerDay ?? 6,
          typicalWatts: spec?.typicalWatts,
          minWatts: spec?.minWatts,
          maxWatts: spec?.maxWatts,
          surgeCategory: spec?.surgeCategory,
          surgeFactor: spec?.surgeFactor,
        } satisfies WizardItem;
      }),
    );
    setStep("appliances");
    toast.success(t("template.applied"));
    // Scroll to selected items so user sees what was added
    setTimeout(() => {
      document.getElementById("selected-items")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const stepIndex = (s: Step) => STEPS.indexOf(s);

  return (
    <div className="space-y-5">
      {/* Step indicator (§27: completed=emerald+check, current=outlined slate,
          upcoming=gray) */}
      <ol
        className="flex items-center gap-2 text-xs font-medium text-slate-500"
        aria-label="Progress"
      >
        {STEPS.map((s, i) => {
          const done = stepIndex(step) > i;
          const current = step === s;
          return (
            <li key={s} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  done
                    ? "bg-emerald-600 text-white"
                    : current
                      ? "border-2 border-slate-900 text-slate-900"
                      : "border border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                ) : (
                  i + 1
                )}
              </span>
              {i < STEPS.length - 1 ? (
                <span
                  className={`h-0.5 w-6 ${done ? "bg-emerald-600" : "bg-slate-200"}`}
                />
              ) : null}
            </li>
          );
        })}
        <li className="text-slate-400">
          {t(
            step === "appliances"
              ? "step.appliances.title"
              : step === "backup"
                ? "step.backup.title"
                : "result.title",
          )}
        </li>
      </ol>

      {/* Sticky live summary — always visible while scrolling */}
      {items.length > 0 && step === "appliances" ? (
        <div
          aria-live="polite"
          className="sticky top-0 z-20 -mx-4 flex items-stretch gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur"
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400">
              {t("summary.totalLoad")}
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
              {formatWatts(liveSummary.load)}
            </p>
          </div>
          <div className="w-px bg-slate-200" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400">
              {t("summary.dailyEnergy")}
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
              {formatEnergy(liveSummary.energy)}
            </p>
          </div>
          <div className="ml-auto hidden items-end pb-1 sm:flex">
            <p className="text-xs text-slate-400">{t("summary.live")}</p>
          </div>
        </div>
      ) : null}

      {step === "appliances" ? (
        <section aria-labelledby="appliances-title" className="step-enter space-y-5">
          <div>
            <h2 id="appliances-title" className="text-2xl font-semibold text-slate-900">
              {t("step.appliances.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t("step.appliances.subtitle")}</p>
          </div>

          {/* Templates (§26) */}
          <div className="space-y-2">
            <p className="field-label">{t("template.title")}</p>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="chip chip-idle"
                  title={t("template.use")}
                >
                  {lang === "bn" ? template.nameBn : template.name}
                </button>
              ))}
            </div>
          </div>

          <AppliancePicker onAdd={addItem} />

          <div id="selected-items" className="space-y-2.5">
            <h3 className="text-base font-medium text-slate-900">
              {t("step.appliances.selected")}{" "}
              {items.length > 0 ? (
                <span className="text-sm font-normal text-slate-400">
                  ({items.length})
                </span>
              ) : null}
            </h3>
            {items.length === 0 ? (
              <div className="flex flex-col items-center rounded-[4px] border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
                <div className="mb-3 rounded-[4px] bg-slate-100 p-3">
                  <ListChecks className="h-6 w-6 text-slate-400" strokeWidth={1.25} />
                </div>
                <p className="mb-1 text-base font-medium text-slate-900">
                  {t("step.appliances.emptyTitle")}
                </p>
                <p className="max-w-sm text-sm text-slate-500">
                  {t("step.appliances.none")}
                </p>
              </div>
            ) : (
              <>
                <ul className="space-y-2.5">
                  {displayItems.map(({ item, name }) => {
                    const issues = rowIssues.get(item.uid) ?? [];
                    const unusualIssue = issues.find((i) =>
                      i.code.startsWith("watts-unusual"),
                    );
                    return (
                      <ApplianceRow
                        key={item.uid}
                        item={item}
                        name={name}
                        invalid={issues.some((i) => i.blocking)}
                        unusual={
                          unusualIssue?.code === "watts-unusual-high"
                            ? "high"
                            : unusualIssue?.code === "watts-unusual-low"
                              ? "low"
                              : null
                        }
                        onChange={updateItem}
                        onRemove={removeItem}
                      />
                    );
                  })}
                </ul>
                {/* "Add more" button — fixes the scroll-up UX pain point */}
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("popular-appliances")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="btn-ghost w-full border border-dashed border-slate-300"
                >
                  + {t("step.appliances.addMore")}
                </button>
              </>
            )}
            {hasBlockingIssues ? (
              <p className="text-xs text-rose-600" role="alert">
                {t("row.err.blocking")}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {step === "backup" ? (
        <section aria-labelledby="backup-title" className="step-enter space-y-5">
          <div>
            <h2 id="backup-title" className="text-2xl font-semibold text-slate-900">
              {t("step.backup.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t("step.backup.subtitle")}</p>
          </div>
          <BackupStep value={backupHours} onChange={setBackupHours} />
        </section>
      ) : null}

      {step === "result" ? (
        <section aria-labelledby="result-title" className="step-enter space-y-4">
          <div>
            <h2 id="result-title" className="text-2xl font-semibold text-slate-900">
              {t("result.title")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t("result.subtitle")}</p>
          </div>
          <ResultView
            result={result}
            shareUrl={shareUrl}
            onEditAppliances={() => setStep("appliances")}
            onEditBackup={() => setStep("backup")}
            onTierChange={setTier}
            settings={settings}
            onSettingsChange={(patch) => setSettings((s) => ({ ...s, ...patch }))}
          />
        </section>
      ) : null}

      {/* Sticky action bar (§37) */}
      {step !== "result" ? (
        <div className="sticky bottom-0 -mx-4 mt-6 flex gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          {step === "backup" ? (
            <button
              type="button"
              onClick={() => setStep("appliances")}
              className="btn-secondary"
            >
              {t("back")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="btn-primary flex-1 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {t("continue")} →
          </button>
        </div>
      ) : null}
    </div>
  );
}