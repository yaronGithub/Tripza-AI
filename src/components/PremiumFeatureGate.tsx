import React, { useState } from 'react';
import { Crown, Lock, Sparkles } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionModal } from './SubscriptionModal';

interface PremiumFeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export function PremiumFeatureGate({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true 
}: PremiumFeatureGateProps) {
  const { isPro, hasFeature } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Check if user has access to this feature
  const hasAccess = isPro() || hasFeature(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show fallback content if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show upgrade prompt if enabled
  if (showUpgrade) {
    return (
      <>
        <div className="relative">
          {/* Blurred content */}
          <div className="filter blur-sm pointer-events-none opacity-50">
            {children}
          </div>
          
          {/* Upgrade overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
            <div className="text-center p-6 max-w-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upgrade to Tripza AI Pro to unlock {feature.toLowerCase()} and all premium features.
              </p>
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center mx-auto"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          highlightFeature={feature}
        />
      </>
    );
  }

  // Don't render anything if no upgrade prompt
  return null;
}

// Convenience component for premium buttons
export function PremiumButton({ 
  feature, 
  onClick, 
  children, 
  className = '',
  ...props 
}: {
  feature: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const { isPro, hasFeature } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const hasAccess = isPro() || hasFeature(feature);

  const handleClick = () => {
    if (hasAccess) {
      onClick();
    } else {
      setShowSubscriptionModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`${className} ${!hasAccess ? 'relative' : ''}`}
        {...props}
      >
        {children}
        {!hasAccess && (
          <Lock className="w-4 h-4 ml-2 text-yellow-500" />
        )}
      </button>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        highlightFeature={feature}
      />
    </>
  );
}