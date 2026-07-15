import React, { useState } from 'react';
import { 
  useListBundles, 
  useCreateBundle, 
  useUpdateBundle, 
  useDeleteBundle,
  getListBundlesQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Settings, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function Admin() {
  const { data: bundles, isLoading } = useListBundles();
  const createMutation = useCreateBundle();
  const updateMutation = useUpdateBundle();
  const deleteMutation = useDeleteBundle();
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<number | 'NEW' | null>(null);
  
  const defaultForm = {
    coinsAmount: 1000,
    priceBdt: 100,
    originalPriceBdt: '',
    discountPercent: '',
    label: 'Standard Bundle',
    sortOrder: 1,
    isActive: true
  };
  
  const [formData, setFormData] = useState<any>(defaultForm);

  const startEdit = (bundle: any) => {
    setEditingId(bundle.id);
    setFormData({
      ...bundle,
      originalPriceBdt: bundle.originalPriceBdt || '',
      discountPercent: bundle.discountPercent || ''
    });
  };

  const startNew = () => {
    setEditingId('NEW');
    setFormData(defaultForm);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = () => {
    const payload = {
      coinsAmount: Number(formData.coinsAmount),
      priceBdt: Number(formData.priceBdt),
      originalPriceBdt: formData.originalPriceBdt ? Number(formData.originalPriceBdt) : null,
      discountPercent: formData.discountPercent ? Number(formData.discountPercent) : null,
      label: formData.label,
      sortOrder: Number(formData.sortOrder),
      isActive: Boolean(formData.isActive)
    };

    if (editingId === 'NEW') {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBundlesQueryKey() });
          setEditingId(null);
        }
      });
    } else {
      updateMutation.mutate({ id: editingId as number, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBundlesQueryKey() });
          setEditingId(null);
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this bundle?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBundlesQueryKey() });
        }
      });
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="text-[#FFC92C]" /> Admin Panel
        </h1>
        {editingId === null && (
          <button 
            onClick={startNew}
            className="bg-[#2A7FEF] hover:bg-[#4FA6FF] text-white p-2 rounded-full shadow-lg transition-colors"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-[#4FA6FF] font-bold text-sm uppercase tracking-wider mb-2">Manage Store Bundles</h2>
        
        {editingId === 'NEW' && (
          <BundleForm 
            data={formData} 
            setData={setFormData} 
            onSave={handleSave} 
            onCancel={cancelEdit} 
            isPending={createMutation.isPending} 
            title="Create New Bundle"
          />
        )}

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          bundles?.sort((a, b) => a.sortOrder - b.sortOrder).map(bundle => (
            editingId === bundle.id ? (
              <BundleForm 
                key={bundle.id}
                data={formData} 
                setData={setFormData} 
                onSave={handleSave} 
                onCancel={cancelEdit} 
                isPending={updateMutation.isPending} 
                title={`Edit Bundle #${bundle.id}`}
              />
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                key={bundle.id} 
                className={`p-3 rounded-xl border ${bundle.isActive ? 'border-[#3A2A9D] bg-[#0B1038]' : 'border-gray-800 bg-[#060A2D] opacity-60'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🪙</span>
                    <span className="font-bold text-white text-lg">{bundle.coinsAmount.toLocaleString()}</span>
                    {!bundle.isActive && <span className="text-[10px] bg-gray-700 px-1.5 py-0.5 rounded text-white">INACTIVE</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(bundle)} className="text-[#4FA6FF] p-1"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(bundle.id)} className="text-red-500 p-1"><Trash2 size={16} /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                  <div>Price: <span className="text-white font-bold">৳{bundle.priceBdt}</span></div>
                  <div>Label: <span className="text-[#FFC92C]">{bundle.label}</span></div>
                  <div>Original: {bundle.originalPriceBdt ? `৳${bundle.originalPriceBdt}` : '-'}</div>
                  <div>Discount: {bundle.discountPercent ? `${bundle.discountPercent}%` : '-'}</div>
                  <div>Order: {bundle.sortOrder}</div>
                </div>
              </motion.div>
            )
          ))
        )}
      </div>
    </div>
  );
}

function BundleForm({ data, setData, onSave, onCancel, isPending, title }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData({
      ...data,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="bg-[#181136] border-2 border-[#4FA6FF] rounded-xl p-4 shadow-[0_0_15px_rgba(79,166,255,0.2)]">
      <h3 className="text-white font-bold mb-4">{title}</h3>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Coins Amount</label>
            <input type="number" name="coinsAmount" value={data.coinsAmount} onChange={handleChange} className="w-full bg-[#060A2D] border border-[#3A2A9D] rounded p-2 text-white text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Price (BDT)</label>
            <input type="number" name="priceBdt" value={data.priceBdt} onChange={handleChange} className="w-full bg-[#060A2D] border border-[#3A2A9D] rounded p-2 text-white text-sm" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Original Price (opt)</label>
            <input type="number" name="originalPriceBdt" value={data.originalPriceBdt} onChange={handleChange} className="w-full bg-[#060A2D] border border-[#3A2A9D] rounded p-2 text-white text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Discount % (opt)</label>
            <input type="number" name="discountPercent" value={data.discountPercent} onChange={handleChange} className="w-full bg-[#060A2D] border border-[#3A2A9D] rounded p-2 text-white text-sm" />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Label</label>
          <input type="text" name="label" value={data.label} onChange={handleChange} className="w-full bg-[#060A2D] border border-[#3A2A9D] rounded p-2 text-white text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Sort Order</label>
            <input type="number" name="sortOrder" value={data.sortOrder} onChange={handleChange} className="w-full bg-[#060A2D] border border-[#3A2A9D] rounded p-2 text-white text-sm" />
          </div>
          <div className="flex items-center h-10 pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isActive" checked={data.isActive} onChange={handleChange} className="w-4 h-4" />
              <span className="text-sm text-white">Active</span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <button 
            onClick={onSave} 
            disabled={isPending}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1"
          >
            <Check size={18} /> {isPending ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1"
          >
            <X size={18} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}