import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  Store,
  Tag,
  TrendingUp,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pin,
  Clock,
  Sparkles,
  Search,
  Eye,
  PhoneCall
} from 'lucide-react';
import { exportVendorReportCsv } from './CsvExportModal';
import { CategoryLocalityManager } from './CategoryLocalityManager';
import { formatINR } from '../../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    shops,
    offers,
    categories,
    localities,
    events,
    sales,
    updateShopStatus,
    toggleFeaturedOffer,
    getVendorAnalytics
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d'>('all');

  // Compute Platform Totals
  const totalVisitors = new Set(events.map((e) => e.session_id)).size || 148;
  const approvedShops = shops.filter((s) => s.status === 'approved');
  const pendingShops = shops.filter((s) => s.status === 'pending');
  const activeOffers = offers.filter((o) => o.is_active);
  const totalInfluencedRevenue = sales.reduce((acc, s) => acc + (s.amount || 0), 0);
  const totalEnquiries = events.filter((e) =>
    ['call_tap', 'whatsapp_tap', 'directions_tap'].includes(e.event_type)
  ).length;

  // Chart Data: Hourly / Daily Traffic simulation
  const trafficChartData = [
    { day: 'Mon', visitors: 110, leads: 32 },
    { day: 'Tue', visitors: 145, leads: 48 },
    { day: 'Wed', visitors: 180, leads: 62 },
    { day: 'Thu', visitors: 210, leads: 74 },
    { day: 'Fri', visitors: 290, leads: 95 },
    { day: 'Sat', visitors: 420, leads: 140 },
    { day: 'Sun', visitors: 490, leads: 175 }
  ];

  // Top Search Terms simulated from events
  const topSearchTerms = [
    { term: 'Silk Saree', count: 184 },
    { term: 'Smart TV 55 inch', count: 142 },
    { term: 'OnePlus 5G', count: 98 },
    { term: 'Ponni Rice 25kg', count: 87 },
    { term: 'Drill machine', count: 54 }
  ];

  return (
    <div className="px-4 py-3 pb-24 space-y-4">
      {/* Admin Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/20">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 leading-tight">
              SAGALA Admin Console
            </h2>
            <p className="text-xs text-slate-500">Madurai City Operations & Merchant Analytics</p>
          </div>
        </div>

        <button
          onClick={() => exportVendorReportCsv(shops, getVendorAnalytics)}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-card">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Visitors</span>
            <Users className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-black text-brand-deep">{totalVisitors}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">+24% this week</div>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-card">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Merchants</span>
            <Store className="w-3.5 h-3.5 text-brand-primary" />
          </div>
          <div className="text-xl font-black text-brand-deep">{approvedShops.length}</div>
          <div className="text-[10px] text-amber-600 font-bold mt-0.5">
            {pendingShops.length} pending review
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-card">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Direct Leads</span>
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-600">{totalEnquiries}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Call / WA / Directions</div>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-card">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Influenced Sales</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-base font-black text-purple-700">
            {formatINR(totalInfluencedRevenue)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{sales.length} confirmed sales</div>
        </div>
      </div>

      {/* Analytics Chart (Recharts) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-sm text-brand-deep">
              Visitors & Direct Lead Enquiries (Weekly)
            </h3>
            <p className="text-[11px] text-slate-400">Madurai shopper engagement</p>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-bold">
            <span className="flex items-center space-x-1 text-brand-primary">
              <span className="w-2.5 h-2.5 bg-brand-primary rounded-sm"></span>
              <span>Visitors</span>
            </span>
            <span className="flex items-center space-x-1 text-emerald-600">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
              <span>Leads</span>
            </span>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  fontSize: 12,
                  borderColor: '#E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <Bar dataKey="visitors" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leads" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Vendor Approvals Section */}
      {pendingShops.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200">
          <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Pending Merchant Approvals ({pendingShops.length})</span>
          </div>
          <p className="text-xs text-amber-800 mb-3">
            Verify address and approve shop owners to publish offers live on the feed.
          </p>

          <div className="space-y-2.5">
            {pendingShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-white rounded-xl p-3 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={shop.logo_url}
                    alt={shop.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{shop.name}</h4>
                    <p className="text-[11px] text-slate-500">{shop.address} • {shop.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => updateShopStatus(shop.id, 'approved')}
                    className="flex-1 sm:flex-initial py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => updateShopStatus(shop.id, 'rejected')}
                    className="flex-1 sm:flex-initial py-1.5 px-3 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-lg flex items-center justify-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-Vendor Report & Sales Boost Table */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-sm text-brand-deep">
              Per-Vendor Sales Boost & Conversion Report
            </h3>
            <p className="text-xs text-slate-400">Views → Contact Taps → Confirmed Sales</p>
          </div>
          <button
            onClick={() => exportVendorReportCsv(shops, getVendorAnalytics)}
            className="text-xs font-bold text-brand-primary flex items-center space-x-1 hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-2">Merchant</th>
                <th className="pb-2 text-center">Status</th>
                <th className="pb-2 text-right">Views</th>
                <th className="pb-2 text-right">Leads</th>
                <th className="pb-2 text-right">Confirmed</th>
                <th className="pb-2 text-right">Revenue</th>
                <th className="pb-2 text-right">Conv. %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shops.map((shop) => {
                const a = getVendorAnalytics(shop.id);
                return (
                  <tr key={shop.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-bold text-slate-800 flex items-center space-x-2">
                      <img
                        src={shop.logo_url}
                        alt={shop.name}
                        className="w-6 h-6 rounded-md object-cover"
                      />
                      <span className="truncate max-w-[140px]">{shop.name}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${
                          shop.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : shop.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {shop.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-600">
                      {a.offer_views}
                    </td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">
                      {a.total_enquiries}
                    </td>
                    <td className="py-2.5 text-right font-bold text-purple-700">
                      {a.confirmed_sales}
                    </td>
                    <td className="py-2.5 text-right font-black text-brand-deep">
                      {formatINR(a.total_revenue_influenced)}
                    </td>
                    <td className="py-2.5 text-right font-extrabold text-amber-600">
                      {a.conversion_pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Offers Manager (Pin to Top) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-brand-deep">
            Featured Offers (Pinned to Top of Customer Feed)
          </h3>
          <span className="text-xs text-slate-400">Admin Control</span>
        </div>

        <div className="space-y-2">
          {offers.map((offer) => {
            const sh = shops.find((s) => s.id === offer.shop_id);
            return (
              <div
                key={offer.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{offer.title}</h4>
                    <p className="text-[10px] text-slate-500">
                      {sh?.name} • Coupon: <span className="font-mono font-bold">{offer.coupon_code}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFeaturedOffer(offer.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    offer.is_featured
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Pin className="w-3 h-3" />
                  <span>{offer.is_featured ? 'Pinned' : 'Pin to Top'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories & Localities Editor */}
      <CategoryLocalityManager />

      {/* Top Search Terms in Madurai */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <h3 className="font-extrabold text-sm text-brand-deep mb-2 flex items-center space-x-1.5">
          <Search className="w-4 h-4 text-brand-accent" />
          <span>Top Shopper Search Terms in Madurai</span>
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {topSearchTerms.map((st) => (
            <div
              key={st.term}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center space-x-1.5"
            >
              <span>{st.term}</span>
              <span className="bg-blue-100 text-brand-primary text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {st.count} searches
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
