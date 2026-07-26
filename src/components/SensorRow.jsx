import React from "react";
import { Thermometer, RotateCw } from "lucide-react";
import { statusTone } from "../lib/tone.js";

const ALERT_BAND_C = 5;

function channelTone(value, otpLimit) {
  if (value > otpLimit) return "critical";
  if (value > otpLimit - ALERT_BAND_C) return "warning";
  return "info";
}

function CycleInfoTile({ cycleAh, cycleCount }) {
  return (
    <div className="rounded-2xl bg-[var(--card)] p-4 shadow-sm ring-1 ring-[var(--border)] sm:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        {/* จัด Icon และ Title ให้อยู่กลุ่มเดียวกัน */}
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand-10)]">
            <RotateCw className="size-4 text-[var(--brand)]" />
          </span>
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Cycle Information (ข้อมูลรอบการใช้งาน)
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
              {cycleAh.toFixed(1)}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">Ah</span>
          </div>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
            Cycle Capacity (ความจุสะสม)
          </p>
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[var(--foreground)] tabular-nums">
              {cycleCount.toFixed(0)}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">cycles</span>
          </div>
          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
            Cycle Count (จำนวนรอบ)
          </p>
        </div>
      </div>
    </div>
  );
}

function TemperatureTile({ channels, temps, maxTemp, otpLimit }) {
  return (
    <div className="rounded-2xl bg-[var(--card)] p-4 shadow-sm ring-1 ring-[var(--border)] sm:col-span-2">
      <div className="mb-3 flex items-center justify-between">
        {/* จัด Icon และ Title ให้อยู่กลุ่มเดียวกัน */}
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--info-10)]">
            <Thermometer className="size-4 text-[var(--info)]" />
          </span>
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Temperature ({channels.length} อุณหภูมิ)
          </h2>
        </div>

        {/* ส่วนแสดงสถานะ Max/OTP อยู่ฝั่งขวา */}
        <span className="text-[10px] text-[var(--muted-foreground)]">
          Max {maxTemp.toFixed(1)}°C · OTP {otpLimit}°C
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {channels.map((c) => {
          const value = temps[c.key];
          const t = statusTone(channelTone(value, otpLimit));
          return (
            <div
              key={c.key}
              className={`flex min-w-[58px] flex-1 flex-col items-center rounded-xl px-2 py-1.5 ${t.bg}`}
            >
              <span className="text-[10px] font-semibold text-[var(--muted-foreground)]">
                {c.label}
              </span>
              <span className={`text-sm font-bold tabular-nums ${t.fg}`}>
                {value.toFixed(1)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SensorRow({ channels, temps, maxTemp, otpLimit, cycleAh, cycleCount }) {
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TemperatureTile channels={channels} temps={temps} maxTemp={maxTemp} otpLimit={otpLimit} />
        <CycleInfoTile cycleAh={cycleAh} cycleCount={cycleCount} />
      </div>
    </section>
  );
}