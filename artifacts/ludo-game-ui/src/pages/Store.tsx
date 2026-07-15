import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useListBundles, usePurchaseBundle, useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';

export default function Store() {
  const { data: bundles, isLoading } = useListBundles();
  const purchaseMutation = usePurchaseBundle();
  const queryClient = useQueryClient();
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePurchase = (bundleId: number) => {
    setErrorMsg(null);
    setPurchaseSuccess(null);
    
    purchaseMutation.mutate({ data: { bundleId } }, {
      onSuccess: (res) => {
        setPurchaseSuccess(`Successfully added ${res.coinsAdded.toLocaleString()} coins!`);
        // Invalidate user to update balance in header
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        
        setTimeout(() => setPurchaseSuccess(null), 3000);
      },
      onError: (err: any) => {
        setErrorMsg(err.message || "Purchase failed.");
        setTimeout(() => setErrorMsg(null), 3000);
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 pb-20 relative"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-white italic tracking-wider">COIN <span className="text-[#FFC92C]">STORE</span></h1>
        <p className="text-gray-400 text-xs mt-1">Get more coins to play bigger matches</p>
      </div>

      {purchaseSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/20 border-2 border-green-500 rounded-xl p-3 mb-6 flex items-center justify-center gap-2 text-green-300 font-bold"
        >
          <CheckCircle2 size={20} />
          {purchaseSuccess}
        </motion.div>
      )}

      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border-2 border-red-500 rounded-xl p-3 mb-6 flex items-center justify-center text-red-300 font-bold text-sm"
        >
          {errorMsg}
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FFC92C]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {bundles?.filter(b => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder).map((bundle, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={bundle.id}
              className="bg-gradient-to-b from-[#181136] to-[#0A071A] border-2 border-[#3A2A9D] rounded-2xl p-4 flex flex-col items-center relative overflow-hidden group hover:border-[#FFC92C] transition-colors shadow-lg"
            >
              {bundle.discountPercent && bundle.discountPercent > 0 && (
                <div className="absolute top-0 right-0 bg-[#F12D2D] text-white text-[10px] font-black px-2 py-1 rounded-bl-lg z-10 shadow-[0_0_10px_#F12D2D]">
                  {bundle.discountPercent}% OFF
                </div>
              )}
              
              <div className="text-4xl mb-2 drop-shadow-[0_0_10px_rgba(255,201,44,0.6)]">
                {bundle.coinsAmount >= 50000 ? '💰' : bundle.coinsAmount >= 10000 ? '💎' : '🪙'}
              </div>
              
              <div className="text-xl font-black text-white mb-1 drop-shadow-md">
                {bundle.coinsAmount.toLocaleString()}
              </div>
              <div className="text-xs text-[#FFC92C] font-bold mb-4">{bundle.label}</div>
              
              <button 
                onClick={() => handlePurchase(bundle.id)}
                disabled={purchaseMutation.isPending}
                className="w-full py-2 rounded-full bg-gradient-to-b from-[#2A7FEF] to-[#0D4EA6] text-white font-bold text-sm border-b-4 border-[#062963] active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center leading-tight"
              >
                <span>৳ {bundle.priceBdt}</span>
                {bundle.originalPriceBdt && (
                  <span className="line-through text-[10px] text-blue-200 opacity-80">৳ {bundle.originalPriceBdt}</span>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      )}
      
      {bundles?.length === 0 && !isLoading && (
        <div className="text-center text-gray-400 py-12">No bundles available right now.</div>
      )}
    </motion.div>
  );
}