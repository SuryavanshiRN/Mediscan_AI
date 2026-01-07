import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Building2,
  CreditCard,
  Shield,
  Clock,
  Users,
  FileText,
  Brain,
  Stethoscope,
} from "lucide-react";
import toast from "react-hot-toast";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out MediScan AI",
    price: 0,
    period: "forever",
    icon: Zap,
    color: "from-gray-500 to-gray-600",
    popular: false,
    features: [
      { text: "5 diagnoses per month", included: true },
      { text: "Basic clinical information", included: true },
      { text: "Grad-CAM visualization", included: true },
      { text: "Email support", included: true },
      { text: "AI prescriptions", included: false },
      { text: "PDF reports", included: false },
      { text: "Patient management", included: false },
      { text: "Analytics dashboard", included: false },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "For individual practitioners",
    price: 29,
    period: "month",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    popular: false,
    features: [
      { text: "50 diagnoses per month", included: true },
      { text: "Detailed clinical information", included: true },
      { text: "Grad-CAM visualization", included: true },
      { text: "AI prescriptions (Gemini)", included: true },
      { text: "PDF reports", included: true },
      { text: "Patient management (50)", included: true },
      { text: "Email support", included: true },
      { text: "Analytics dashboard", included: false },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For clinics and medical practices",
    price: 79,
    period: "month",
    icon: Crown,
    color: "from-purple-500 to-indigo-600",
    popular: true,
    features: [
      { text: "Unlimited diagnoses", included: true },
      { text: "Advanced clinical insights", included: true },
      { text: "Grad-CAM + attention maps", included: true },
      { text: "AI prescriptions (Gemini Pro)", included: true },
      { text: "Professional PDF reports", included: true },
      { text: "Unlimited patient management", included: true },
      { text: "Full analytics dashboard", included: true },
      { text: "Priority email & chat support", included: true },
      { text: "Multi-user access (5 users)", included: true },
      { text: "API access", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For hospitals and large organizations",
    price: 299,
    period: "month",
    icon: Building2,
    color: "from-amber-500 to-orange-600",
    popular: false,
    features: [
      { text: "Unlimited everything", included: true },
      { text: "Custom AI model training", included: true },
      { text: "All visualization features", included: true },
      { text: "AI prescriptions (Custom)", included: true },
      { text: "White-label PDF reports", included: true },
      { text: "Unlimited patients & users", included: true },
      { text: "Advanced analytics & BI", included: true },
      { text: "24/7 dedicated support", included: true },
      { text: "Custom integrations", included: true },
      { text: "Full API access & webhooks", included: true },
    ],
  },
];

const faqs = [
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Yes! All paid plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and are HIPAA compliant. Your patient data is always protected.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. No questions asked.",
  },
];

export default function Subscription() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSelectPlan = (plan) => {
    if (plan.id === "free") {
      toast.success("You're already on the Free plan!");
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleSubscribe = () => {
    toast.success(
      `Successfully subscribed to ${selectedPlan.name} plan! (Demo)`
    );
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const getPrice = (plan) => {
    if (plan.price === 0) return "Free";
    const price =
      billingPeriod === "yearly" ? Math.round(plan.price * 0.8) : plan.price;
    return `$${price}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          Choose Your Plan
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Unlock the full potential of AI-powered medical diagnostics. Choose
          the plan that fits your practice.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <span
            className={`text-sm ${
              billingPeriod === "monthly"
                ? "text-text-primary font-medium"
                : "text-text-tertiary"
            }`}
          >
            Monthly
          </span>
          <motion.button
            onClick={() =>
              setBillingPeriod(
                billingPeriod === "monthly" ? "yearly" : "monthly"
              )
            }
            className={`relative w-14 h-7 rounded-full transition-colors ${
              billingPeriod === "yearly" ? "bg-medical-primary" : "bg-border"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ left: billingPeriod === "yearly" ? "32px" : "4px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
          <span
            className={`text-sm ${
              billingPeriod === "yearly"
                ? "text-text-primary font-medium"
                : "text-text-tertiary"
            }`}
          >
            Yearly{" "}
            <span className="text-medical-success font-semibold">
              (Save 20%)
            </span>
          </span>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.id}
              className={`relative glass-card p-6 rounded-2xl ${
                plan.popular
                  ? "ring-2 ring-purple-500 shadow-xl shadow-purple-500/20"
                  : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <motion.div
                  className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-text-primary">
                  {plan.name}
                </h3>
                <p className="text-sm text-text-tertiary mt-1">
                  {plan.description}
                </p>
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-text-primary">
                  {getPrice(plan)}
                </span>
                {plan.price > 0 && (
                  <span className="text-text-tertiary">
                    /{billingPeriod === "yearly" ? "mo" : "month"}
                  </span>
                )}
                {billingPeriod === "yearly" && plan.price > 0 && (
                  <p className="text-xs text-medical-success mt-1">
                    Billed annually (${Math.round(plan.price * 0.8 * 12)}/year)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-2 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.02 }}
                  >
                    {feature.included ? (
                      <Check className="w-4 h-4 text-medical-success flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-text-tertiary flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        feature.included
                          ? "text-text-secondary"
                          : "text-text-tertiary line-through"
                      }
                    >
                      {feature.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-xl font-medium transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30"
                    : plan.price === 0
                    ? "bg-background-secondary text-text-primary hover:bg-background-tertiary"
                    : "bg-medical-primary text-white hover:bg-medical-primary-hover"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.price === 0 ? "Current Plan" : "Get Started"}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <motion.div
        className="glass-card p-8 rounded-2xl mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
          Why Choose MediScan AI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div className="text-center" whileHover={{ y: -5 }}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">
              Advanced AI Models
            </h3>
            <p className="text-sm text-text-secondary">
              State-of-the-art deep learning models trained on millions of
              medical images for accurate diagnoses.
            </p>
          </motion.div>
          <motion.div className="text-center" whileHover={{ y: -5 }}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">
              HIPAA Compliant
            </h3>
            <p className="text-sm text-text-secondary">
              Your patient data is protected with enterprise-grade security and
              full HIPAA compliance.
            </p>
          </motion.div>
          <motion.div className="text-center" whileHover={{ y: -5 }}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">
              Instant Results
            </h3>
            <p className="text-sm text-text-secondary">
              Get diagnostic results in seconds, not hours. Speed up your
              workflow and patient care.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* FAQs */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.25 }}
      >
        <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="glass-card p-5 rounded-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="font-semibold text-text-primary mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-text-secondary">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <motion.div
          className="fixed inset-0 glass-overlay flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPaymentModal(false)}
        >
          <motion.div
            className="glass-modal rounded-2xl p-8 w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${selectedPlan.color} flex items-center justify-center mb-4`}
              >
                <selectedPlan.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">
                Subscribe to {selectedPlan.name}
              </h2>
              <p className="text-text-secondary mt-2">
                {getPrice(selectedPlan)}/
                {billingPeriod === "yearly" ? "month" : "month"}
                {billingPeriod === "yearly" && (
                  <span className="block text-sm text-medical-success">
                    Billed annually
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-3 pl-12 border border-border rounded-xl bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                  />
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-surface text-text-primary focus:ring-2 focus:ring-medical-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-background-secondary/50 rounded-xl p-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-medical-success" />
                  <span className="font-medium text-text-primary">
                    Secure Payment
                  </span>
                </div>
                <p>
                  Your payment is secured with 256-bit SSL encryption. We never
                  store your full card details.
                </p>
              </div>

              <motion.button
                onClick={handleSubscribe}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe Now
              </motion.button>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
