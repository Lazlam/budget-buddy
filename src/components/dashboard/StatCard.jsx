import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      // Added dark:bg-gray-800, dark:border-gray-700, and transition-colors
      className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      
      <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-10" style={{ background: color }} />
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">{title}</p>
          
          {/* Added dark:text-white */}
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          
          {/* Added dark:text-gray-400 */}
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        
        <div className="p-3 rounded-xl" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}