import React from 'react';
import { Sparkles, TrendingUp, PhoneCall, CheckCircle2 } from 'lucide-react';
import { VendorAnalytics } from '../../types';
import { formatINR } from '../../lib/utils';

interface WeeklySummaryCardProps {
  stats: VendorAnalytics;
}

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ stats }) => {
  return (
    <div className="bg-gradient-to-br from-brand-deep via-blue-900 to-brand-primary rounded-3xl p-4 text-white shadow-xl shadow-brand-primary/15 relative overflow-hidden mb-4">
      {/* Background soft circles */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-brand-accent/20 rounded-full blur-lg pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-amber-300">
            <Sparkles className="w-3 h-3 text-brand-gold animate-spin" />
            <span>Weekly Growth Engine</span>
          </div>
          <span className="text-[11px] text-blue-200">Last 7 Days</span>
        </div>

        <h3 className="font-extrabold text-base leading-snug mb-1">
          Your offers brought <span className="text-amber-300 font-black">{stats.offer_views} views</span> and{' '}
          <span className="text-emerald-300 font-black">{stats.total_enquiries} direct enquiries</span>!
        </h3>

        <p className="text-xs text-blue-100/90 leading-relaxed mb-3">
          Hyperlocal buyers in Madurai are actively discovering your shop profile and dialing your counter.
        </p>

        {/* Mini Highlights */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm">
            <div className="text-[10px] text-blue-200 font-medium">Phone Calls</div>
            <div className="text-sm font-black text-white">{stats.call_taps}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm">
            <div className="text-[10px] text-blue-200 font-medium">WhatsApp Leads</div>
            <div className="text-sm font-black text-emerald-300">{stats.whatsapp_taps}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-2 text-center backdrop-blur-sm">
            <div className="text-[10px] text-blue-200 font-medium">Influenced Rev</div>
            <div className="text-xs font-black text-amber-300">{formatINR(stats.total_revenue_influenced)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
