# 🔮 Phase 2 Roadmap & Architecture Blueprint

While the Phase 1 MVP delivers a complete, installable, and free-to-host hyperlocal offers platform, the following features are planned for Phase 2 expansion as the merchant base grows:

---

## 1. Web Push Notifications
- **Goal**: Alert nearby shoppers when their favourite shops post flash deals (e.g., "Meenakshi Silks just posted 40% Off bridal sarees!").
- **Implementation**:
  - Web Push API + Service Worker `push` event.
  - Supabase Edge Functions or free Firebase Cloud Messaging (FCM) tier.
  - Opt-in prompt with granular category preferences (e.g. only Electronics & Clothing).

---

## 2. Online Advance Token Payments (Zero-No-Show Reservations)
- **Goal**: Allow shoppers to reserve a limited stock offer by paying a small advance token (e.g. ₹100 - ₹500) online.
- **Implementation**:
  - Razorpay or Cashfree standard checkout modal.
  - The advance amount is deducted from the final in-store bill when the merchant scans the QR code / coupon.

---

## 3. Hyperlocal Dunzo / Porter / Shadowfax Delivery Integration
- **Goal**: Same-day 2-hour doorstep delivery from Madurai shops to customers within 10 km.
- **Implementation**:
  - Webhook dispatch to local courier logistics APIs (Dunzo for Business or Porter API).
  - Live GPS tracking link sent via WhatsApp to the buyer.

---

## 4. Customer Ratings & Verified Bill Reviews
- **Goal**: Build social proof and trust for local Madurai shops.
- **Implementation**:
  - Star ratings (1-5) and photo reviews.
  - "Verified Buyer" badge awarded only if the review is submitted by a customer whose coupon code was confirmed by the merchant.

---

## 5. Vendor Subscription & Premium Placement Plans
- **Goal**: Monetize the platform for the SAGALA team as merchant volume increases.
- **Tier Structure**:
  - **Free Tier**: 3 active offers, standard feed ranking, basic analytics.
  - **Silver Partner (₹999/mo)**: 10 active offers, WhatsApp enquiry auto-responder, locality featured badge.
  - **Gold Partner (₹2,499/mo)**: Unlimited offers, top pinned story banner, dedicated weekly customer blast, advanced conversion analytics.
