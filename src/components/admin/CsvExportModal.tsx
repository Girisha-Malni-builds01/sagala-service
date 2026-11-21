import React from 'react';
import { useApp } from '../../context/AppContext';
import { Download, FileSpreadsheet } from 'lucide-react';

export const exportVendorReportCsv = (shops: any[], getVendorAnalytics: (id: string) => any) => {
  const headers = [
    'Shop ID',
    'Shop Name',
    'Status',
    'Offer Views',
    'Shop Profile Visits',
    'Phone Calls',
    'WhatsApp Leads',
    'Map Directions',
    'Total Enquiries',
    'Confirmed Sales',
    'Influenced Revenue (INR)',
    'Conversion Rate (%)'
  ];

  const rows = shops.map((shop) => {
    const a = getVendorAnalytics(shop.id);
    return [
      `"${shop.id}"`,
      `"${shop.name.replace(/"/g, '""')}"`,
      `"${shop.status}"`,
      a.offer_views,
      a.shop_views,
      a.call_taps,
      a.whatsapp_taps,
      a.directions_taps,
      a.total_enquiries,
      a.confirmed_sales,
      a.total_revenue_influenced,
      `"${a.conversion_pct}%"`
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `sagala_vendor_sales_boost_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
