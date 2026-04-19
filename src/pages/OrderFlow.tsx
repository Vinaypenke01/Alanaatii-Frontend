import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Stepper } from "@/components/Stepper";
import { PricingCard } from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useOrderStore } from "@/lib/orderStore";
import {
  productTypes, scriptPackages, expressScriptFee, letterPapers,
  letters, textStyles, boxes, gifts, relations, getDeliveryCharge,
} from "@/lib/data";
import { mockCoupons } from "@/lib/mockData";
import { format, addWeeks, isBefore } from "date-fns";
import { CalendarIcon, ArrowLeft, ArrowRight, Check, Minus, Plus, Ticket, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMemo, useState } from "react";

function getSteps(productType: string): string[] {
  switch (productType) {
    case "script":
      return ["Script Package", "Details", "Summary", "Pay"];
    case "letterPaper":
      return ["Paper", "Quantity", "Delivery", "Summary", "Pay"];
    case "letter":
      return ["Letter", "Style & Date", "Details", "Delivery", "Summary", "Pay"];
    case "letterBox":
      return ["Letter", "Style & Date", "Box", "Details", "Delivery", "Summary", "Pay"];
    case "letterBoxGift":
      return ["Letter", "Style & Date", "Box", "Gift", "Details", "Delivery", "Summary", "Pay"];
    default:
      return ["Letter", "Style & Date", "Details", "Delivery", "Summary", "Pay"];
  }
}

export default function OrderFlow() {
  const store = useOrderStore();
  const navigate = useNavigate();
  const { step, productType, setStep, setField } = store;
  const [couponInput, setCouponInput] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = useMemo(() => getSteps(productType), [productType]);
  const currentStepName = steps[step];

  const selectedScriptPkg = scriptPackages.find((s) => s.id === store.scriptPackageId);
  const selectedPaper = letterPapers.find((p) => p.id === store.letterPaperId);
  const selectedLetter = letters.find((l) => l.id === store.letterId);
  const selectedStyle = textStyles.find((t) => t.id === store.textStyleId);
  const selectedBox = boxes.find((b) => b.id === store.boxId);
  const selectedGift = gifts.find((g) => g.id === store.giftId);
  const fourWeeksOut = addWeeks(new Date(), 4);
  const isEarlyDelivery = store.deliveryDate && isBefore(store.deliveryDate, fourWeeksOut);
  const deliveryCharge = store.pincode.length >= 3 ? getDeliveryCharge(store.pincode) : 0;

  const needsDelivery = productType !== "script";

  const total = useMemo(() => {
    let t = 0;
    if (productType === "script") {
      if (selectedScriptPkg) t += selectedScriptPkg.price;
      if (store.expressScript) t += expressScriptFee;
    } else if (productType === "letterPaper") {
      if (selectedPaper) t += selectedPaper.price * store.paperQuantity;
      t += deliveryCharge;
    } else {
      if (selectedLetter) t += selectedLetter.price;
      if (selectedStyle) t += selectedStyle.price;
      if (selectedBox) t += selectedBox.price;
      if (selectedGift && selectedGift.id !== "custom") t += selectedGift.price;
      if (isEarlyDelivery) t += 100;
      t += deliveryCharge;
    }
    
    // Apply Coupon
    if (store.appliedCoupon) {
      const coupon = mockCoupons.find(c => c.code === store.appliedCoupon);
      if (coupon && coupon.active) {
        t = t * (1 - coupon.discount / 100);
      }
    }
    
    return Math.round(t);
  }, [productType, selectedScriptPkg, store.expressScript, selectedPaper, store.paperQuantity, selectedLetter, selectedStyle, selectedBox, selectedGift, isEarlyDelivery, deliveryCharge, store.appliedCoupon]);

  const handleApplyCoupon = () => {
    const coupon = mockCoupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    if (!coupon) {
      toast.error("Invalid coupon code");
      return;
    }
    if (!coupon.active) {
      toast.error("This coupon is no longer active");
      return;
    }
    setField("appliedCoupon", coupon.code);
    toast.success(`Coupon ${coupon.code} applied! ${coupon.discount}% off.`);
  };

  const canNext = () => {
    switch (currentStepName) {
      case "Script Package": return !!store.scriptPackageId;
      case "Paper": return !!store.letterPaperId;
      case "Quantity": return store.paperQuantity >= 1;
      case "Letter": return !!store.letterId;
      case "Style & Date": return !!store.textStyleId && !!store.deliveryDate;
      case "Box": return !!store.boxId;
      case "Gift": return !!store.giftId;
      case "Details": return !!store.relation && !!store.recipientName && !!store.messageContent;
      case "Delivery": return !!store.address && !!store.city && store.pincode.length >= 6;
      default: return true;
    }
  };

  const next = () => {
    if (!canNext()) { toast.error("Please complete all required fields"); return; }
    if (step < steps.length - 1) setStep(step + 1);
  };
  const prev = () => { 
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate("/products");
    }
  };

  const renderStep = () => {
    switch (currentStepName) {
      case "Script Package":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Choose Script Package</h2>
            <div className="grid gap-4">
              {scriptPackages.map((s) => (
                <PricingCard key={s.id} title={s.title} description={s.description} price={s.price}
                  image={s.image}
                  selected={store.scriptPackageId === s.id} onClick={() => setField("scriptPackageId", s.id)} />
              ))}
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted border">
              <Checkbox id="express" checked={store.expressScript}
                onCheckedChange={(v) => setField("expressScript", !!v)} />
              <label htmlFor="express" className="text-sm text-foreground cursor-pointer">
                Express Script Review — <span className="text-primary font-semibold">+₹{expressScriptFee}</span>
              </label>
            </div>
          </div>
        );

      case "Paper":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Choose Letter Paper</h2>
            <div className="grid gap-4">
              {letterPapers.map((p) => (
                <PricingCard key={p.id} title={p.title} description={p.description} price={p.price}
                  image={p.image}
                  selected={store.letterPaperId === p.id} onClick={() => setField("letterPaperId", p.id)} />
              ))}
            </div>
          </div>
        );

      case "Quantity":
        return (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Select Quantity</h2>
            {selectedPaper && (
              <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{selectedPaper.title}</span> — ₹{selectedPaper.price} each
              </div>
            )}
            <div className="flex items-center gap-4 justify-center">
              <Button variant="outline" size="icon" onClick={() => setField("paperQuantity", Math.max(1, store.paperQuantity - 1))}>
                <Minus size={16} />
              </Button>
              <span className="text-3xl font-bold text-foreground w-16 text-center">{store.paperQuantity}</span>
              <Button variant="outline" size="icon" onClick={() => setField("paperQuantity", store.paperQuantity + 1)}>
                <Plus size={16} />
              </Button>
            </div>
            {selectedPaper && (
              <p className="text-center text-sm text-muted-foreground">
                Subtotal: <span className="text-primary font-semibold">₹{selectedPaper.price * store.paperQuantity}</span>
              </p>
            )}
          </div>
        );

      case "Letter":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Choose Your Letter</h2>
            <div className="grid gap-4">
              {letters.map((l) => (
                <PricingCard key={l.id} title={l.title} description={l.description} price={l.price}
                  image={l.image}
                  selected={store.letterId === l.id} onClick={() => setField("letterId", l.id)} />
              ))}
            </div>
          </div>
        );

      case "Style & Date":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Text Style</h2>
              <div className="grid gap-4">
                {textStyles.map((t) => (
                  <PricingCard key={t.id} title={t.title} description={t.description} price={t.price}
                    image={(t as any).image}
                    selected={store.textStyleId === t.id} onClick={() => setField("textStyleId", t.id)} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Delivery Date</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !store.deliveryDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {store.deliveryDate ? format(store.deliveryDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={store.deliveryDate ?? undefined}
                    onSelect={(d) => setField("deliveryDate", d)}
                    disabled={(d) => isBefore(d, new Date())}
                    className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {isEarlyDelivery && (
                <p className="text-sm text-accent mt-2 font-medium">⚡ Early delivery: +₹100 extra</p>
              )}
            </div>
          </div>
        );

      case "Box":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Select Box</h2>
            <div className="grid gap-4">
              {boxes.map((b) => (
                <PricingCard key={b.id} title={b.title} description={b.description} price={b.price}
                  image={b.image}
                  selected={store.boxId === b.id} onClick={() => setField("boxId", b.id)}
                  badge={b.id === "premium" ? "Popular" : undefined} />
              ))}
            </div>
          </div>
        );

      case "Gift":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Select Gift</h2>
            <div className="grid gap-4">
              {gifts.map((g) => (
                <PricingCard key={g.id} title={g.title} description={g.description}
                  price={g.price} image={g.image} selected={store.giftId === g.id}
                  onClick={() => setField("giftId", g.id)}
                  badge={g.id === "custom" ? "Custom" : undefined} />
              ))}
            </div>
            {store.giftId === "custom" && (
              <div className="p-4 rounded-lg bg-muted border text-sm text-muted-foreground">
                💬 For custom gifts, our team will contact you via WhatsApp after the order is placed.
              </div>
            )}
          </div>
        );

      case "Details":
        return (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-foreground">Tell Us More</h2>
            <div>
              <Label>Relation</Label>
              <Select value={store.relation ?? ""} onValueChange={(v) => setField("relation", v)}>
                <SelectTrigger><SelectValue placeholder="Select relation" /></SelectTrigger>
                <SelectContent>
                  {relations.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Recipient Name</Label>
              <Input value={store.recipientName} onChange={(e) => setField("recipientName", e.target.value)} placeholder="Their name" />
            </div>
            <div>
              <Label>Message Content</Label>
              <Textarea value={store.messageContent} onChange={(e) => setField("messageContent", e.target.value)} placeholder="What would you like to say?" rows={4} />
            </div>
            <div>
              <Label>Special Notes (optional)</Label>
              <Input value={store.specialNotes} onChange={(e) => setField("specialNotes", e.target.value)} placeholder="Any special requests?" />
            </div>
          </div>
        );

      case "Delivery":
        return (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-foreground">Delivery Details</h2>
            <div>
              <Label>Address</Label>
              <Textarea value={store.address} onChange={(e) => setField("address", e.target.value)} placeholder="Full delivery address" rows={3} />
            </div>
            <div>
              <Label>City</Label>
              <Input value={store.city} onChange={(e) => setField("city", e.target.value)} placeholder="City" />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input value={store.pincode} onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6-digit pincode" />
              {store.pincode.length >= 3 && (
                <p className="text-sm text-muted-foreground mt-1">Delivery charge: ₹{deliveryCharge}</p>
              )}
            </div>
          </div>
        );

      case "Summary":
        return (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Order Summary</h2>
            <div className="bg-card rounded-xl border p-6 space-y-3">
              {productType === "script" && (
                <>
                  {selectedScriptPkg && <SummaryRow label={selectedScriptPkg.title} value={selectedScriptPkg.price} />}
                  {store.expressScript && <SummaryRow label="Express Script Review" value={expressScriptFee} />}
                </>
              )}
              {productType === "letterPaper" && selectedPaper && (
                <SummaryRow label={`${selectedPaper.title} × ${store.paperQuantity}`} value={selectedPaper.price * store.paperQuantity} />
              )}
              {productType !== "script" && productType !== "letterPaper" && (
                <>
                  {selectedLetter && <SummaryRow label={selectedLetter.title} value={selectedLetter.price} />}
                  {selectedStyle && <SummaryRow label={`Text Style: ${selectedStyle.title}`} value={selectedStyle.price} />}
                  {selectedBox && <SummaryRow label={selectedBox.title} value={selectedBox.price} />}
                  {selectedGift && selectedGift.id !== "custom" && <SummaryRow label={selectedGift.title} value={selectedGift.price} />}
                  {isEarlyDelivery && <SummaryRow label="Early Delivery" value={100} />}
                </>
              )}
              {needsDelivery && <SummaryRow label="Delivery Charge" value={deliveryCharge} />}
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg text-foreground">
                <span>Total</span>
                <div className="text-right">
                  {store.appliedCoupon && (
                    <span className="text-xs text-muted-foreground line-through mr-2 font-normal">
                      ₹{
                        // Calculate total without coupon for display
                        (() => {
                          let t = 0;
                          if (productType === "script") {
                            if (selectedScriptPkg) t += selectedScriptPkg.price;
                            if (store.expressScript) t += expressScriptFee;
                          } else if (productType === "letterPaper") {
                            if (selectedPaper) t += selectedPaper.price * store.paperQuantity;
                            t += deliveryCharge;
                          } else {
                            if (selectedLetter) t += selectedLetter.price;
                            if (selectedStyle) t += selectedStyle.price;
                            if (selectedBox) t += selectedBox.price;
                            if (selectedGift && selectedGift.id !== "custom") t += selectedGift.price;
                            if (isEarlyDelivery) t += 100;
                            t += deliveryCharge;
                          }
                          return t;
                        })()
                      }
                    </span>
                  )}
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-4 space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Ticket size={16} className="text-primary" /> Have a Coupon?
              </Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter code (e.g. START20)" 
                  value={couponInput} 
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="uppercase h-10"
                />
                <Button variant="outline" onClick={handleApplyCoupon} className="h-10 border-primary text-primary hover:bg-primary/5">
                  Apply
                </Button>
              </div>
              {store.appliedCoupon && (
                <p className="text-xs text-green-600 font-medium">
                  ✓ Coupon "{store.appliedCoupon}" applied successfully!
                </p>
              )}
            </div>
            {store.recipientName && (
              <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground space-y-1">
                <p><strong>To:</strong> {store.recipientName}</p>
                {store.relation && <p><strong>Relation:</strong> {store.relation}</p>}
                {needsDelivery && store.address && <p><strong>Delivery:</strong> {store.address}, {store.city} - {store.pincode}</p>}
                {store.deliveryDate && <p><strong>Date:</strong> {format(store.deliveryDate, "PPP")}</p>}
              </div>
            )}
          </div>
        );

      case "Pay":
        return (
          <div className="space-y-6 py-4">
            <h2 className="font-display text-2xl font-bold text-foreground text-center">Complete Your Payment</h2>
            
            <div className="bg-muted p-6 rounded-xl border border-dashed border-primary/30 text-center space-y-4">
              <p className="text-sm text-muted-foreground">Please scan the QR code or pay to the UPI ID below</p>
              <div className="w-48 h-48 bg-white mx-auto flex items-center justify-center rounded-lg border shadow-sm">
                <div className="text-muted-foreground text-[10px] text-center px-4">
                  <p className="font-bold mb-1">UPI QR CODE</p>
                  <div className="w-32 h-32 bg-slate-100 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-[8px] opacity-40">QR Placeholder</span>
                  </div>
                  <p className="font-medium text-foreground text-xs">alanaatii@upi</p>
                </div>
              </div>
              <p className="font-bold text-primary text-xl">₹{total}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-card border rounded-lg p-5">
                <Label className="text-base mb-3 block">Upload Payment Screenshot</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors bg-muted/30">
                  <input
                    type="file"
                    id="screenshot-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        toast.success("Screenshot uploaded successfully!");
                        setField("paymentScreenshot", "/placeholder.svg"); // Mock file path
                      }
                    }}
                  />
                  <Label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Plus size={24} />
                    </div>
                    <span className="text-sm font-medium text-foreground">Click to upload receipt</span>
                    <span className="text-xs text-muted-foreground">JPG, PNG or PDF (Max 5MB)</span>
                  </Label>
                  {store.paymentScreenshot && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-green-600 font-medium">
                      <Check size={14} /> Receipt attached
                    </div>
                  )}
                </div>
              </div>

              <Button 
                size="lg" 
                disabled={!store.paymentScreenshot}
                className={cn(
                  "w-full h-14 text-lg font-bold shadow-lg transition-all",
                  store.paymentScreenshot ? "bg-gradient-gold text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground grayscale"
                )}
                onClick={() => { 
                  setShowSuccessModal(true);
                }}
              >
                {store.paymentScreenshot ? "Submit Payment Receipt" : "Upload Receipt to Continue"}
              </Button>
              <p className="text-center text-xs text-muted-foreground px-6 leading-relaxed">
                By clicking submit, you confirm that the payment of ₹{total} has been made to the Alanaatii UPI ID.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container max-w-2xl">

          <div className="flex items-center justify-between mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/products")}
              className="text-muted-foreground hover:text-foreground -ml-2 h-8"
            >
              <ArrowLeft size={14} className="mr-2" /> Back to Products
            </Button>
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border">
              Step {step + 1} of {steps.length}
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-display font-bold text-foreground">
              Configuring: <span className="text-primary">{productTypes.find(pt => pt.id === productType)?.title}</span>
            </h1>
          </div>

          <Stepper steps={steps} current={step} />

          <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
            {renderStep()}

            {currentStepName !== "Pay" && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button variant="outline" onClick={prev}>
                  <ArrowLeft size={16} className="mr-1" /> Back
                </Button>
                <Button onClick={next} className="bg-gradient-gold text-primary-foreground hover:opacity-90">
                  {currentStepName === "Summary" ? "Proceed to Pay" : "Next"} <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
            )}
          </div>

          {total > 0 && currentStepName !== "Summary" && currentStepName !== "Pay" && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Running total: <span className="font-semibold text-primary">₹{total}</span>
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
              <CheckCircle2 size={48} className="text-green-500 animate-in zoom-in duration-500" />
            </div>
            <DialogHeader className="text-center sm:text-center">
              <DialogTitle className="text-2xl font-bold font-display text-foreground">
                Payment Receipt Submitted!
              </DialogTitle>
              <DialogDescription className="text-muted-foreground pt-2 text-base leading-relaxed">
                Thank you for your payment. Your order is now being processed.
                <br />
                <span className="font-semibold text-primary block mt-4">
                  Kindly note: Admin will review your payment and you will get notifications through WhatsApp and email for further details.
                </span>
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="sm:justify-center mt-6">
            <Button 
              className="w-full sm:w-48 bg-gradient-gold text-primary-foreground font-bold h-12 shadow-lg hover:opacity-90 transition-all"
              onClick={() => {
                setShowSuccessModal(false);
                store.reset();
                setStep(0);
                navigate("/");
              }}
            >
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">₹{value}</span>
    </div>
  );
}
