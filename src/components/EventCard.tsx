import {Card} from "./ui/card";
import {ImageWithFallback} from "./ImageWithFallback";
import {Calendar} from "lucide-react";

interface Speaker {
    id: string;
    name: string;
    title: string;
    avatar: string;
}

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    endDate?: string;
    startTime: string;
    endTime: string;
    location: string;
    image: string;
    category: "event" | "exhibition";
    isLive: boolean;
    youtubeVideoId?: string;
    videoPlatform?: "YouTube" | "Rutube" | "VK";
    registeredCount: number;
    maxCapacity: number;
    price: number;
    speakers?: Speaker[];
}

interface EventCardProps {
    event: Event;
    onClick: () => void;
}

export default function EventCard({event, onClick}: EventCardProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short'
        });
    };

    const formatDateRange = () => {
        if (!event.endDate || event.endDate === event.date) {
            return formatDate(event.date);
        }

        const startDate = new Date(event.date);
        const endDate = new Date(event.endDate);

        const startDay = startDate.getDate();
        const endDay = endDate.getDate();

        // Если месяцы одинаковые
        if (startDate.getMonth() === endDate.getMonth()) {
            const month = endDate.toLocaleDateString('ru-RU', {month: 'short'});
            return `${startDay}-${endDay} ${month}`;
        }

        // Если разные месяцы
        return `${formatDate(event.date)} - ${formatDate(event.endDate)}`;
    };

    const isEventLiveNow = () => {
        const now = new Date();
        const eventStart = new Date(`${event.date}T${event.startTime}`);
        const eventEnd = new Date(`${event.date}T${event.endTime}`);
        return now >= eventStart && now <= eventEnd;
    };

    const shouldShowLive = event.isLive && isEventLiveNow();

      return (
    <div 
      className="p-[5px] rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
      style={{ 
        background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))',
        height: '250px'
      }}
      onClick={onClick}
    >
      <Card 
        className="group relative overflow-hidden h-full border-0"
      >
      {/* Изображение на весь фон */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Градиент overlay для читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Контент поверх изображения */}
      <div className="relative h-full flex flex-col justify-end">
        {/* Нижняя часть: Название, Дата и Лого */}
        <div className="space-y-3 pb-2 px-5">
          {/* Название */}
          <div className={`${shouldShowLive ? 'pr-20' : ''}`}>
            <h3 className="text-white font-semibold text-xl leading-tight line-clamp-3 drop-shadow-lg">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Badges: Дата и Лого */}
        <div className="flex items-end justify-between -m-[5px]">
          {/* Дата и время в одну строку в левом нижнем углу */}
          <div 
            className="p-[5px] rounded-tr-2xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'
            }}
          >
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-tr-xl shadow-lg">
              <Calendar className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />
              <div className="text-xs">
                <div className="font-medium text-gray-900 whitespace-nowrap">
                  {formatDateRange()} • {event.startTime}
                </div>
              </div>
            </div>
          </div>

          {/* Лого в правом нижнем углу */}
          <div 
            className="p-[5px] rounded-tl-2xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'
            }}
          >
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-2 py-1.5 rounded-tl-xl shadow-lg flex-shrink-0">
              <div className="h-6 flex items-center">
                <img
                  src="/images/cardLogoMini.png"
                  alt="Консилиум"
                  className="h-6 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE badge в правом верхнем углу */}
      {shouldShowLive && (
        <div className="absolute top-0 right-0">
          <div className="bg-red-500 text-white px-3 py-2 rounded-bl-lg shadow-lg">
            <div className="flex items-center animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-1.5"></div>
              <span className="font-semibold text-sm">LIVE</span>
            </div>
          </div>
        </div>
      )}
      </Card>
    </div>
  );
}
