import React from 'react';
import { ShoppingBag, Search, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmptyState = ({
  type = 'general',
  title = 'No results found',
  description = 'Try adjusting your search filters or check back later.',
  actionText,
  onAction,
}) => {
  const navigate = useNavigate();

  const icons = {
    search: <Search className="w-16 h-16 text-slate-300" />,
    cart: <ShoppingBag className="w-16 h-16 text-slate-300" />,
    orders: <ClipboardList className="w-16 h-16 text-slate-300" />,
    general: <ShoppingBag className="w-16 h-16 text-slate-300" />,
  };

  const defaultActions = {
    cart: {
      text: 'Browse Restaurants',
      handler: () => navigate('/'),
    },
    orders: {
      text: 'Order Now',
      handler: () => navigate('/'),
    },
    search: {
      text: 'Clear Filters',
      handler: onAction,
    },
  };

  const finalActionText = actionText || defaultActions[type]?.text;
  const finalActionHandler = onAction || defaultActions[type]?.handler;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto space-y-5 animate-pop-in">
      <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
        {icons[type] || icons.general}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm max-w-sm leading-relaxed">{description}</p>
      </div>
      {finalActionText && finalActionHandler && (
        <button onClick={finalActionHandler} className="button-primary font-semibold">
          {finalActionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
