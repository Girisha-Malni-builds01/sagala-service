# 🛡️ SAGALA Admin Operations & Analytics Guide

This guide is for the SAGALA central team to operate, monitor, and scale the Madurai platform.

---

## 1. Accessing the Admin Console

- In the top navigation bar, click the role pill and switch to **SAGALA Admin** (or navigate to `admin_dashboard`).
- In production, admin privileges are enforced via Supabase Row Level Security (`profiles.role = 'admin'`).

---

## 2. Reviewing & Approving Merchant Applications

When new shop owners sign up, they enter the **Pending Approvals** queue.

1. Review the shop name, physical street address, and phone number.
2. If legitimate, click **"Approve"**:
   - The shop status changes to `approved` and is verified with a blue checkmark badge.
   - The merchant's active offers immediately appear on the public customer feed.
3. If duplicate or spam, click **"Reject"** or **"Suspend"**.

---

## 3. Pinning "Featured Offers" to the Top of the Feed

1. In the **Featured Offers** management section, browse all merchant offers across Madurai.
2. Click **"Pin to Top"** on any offer:
   - The offer receives a golden **"FEATURED"** chip and is permanently pinned to the very top of the customer feed regardless of posting timestamp.
   - You can unpin an offer at any time with 1 click.

---

## 4. Editing Categories & Madurai Localities (No Code Changes)

Under **Admin Taxonomy Manager**:
- **Categories Tab**: Add or delete categories on the fly (e.g., *Jewellery / நகைக்கடை*, *Footwear / காலணிகள்*). Changes take effect instantly for all shoppers and merchants.
- **Localities Tab**: Add new Madurai neighborhoods (e.g., *Othakadai*, *Thirunagar*, *Teppakulam*, *Anuppanadi*) along with pincodes.

---

## 5. First-Party Tracking & Conversion Metrics

SAGALA features a custom first-party tracking engine (table `events`):
- **Views**: Each unique session browsing an offer or shop.
- **Leads**: Clicks on Call, WhatsApp, and Directions.
- **Sales Boost**: Measured by confirmed coupon codes entered by merchants.
- **Rate Limiting**: Identical taps from the same session on the same offer are deduplicated within a 30-second window.
- **Privacy Compliance**: Zero personal data, cookies, or external ad pixels are stored.

---

## 6. Exporting Merchant Performance Reports to CSV

1. In the top right corner of the Admin Dashboard, click **"Export CSV"**.
2. A file named `sagala_vendor_sales_boost_<date>.csv` downloads immediately with full columns:
   - Shop Name, Locality, Status, Offer Views, Profile Visits, Calls, WhatsApp Taps, Directions Taps, Confirmed Sales, Influenced Revenue (₹), and Conversion Rate (%).
3. Open in Excel, Google Sheets, or Numbers to share weekly growth reports with shop owners!
