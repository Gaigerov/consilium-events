interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export default function Logo({ className = "", onClick }: LogoProps) {
  return (
    <div 
      className={`flex items-center space-x-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img
        src='/images/mainLogo.png'
        alt="Консилиум"
        className="h-8 sm:h-10 w-auto object-contain"
      />
    </div>
  );
}