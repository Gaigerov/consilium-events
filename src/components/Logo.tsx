interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const mainLogo = './images/mainLogo.png'

export default function Logo({ className = "", onClick }: LogoProps) {
  return (
    <div 
      className={`flex items-center space-x-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img
        src={mainLogo}
        alt="Консилиум"
        className="h-8 sm:h-10 w-auto object-contain"
      />
    </div>
  );
}