import {Card} from "./ui/card";
import {ImageWithFallback} from "./ImageWithFallback";
import {Calendar} from "lucide-react";

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
    registeredCount: number;
    maxCapacity: number;
    price: number;
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
        <Card
            className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border-2 border-blue-500/50"
            onClick={onClick}
            style={{height: '240px'}}
        >
            {/* Изображение на весь фон */}
            <div className="absolute inset-0">
                <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Градиент overlay для читаемости текста */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </div>

            {/* Контент поверх изображения */}
            <div className="relative h-full flex flex-col justify-between">
                {/* Верхняя часть: Название */}
                <div className={`p-5 ${shouldShowLive ? 'pr-24' : 'pr-5'}`}>
                    <h3 className="text-white font-semibold text-xl leading-tight line-clamp-3 drop-shadow-lg">
                        {event.title}
                    </h3>
                </div>

                {/* Нижняя часть: Дата и цена */}
                <div className="flex items-end justify-between">
                    {/* Дата в левом нижнем углу */}
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-tr-lg shadow-lg">
                        <Calendar className="w-4 h-4 text-gray-700 flex-shrink-0" />
                        <div className="text-sm">
                            <div className="font-semibold text-gray-900 whitespace-nowrap">{formatDateRange()}</div>
                            <div className="text-xs text-gray-600 whitespace-nowrap">{event.startTime}</div>
                        </div>
                    </div>

                    {/* Цена в правом нижнем углу */}
                    {event.price > 0 && (
                        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-tl-lg shadow-lg flex-shrink-0">
                            <div className="text-sm">
                                <div className="font-semibold text-gray-900 whitespace-nowrap">{event.price.toLocaleString()} ₽</div>
                            </div>
                        </div>
                    )}
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
    );
}
