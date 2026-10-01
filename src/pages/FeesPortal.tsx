import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  Receipt,
  AlertCircle,
  FileCheck,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Copy,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { COLLEGE_LOGO_BASE64 } from '../assets/collegeLogo';

interface FeeItem {
  id: string;
  category: string;
  amount: number;
  dueDate: string;
  paidDate: string;
  transactionId: string;
  paymentMode: string;
  status: 'Paid' | 'Pending';
}

export const FeesPortal: React.FC = () => {
  const { user, profile } = useAuth();
  const [selectedReceipt, setSelectedReceipt] = useState<FeeItem | null>(null);
  const [downloadSuccessModal, setDownloadSuccessModal] = useState<string | null>(null);
  const [copiedReceiptId, setCopiedReceiptId] = useState<string | null>(null);

  const studentName = profile?.name || user?.name || 'Rohit Kumar';
  const rollNumber = profile?.rollNumber || user?.rollNumber || '22CSE045';
  const department = profile?.department || user?.department || 'Computer Science & Engineering';

  const feeLedger: FeeItem[] = [
    {
      id: 'SEC-FEE-801',
      category: 'Semester VIII Academic Tuition Fee (Autonomous B.E. CSE)',
      amount: 55000,
      dueDate: 'Jul 15, 2026',
      paidDate: 'Jul 10, 2026',
      transactionId: 'TXN-SEC-2026-992140',
      paymentMode: 'Net Banking (SBI Portal)',
      status: 'Paid',
    },
    {
      id: 'SEC-FEE-802',
      category: 'Autonomous End-Semester Examination Fee (Theory & Practical Labs)',
      amount: 3200,
      dueDate: 'Aug 05, 2026',
      paidDate: 'Aug 02, 2026',
      transactionId: 'TXN-SEC-2026-992141',
      paymentMode: 'UPI (Google Pay)',
      status: 'Paid',
    },
    {
      id: 'SEC-FEE-803',
      category: 'College Bus Transport Fee (Route #12: Erode Junction to Campus)',
      amount: 14000,
      dueDate: 'Jul 20, 2026',
      paidDate: 'Jul 12, 2026',
      transactionId: 'TXN-SEC-2026-992142',
      paymentMode: 'HDFC SmartHub Payment Gateway',
      status: 'Paid',
    },
    {
      id: 'SEC-FEE-804',
      category: 'Cloud Computing & Advanced GPU AI Lab Maintenance Fee',
      amount: 4500,
      dueDate: 'Jul 25, 2026',
      paidDate: 'Jul 14, 2026',
      transactionId: 'TXN-SEC-2026-992143',
      paymentMode: 'Debit Card (RuPay)',
      status: 'Paid',
    },
    {
      id: 'SEC-FEE-805',
      category: 'Career Development Centre (CDC) & Zoho/TCS Placement Training',
      amount: 5000,
      dueDate: 'Jul 25, 2026',
      paidDate: 'Jul 14, 2026',
      transactionId: 'TXN-SEC-2026-992144',
      paymentMode: 'UPI (PhonePe)',
      status: 'Paid',
    },
  ];

  const totalAmount = feeLedger.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = feeLedger
    .filter((x) => x.status === 'Paid')
    .reduce((sum, item) => sum + item.amount, 0);
  const balanceDue = totalAmount - paidAmount;

  const generateAndDownloadReceiptHTML = (item: FeeItem) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SEC_Receipt_${item.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 30px auto; max-width: 650px; color: #0f172a; line-height: 1.5; background: #fff; }
    .receipt-card { border: 2px solid #cbd5e1; border-radius: 16px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-size: 20px; font-weight: 900; text-transform: uppercase; color: #1e1b4b; margin: 0; }
    .subtitle { font-size: 11px; color: #475569; margin: 2px 0; }
    .badge { display: inline-block; background: #059669; color: #fff; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; margin-top: 8px; text-transform: uppercase; }
    .grid-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .label { color: #64748b; font-weight: 600; }
    .value { font-weight: 800; color: #0f172a; }
    .amount-box { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 14px 18px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
    .amount-val { font-size: 20px; font-weight: 900; color: #166534; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; padding-top: 20px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b; }
    .sign-box { text-align: center; }
    .sign-line { width: 140px; border-bottom: 1.5px solid #475569; margin-bottom: 6px; }
    @media print {
      body { margin: 10mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <div style="text-align: center; margin-bottom: 8px;">
        <img src="${COLLEGE_LOGO_BASE64}" alt="Sengunthar Engineering College" style="height: 60px; max-width: 280px; object-fit: contain; margin: 0 auto 6px; display: block;" />
        <div style="font-size: 11px; font-weight: 800; color: #1e1b4b; text-transform: uppercase;">Autonomous • NAAC 'A' Grade • Affiliated to Anna University</div>
      </div>
      <p class="subtitle">Tiruchengode - 637205, Namakkal District, Tamil Nadu • Office of Accounts & Finance</p>
      <div class="badge">Official E-Fee Receipt • Payment Successful</div>
    </div>

    <div class="grid-row">
      <span class="label">Receipt Reference No:</span>
      <span class="value" style="color: #4338ca; font-family: monospace;">${item.id}</span>
    </div>
    <div class="grid-row">
      <span class="label">Candidate Name:</span>
      <span class="value">${studentName}</span>
    </div>
    <div class="grid-row">
      <span class="label">Register Number:</span>
      <span class="value" style="font-family: monospace;">${rollNumber}</span>
    </div>
    <div class="grid-row">
      <span class="label">Degree & Branch:</span>
      <span class="value">B.E. ${department}</span>
    </div>
    <div class="grid-row">
      <span class="label">Fee Particulars:</span>
      <span class="value" style="max-width: 380px; text-align: right;">${item.category}</span>
    </div>
    <div class="grid-row">
      <span class="label">Transaction Reference:</span>
      <span class="value" style="font-family: monospace;">${item.transactionId}</span>
    </div>
    <div class="grid-row">
      <span class="label">Payment Channel:</span>
      <span class="value">${item.paymentMode}</span>
    </div>
    <div class="grid-row">
      <span class="label">Payment Date:</span>
      <span class="value">${item.paidDate}</span>
    </div>

    <div class="amount-box">
      <div>
        <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #166534; display: block;">Total Paid</span>
        <span style="font-size: 11px; color: #15803d;">Status: Confirmed & No Dues</span>
      </div>
      <span class="amount-val">₹${item.amount.toLocaleString()}</span>
    </div>

    <div class="footer">
      <div>
        <span>System Generated Electronic Receipt</span><br>
        <span>Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • SEC Finance Portal</span>
      </div>
      <div class="sign-box">
        <div class="sign-line" style="font-style: italic; color: #1e1b4b; font-weight: bold; font-size: 12px;">Dr. P. Shanmugam</div>
        <span>Finance & Accounts Officer</span>
      </div>
    </div>
  </div>

  <div class="no-print" style="margin-top: 25px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 24px; background: #4338ca; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px;">
      🖨️ Click to Print or Save as PDF
    </button>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEC_FeeReceipt_${item.id}_${rollNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessModal(`Fee Receipt ${item.id} (${item.category.slice(0, 32)}...)`);
  };

  const generateAndDownloadFullStatementHTML = () => {
    const tableRows = feeLedger
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold; color: #4338ca;">${item.id}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${item.category}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${item.paidDate}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${item.paymentMode}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 11px;">${item.transactionId}</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold; color: #166534;">₹${item.amount.toLocaleString()}</td>
        </tr>`
      )
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SEC_Fee_Statement_2026_${rollNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 30px; color: #0f172a; line-height: 1.5; background: #fff; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
    .college-name { font-size: 22px; font-weight: 900; text-transform: uppercase; color: #1e1b4b; margin: 0; }
    .college-sub { font-size: 12px; color: #475569; margin: 3px 0; }
    .title-pill { display: inline-block; background: #0f172a; color: #fff; padding: 4px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; margin-top: 8px; text-transform: uppercase; }
    .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
    th { background: #f1f5f9; padding: 10px 8px; border: 1px solid #cbd5e1; text-transform: uppercase; font-size: 11px; text-align: left; }
    .summary-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 14px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
    @media print { body { margin: 10mm; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div style="text-align: center; margin-bottom: 8px;">
      <img src="${COLLEGE_LOGO_BASE64}" alt="Sengunthar Engineering College" style="height: 60px; max-width: 280px; object-fit: contain; margin: 0 auto 6px; display: block;" />
      <div style="font-size: 12px; font-weight: 800; color: #1e1b4b; text-transform: uppercase;">
        (Autonomous Institution • NAAC 'A' Grade • Affiliated to Anna University)
      </div>
    </div>
    <p class="college-sub">Approved by AICTE • Tiruchengode - 637205, Namakkal District, Tamil Nadu • Center Code: 7304</p>
    <div class="title-pill">Official Annual Fee Statement & Clearance Ledger • AY 2025-2026</div>
  </div>

  <div class="meta-box">
    <div><strong>Candidate:</strong> ${studentName}</div>
    <div><strong>Register Number:</strong> ${rollNumber}</div>
    <div><strong>Degree & Branch:</strong> B.E. ${department}</div>
    <div><strong>Clearance Status:</strong> <span style="color:#059669; font-weight:bold;">100% Paid • No Dues Certificate Granted</span></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Receipt ID</th>
        <th>Fee Particulars</th>
        <th>Date Paid</th>
        <th>Payment Channel</th>
        <th>Transaction ID</th>
        <th style="text-align: right;">Amount Paid</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <div class="summary-box">
    <div>
      <strong style="color: #166534; font-size: 13px;">Total Academic Fees Cleared:</strong>
      <div style="font-size: 11px; color: #15803d;">All heads verified by SEC Bursar & Examination Branch</div>
    </div>
    <div style="font-size: 20px; font-weight: 900; color: #166534;">₹${paidAmount.toLocaleString()}</div>
  </div>

  <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px;">
    <div>
      Electronic Ledger Record<br>
      Verified by Accounts & Examination Clearance Wing
    </div>
    <div style="text-align: center;">
      <div style="width: 140px; border-bottom: 1.5px solid #475569; margin-bottom: 4px; font-style: italic; font-weight: bold; color: #1e1b4b;">Dr. P. Shanmugam</div>
      <strong>Finance & Accounts Officer</strong>
    </div>
  </div>

  <div class="no-print" style="margin-top: 30px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 24px; background: #4338ca; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
      🖨️ Click to Print or Save as PDF
    </button>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SEC_FullFeeStatement_2026_${rollNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessModal(`Full Fee Statement 2025-2026 (₹${paidAmount.toLocaleString()} Total Paid)`);
  };

  const handleCopyReceipt = (item: FeeItem) => {
    const text = `SENGUNTHAR ENGINEERING COLLEGE (AUTONOMOUS)\n` +
      `OFFICIAL FEE RECEIPT: ${item.id}\n` +
      `Student: ${studentName} | Reg No: ${rollNumber}\n` +
      `Particulars: ${item.category}\n` +
      `Amount Paid: ₹${item.amount.toLocaleString()}\n` +
      `Payment Mode: ${item.paymentMode}\n` +
      `Transaction ID: ${item.transactionId}\n` +
      `Payment Date: ${item.paidDate}\n` +
      `Status: Verified Paid (No Dues)`;

    navigator.clipboard.writeText(text);
    setCopiedReceiptId(item.id);
    setTimeout(() => setCopiedReceiptId(null), 3000);
  };

  const handlePrint = (item?: FeeItem) => {
    if (item) {
      generateAndDownloadReceiptHTML(item);
    } else {
      generateAndDownloadFullStatementHTML();
    }

    try {
      window.print();
    } catch {
      // Ignored in sandboxed iframe
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Accounts Branch • No Dues Clearance Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Semester Fee & Tuition Receipts
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm font-medium">
              Candidate: <span className="text-white font-bold">{studentName}</span> ({rollNumber}) • B.E. {department}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-indigo-200 block uppercase font-bold">Total Billed</span>
              <span className="text-lg font-black text-white">₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-indigo-200 block uppercase font-bold">Total Paid</span>
              <span className="text-lg font-black text-emerald-300">₹{paidAmount.toLocaleString()}</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <span className="text-[10px] text-indigo-200 block uppercase font-bold">Balance Dues</span>
              <span className="text-lg font-black text-white">₹{balanceDue}</span>
            </div>
          </div>
        </div>

        {/* Download Success Banner */}
        {downloadSuccessModal && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-black text-emerald-950 flex items-center gap-2">
                  <span>Official Fee Document Downloaded!</span>
                </div>
                <p className="text-xs text-emerald-800">
                  <span className="font-bold">{downloadSuccessModal}</span> file aapke computer ke <strong>Downloads folder</strong> me save ho gayi hai. Ise open karke direct print ya PDF save karein (<kbd className="px-1 py-0.5 bg-emerald-200 rounded font-mono font-bold">Ctrl + P</kbd>)!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setDownloadSuccessModal(null)}
                className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Fee Items Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <span>Academic Year 2025-2026 Ledger Breakup</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official receipts verified by Sengunthar Accounts Section & Controller of Examinations
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => generateAndDownloadFullStatementHTML()}
                className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black border border-indigo-200 shadow-xs flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Statement</span>
              </button>
              <button
                onClick={() => handlePrint()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ledger</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Fee Particulars</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date Paid</th>
                  <th className="py-3 px-4">Channel / Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {feeLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{item.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.category}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">₹{item.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.paidDate}</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.paymentMode}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => generateAndDownloadReceiptHTML(item)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          title="Download Receipt Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedReceipt(item)}
                          className="px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                        >
                          View Slip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Eligible for Final Year Hall Ticket & Degree Clearance Certificate</span>
            </span>
            <span>Accounts Incharge: Dr. P. Shanmugam (Bursar Office)</span>
          </div>
        </div>

        {/* Modal: Official Printable Fee Slip */}
        {selectedReceipt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Slip Header */}
              <div className="text-center space-y-1 pb-4 border-b border-slate-200">
                <img
                  src="/images/sect-logo.png"
                  alt="Sengunthar Engineering College"
                  className="h-12 w-auto mx-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://sect.edu.in/images/logo.png';
                  }}
                />
                <div className="text-xs font-black text-slate-900 uppercase tracking-tight">
                  Official E-Receipt • Accounts Section
                </div>
                <div className="text-[10px] text-slate-500">
                  Tiruchengode - 637205, Tamil Nadu • Autonomous Institution
                </div>
              </div>

              {/* Receipt Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Receipt Ref:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">{studentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Register Number:</span>
                  <span className="font-bold text-slate-900">{rollNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Fee Particular:</span>
                  <span className="font-bold text-slate-900 text-right max-w-xs">{selectedReceipt.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-mono text-slate-700">{selectedReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.paymentMode}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Payment Date:</span>
                  <span className="font-bold text-slate-800">{selectedReceipt.paidDate}</span>
                </div>
                <div className="flex justify-between py-2 bg-emerald-50 px-3 rounded-xl">
                  <span className="font-black text-emerald-900">Total Amount Paid:</span>
                  <span className="font-black text-emerald-900 text-sm">₹{selectedReceipt.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyReceipt(selectedReceipt)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {copiedReceiptId === selectedReceipt.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span>{copiedReceiptId === selectedReceipt.id ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => generateAndDownloadReceiptHTML(selectedReceipt)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Slip</span>
                  </button>

                  <button
                    onClick={() => handlePrint(selectedReceipt)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FeesPortal;
