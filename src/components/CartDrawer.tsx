/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, ShoppingCart, Trash2, Tag, ShieldAlert, CheckCircle2, 
  ArrowRight, CreditCard, Landmark, Check, RefreshCw, Smartphone, Sparkles, Download
} from "lucide-react";
import { CartItem, MedicalNote } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveFromCart: (noteId: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (unlockedNoteIds: string[]) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onClearCart,
  onCheckoutSuccess
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment" | "success">("cart");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cashfree">("cashfree");
  
  // Payment & Customer states
  const [upiInput, setUpiInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Cashfree integration states
  const [customerName, setCustomerName] = useState("Dr. Ananya");
  const [customerEmail, setCustomerEmail] = useState("student@stethonotes.com");
  const [customerPhone, setCustomerPhone] = useState("9876543210");
  const [cashfreeError, setCashfreeError] = useState("");
  const [cashfreeSessionId, setCashfreeSessionId] = useState("");
  const [cashfreeOrderId, setCashfreeOrderId] = useState("");
  const [isDemoCashfree, setIsDemoCashfree] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.note.price * item.quantity), 0);
  const discountAmount = Math.floor(subtotal * (discountPercent / 100));
  const platformFee = subtotal > 0 ? 10 : 0; // ₹10 processing fee
  const grandTotal = Math.max(0, subtotal - discountAmount + platformFee);

  const applyCoupon = () => {
    setCouponError("");
    if (couponCode.toUpperCase() === "FUTUREDOC" || couponCode.toUpperCase() === "STETHO10") {
      setDiscountPercent(15);
      setCouponApplied(true);
    } else {
      setCouponError("Invalid coupon code. Try FUTUREDOC for 15% off!");
    }
  };

  const handleCashfreePayment = async () => {
    setIsProcessing(true);
    setCashfreeError("");

    try {
      const response = await fetch("/api/cashfree/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: grandTotal,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          customerName: customerName
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to generate Cashfree session.");
      }

      setCashfreeSessionId(data.paymentSessionId);
      setCashfreeOrderId(data.orderId);
      setIsDemoCashfree(!!data.demoMode);

      if (data.demoMode) {
        // Trigger simulated experience
        setShowSimulator(true);
        setIsProcessing(false);
      } else {
        // Trigger actual SDK Checkout
        const CashfreeSDK = (window as any).Cashfree;
        if (CashfreeSDK) {
          let cashfree;
          try {
            // Attempt standard factory call (SDK v3 style)
            cashfree = CashfreeSDK({
              mode: data.environment || "sandbox"
            });
          } catch (e) {
            // Fallback to constructor instantiation
            cashfree = new CashfreeSDK({
              mode: data.environment || "sandbox"
            });
          }
          
          cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            returnUrl: window.location.href,
          }).then((result: any) => {
            if (result.error) {
              setCashfreeError(result.error.message || "Payment aborted.");
              setIsProcessing(false);
            } else if (result.redirect) {
              console.log("Cashfree redirecting...");
            } else {
              // Direct success callback if supported in modern embedded view
              setIsProcessing(false);
              setCheckoutStep("success");
              onCheckoutSuccess(cart.map((item) => item.note.id));
            }
          });
        } else {
          // SDK not loaded, fall back to interactive sandbox
          setIsDemoCashfree(true);
          setShowSimulator(true);
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      setCashfreeError(err.message || "Unable to establish secure checkout token.");
      setIsProcessing(false);
    }
  };

  const handleProcessPayment = () => {
    if (paymentMethod === "cashfree") {
      handleCashfreePayment();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep("success");
      onCheckoutSuccess(cart.map((item) => item.note.id));
    }, 2000);
  };

  const resetDrawerState = () => {
    setCheckoutStep("cart");
    setCouponCode("");
    setDiscountPercent(0);
    setCouponApplied(false);
    setCashfreeError("");
    setShowSimulator(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end" id="cart-drawer-overlay">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        id="cart-drawer-content"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-sky-600" />
            <h3 className="text-base font-bold font-display text-slate-900">Your Cart</h3>
            {cart.length > 0 && (
              <span className="bg-sky-50 text-sky-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </div>
          <button 
            onClick={resetDrawerState}
            className="text-slate-400 hover:text-slate-900 transition-colors p-1"
            id="drawer-close-btn"
          >
            <X className="h-5.5 w-5.5" />
          </button>
        </div>

        {/* Dynamic Inner Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {checkoutStep === "cart" && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4" id="empty-cart-view">
                  <div className="mx-auto h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Your cart is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore the StethoNotes marketplace and add verified gold-medalist handwritten notebooks to your collection.
                  </p>
                  <button
                    onClick={onClose}
                    className="rounded-xl bg-slate-900 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-sm"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                <div className="space-y-4" id="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.note.id} className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-b-0">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-center items-center text-slate-500 shrink-0">
                        <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-tight">PDF</span>
                        <span className="text-[10px] font-bold text-slate-900 font-mono">₹{item.note.price}</span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.note.title}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold block">{item.note.author.name} • {item.note.pages} Pages</span>
                      </div>

                      <button
                        onClick={() => onRemoveFromCart(item.note.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                        title="Remove Item"
                        id={`remove-item-${item.note.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Coupon Application widget */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Have an Academic Promo?</span>
                    {couponApplied ? (
                      <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Mnemonic Code Applied: <strong>15% OFF</strong></span>
                        </div>
                        <button
                          onClick={() => {
                            setDiscountPercent(0);
                            setCouponApplied(false);
                          }}
                          className="text-[10px] text-slate-400 hover:text-slate-900 underline font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="e.g. FUTUREDOC"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                        />
                        <button
                          onClick={applyCoupon}
                          className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-800 transition-all"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {couponError && <span className="text-[10px] text-rose-500 font-bold block">{couponError}</span>}
                  </div>
                </div>
              )}
            </>
          )}

          {checkoutStep === "payment" && (
            <div className="space-y-6" id="payment-step-view">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Secure Payment Gateway</span>
                  <span className="text-sm font-bold text-slate-900 block mt-1">Select Payment Protocol</span>
                </div>
                <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 text-[10px] font-black px-2.5 py-1 rounded-md border border-sky-100">
                  <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                  Cashfree PG Enabled
                </span>
              </div>

              {/* Payment Methods tabs - 3 columns including Cashfree */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setPaymentMethod("cashfree")}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    paymentMethod === "cashfree"
                      ? "border-sky-500 bg-sky-50/50 text-sky-700 font-extrabold shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Sparkles className="h-4.5 w-4.5 mx-auto text-amber-500 mb-1 animate-pulse" />
                  <span className="text-[10px] block font-bold">Cashfree PG</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    paymentMethod === "upi"
                      ? "border-sky-500 bg-sky-50/50 text-sky-700 font-extrabold shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Smartphone className="h-4.5 w-4.5 mx-auto text-sky-600 mb-1" />
                  <span className="text-[10px] block">Instant UPI</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    paymentMethod === "card"
                      ? "border-sky-500 bg-sky-50/50 text-sky-700 font-extrabold shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="h-4.5 w-4.5 mx-auto text-sky-600 mb-1" />
                  <span className="text-[10px] block">Cards</span>
                </button>
              </div>

              {/* Dynamic Payment Body */}
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 space-y-4">
                {paymentMethod === "cashfree" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200/50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cashfree Customer Parameters</span>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">Safe Checkout</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Student Name</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Dr. Ananya"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="student@stethonotes.com"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                          <input
                            type="text"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="9876543210"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {cashfreeError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[10.5px] text-rose-700 font-bold space-y-1">
                        <span>⚠️ Integration Error:</span>
                        <p className="font-mono text-[9.5px] leading-relaxed bg-white/50 p-1.5 rounded">{cashfreeError}</p>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-500 leading-normal">
                      ℹ️ Clicking pay will connect directly to Cashfree APIs to generate a secure session token. If API credentials are not yet saved, StethoNotes automatically spins up a sandbox simulator.
                    </p>
                  </div>
                ) : paymentMethod === "upi" ? (
                  <div className="space-y-4">
                    {/* Simulated QR block */}
                    <div className="flex justify-center p-3 bg-white rounded-xl border border-slate-200 max-w-[140px] mx-auto shadow-inner">
                      <svg viewBox="0 0 100 100" className="w-24 h-24 text-slate-900">
                        {/* Simulated QR patterns */}
                        <path d="M10 10h20v20H10zm50 0h20v20H60zM10 60h20v20H10z" fill="currentColor"/>
                        <path d="M15 15h10v10H15zm50 0h10v10H65zM15 65h10v10H15z" fill="white"/>
                        <path d="M35 15h15v5H35zm0 10h5v15h-5zm15 15h25v5H50zm15-20h5v15h-5zm0 30h10v5H65zM35 55h20v5H35z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span className="text-[10px] text-slate-400 text-center block font-semibold uppercase">Scan QR code using GooglePay / PhonePe / Paytm</span>
                    
                    <div className="h-px bg-slate-200 my-2"></div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Or Enter UPI ID</label>
                      <input
                        type="text"
                        placeholder="e.g. residentdoctor@okaxis"
                        value={upiInput}
                        onChange={(e) => setUpiInput(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-sky-500 focus:outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          maxLength={3}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-sky-500 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Secure transaction guarantee */}
              <div className="flex items-start gap-2 text-[10px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                <ShieldAlert className="h-4.5 w-4.5 text-sky-600 mt-0.5 shrink-0" />
                <span>By checking out, you agree to immediate document delivery inside "My Library". Notes are fully aligned with NMC regulations.</span>
              </div>
            </div>
          )}

          {checkoutStep === "success" && (
            <div className="text-center py-10 space-y-5" id="checkout-success-view">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-50">
                <Check className="h-8 w-8" strokeWidth={3} />
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-100">
                  <Sparkles className="h-3 w-3 text-yellow-500 fill-yellow-300" />
                  Instant Unlock Complete
                </span>
                <h4 className="text-base font-extrabold text-slate-900">Payment Successful!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Your purchase was verified. Your academic assets are now available in your <strong>Library tab</strong> for instant reading, study Companion integration, and HD downloads.
                </p>
              </div>

              {/* Demo action list */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Unlocked Documents</span>
                {cart.map((item) => (
                  <div key={item.note.id} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{item.note.title}</span>
                    <a
                      href={`data:text/plain,STETHONOTES_DOWNLOAD_${item.note.id}`}
                      download={`stethonotes_${item.note.subject.toLowerCase()}_unlocked.pdf`}
                      className="text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5"
                    >
                      <Download className="h-3 w-3" /> PDF Download
                    </a>
                  </div>
                ))}
              </div>

              <button
                onClick={resetDrawerState}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-xs transition-all shadow-md"
              >
                Go to My Library
              </button>
            </div>
          )}

        </div>

        {/* Drawer Footer Calculations (Hidden on success screen) */}
        {checkoutStep !== "success" && cart.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-100 p-6 space-y-4">
            
            {/* Calculation breakdowns */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span className="font-mono">₹{subtotal}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Mnemonic Discount ({discountPercent}%)</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500 font-medium">
                <span>Platform Processing Fee</span>
                <span className="font-mono">₹{platformFee}</span>
              </div>

              <div className="h-px bg-slate-200/60 my-2"></div>

              <div className="flex justify-between text-slate-900 font-extrabold text-sm">
                <span>Grand Total</span>
                <span className="font-mono">₹{grandTotal}</span>
              </div>
            </div>

            {/* Main checkout transition trigger */}
            {checkoutStep === "cart" ? (
              <button
                onClick={() => setCheckoutStep("payment")}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                id="cart-proceed-btn"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold py-3 text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                id="cart-pay-btn"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Banking Protocols...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Pay ₹{grandTotal} securely</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>

      {/* Cashfree Checkout Sandbox Simulator Overlay */}
      {showSimulator && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#1f2438] text-white p-6 flex items-center justify-between relative">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-sky-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">SANDBOX TESTMODE</span>
                  <span className="text-[10px] font-mono text-slate-400">ID: {cashfreeOrderId}</span>
                </div>
                <h3 className="text-lg font-black font-display tracking-tight flex items-center gap-1.5">
                  <span className="text-sky-400">cashfree</span> payments
                </h3>
              </div>
              <button 
                onClick={() => setShowSimulator(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Order Meta info */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Merchant Name</span>
                  <span className="text-slate-800 font-bold block">StethoNotes Pvt Ltd</span>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Amount Due</span>
                  <span className="text-sky-700 font-extrabold text-sm block">INR {grandTotal}.00</span>
                </div>
                <div className="space-y-1 border-t border-slate-200/50 pt-2 col-span-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Customer Parameters</span>
                  <div className="flex justify-between text-[11px] text-slate-600 font-mono">
                    <span>{customerName}</span>
                    <span>{customerEmail}</span>
                    <span>{customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Simulation message box */}
              <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-800">
                  <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse shrink-0" />
                  <span className="text-xs font-bold font-display">Interactive API Sandbox Live</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Your server generated a mock Cashfree Order Session <code>{cashfreeSessionId}</code> successfully because custom credentials have not been saved. You can simulate the successful payment response below!
                </p>
              </div>

              {/* Option Selector Simulation */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Sandbox Simulation Route</span>
                
                <div className="space-y-2">
                  {/* Option 1: Simulated UPI scan */}
                  <div className="border border-slate-200/80 rounded-2xl p-3.5 hover:border-slate-300 transition-all flex items-center justify-between bg-white">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center font-bold font-mono text-xs">UPI</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Scan BHIM UPI / GPay Code</h4>
                        <p className="text-[10.5px] text-slate-500 font-medium">Auto-confirms on response trigger</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Popular</span>
                  </div>

                  {/* Option 2: Mock Card scan */}
                  <div className="border border-slate-200/80 rounded-2xl p-3.5 hover:border-slate-300 transition-all flex items-center justify-between bg-white">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center font-bold font-mono text-xs">CARD</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Simulate Visa/MasterCard Auth</h4>
                        <p className="text-[10.5px] text-slate-500 font-medium">Requires secure bank OTP simulation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action buttons footer */}
            <div className="bg-slate-50 p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setShowSimulator(false);
                  setCashfreeError("Payment simulation declined by user.");
                }}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-3 text-xs rounded-xl transition-all"
              >
                Decline & Close
              </button>

              <button
                onClick={() => {
                  setShowSimulator(false);
                  setCheckoutStep("success");
                  onCheckoutSuccess(cart.map((item) => item.note.id));
                }}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3 text-xs rounded-xl transition-all shadow-md shadow-emerald-50 text-center"
              >
                ✓ Confirm Success
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
