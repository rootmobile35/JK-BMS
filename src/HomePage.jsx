import React from "react";
import { Zap, ShieldCheck, Smartphone, Cpu, BatteryCharging, Terminal, ChevronRight, Thermometer, Gauge, MessageSquare, Globe } from "lucide-react";

// ใส่ไว้ด้านบนสุดของไฟล์ หรือใน CSS หลัก (ในโปรเจกต์จริงควรย้ายไปไว้ในไฟล์ CSS)
const style = {
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  }
};

// --- Custom Animation Visualizer (แก้ไข Error การ Import และย้ายมาไว้ข้างนอก) ---
const ConnectionVisualizer = () => (
  <div className="flex items-center justify-center gap-2 my-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
    {/* สไตล์สำหรับ Animation ข้อมูลวิ่ง */}
    <style>{`
      @keyframes slide {
        0% { transform: translateX(-100%); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateX(300%); opacity: 0; }
      }
      .animate-data-flow { animation: slide 2s infinite ease-in-out; }
    `}</style>
    
    <div className="flex flex-col items-center">
      <div className="p-2 bg-white border border-emerald-500/30 rounded"><Cpu className="size-6 text-emerald-600" /></div>
      <span className="text-[9px] font-mono text-emerald-700/50 mt-1">ESP32</span>
    </div>
    <div className="flex-1 w-24 h-[2px] bg-slate-200 relative overflow-hidden rounded-full">
       <div className="absolute inset-0 bg-emerald-500 w-12 animate-data-flow"></div>
    </div>
    <div className="flex flex-col items-center">
      <div className="p-2 bg-white border border-emerald-500/30 rounded"><BatteryCharging className="size-6 text-emerald-600" /></div>
      <span className="text-[9px] font-mono text-emerald-700/50 mt-1">JK_BMS</span>
    </div>
  </div>
);

// --- คอมโพเนนต์ย่อยสำหรับแสดงเกจวัด ---
const BMSGaugeCard = ({ icon: Icon, label, value, unit, colorClass, max }) => {
  // คำนวณเปอร์เซ็นต์แบบง่ายๆ เพื่อใช้กับ progress bar
  const percentage = (value / max) * 100;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-600">
          <Icon className={`size-5 ${colorClass}`} />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</span>
        </div>
        <span className={`text-xl font-bold ${colorClass}`}>{value} <span className="text-sm font-normal text-slate-400">{unit}</span></span>
      </div>
      
      {/* Custom Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
        <div 
          className={`absolute inset-y-0 left-0 rounded-full ${colorClass.replace('text', 'bg')}`} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
        {/* เพิ่มเอฟเฟกต์แสงวิบวับนิดหน่อยให้ดูไฮเทค */}
        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
      </div>
      <div className="text-[10px] text-slate-400 font-mono flex justify-between">
        <span>0 {unit}</span>
        <span>Max: {max} {unit}</span>
      </div>
    </div>
  );
};

// --- Animation Visualizer (Node-based) ---
const ArchitectureVisualizer = () => (
  <div className="relative w-full max-w-4xl mx-auto my-16 p-12 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
    
    <style>{`
      @keyframes flow-r { 0% { left: 0%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
      @keyframes flow-l { 0% { right: 0%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { right: 100%; opacity: 0; } }
      .packet-r { animation: flow-r 2s infinite linear; }
      .packet-l { animation: flow-l 2s infinite linear; }
    `}</style>

    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
    
    <div className="relative flex items-center justify-between">
      
      {/* 1. WEB SERVICE */}
      <Node icon={<Globe className="size-8 text-indigo-600" />} title="WEB_CLOUD" desc="Remote Server" color="indigo" />

      {/* CONNECTION: WEB <-> ESP32 (Bidirectional) */}
      <div className="flex-1 h-8 flex flex-col justify-between mx-4">
         <div className="relative w-full h-[1px] bg-slate-200">
            <div className="absolute top-[-3px] size-2 rounded-full bg-indigo-500 packet-r"></div>
         </div>
         <div className="relative w-full h-[1px] bg-slate-200">
            <div className="absolute top-[-3px] size-2 rounded-full bg-indigo-400 packet-l delay-1000"></div>
         </div>
      </div>

      {/* 2. ESP32 HUB */}
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Node icon={<Cpu className="size-10 text-emerald-600" />} title="ESP32_HUB" desc="IoT Gateway" color="emerald" active />
      </div>

      {/* CONNECTION: ESP32 <-> BMS (Bidirectional) */}
      <div className="flex-1 h-8 flex flex-col justify-between mx-4">
         <div className="relative w-full h-[1px] bg-slate-200">
            <div className="absolute top-[-3px] size-2 rounded-full bg-emerald-500 packet-r delay-500"></div>
         </div>
         <div className="relative w-full h-[1px] bg-slate-200">
            <div className="absolute top-[-3px] size-2 rounded-full bg-blue-500 packet-l delay-1500"></div>
         </div>
      </div>

      {/* 3. BMS */}
      <Node icon={<BatteryCharging className="size-8 text-blue-600" />} title="JK_BMS" desc="Power System" color="blue" />
    </div>

    {/* Status Footer */}
    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-12 font-mono text-[10px] text-slate-400">
      <span className="flex items-center gap-2">● FULL_DUPLEX_COMMUNICATION</span>
      <span className="flex items-center gap-2">● LIVE_TELEMETRY_SYNC</span>
    </div>
  </div>
);

const Node = ({ icon, title, desc, color, active }) => (
  <div className={`flex flex-col items-center z-10 ${active ? 'scale-110' : ''}`}>
    <div className={`p-4 bg-white rounded-2xl shadow-lg border border-${color}-100 transition-all`}>
      {icon}
    </div>
    <div className="mt-4 text-center">
      <div className="text-xs font-mono font-bold text-slate-800 tracking-widest">{title}</div>
      <div className="text-[10px] text-slate-400 uppercase">{desc}</div>
    </div>
  </div>
);

// --- Feature Card Component ---
function Feature({ icon, title, desc, delay }) {
  return (
    <div className={`
      p-6 bg-white border border-slate-100 rounded-2xl 
      transition-all duration-500 ease-out 
      hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 
      hover:-translate-y-2 
      animate-in fade-in slide-in-from-bottom-5 duration-700 ${delay}
    `}>
      <div className="text-emerald-600 mb-4 bg-emerald-50 rounded-xl p-3 inline-block group-hover:bg-emerald-100 transition-colors">
        {icon}
      </div>
      <h3 className="text-sm font-mono font-bold mb-2 text-slate-800 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

// --- หน้า HomePage หลัก ---
export default function HomePage({ onGoToLogin }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 relative font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Column: Marketing */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-widest">System Status: Live Telemetry</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 leading-tight">
              อัปเกรด <span className="text-emerald-600">JK BMS</span><br/>ด้วยขุมพลัง ESP32
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              เปลี่ยนระบบจัดการแบตเตอรี่ของคุณให้เป็นระบบอัจฉริยะ แสดงผลข้อมูล Real-time 
              ด้วยเกจวัดความแม่นยำสูง พร้อมแจ้งเตือนด่วนและสั่งการได้จากทุกที่
            </p>

            {/* Button Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mx-auto lg:mx-0">
              
              {/* ปุ่มหลัก: เริ่มต้นใช้งาน */}
              <button 
                onClick={onGoToLogin}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-lg transition-all flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center"
              >
                เริ่มต้นใช้งาน <ChevronRight className="size-5" />
              </button>

              {/* ปุ่มรอง: ติดต่อทางไลน์ */}
              <a 
                href="https://line.me/ti/p/~yourid" // เปลี่ยนเป็น Link ไลน์ของคุณ
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-4 px-8 rounded-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <MessageSquare className="size-5 text-emerald-600" />
                ติดต่อสอบถาม
              </a>

            </div>
          </div>

          {/* Right Column: Digital Gauges */}
          <div className="flex-1 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* หัวข้อฝั่งขวา */}
            <div className="md:col-span-2 flex items-center gap-3 mb-2 text-slate-600">
                <Gauge className="size-6 text-emerald-500" />
                <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-600">Live System Metrics</h2>
            </div>

            {/* Gauge 1: Voltage */}
            <BMSGaugeCard 
              icon={BatteryCharging}
              label="System Voltage"
              value={51.2}
              unit="V"
              colorClass="text-emerald-600" // สีเขียว
              max={60} // สมมติ Max Voltage 60V
            />

            {/* Gauge 2: Current */}
            <BMSGaugeCard 
              icon={Zap}
              label="Load Current"
              value={15.8}
              unit="A"
              colorClass="text-blue-600" // สีฟ้า
              max={100} // สมมติ Max Current 100A
            />

            {/* Gauge 3: Temperature */}
            <BMSGaugeCard 
              icon={Thermometer}
              label="BMS Temp"
              value={34.5}
              unit="°C"
              colorClass="text-orange-500" // สีส้ม
              max={80} // สมมติ Max Temp 80°C
            />

            {/* Terminal Log (วางคู่กับเกจวัด) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 font-mono text-[11px] shadow-xl text-emerald-400 flex flex-col justify-between">
               <div className="flex gap-2 opacity-50 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              </div>
              <div className="space-y-1.5">
                <p>{"> telemetry_bus_active"}</p>
                <p>{"> node_id: esp32_bms_bridge"}</p>
                <p className="animate-pulse">{"> status: data_stream_synced"}</p>
              </div>
              <div className="text-right text-emerald-700 mt-2">v1.0.2</div>
            </div>

          </div>
        </div>

        {/* Connection Animation (เลือกใช้ตัวใดตัวหนึ่ง ผมแนะนำ ArchitectureVisualizer มันดูโปรกว่า) */}
        {/* <ConnectionVisualizer /> */}
        <ArchitectureVisualizer />

        {/* Features Grid (พร้อม Animation) */}
        <section className="grid md:grid-cols-3 gap-6 mt-20">
          <Feature 
            icon={<Smartphone />} 
            title="REMOTE CONTROL" 
            desc="ควบคุมผ่านมือถือได้ทุกที่" 
            delay="delay-0"
          />
          <Feature 
            icon={<ShieldCheck />} 
            title="HARDWARE SAFE" 
            desc="ระบบตัดไฟฉุกเฉินแม่นยำสูง" 
            delay="delay-150"
          />
          <Feature 
            icon={<Zap />} 
            title="DATA TELEMETRY" 
            desc="เก็บข้อมูลและแจ้งเตือนทันที" 
            delay="delay-300"
          />
        </section>
      </div>
    </div>
  );
}