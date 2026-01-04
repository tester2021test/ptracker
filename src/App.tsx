import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { 
  Calculator, FileText, CheckCircle2, Wallet, 
  Building2, Landmark, Save, Plus, Trash2, Calendar, 
  PieChart, Key, Edit2, X, ChevronRight, TrendingUp,
  UploadCloud, AlertCircle, Download, CreditCard,
  BarChart3, RefreshCw, Printer, FileCheck, Ruler,
  LogOut, Lock, Mail, Loader2, Menu, TrendingDown,
  ArrowRightCircle, FileUp, FileInput, Percent,
  Home, DollarSign, GripHorizontal
} from 'lucide-react';

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://xwulcesvatevnpowekyu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dWxjZXN2YXRldm5wb3dla3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MjE5ODEsImV4cCI6MjA4MzA5Nzk4MX0.hnesvMA5QYsD8GzSnRr5dy-pFyHxraKILtu9SrvONUA';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- UTILS ---
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try { return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }); } catch (e) { return dateStr; }
};

// --- COMPONENTS ---

// Bento Box Style Card
const BentoCard = ({ title, value, subtext, icon: Icon, variant = "default", onClick, className = "" }) => {
  const variants = {
    default: "bg-white border-slate-100 text-slate-800",
    primary: "bg-indigo-600 border-indigo-500 text-white",
    dark: "bg-slate-900 border-slate-800 text-white",
    success: "bg-emerald-50 border-emerald-100 text-emerald-900",
    warning: "bg-amber-50 border-amber-100 text-amber-900"
  };

  return (
    <div 
      onClick={onClick}
      className={`p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between h-full relative overflow-hidden ${variants[variant]} ${className}`}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3 opacity-80">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {subtext && <div className="text-xs mt-1 opacity-70 font-medium">{subtext}</div>}
      </div>
      {/* Decorative background element */}
      {Icon && <Icon className="absolute -bottom-4 -right-4 w-24 h-24 opacity-[0.05] pointer-events-none" />}
    </div>
  );
};

// New Breakdown Card Component for Taxes/Charges
const BreakdownCard = ({ title, total, items, icon: Icon, bgClass = "bg-white", borderClass = "border-slate-100" }) => (
  <div className={`p-6 rounded-[2rem] border ${borderClass} shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full ${bgClass} relative overflow-hidden group hover:shadow-lg transition-all duration-300`}>
    <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-slate-100/50"><Icon className="w-4 h-4 text-slate-600" /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        </div>
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm items-center border-b border-slate-50 last:border-0 pb-1.5 last:pb-0">
                    <span className="text-slate-500 font-medium text-xs md:text-sm">{item.label}</span>
                    <span className="font-bold text-slate-700 font-mono text-xs md:text-sm">{item.value}</span>
                </div>
            ))}
        </div>
    </div>
    <div className="mt-5 pt-4 border-t border-slate-200/50 flex justify-between items-end">
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Total</span>
        <span className="text-lg font-bold text-slate-800">{total}</span>
    </div>
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform rotate-12 scale-150 pointer-events-none">
        <Icon className="w-32 h-32" />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    received: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-slate-100 text-slate-500 border-slate-200",
    partial: "bg-amber-100 text-amber-700 border-amber-200",
    na: "bg-slate-50 text-slate-400 border-slate-100"
  };
  const labels = {
    paid: "Paid", received: "Received", pending: "Pending", partial: "Partial", na: "N/A"
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[status] || styles.pending} flex items-center gap-1 w-fit`}>
      {status === 'paid' || status === 'received' ? <CheckCircle2 className="w-3 h-3" /> : null}
      {labels[status] || status}
    </span>
  );
};

// Bottom Navigation for Mobile
const MobileNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'schedule', icon: Building2, label: 'Schedule' },
    { id: 'loan', icon: Wallet, label: 'Finance' },
    { id: 'bank_plan', icon: Landmark, label: 'Bank' },
    { id: 'docs', icon: FileCheck, label: 'Docs' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 pb-safe z-50 safe-area-bottom no-print">
      <div className="flex justify-around items-center p-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 w-16 ${activeTab === tab.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Desktop Navigation Pill
const DesktopNav = ({ activeTab, setActiveTab }) => (
  <div className="hidden md:flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
    {[
      { id: 'schedule', icon: Building2, label: 'Schedule' },
      { id: 'loan', icon: Wallet, label: 'Finance' },
      { id: 'bank_plan', icon: Landmark, label: 'Bank' },
      { id: 'docs', icon: FileCheck, label: 'Documents' },
    ].map(tab => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
          activeTab === tab.id 
            ? 'bg-white text-indigo-600 shadow-sm shadow-slate-200' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
        }`}
      >
        <tab.icon className="w-4 h-4" />
        {tab.label}
      </button>
    ))}
  </div>
);

// Drawer/Modal Component
const BottomDrawer = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4 no-print">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl transform transition-all animate-in slide-in-from-bottom-full md:slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 py-4 border-b border-slate-100 flex justify-between items-center rounded-t-3xl">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- CHARTS ---
const DonutChart = ({ data, size = 120 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativeAngle = 0;
    if (total === 0) return (<div className="flex items-center justify-center text-xs text-slate-400 h-full w-full bg-slate-50 rounded-full">No Data</div>);
    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
          {data.map((item, i) => {
            const angle = (item.value / total) * 360;
            const x1 = 50 + 40 * Math.cos((Math.PI * cumulativeAngle) / 180);
            const y1 = 50 + 40 * Math.sin((Math.PI * cumulativeAngle) / 180);
            const x2 = 50 + 40 * Math.cos((Math.PI * (cumulativeAngle + angle)) / 180);
            const y2 = 50 + 40 * Math.sin((Math.PI * (cumulativeAngle + angle)) / 180);
            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = total === item.value 
                ? `M 50 10 m 0 40 a 40 40 0 1 0 0 -80 a 40 40 0 1 0 0 80`
                : `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            cumulativeAngle += angle;
            return <path key={i} d={pathData} fill={item.color} stroke="white" strokeWidth="2" />;
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
    );
};

const AnnualSpendChart = ({ data }) => {
  if (!data || data.length === 0) return (<div className="w-full h-40 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">Add EMI transactions to see the trend</div>);
  const maxVal = Math.max(...data.map(d => d.value));
  const yMax = maxVal * 1.15;
  return (
    <div className="w-full h-48 flex flex-col justify-end pt-4 pb-2 relative">
       <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none">
          {[1, 0.66, 0.33, 0].map((tick, i) => (
             <div key={i} className="border-t border-dashed border-slate-100 w-full h-0 relative">
                {tick > 0 && <span className="absolute -top-2.5 right-0 text-[9px] text-slate-300 bg-white pl-1">{new Intl.NumberFormat('en-IN', { notation: "compact", maximumFractionDigits: 1 }).format(maxVal * tick)}</span>}
             </div>
          ))}
       </div>
       <div className="flex items-end justify-around h-full z-10 px-2 gap-2 overflow-x-auto">
          {data.map((item, i) => {
             const height = (item.value / yMax) * 100;
             return (
               <div key={i} className="flex flex-col items-center justify-end h-full flex-1 group relative min-w-[30px]">
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none">
                     {item.formattedValue}
                     <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                  <div className="w-full max-w-[40px] bg-indigo-500 rounded-t-md relative hover:bg-indigo-600 transition-all duration-500 ease-out group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]" style={{ height: `${Math.max(height, 2)}%` }}></div>
                  <div className="mt-2 text-[10px] text-slate-500 font-medium whitespace-nowrap rotate-0 md:rotate-0 sm:-rotate-45 origin-top-left sm:translate-y-2 md:translate-y-0">{item.label.replace('FY ', '')}</div>
               </div>
             );
          })}
       </div>
    </div>
  );
};

// --- AUTH PAGE ---
const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    } catch (error) {
        setMessage(error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
       <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
           <div className="text-center mb-8">
               <div className="inline-flex p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
                   <Calculator className="w-8 h-8" />
               </div>
               <h1 className="text-2xl font-bold text-slate-800">Property Tracker</h1>
               <p className="text-slate-500 text-sm mt-1">Secure Login</p>
           </div>
           
           <form onSubmit={handleLogin} className="space-y-4">
               <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Email</label>
                   <div className="relative">
                       <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                       <input type="email" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={email} onChange={e => setEmail(e.target.value)} />
                   </div>
               </div>
               <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Password</label>
                   <div className="relative">
                       <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                       <input type="password" required className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={password} onChange={e => setPassword(e.target.value)} />
                   </div>
               </div>
               {message && <div className="p-3 rounded-xl text-xs bg-red-50 text-red-700">{message}</div>}
               <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2">
                   {loading && <Loader2 className="w-4 h-4 animate-spin" />} Login
               </button>
           </form>
       </div>
    </div>
  );
};


// --- MAIN APP ---
const App = () => {
  // --- Auth State ---
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- App State ---
  const [activeTab, setActiveTab] = useState('schedule');
  const [carpetArea, setCarpetArea] = useState('');
  const [prepaymentAmount, setPrepaymentAmount] = useState('');
  const [docsList, setDocsList] = useState([
    { id: 'allotment', label: 'Allotment Letter', status: 'pending' },
    { id: 'agreement', label: 'Registered Agreement', status: 'pending' },
    { id: 'index2', label: 'Index II Document', status: 'pending' },
    { id: 'receipts', label: 'All Payment Receipts', status: 'pending' },
    { id: 'sanction', label: 'Loan Sanction Letter', status: 'pending' },
    { id: 'noc', label: 'Builder NOC', status: 'pending' },
    { id: 'possession', label: 'Possession Letter', status: 'pending' },
  ]);

  // Data Stores
  const [paymentRecords, setPaymentRecords] = useState({});
  const [bankTransactions, setBankTransactions] = useState([]);
  const [bankEntries, setBankEntries] = useState([]); 
  
  // Forms & UI State
  const [editingStage, setEditingStage] = useState(null); 
  const [editForm, setEditForm] = useState({ date: '', receipt: '', amount: '' });
  const [financeForm, setFinanceForm] = useState({ type: 'emi', date: '', amount: '', notes: '' });
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  
  // Bank Edit Form
  const [editBankId, setEditBankId] = useState(null);
  const [bankForm, setBankForm] = useState({ date: '', type: 'emi', emi: '', amount: '', interest: '', principal: '', roi: '', balance: '' });
  const [showBankForm, setShowBankForm] = useState(false); 

  // Constants
  const AGREEMENT_VALUE = 4400000;
  const STAMP_DUTY_RATE = 0.06;
  const REGISTRATION_CHARGE = 40000;
  const MAINTENANCE_CHARGE = 123600;
  const CORPUS_FUND = 103000;

  // --- Logic & Calculations ---
  // (Same logic as before, kept concise)
  const bankTaxAnalysis = useMemo(() => {
      const grouped = {};
      bankEntries.forEach(row => {
          if (row.type !== 'emi') return;
          const date = new Date(row.date);
          const month = date.getMonth(); 
          const year = date.getFullYear();
          const fyStart = month >= 3 ? year : year - 1; 
          const fyLabel = `FY ${fyStart}-${(fyStart + 1).toString().slice(-2)}`;
          if (!grouped[fyLabel]) grouped[fyLabel] = { principal: 0, interest: 0, total: 0 };
          grouped[fyLabel].principal += row.principal || 0;
          grouped[fyLabel].interest += row.interest || 0;
          grouped[fyLabel].total += row.emi || row.amount || 0;
      });
      return grouped;
  }, [bankEntries]);

  const bankSummary = useMemo(() => {
      if (bankEntries.length === 0) return { currentEMI: 0, projectedEMI: 0, currentROI: 0, tenureEnd: '-', currentPrincipal: 0 };
      const today = new Date();
      const sorted = [...bankEntries].sort((a,b) => new Date(a.date) - new Date(b.date));
      const current = sorted.filter(e => new Date(e.date) <= today).pop() || sorted[0];
      const future = sorted.filter(e => new Date(e.date) > today && e.type === 'emi');
      const maxEMI = future.length > 0 ? Math.max(...future.map(e => e.emi || e.amount)) : 0;
      const lastEntry = sorted[sorted.length - 1];
      return {
          currentEMI: current.emi || current.amount || 0,
          projectedEMI: maxEMI,
          currentROI: current.roi || 0,
          tenureEnd: lastEntry ? new Date(lastEntry.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '-',
          currentPrincipal: current.balance || 0
      };
  }, [bankEntries]);

  const prepaymentStats = useMemo(() => {
    const P = bankSummary.currentPrincipal;
    const r = (bankSummary.currentROI / 100) / 12;
    const emi = bankSummary.currentEMI;
    const prepay = parseFloat(prepaymentAmount) || 0;
    if (P <= 0 || r <= 0 || emi <= 0 || prepay <= 0 || prepay >= P) return null;
    const calcMonths = (principal) => {
        if (principal * r >= emi) return Infinity; 
        return -Math.log(1 - (principal * r) / emi) / Math.log(1 + r);
    };
    const monthsOriginal = calcMonths(P);
    const monthsNew = calcMonths(P - prepay);
    if (monthsOriginal === Infinity || monthsNew === Infinity) return null;
    const interestOriginal = (monthsOriginal * emi) - P;
    const interestNew = (monthsNew * emi) - (P - prepay);
    return {
        savedInterest: Math.max(0, interestOriginal - interestNew),
        monthsSaved: Math.max(0, monthsOriginal - monthsNew),
        newTenureMonths: monthsNew
    };
  }, [bankSummary, prepaymentAmount]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => { setSession(session); setLoading(false); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
      if (!session) return;
      const user = session.user;
      const fetchData = async () => {
          const { data: txData } = await supabase.from('transactions').select('*').eq('user_id', user.id);
          if (txData) setBankTransactions(txData);
          const { data: payData } = await supabase.from('payment_records').select('*').eq('user_id', user.id);
          if (payData) {
              const records = {};
              payData.forEach(p => { records[p.stage_id] = { dbId: p.id, paidAmount: p.amount, date: p.payment_date, receipt: p.receipt_number }; });
              setPaymentRecords(records);
          }
          const { data: settingsData } = await supabase.from('settings').select('*').eq('user_id', user.id).single();
          if (settingsData) {
              setCarpetArea(settingsData.carpet_area);
              if (settingsData.checklist) setDocsList(prev => prev.map(d => ({ ...d, status: settingsData.checklist[d.id] || 'pending' })));
          }
          const { data: bankData } = await supabase.from('bank_entries').select('*').eq('user_id', user.id).order('date', { ascending: true });
          if (bankData && bankData.length > 0) setBankEntries(bankData); else setBankEntries([]); 
      };
      fetchData();
  }, [session]);

  const value = AGREEMENT_VALUE;
  const gstRate = value > 0 ? (value <= 4500000 ? 0.01 : 0.05) : 0;
  const totalGst = value * gstRate;
  const stampDuty = value * STAMP_DUTY_RATE;
  const regCharge = value > 0 ? REGISTRATION_CHARGE : 0;
  const totalPossessionCharges = MAINTENANCE_CHARGE + CORPUS_FUND;
  const incidentalCosts = useMemo(() => bankTransactions.filter(t => t.type === 'incidental').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0), [bankTransactions]);
  const totalCost = value + totalGst + stampDuty + regCharge + totalPossessionCharges + incidentalCosts;

  const rawSchedule = [
    { label: "Booking", cumulative: 5 }, { label: "On execution of Sales Agreement", cumulative: 10 }, { label: "Payment within 15 Days After Registration", cumulative: 30 },
    { label: "Plinth", cumulative: 45 }, { label: "1st Slab", cumulative: 49 }, { label: "3rd Slab", cumulative: 53 }, { label: "5th Slab", cumulative: 57 },
    { label: "7th Slab", cumulative: 61 }, { label: "9th Slab", cumulative: 65 }, { label: "11th Slab", cumulative: 69 }, { label: "13th Slab", cumulative: 73 },
    { label: "15th Slab", cumulative: 77 }, { label: "17th Slab", cumulative: 81 }, { label: "19th Slab", cumulative: 85 }, { label: "On Bricks work", cumulative: 90 },
    { label: "On Plaster Flooring", cumulative: 95 }, { label: "On 100% Completion", cumulative: 100 },
  ];

  const planData = useMemo(() => {
    let previousCumulative = 0;
    const constructionStages = rawSchedule.map((stage, index) => {
      const stageId = index + 1; 
      const stagePercent = stage.cumulative - previousCumulative;
      const stageAmount = (value * stagePercent) / 100;
      const stageGst = stageAmount * gstRate;
      const totalStageAmount = stageAmount + stageGst;
      previousCumulative = stage.cumulative;
      const record = paymentRecords[stageId] || {};
      const paidAmount = parseFloat(record.paidAmount) || 0;
      const balance = totalStageAmount - paidAmount;
      let status = 'pending';
      if (paidAmount >= totalStageAmount - 1) status = 'paid';
      else if (paidAmount > 0) status = 'partial';
      return { id: stageId, label: stage.label, type: 'construction', stagePercent: parseFloat(stagePercent.toFixed(2)), totalPayable: totalStageAmount, record, paidAmount, balance, status };
    });
    const stampDutyRow = { id: 101, label: "Stamp Duty (6%)", type: 'tax', stagePercent: 0, totalPayable: stampDuty, record: paymentRecords[101] || {}, paidAmount: parseFloat(paymentRecords[101]?.paidAmount) || 0, balance: stampDuty - (parseFloat(paymentRecords[101]?.paidAmount) || 0), status: (parseFloat(paymentRecords[101]?.paidAmount) || 0) >= stampDuty - 1 ? 'paid' : 'pending' };
    const regRow = { id: 102, label: "Registration", type: 'tax', stagePercent: 0, totalPayable: regCharge, record: paymentRecords[102] || {}, paidAmount: parseFloat(paymentRecords[102]?.paidAmount) || 0, balance: regCharge - (parseFloat(paymentRecords[102]?.paidAmount) || 0), status: (parseFloat(paymentRecords[102]?.paidAmount) || 0) >= regCharge - 1 ? 'paid' : 'pending' };
    const possessionRow = { id: 103, label: "Maint. + Corpus", type: 'possession', stagePercent: 0, totalPayable: totalPossessionCharges, record: paymentRecords[103] || {}, paidAmount: parseFloat(paymentRecords[103]?.paidAmount) || 0, balance: totalPossessionCharges - (parseFloat(paymentRecords[103]?.paidAmount) || 0), status: (parseFloat(paymentRecords[103]?.paidAmount) || 0) >= totalPossessionCharges - 1 ? 'paid' : 'pending' };
    const combinedData = [...constructionStages];
    combinedData.splice(3, 0, stampDutyRow, regRow);
    combinedData.push(possessionRow);
    return combinedData;
  }, [value, gstRate, paymentRecords, stampDuty, regCharge, totalPossessionCharges]);

  const totalPaid = planData.reduce((sum, r) => sum + (parseFloat(r.paidAmount) || 0), 0);
  const paidPercent = totalCost > 0 ? (totalPaid / totalCost) * 100 : 0;

  const financeSummary = useMemo(() => {
    const disbursements = bankTransactions.filter(t => t.type === 'disbursement');
    const ownContrib = bankTransactions.filter(t => t.type === 'own');
    const emis = bankTransactions.filter(t => t.type === 'emi');
    const totalDisbursed = disbursements.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalOwn = ownContrib.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalEmiPaid = emis.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalPaidTowardsCost = totalDisbursed + totalOwn;
    const balanceDue = totalCost - totalPaidTowardsCost;
    const byFY = {};
    emis.forEach(t => {
      const dVal = t.transaction_date || t.date; 
      if (!dVal) return;
      const date = new Date(dVal);
      const month = date.getMonth(); 
      const year = date.getFullYear();
      const fyStart = month >= 3 ? year : year - 1;
      const fyEndShort = (fyStart + 1).toString().slice(-2);
      const fyLabel = `FY ${fyStart}-${(fyStart + 1).toString().slice(-2)}`;
      if (!byFY[fyLabel]) byFY[fyLabel] = 0;
      byFY[fyLabel] += parseFloat(t.amount) || 0;
    });
    const chartData = Object.keys(byFY).sort().map(year => ({ label: year, value: byFY[year], formattedValue: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(byFY[year]) }));
    return { totalDisbursed, totalOwn, totalEmiPaid, byFY, balanceDue, totalPaidTowardsCost, chartData };
  }, [bankTransactions, totalCost]);

  // --- Handlers ---
  const savePayment = async () => {
    if(!session || !editingStage) return;
    const existingRecord = paymentRecords[editingStage];
    const payload = { user_id: session.user.id, stage_id: editingStage, amount: editForm.amount, payment_date: editForm.date, receipt_number: editForm.receipt };
    if (existingRecord?.dbId) {
        const { error } = await supabase.from('payment_records').update(payload).eq('id', existingRecord.dbId);
        if(!error) setPaymentRecords(prev => ({ ...prev, [editingStage]: { ...existingRecord, paidAmount: editForm.amount, date: editForm.date, receipt: editForm.receipt } }));
    } else {
        const { data, error } = await supabase.from('payment_records').insert([payload]).select();
        if(!error && data) setPaymentRecords(prev => ({ ...prev, [editingStage]: { dbId: data[0].id, paidAmount: editForm.amount, date: editForm.date, receipt: editForm.receipt } }));
    }
    setEditingStage(null);
  };

  const saveTransaction = async () => {
    if(!session || !financeForm.date || !financeForm.amount) return;
    const payload = { user_id: session.user.id, type: financeForm.type, amount: financeForm.amount, transaction_date: financeForm.date, notes: financeForm.notes };
    if (editingTransactionId) {
        const { error } = await supabase.from('transactions').update(payload).eq('id', editingTransactionId);
        if(!error) {
            setBankTransactions(prev => prev.map(t => t.id === editingTransactionId ? { ...t, ...payload, date: payload.transaction_date } : t));
            setEditingTransactionId(null);
        }
    } else {
        const { data, error } = await supabase.from('transactions').insert([payload]).select();
        if(!error && data) setBankTransactions(prev => [...prev, { ...data[0], date: data[0].transaction_date }]);
    }
    setFinanceForm({ type: 'emi', date: '', amount: '', notes: '' });
    setShowTransactionModal(false);
  };

  const deleteTransaction = async (id) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if(!error) setBankTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateCarpetArea = async (val) => {
      setCarpetArea(val);
      if(!session) return;
      await supabase.from('settings').upsert({ user_id: session.user.id, carpet_area: val });
  };

  const toggleDocStatus = async (docId, currentStatus) => {
      if(!session) return;
      const newStatus = currentStatus === 'pending' ? 'received' : currentStatus === 'received' ? 'na' : 'pending';
      const newDocsList = docsList.map(d => d.id === docId ? { ...d, status: newStatus } : d);
      setDocsList(newDocsList);
      const checklistMap = newDocsList.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.status }), {});
      await supabase.from('settings').upsert({ user_id: session.user.id, checklist: checklistMap });
  };
  
  const handleFileUpload = (e) => {
      if (!session) return;
      const user = session.user;

      // Full Projected data from user PDF - UPDATED with complete timeline
      const mockParsedData = [
        { date: '2024-04-01', type: 'emi', amount: 6646, interest: 3797, principal: 2849, balance: 533151, roi: 8.5 },
        { date: '2024-05-01', type: 'emi', amount: 6646, interest: 3776, principal: 2870, balance: 530281, roi: 8.5 },
        { date: '2024-06-01', type: 'emi', amount: 6646, interest: 3756, principal: 2890, balance: 527391, roi: 8.5 },
        { date: '2024-07-01', type: 'emi', amount: 6646, interest: 3736, principal: 2910, balance: 524481, roi: 8.5 },
        { date: '2024-08-01', type: 'disb', amount: 202000, balance: 726481 }, 
        { date: '2024-08-01', type: 'emi', amount: 9206, interest: 5146, principal: 4060, balance: 722421, roi: 8.5 },
        { date: '2024-09-01', type: 'emi', amount: 9206, interest: 5117, principal: 4089, balance: 718332, roi: 8.5 },
        { date: '2024-10-01', type: 'disb', amount: 176000, balance: 894332 },
        { date: '2024-10-01', type: 'emi', amount: 11877, interest: 6335, principal: 5542, balance: 888790, roi: 8.5 },
        { date: '2024-11-01', type: 'disb', amount: 176000, balance: 1064790 },
        { date: '2024-11-01', type: 'emi', amount: 13202, interest: 7542, principal: 5660, balance: 1059130, roi: 8.5 },
        { date: '2024-12-01', type: 'emi', amount: 16773, interest: 7502, principal: 9271, balance: 1049859, roi: 8.5 },
        { date: '2025-01-01', type: 'emi', amount: 21540, interest: 7437, principal: 14103, balance: 1035756, roi: 8.5 },
        { date: '2025-02-01', type: 'emi', amount: 25530, interest: 7210, principal: 18320, balance: 1017436, roi: 8.5 },
        { date: '2025-03-01', type: 'disb', amount: 220000, balance: 1237436 }, 
        { date: '2025-03-01', type: 'emi', amount: 15345, interest: 8411, principal: 6934, balance: 1230502, roi: 8.25 },
        { date: '2025-04-01', type: 'disb', amount: 170000, balance: 1400502 }, 
        { date: '2025-04-01', type: 'emi', amount: 17179, interest: 9536, principal: 7643, balance: 1392859, roi: 8.25 },
        { date: '2025-05-01', type: 'emi', amount: 39951, interest: 9096, principal: 30855, balance: 1362004, roi: 8.0 }, 
        { date: '2025-06-01', type: 'emi', amount: 39951, interest: 8870, principal: 31081, balance: 1330923, roi: 8.0 },
        { date: '2025-07-01', type: 'emi', amount: 39951, interest: 8113, principal: 31838, balance: 1299085, roi: 7.5 },
        { date: '2025-08-01', type: 'emi', amount: 39951, interest: 7914, principal: 32037, balance: 1267048, roi: 7.5 },
        { date: '2025-09-01', type: 'emi', amount: 39951, interest: 7722, principal: 32229, balance: 1234819, roi: 7.5 },
        { date: '2025-10-01', type: 'emi', amount: 39951, interest: 7529, principal: 32422, balance: 1202397, roi: 7.5 },
        { date: '2025-11-01', type: 'emi', amount: 39951, interest: 7318, principal: 32633, balance: 1169764, roi: 7.5 },
        { date: '2025-12-01', type: 'emi', amount: 39951, interest: 7106, principal: 32845, balance: 1136919, roi: 7.5 },
        { date: '2026-01-01', type: 'emi', amount: 39951, interest: 6869, principal: 33082, balance: 1103837, roi: 7.25 },
        { date: '2026-02-01', type: 'emi', amount: 39951, interest: 6649, principal: 33302, balance: 1070535, roi: 7.25 },
        { date: '2026-03-01', type: 'emi', amount: 39951, interest: 6468, principal: 33483, balance: 1037052, roi: 7.25 },
        { date: '2026-04-01', type: 'emi', amount: 39951, interest: 6265, principal: 33686, balance: 1003366, roi: 7.25 },
        { date: '2026-05-01', type: 'emi', amount: 39951, interest: 6062, principal: 33889, balance: 969477, roi: 7.25 },
        { date: '2026-06-01', type: 'emi', amount: 39951, interest: 5857, principal: 34094, balance: 935383, roi: 7.25 },
        { date: '2026-07-01', type: 'emi', amount: 39951, interest: 5651, principal: 34300, balance: 901083, roi: 7.25 },
        { date: '2026-08-01', type: 'emi', amount: 39951, interest: 5444, principal: 34507, balance: 866576, roi: 7.25 },
        { date: '2026-09-01', type: 'emi', amount: 39951, interest: 5236, principal: 34715, balance: 831861, roi: 7.25 },
        { date: '2026-10-01', type: 'emi', amount: 39951, interest: 5026, principal: 34925, balance: 796936, roi: 7.25 },
        { date: '2026-11-01', type: 'emi', amount: 39951, interest: 4815, principal: 35136, balance: 761800, roi: 7.25 },
        { date: '2026-12-01', type: 'emi', amount: 39951, interest: 4603, principal: 35348, balance: 726452, roi: 7.25 },
        { date: '2027-01-01', type: 'emi', amount: 39951, interest: 4389, principal: 35562, balance: 690890, roi: 7.25 },
        { date: '2027-02-01', type: 'emi', amount: 39951, interest: 4174, principal: 35777, balance: 655113, roi: 7.25 },
        { date: '2027-03-01', type: 'emi', amount: 39951, interest: 3958, principal: 35993, balance: 619120, roi: 7.25 },
        { date: '2027-04-01', type: 'emi', amount: 39951, interest: 3740, principal: 36211, balance: 582909, roi: 7.25 },
        { date: '2027-05-01', type: 'emi', amount: 39951, interest: 3522, principal: 36429, balance: 546480, roi: 7.25 },
        { date: '2027-06-01', type: 'emi', amount: 39951, interest: 3302, principal: 36649, balance: 509831, roi: 7.25 },
        { date: '2027-07-01', type: 'emi', amount: 39951, interest: 3080, principal: 36871, balance: 472960, roi: 7.25 },
        { date: '2027-08-01', type: 'emi', amount: 39951, interest: 2857, principal: 37094, balance: 435866, roi: 7.25 },
        { date: '2027-09-01', type: 'emi', amount: 39951, interest: 2633, principal: 37318, balance: 398548, roi: 7.25 },
        { date: '2027-10-01', type: 'emi', amount: 39951, interest: 2408, principal: 37543, balance: 361005, roi: 7.25 },
        { date: '2027-11-01', type: 'emi', amount: 39951, interest: 2181, principal: 37770, balance: 323235, roi: 7.25 },
        { date: '2027-12-01', type: 'emi', amount: 39951, interest: 1953, principal: 37998, balance: 285237, roi: 7.25 },
        { date: '2028-01-01', type: 'emi', amount: 39951, interest: 1723, principal: 38228, balance: 247009, roi: 7.25 },
        { date: '2028-02-01', type: 'emi', amount: 39951, interest: 1492, principal: 38459, balance: 208550, roi: 7.25 },
        { date: '2028-03-01', type: 'emi', amount: 39951, interest: 1260, principal: 38691, balance: 169859, roi: 7.25 },
        { date: '2028-04-01', type: 'emi', amount: 39951, interest: 1026, principal: 38925, balance: 130934, roi: 7.25 },
        { date: '2028-05-01', type: 'emi', amount: 39951, interest: 791, principal: 39160, balance: 91774, roi: 7.25 },
        { date: '2028-06-01', type: 'emi', amount: 39951, interest: 554, principal: 39397, balance: 52377, roi: 7.25 },
        { date: '2028-07-01', type: 'emi', amount: 39951, interest: 316, principal: 39635, balance: 12742, roi: 7.25 },
        { date: '2028-08-01', type: 'emi', amount: 12818, interest: 77, principal: 12742, balance: 0, roi: 7.25 }
      ];

      const insertData = async () => {
          const payload = mockParsedData.map(d => ({ user_id: user.id, ...d }));
          const { data, error } = await supabase.from('bank_entries').insert(payload).select();
          if (!error && data) {
              setBankEntries(prev => [...prev, ...data].sort((a,b) => new Date(a.date) - new Date(b.date)));
          }
      };
      insertData();
  };

  const saveBankEntry = async () => {
      if (!session) return;
      const user = session.user;

      const payload = {
          user_id: user.id,
          date: bankForm.date,
          type: bankForm.type,
          amount: parseFloat(bankForm.amount) || 0,
          interest: parseFloat(bankForm.interest) || 0,
          principal: parseFloat(bankForm.principal) || 0,
          roi: parseFloat(bankForm.roi) || 0,
          balance: parseFloat(bankForm.balance) || 0,
          // If type is EMI, use the dedicated EMI field from form, or fallback to amount field
          emi: (bankForm.type === 'emi') ? (parseFloat(bankForm.emi) || parseFloat(bankForm.amount) || 0) : 0
      };

      let newEntry = null;

      if (editBankId) {
          const { error } = await supabase.from('bank_entries').update(payload).eq('id', editBankId);
          if (!error) {
              setBankEntries(prev => prev.map(e => e.id === editBankId ? { ...e, ...payload } : e));
          } else {
              console.error("Update failed", error);
          }
      } else {
          const { data, error } = await supabase.from('bank_entries').insert([payload]).select();
          if (!error && data) {
              newEntry = data[0];
          } else {
              console.error("Insert failed", error);
          }
      }

      if (newEntry) {
          setBankEntries(prev => [...prev, newEntry].sort((a,b) => new Date(a.date) - new Date(b.date)));
      }

      setEditBankId(null);
      setShowBankForm(false);
      setBankForm({ date: '', type: 'emi', emi: '', amount: '', interest: '', principal: '', roi: '', balance: '' });
  };
  const handleEditBankEntry = (entry) => { setEditBankId(entry.id); setBankForm({ date: entry.date, type: entry.type, amount: entry.type === 'disb' ? entry.amount : (entry.emi || entry.amount), emi: entry.emi || '', interest: entry.interest || '', principal: entry.principal || '', roi: entry.roi || '', balance: entry.balance || '' }); setShowBankForm(true); };
  
  const handleDeleteBankEntry = async (id) => { setBankEntries(prev => prev.filter(e => e.id !== id)); await supabase.from('bank_entries').delete().eq('id', id); };
  
  const handleDeleteAllBankEntries = async () => {
      if (!session) return;
      if (!window.confirm("Are you sure you want to delete ALL bank entries? This cannot be undone.")) return;
      
      const { error } = await supabase.from('bank_entries').delete().eq('user_id', session.user.id);
      if (!error) setBankEntries([]);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };
  
  const handleExportCSV = () => {
    const headers = ["Section", "Details", "Amount", "Date", "Notes/Ref"];
    const rows = [];
    rows.push(["SUMMARY", "Agreement Value", value, "", ""]);
    rows.push(["SUMMARY", "Govt Taxes (GST+Stamp+Reg)", totalGst + stampDuty + regCharge, "", ""]);
    rows.push(["SUMMARY", "Possession Charges", totalPossessionCharges, "", ""]);
    rows.push(["SUMMARY", "Incidental/Extras", incidentalCosts, "", ""]);
    rows.push(["SUMMARY", "Total Cost of Ownership", totalCost, "", ""]);
    rows.push(["SUMMARY", "Total Paid So Far", totalPaid, "", ""]);
    rows.push([]); 
    rows.push(["PAYMENT SCHEDULE", "Stage", "Payable", "Paid Amount", "Payment Date", "Balance"]);
    planData.forEach(p => {
        rows.push([ "SCHEDULE", p.label, p.totalPayable, p.paidAmount > 0 ? p.paidAmount : "0", p.record.date || "-", p.balance <= 1 ? "0" : p.balance ]);
    });
    rows.push([]);
    rows.push(["FINANCE HISTORY", "Type", "Amount", "Date", "Notes"]);
    bankTransactions.sort((a,b) => new Date(a.date || a.transaction_date) - new Date(b.date || b.transaction_date)).forEach(tx => {
        rows.push([ "TRANSACTION", tx.type, tx.amount, formatDate(tx.transaction_date || tx.date), tx.notes || "" ]);
    });
    
    // --- Added Bank Amortization Section ---
    if (bankEntries.length > 0) {
        rows.push([]);
        rows.push(["BANK AMORTIZATION", "Date", "Type", "Amount/EMI", "Interest", "Principal", "Balance", "ROI"]);
        bankEntries.forEach(row => {
            rows.push([
                "AMORTIZATION",
                formatDate(row.date),
                row.type === 'disb' ? 'Disbursement' : 'EMI',
                row.type === 'disb' ? row.amount : (row.emi || row.amount),
                row.interest || 0,
                row.principal || 0,
                row.balance || 0,
                row.roi || 0
            ]);
        });
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "property_financial_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => { window.print(); };

  // --- RENDER ---
  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  if (!session) return <AuthPage />;

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-24 md:pb-8 selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Print Styles */}
      <style>{`
        @media print { 
            @page { margin: 1cm; size: A4 portrait; } 
            body { background: white !important; -webkit-print-color-adjust: exact; margin: 0; padding: 0; }
            .no-print { display: none !important; } 
            .print-only { display: block !important; width: 100%; position: absolute; top: 0; left: 0; z-index: 1000; background: white; } 
            html, body { height: auto; overflow: visible; }
        }
        .print-only { display: none; }
      `}</style>

      {/* --- PRINT REPORT CONTAINER --- */}
      {/* ... existing print container ... */}
      <div className="print-only max-w-[210mm] mx-auto p-8 bg-white text-slate-900">
          <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-bold uppercase tracking-tight text-slate-900">Property Report</h1>
                  <p className="text-slate-500 text-sm mt-1">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                  <div className="text-xs uppercase font-bold text-slate-400">Total Ownership Cost</div>
                  <div className="text-3xl font-bold text-indigo-700">{formatCurrency(totalCost)}</div>
              </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Agreement Value</div>
                  <div className="text-lg font-bold">{formatCurrency(value)}</div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Taxes & Govt</div>
                  <div className="text-lg font-bold">{formatCurrency(totalGst + stampDuty + regCharge)}</div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Possession Charges</div>
                  <div className="text-lg font-bold">{formatCurrency(totalPossessionCharges)}</div>
              </div>
              <div className="p-4 border border-emerald-200 rounded-lg bg-emerald-50">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Total Paid</div>
                  <div className="text-lg font-bold text-emerald-800">{formatCurrency(totalPaid)}</div>
              </div>
          </div>

          <h2 className="text-lg font-bold border-l-4 border-indigo-600 pl-3 mb-4 text-slate-800 mt-8">Payment Schedule Status</h2>
          <table className="w-full text-left text-xs mb-8 border border-slate-200">
              <thead className="bg-slate-100">
                  <tr>
                      <th className="p-2 border-r border-slate-200 font-semibold text-slate-700">Stage</th>
                      <th className="p-2 border-r border-slate-200 text-right font-semibold text-slate-700">Payable</th>
                      <th className="p-2 border-r border-slate-200 text-right font-semibold text-slate-700">Paid</th>
                      <th className="p-2 border-r border-slate-200 font-semibold text-slate-700">Date/Receipt</th>
                      <th className="p-2 text-right font-semibold text-slate-700">Balance</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {planData.map(row => (
                      <tr key={row.id} className={row.type !== 'construction' ? 'bg-slate-50' : ''}>
                          <td className="p-2 border-r border-slate-200 font-medium">{row.label}</td>
                          <td className="p-2 border-r border-slate-200 text-right font-mono text-slate-600">{formatCurrency(row.totalPayable)}</td>
                          <td className="p-2 border-r border-slate-200 text-right font-mono text-emerald-700 font-bold">{row.paidAmount > 0 ? formatCurrency(row.paidAmount) : '-'}</td>
                          <td className="p-2 border-r border-slate-200 text-slate-500">{row.record.date ? `${formatDate(row.record.date)} ${row.record.receipt ? '#' + row.record.receipt : ''}` : '-'}</td>
                          <td className="p-2 text-right font-mono text-slate-700">{row.balance <= 1 ? <span className="font-bold text-emerald-600">PAID</span> : formatCurrency(row.balance)}</td>
                      </tr>
                  ))}
              </tbody>
          </table>

          <div className="flex gap-8 items-start page-break-inside-avoid">
              <div className="flex-1">
                  <h2 className="text-lg font-bold border-l-4 border-emerald-600 pl-3 mb-4 text-slate-800">Finance & Transactions</h2>
                  <table className="w-full text-left text-xs border border-slate-200">
                      <thead className="bg-slate-100">
                          <tr>
                              <th className="p-2 border-r border-slate-200 font-semibold">Date</th>
                              <th className="p-2 border-r border-slate-200 font-semibold">Type</th>
                              <th className="p-2 text-right font-semibold">Amount</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {bankTransactions.length === 0 ? <tr><td colSpan="3" className="p-4 text-center text-slate-400">No transactions.</td></tr> :
                            bankTransactions.sort((a,b) => new Date(a.date || a.transaction_date) - new Date(b.date || b.transaction_date)).map((tx, i) => (
                              <tr key={i}>
                                  <td className="p-2 border-r border-slate-200 text-slate-600">{formatDate(tx.transaction_date || tx.date)}</td>
                                  <td className="p-2 border-r border-slate-200 capitalize text-slate-600">{tx.type}</td>
                                  <td className="p-2 text-right font-mono text-slate-800">{formatCurrency(tx.amount)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
              <div className="w-1/3">
                  <h2 className="text-lg font-bold border-l-4 border-slate-400 pl-3 mb-4 text-slate-800">Document Checklist</h2>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                      {docsList.map(d => (
                          <div key={d.id} className="flex justify-between items-center p-2 border-b border-slate-100 last:border-0 text-xs">
                              <span className="text-slate-700">{d.label}</span>
                              <span className={`uppercase font-bold ${d.status === 'received' ? 'text-emerald-600' : 'text-slate-300'}`}>{d.status === 'na' ? 'N/A' : d.status}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* --- Bank Amortization Section for Print --- */}
          {bankEntries.length > 0 && (
             <div className="mt-8">
                 <h2 className="text-lg font-bold border-l-4 border-indigo-600 pl-3 mb-4 text-slate-800 break-before-page">Bank Amortization Schedule</h2>
                 <div className="grid grid-cols-4 gap-4 mb-4 text-xs">
                    <div className="p-2 border border-slate-200 rounded bg-slate-50">
                        <span className="block text-slate-400 uppercase font-bold text-[10px]">Current EMI</span>
                        <span className="font-bold text-slate-800">{formatCurrency(bankSummary.currentEMI)}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50">
                        <span className="block text-slate-400 uppercase font-bold text-[10px]">Projected EMI</span>
                        <span className="font-bold text-slate-800">{formatCurrency(bankSummary.projectedEMI)}</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50">
                        <span className="block text-slate-400 uppercase font-bold text-[10px]">Current ROI</span>
                        <span className="font-bold text-slate-800">{bankSummary.currentROI}%</span>
                    </div>
                    <div className="p-2 border border-slate-200 rounded bg-slate-50">
                        <span className="block text-slate-400 uppercase font-bold text-[10px]">Tenure End</span>
                        <span className="font-bold text-slate-800">{bankSummary.tenureEnd}</span>
                    </div>
                 </div>
                 
                 <table className="w-full text-left text-[10px] border border-slate-200">
                     <thead className="bg-slate-100">
                         <tr>
                             <th className="p-1.5 border-r border-slate-200 font-semibold text-slate-700">Date</th>
                             <th className="p-1.5 border-r border-slate-200 font-semibold text-slate-700">Type</th>
                             <th className="p-1.5 border-r border-slate-200 text-right font-semibold text-slate-700">Amount</th>
                             <th className="p-1.5 border-r border-slate-200 text-right font-semibold text-slate-700">Interest</th>
                             <th className="p-1.5 border-r border-slate-200 text-right font-semibold text-slate-700">Principal</th>
                             <th className="p-1.5 text-right font-semibold text-slate-700">Balance</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {bankEntries.map((row, i) => (
                             <tr key={i} className={row.type === 'disb' ? 'bg-blue-50/50' : ''}>
                                 <td className="p-1.5 border-r border-slate-200 text-slate-600">{formatDate(row.date)}</td>
                                 <td className="p-1.5 border-r border-slate-200 capitalize text-slate-600">{row.type === 'disb' ? 'Disb.' : 'EMI'}</td>
                                 <td className="p-1.5 border-r border-slate-200 text-right font-mono text-slate-800">{formatCurrency(row.type === 'disb' ? row.amount : (row.emi || row.amount))}</td>
                                 <td className="p-1.5 border-r border-slate-200 text-right text-slate-500">{row.interest ? formatCurrency(row.interest) : '-'}</td>
                                 <td className="p-1.5 border-r border-slate-200 text-right text-slate-500">{row.principal ? formatCurrency(row.principal) : '-'}</td>
                                 <td className="p-1.5 text-right font-mono text-slate-700">{row.balance ? formatCurrency(row.balance) : '-'}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
          )}
      </div>

      {/* HEADER - Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 transition-all duration-300 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-row justify-between items-center py-4">
             <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200">
                   <Calculator className="w-5 h-5" />
                </div>
                <div>
                   <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">Property Tracker</h1>
                   <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dashboard</p>
                </div>
             </div>
             <DesktopNav activeTab={activeTab} setActiveTab={setActiveTab} />
             <div className="flex gap-2">
                <button onClick={handleExportCSV} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Export CSV"><Download className="w-5 h-5" /></button>
                <button onClick={handlePrint} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Print"><Printer className="w-5 h-5" /></button>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"><LogOut className="w-5 h-5" /></button>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6 animate-in fade-in duration-500 no-print">

        {/* --- SCHEDULE TAB --- */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* HERO SECTION "At a Glance" - Enhanced Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Main Investment Summary */}
                <div className="md:col-span-2 lg:col-span-1 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20 flex flex-col justify-between min-h-[320px]">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Paid</p>
                                <h2 className="text-4xl font-bold tracking-tight mb-1">{formatCurrency(totalPaid)}</h2>
                                <p className="text-sm text-slate-400">Total Cost: <span className="text-white font-medium">{formatCurrency(totalCost)}</span></p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                <PieChart className="w-6 h-6 text-indigo-300" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-indigo-200">Progress</span>
                                <span className="text-white">{paidPercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden p-1 shadow-inner border border-white/5">
                                <div className="bg-gradient-to-r from-indigo-500 to-violet-400 h-full rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out" style={{ width: `${paidPercent}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-white/10">
                                <span>Started</span>
                                <span>Agreement Value: {formatCurrency(value)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/20 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none"></div>
                </div>

                {/* Breakdown Card: Govt Taxes */}
                <BreakdownCard 
                    title="Govt. Taxes Breakdown" 
                    total={formatCurrency(totalGst + stampDuty + regCharge)}
                    items={[
                        { label: `GST (${(gstRate * 100).toFixed(0)}%)`, value: formatCurrency(totalGst) },
                        { label: `Stamp Duty (${(STAMP_DUTY_RATE * 100).toFixed(0)}%)`, value: formatCurrency(stampDuty) },
                        { label: "Registration", value: formatCurrency(regCharge) }
                    ]}
                    icon={Landmark}
                />

                {/* Breakdown Card: Possession Charges */}
                <BreakdownCard 
                    title="Possession Charges" 
                    total={formatCurrency(totalPossessionCharges)}
                    items={[
                        { label: "Maint. + Corpus", value: formatCurrency(totalPossessionCharges) },
                        { label: "Incidental/Extras", value: formatCurrency(incidentalCosts) }
                    ]}
                    icon={Key}
                    bgClass="bg-amber-50/50"
                    borderClass="border-amber-100"
                />
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Payment Timeline</h2>
                <span className="text-xs font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-500">{planData.filter(d => d.status === 'paid').length} / {planData.length} Completed</span>
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="md:hidden relative pl-4 border-l-2 border-slate-100 ml-4 space-y-8 my-4">
                {planData.map((row) => (
                    <div key={row.id} className="relative pl-6">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-colors duration-300 ${row.status === 'paid' ? 'bg-emerald-500 ring-4 ring-emerald-50' : 'bg-slate-300'}`}></div>
                        <div 
                            onClick={() => { setEditingStage(row.id); setEditForm({ date: row.record.date || new Date().toISOString().split('T')[0], receipt: row.record.receipt || '', amount: row.record.paidAmount || row.totalPayable }); }}
                            className={`p-4 rounded-2xl border transition-all active:scale-[0.98] ${row.status === 'paid' ? 'bg-white border-emerald-100 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stage {row.id}</span>
                                <StatusBadge status={row.status} />
                            </div>
                            <h4 className="font-bold text-slate-800 mb-1">{row.label}</h4>
                            <div className="flex justify-between items-end mt-3">
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">Amount</div>
                                    <div className="text-sm font-bold text-slate-700">{formatCurrency(row.totalPayable)}</div>
                                </div>
                                {row.balance > 1 && (
                                    <div className="text-right">
                                        <div className="text-[10px] text-rose-400 uppercase font-bold">Balance</div>
                                        <div className="text-sm font-bold text-rose-600">{formatCurrency(row.balance)}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-xs uppercase font-bold text-slate-400">
                    <tr>
                      <th className="py-5 px-6">Stage Details</th>
                      <th className="py-5 px-6 text-right">Amount</th>
                      <th className="py-5 px-6">Status</th>
                      <th className="py-5 px-6 text-right">Balance</th>
                      <th className="py-5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {planData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                            <div className="font-bold text-slate-700">{row.label}</div>
                            {row.stagePercent > 0 && <div className="text-xs text-slate-400 mt-0.5">{row.stagePercent}%</div>}
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-medium text-slate-600">{formatCurrency(row.totalPayable)}</td>
                        <td className="py-4 px-6"><StatusBadge status={row.status} /></td>
                        <td className="py-4 px-6 text-right font-mono text-slate-500">{row.balance <= 1 ? '-' : formatCurrency(row.balance)}</td>
                        <td className="py-4 px-6 text-center">
                            <button 
                                onClick={() => { setEditingStage(row.id); setEditForm({ date: row.record.date || new Date().toISOString().split('T')[0], receipt: row.record.receipt || '', amount: row.record.paidAmount || row.totalPayable }); }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        )}

        {/* --- FINANCE TAB --- */}
        {activeTab === 'loan' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <BentoCard title="Total Disbursed" value={formatCurrency(financeSummary.totalDisbursed + financeSummary.totalOwn)} subtext={`Target: ${formatCurrency(totalCost)}`} icon={Wallet} variant="primary" />
               <BentoCard title="Total Interest Paid" value={formatCurrency(financeSummary.totalEmiPaid)} subtext="Principal + Interest outflow" icon={TrendingUp} />
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">Transaction History</h3>
                    <button onClick={() => { setEditingTransactionId(null); setFinanceForm({ type: 'emi', date: new Date().toISOString().split('T')[0], amount: '', notes: '' }); setShowTransactionModal(true); }} className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
                        <Plus className="w-3 h-3" /> Add Entry
                    </button>
                </div>
                
                {bankTransactions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <RefreshCw className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm">No transactions yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bankTransactions.sort((a,b) => new Date(b.date || b.transaction_date) - new Date(a.date || a.transaction_date)).map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${tx.type === 'emi' ? 'bg-indigo-50 text-indigo-600' : tx.type === 'own' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                        {tx.type === 'emi' ? <Calendar className="w-5 h-5" /> : tx.type === 'own' ? <Wallet className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 capitalize">{tx.type}</div>
                                        <div className="text-xs text-slate-400">{formatDate(tx.transaction_date || tx.date)}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-800 font-mono">{formatCurrency(tx.amount)}</div>
                                    <div className="flex justify-end gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setFinanceForm({ type: tx.type, date: tx.transaction_date || tx.date, amount: tx.amount, notes: tx.notes || '' }); setEditingTransactionId(tx.id); setShowTransactionModal(true); }} className="text-indigo-600 text-[10px] font-bold uppercase">Edit</button>
                                        <button onClick={() => deleteTransaction(tx.id)} className="text-rose-600 text-[10px] font-bold uppercase">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        )}

        {/* --- BANK PLAN TAB --- */}
        {activeTab === 'bank_plan' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <BentoCard title="Current EMI" value={formatCurrency(bankSummary.currentEMI)} variant="default" />
                    <BentoCard title="Projected EMI" value={formatCurrency(bankSummary.projectedEMI)} variant="default" />
                    <BentoCard title="Current ROI" value={`${bankSummary.currentROI}%`} variant="default" />
                    <BentoCard title="Tenure End" value={bankSummary.tenureEnd} variant="default" />
                </div>

                {/* Prepayment & Table */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="font-bold text-slate-800">Amortization Schedule</h3>
                        <div className="flex gap-2">
                            {/* File Upload for Parsing */}
                            <label className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-full flex items-center justify-center gap-1 hover:bg-emerald-700 transition-colors cursor-pointer flex-1 md:flex-none">
                                <FileUp className="w-3 h-3" /> Upload PDF
                                <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                            </label>

                            <button onClick={() => { setEditBankId(null); setShowBankForm(true); setBankForm({ date: new Date().toISOString().split('T')[0], type: 'emi', emi: '', amount: '', interest: '', principal: '', roi: '', balance: '' }); }} className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors">Add Entry</button>
                            <button onClick={handleDeleteAllBankEntries} className="text-xs bg-rose-50 text-rose-600 px-4 py-2 rounded-full font-bold hover:bg-rose-100 transition-colors">Clear All</button>
                        </div>
                    </div>
                    {/* Prepayment Calculator within Bank Tab */}
                    <div className="p-6 bg-slate-50 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><Percent className="w-4 h-4" /></div>
                            <span className="text-xs font-bold uppercase text-slate-500">Prepayment Simulator</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <input 
                                    type="number" 
                                    placeholder="Enter Lumpsum Amount (e.g. 500000)" 
                                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={prepaymentAmount}
                                    onChange={(e) => setPrepaymentAmount(e.target.value)}
                                />
                            </div>
                            {prepaymentStats && (
                                <div className="flex gap-4 w-full md:w-auto">
                                    <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl">
                                        <div className="text-[10px] font-bold uppercase opacity-60">Save Interest</div>
                                        <div className="font-bold">{formatCurrency(prepaymentStats.savedInterest)}</div>
                                    </div>
                                    <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-xl">
                                        <div className="text-[10px] font-bold uppercase opacity-60">Save Time</div>
                                        <div className="font-bold">{Math.floor(prepaymentStats.monthsSaved)}m</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-right hidden md:table-cell">Interest</th>
                                    <th className="p-4 text-right hidden md:table-cell">Principal</th>
                                    <th className="p-4 text-right">Balance</th>
                                    <th className="p-4 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bankEntries.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 group">
                                        <td className="p-4 text-slate-600">{new Date(row.date).toLocaleDateString('en-IN', {month:'short', year:'2-digit'})}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.type === 'disb' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{row.type === 'disb' ? 'Disb' : 'EMI'}</span></td>
                                        <td className="p-4 text-right font-mono font-medium">{formatCurrency(row.type === 'disb' ? row.amount : (row.emi || row.amount))}</td>
                                        <td className="p-4 text-right text-slate-400 hidden md:table-cell">{row.interest ? formatCurrency(row.interest) : '-'}</td>
                                        <td className="p-4 text-right text-slate-400 hidden md:table-cell">{row.principal ? formatCurrency(row.principal) : '-'}</td>
                                        <td className="p-4 text-right font-mono font-bold text-slate-700">{formatCurrency(row.balance)}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditBankEntry(row)} className="p-1 hover:bg-indigo-50 text-indigo-600 rounded"><Edit2 className="w-3 h-3" /></button>
                                                <button onClick={() => handleDeleteBankEntry(row.id)} className="p-1 hover:bg-rose-50 text-rose-600 rounded"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* --- DOCS TAB --- */}
        {activeTab === 'docs' && (
           <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                       <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                           <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileCheck className="w-5 h-5 text-indigo-500" /> Document Checklist</h3>
                           <p className="text-xs text-slate-500 mt-1">Keep track of critical property documents.</p>
                       </div>
                       <div className="divide-y divide-slate-50">
                           {docsList.map((doc) => (
                               <div key={doc.id} onClick={() => toggleDocStatus(doc.id, doc.status)} className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                                   <div className="flex items-center gap-4">
                                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${doc.status === 'received' ? 'bg-emerald-500 border-emerald-500 scale-110' : doc.status === 'na' ? 'bg-slate-100 border-slate-200' : 'border-slate-200 bg-white'}`}>
                                           {doc.status === 'received' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                           {doc.status === 'na' && <X className="w-3 h-3 text-slate-400" />}
                                       </div>
                                       <span className={`font-medium transition-colors ${doc.status === 'received' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{doc.label}</span>
                                   </div>
                                   <StatusBadge status={doc.status} />
                               </div>
                           ))}
                       </div>
                   </div>
                   
                   <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                        <div className="relative z-10 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Why track documents?</h3>
                                <p className="text-indigo-200 text-sm leading-relaxed">
                                    Missing a single document like the <strong>Index II</strong> or <strong>NOC</strong> can delay your future resale or loan transfer by months. 
                                </p>
                            </div>
                            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <h4 className="font-bold text-sm mb-2 text-indigo-100 flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Pro Tip</h4>
                                <p className="text-xs text-indigo-200/80 leading-relaxed">Always scan and upload your physical documents to a secure cloud storage (DigiLocker) immediately after receiving them.</p>
                            </div>
                        </div>
                        {/* Background Decor */}
                        <FileText className="absolute -right-8 -bottom-8 w-48 h-48 text-white opacity-5 transform rotate-12" />
                   </div>
               </div>
           </div>
        )}

      </div>

      {/* --- DRAWERS / MODALS --- */}
      
      {/* Payment Edit Drawer */}
      <BottomDrawer isOpen={!!editingStage} onClose={() => setEditingStage(null)} title="Update Payment">
         <div className="space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Payment Date</label>
                <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Amount Paid</label>
                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} />
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Receipt No.</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={editForm.receipt} onChange={e => setEditForm({...editForm, receipt: e.target.value})} />
            </div>
            <button onClick={savePayment} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-2">Save Payment</button>
         </div>
      </BottomDrawer>

      {/* Transaction Add/Edit Drawer */}
      <BottomDrawer isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)} title={editingTransactionId ? "Edit Transaction" : "New Transaction"}>
         <div className="space-y-4">
            <div className="flex p-1 bg-slate-100 rounded-xl">
                {[{ id: 'emi', label: 'EMI' }, { id: 'disbursement', label: 'Bank Release' }, { id: 'own', label: 'Own' }, { id: 'incidental', label: 'Extra' }].map(opt => (
                  <button key={opt.id} onClick={() => setFinanceForm({...financeForm, type: opt.id})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${financeForm.type === opt.id ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>{opt.label}</button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Date</label>
                    <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={financeForm.date} onChange={e => setFinanceForm({...financeForm, date: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Amount</label>
                    <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={financeForm.amount} onChange={e => setFinanceForm({...financeForm, amount: e.target.value})} />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Notes</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Optional notes" value={financeForm.notes} onChange={e => setFinanceForm({...financeForm, notes: e.target.value})} />
            </div>
            <button onClick={saveTransaction} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-2">Save Transaction</button>
         </div>
      </BottomDrawer>

      {/* Bank Entry Drawer */}
      <BottomDrawer isOpen={showBankForm} onClose={() => setShowBankForm(false)} title={editBankId ? "Edit Bank Entry" : "Add Bank Entry"}>
         <div className="grid grid-cols-2 gap-3">
             <div className="col-span-2">
                 <label className="text-[10px] uppercase font-bold text-slate-400">Date</label>
                 <input type="date" className="w-full p-2 border rounded-lg bg-slate-50" value={bankForm.date} onChange={e => setBankForm({...bankForm, date: e.target.value})} />
             </div>
             <div>
                 <label className="text-[10px] uppercase font-bold text-slate-400">Type</label>
                 <select className="w-full p-2 border rounded-lg bg-slate-50" value={bankForm.type} onChange={e => setBankForm({...bankForm, type: e.target.value})}>
                     <option value="emi">EMI</option>
                     <option value="disb">Disbursement</option>
                 </select>
             </div>
             {bankForm.type === 'disb' ? (
                 <div>
                     <label className="text-[10px] uppercase font-bold text-slate-400">Amount</label>
                     <input type="number" className="w-full p-2 border rounded-lg bg-slate-50" value={bankForm.amount} onChange={e => setBankForm({...bankForm, amount: e.target.value})} />
                 </div>
             ) : (
                 <div>
                     <label className="text-[10px] uppercase font-bold text-slate-400">EMI Amount</label>
                     <input type="number" className="w-full p-2 border rounded-lg bg-slate-50" value={bankForm.emi} onChange={e => setBankForm({...bankForm, emi: e.target.value})} />
                 </div>
             )}
             <div><label className="text-[10px] uppercase font-bold text-slate-400">Interest</label><input type="number" className="w-full p-2 border rounded-lg bg-slate-50" value={bankForm.interest} onChange={e => setBankForm({...bankForm, interest: e.target.value})} /></div>
             <div><label className="text-[10px] uppercase font-bold text-slate-400">Principal</label><input type="number" className="w-full p-2 border rounded-lg bg-slate-50" value={bankForm.principal} onChange={e => setBankForm({...bankForm, principal: e.target.value})} /></div>
             <div><label className="text-[10px] uppercase font-bold text-slate-400">Balance</label><input type="number" className="w-full p-2 border rounded-lg bg-slate-50" value={bankForm.balance} onChange={e => setBankForm({...bankForm, balance: e.target.value})} /></div>
             <div><label className="text-[10px] uppercase font-bold text-slate-400">ROI %</label><input type="number" className="w-full p-2 border rounded-lg bg-slate-50" value={bankForm.roi} onChange={e => setBankForm({...bankForm, roi: e.target.value})} /></div>
             <button onClick={saveBankEntry} className="col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-bold mt-2">Save Entry</button>
         </div>
      </BottomDrawer>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
