import React from "react";
import { Zap, ArrowUpRight, ArrowDownRight, Power } from "lucide-react";

export function PowerFlowChart({
    packVoltage = 0,
    current = 0,
    chargedAh = 0,
    dischargedAh = 0,
    chargedWh = 0,
    dischargedWh = 0,
}) {
    const rawPowerW = packVoltage * current;
    const absPowerW = Math.abs(rawPowerW);
    const powerKw = (absPowerW / 1000).toFixed(2);

    const isCharging = current > 0.1;
    const isDischarging = current < -0.1;

    // 1. คำนวณค่า Net Energy สุทธิ
    const netWh = chargedWh - dischargedWh;
    const isPositiveBalance = netWh >= 0;

    // กำหนด Theme สำหรับ Dynamic Class เพื่อแก้ปัญหา Tailwind CSS
    const theme = {
        emerald: {
            active: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
            icon: "text-emerald-500"
        },
        amber: {
            active: "bg-amber-500/10 border-amber-500/30 text-amber-500",
            icon: "text-amber-500"
        }
    };
    
    // Helper Card Component
    const StatCard = ({ title, value, unit, subValue, icon: Icon, color, active }) => {
        const styles = theme[color];
        return (
            <div className={`flex flex-col p-5 rounded-2xl border transition-all duration-300 ${active ? styles.active : "bg-[var(--card)] border-[var(--border)]"}`}>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs uppercase font-bold text-[var(--muted-foreground)]">{title}</span>
                    <Icon className={`size-5 ${active ? styles.icon : "text-gray-400"}`} />
                </div>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tabular-nums  text-[var(--foreground)] tracking-tight">{value}</span>
                    <span className="text-sm text-[var(--muted-foreground)] font-semibold">{unit}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border)]/50 text-[11px] text-[var(--muted-foreground)] font-medium">
                    {subValue}
                </div>
            </div>
        );
    };

    return (
        <section className="rounded-3xl bg-[var(--card)] p-6 shadow-sm border border-[var(--border)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand-10)]">
                        <Zap className="size-4 text-[var(--brand)]" />
                    </span>
                    <div>
                        <h2 className="text-sm font-semibold text-[var(--foreground)]">
                            Energy Flow (การไหลของพลังงาน)
                        </h2>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">Real-time system telemetry</p>
                    </div>
                </div>

                <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border ${isCharging ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : isDischarging ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-gray-500/10 border-gray-500/20 text-gray-400"}`}>
                    <span className={`size-2 rounded-full ${isCharging || isDischarging ? "animate-ping" : ""} ${isCharging ? "bg-emerald-500" : isDischarging ? "bg-amber-500" : "bg-gray-400"}`}></span>
                    {isCharging ? "Charging (กำลังชาร์จ)" : isDischarging ? "Discharging (กำลังจ่ายไฟ)" : "Standby (รอการทำงาน)"}
                </div>
            </div>

            {/* Power Hub */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard 
                    title="Charge Rate (กำลังชาร์จ)" 
                    value={isCharging ? current.toFixed(1) : "0.0"} 
                    unit="A" 
                    subValue={`${(chargedWh / 1000).toFixed(2)} kWh Today (วันนี้)`}
                    icon={ArrowUpRight}
                    color="emerald"
                    active={isCharging}
                />

                {/* Center Hub */}
                <div className="flex flex-col items-center justify-center p-6 bg-[var(--background)] rounded-2xl border border-[var(--border)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[var(--brand)]/5" />
                    <Power className="size-7 text-[var(--brand)] mb-2" />
                    <div className="text-5xl font-black tabular-nums  text-[var(--foreground)] tracking-tighter">
                        {powerKw} <span className="text-2xl font-bold text-[var(--muted-foreground)]">kW</span>
                    </div>
                    <div className="text-xs font-bold text-[var(--muted-foreground)] mt-2 tracking-widest uppercase">
                        {packVoltage.toFixed(1)} Pack Voltage (แรงดันไฟฟ้า)
                    </div>
                </div>

                <StatCard 
                    title="Discharge Rate (กำลังจ่ายไฟ)" 
                    value={isDischarging ? Math.abs(current).toFixed(1) : "0.0"} 
                    unit="A" 
                    subValue={`${(dischargedWh / 1000).toFixed(2)} kWh Today (วันนี้)`}
                    icon={ArrowDownRight}
                    color="amber"
                    active={isDischarging}
                />
            </div>

            {/* Footer Section */}
            <div className="mt-8">
                <div className="flex justify-between text-xs font-bold text-[var(--muted-foreground)] mb-3 uppercase tracking-widest">
                    <span>Net Energy Balance (สถานะสมดุลพลังงาน)</span>
                    <span className={isPositiveBalance ? "text-emerald-500" : "text-amber-500"}>
                        {isPositiveBalance ? "+" : ""}{ (netWh / 1000).toFixed(2) } kWh
                    </span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 w-full bg-[var(--border)] rounded-full overflow-hidden flex shadow-inner">
                    <div 
                        className="bg-emerald-500 h-full transition-all duration-1000" 
                        style={{ width: `${chargedWh / (chargedWh + dischargedWh + 1) * 100}%` }} 
                    />
                    <div 
                        className="bg-amber-500 h-full transition-all duration-1000" 
                        style={{ width: `${dischargedWh / (chargedWh + dischargedWh + 1) * 100}%` }} 
                    />
                </div>
                
                <div className="flex justify-between mt-2 text-[10px] text-[var(--muted-foreground)] font-semibold">
                    <span>
                        Charged (ชาร์จเข้า): 
                        {chargedWh > 0 ? ` ${(chargedWh/1000).toFixed(2)} kWh` : " -"}
                    </span>
                    <span>
                        Discharged (จ่ายออก): 
                        {dischargedWh > 0 ? ` ${(dischargedWh/1000).toFixed(2)} kWh` : " -"}
                    </span>
                </div>
            </div>
        </section>
    );
}