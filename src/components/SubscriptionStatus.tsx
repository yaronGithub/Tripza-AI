import React, { useState } from 'react';
import { Crown, Calendar, RefreshCw, Settings } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionModal } from './SubscriptionModal';

export function SubscriptionStatus() {
  const { subscription, refreshSubscription, loading } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!subscription.isActive) {
    return (
      <>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Plan</h3>
              <p className="text-gray-600 text-sm">
                Upgrade to unlock premium features and unlimited trip planning
              </p>
            </div>
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade
            </button>
          </div>
        </div>

        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />
      </>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Tripza AI Pro {subscription.plan && `(${subscription.plan})`}
            </h3>
            <p className="text-green-700 text-sm font-medium">Active Subscription</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshSubscription}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-colors"
            title="Refresh subscription status"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-colors"
            title="Manage subscription"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {subscription.expirationDate && (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {subscription.willRenew ? 'Renews' : 'Expires'} on {formatDate(subscription.expirationDate)}
          </span>
        </div>
      )}

      {/* Active Features */}
      <div className="mt-4 pt-4 border-t border-green-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Active Features:</h4>
        <div className="flex flex-wrap gap-2">
          {subscription.entitlements.map((entitlement) => (
            <span
              key={entitlement}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
            >
              {entitlement}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}