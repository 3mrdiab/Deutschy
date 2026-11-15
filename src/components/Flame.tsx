export default function Flame({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c.6 3.2-1.4 4.8-3 6.6C7.4 10.400 6 12.100 6 14.700 6 18.500 8.700 22 12 22s6-3.100 6-6.800c0-2.200-1-3.900-2.100-5.200-.3 1.200-.9 2-1.700 2.500.5-3.700-.4-7.800-2.200-10.500z"/>
    </svg>
  );
}
