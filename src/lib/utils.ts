// Utility helpers for time, currency, coupons, share, maps
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function generateCouponCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SGL-${num}`;
}

export function getHoursRemaining(endsAt: string): number {
  const diff = new Date(endsAt).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
}

export function formatTimeLeft(endsAt: string): { label: string; isEndingSoon: boolean } {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) {
    return { label: 'Expired', isEndingSoon: false };
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 24) {
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return {
      label: `${hours}h ${mins}m left`,
      isEndingSoon: true
    };
  }

  return {
    label: `${days}d left`,
    isEndingSoon: false
  };
}

export function getWhatsAppShareUrl(offerTitle: string, shopName: string, couponCode: string): string {
  const text = encodeURIComponent(
    `🔥 Super Offer on SAGALA SERVICE!\n\n${offerTitle}\nat *${shopName}*, Madurai.\nUse Coupon Code: *${couponCode}* at billing.\n\nView offer: ${window.location.origin}`
  );
  return `https://api.whatsapp.com/send?text=${text}`;
}

export function getShopWhatsAppDirectUrl(phone: string, offerTitle: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const text = encodeURIComponent(`Hi, I saw your offer "${offerTitle}" on SAGALA SERVICE`);
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

export function getGoogleMapsUrl(address: string, shopName: string): string {
  const query = encodeURIComponent(`${shopName}, ${address}, Madurai`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
