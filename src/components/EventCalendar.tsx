import {useState} from "react";
import {Calendar} from "./ui/calendar";
import {Card, CardContent} from "./ui/card";
import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "./ui/dialog";
import {ImageWithFallback} from "./ImageWithFallback";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {Calendar as CalendarIcon, Clock, MapPin, Users, Play} from "lucide-react";
import UserRegistrationForm from "./UserRegistrationForm";

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

interface EventCalendarProps {
    events: Event[];
    onRegister: (eventId: string) => void;
    onWatchStream: (event: Event) => void;
    registeredEvents: string[];
    isLoggedIn: boolean;
}

export default function EventCalendar({
    events,
    onRegister,
    onWatchStream,
    registeredEvents,
    isLoggedIn
}: EventCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [detailsModal, setDetailsModal] = useState<{
        isOpen: boolean;
        event: Event | null;
    }>({isOpen: false, event: null});
    const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);

    // Проверяем, проходит ли событие в указанную дату
    const isEventOnDate = (event: Event, dateStr: string) => {
        if (!event.endDate || event.endDate === event.date) {
            return event.date === dateStr;
        }

        // Для многодневных событий проверяем, входит ли дата в диапазон
        return dateStr >= event.date && dateStr <= event.endDate;
    };

    // Получаем события для выбранной даты
    const getEventsForDate = (date: Date) => {
        // Используем toLocaleDateString для корректного сравнения дат без проблем с часовыми поясами
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        return events.filter(event => isEventOnDate(event, dateStr));
    };

    // Получаем все даты, на которые есть события (включая диапазоны)
    const getEventDates = () => {
        const allDates: Date[] = [];

        events.forEach(event => {
            const [startYear, startMonth, startDay] = event.date.split('-').map(Number);
            const startDate = new Date(startYear, startMonth - 1, startDay);

            if (!event.endDate || event.endDate === event.date) {
                allDates.push(startDate);
            } else {
                // Для многодневных событий добавляем все даты в диапазоне
                const [endYear, endMonth, endDay] = event.endDate.split('-').map(Number);
                const endDate = new Date(endYear, endMonth - 1, endDay);

                const currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    allDates.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });

        return allDates;
    };

    const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
    const eventDates = getEventDates();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateRange = (event: Event) => {
        if (!event.endDate || event.endDate === event.date) {
            const [year, month, day] = event.date.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return formatDate(date);
        }

        const [startYear, startMonth, startDay] = event.date.split('-').map(Number);
        const [endYear, endMonth, endDay] = event.endDate.split('-').map(Number);
        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);

        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const isEventLiveNow = (event: Event) => {
        const now = new Date();
        const eventStart = new Date(`${event.date}T${event.startTime}`);
        const eventEnd = new Date(`${event.date}T${event.endTime}`);
        return now >= eventStart && now <= eventEnd;
    };

    // // Функция для определения, есть ли события на конкретную дату
    // const hasEventsOnDate = (date: Date) => {
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const dateStr = `${year}-${month}-${day}`;

    //     return events.some(event => isEventOnDate(event, dateStr));
    // };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="space-y-4 py-6">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-8 h-8" style={{color: '#34c759'}} />
                    <h1 className="text-4xl font-bold text-white">Календарь Мероприятий</h1>
                </div>
                <p className="text-xl text-white/70">
                    Выберите дату, чтобы посмотреть запланированные мероприятия и выставки
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Календарь */}
                <div className="lg:col-span-1">
                    <div
                        className="p-[5px] rounded-2xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'
                        }}
                    >
                        <div className="bg-white rounded-xl p-3">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md"
                                modifiers={{
                                    hasEvents: eventDates
                                }}
                                modifiersStyles={{
                                    hasEvents: {
                                        backgroundColor: '#3b82f6',
                                        color: '#ffffff',
                                        fontWeight: 'bold'
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* События выбранной даты */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                {selectedDate ? formatDate(selectedDate) : 'Выберите дату'}
                            </h2>
                            {selectedDateEvents.length > 0 ? (
                                <p className="text-white/60">
                                    Найдено {selectedDateEvents.length} мероприятий
                                </p>
                            ) : selectedDate ? (
                                <p className="text-white/60">
                                    На эту дату мероприятий не запланировано
                                </p>
                            ) : null}
                        </div>

                        {selectedDateEvents.length === 0 ? (
                            <div
                                className="p-[5px] rounded-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'
                                }}
                            >
                                <Card className="border-0">
                                    <CardContent className="flex flex-col items-center justify-center py-12">
                                        <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground text-center">
                                            {!selectedDate
                                                ? "Выберите дату в календаре, чтобы посмотреть мероприятия"
                                                : "На выбранную дату мероприятий нет"}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedDateEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-[5px] rounded-2xl"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.5), rgba(66, 200, 187, 0.5), rgba(13, 81, 136, 0.5))'
                                        }}
                                    >
                                        <Card className="overflow-hidden border-0">
                                            <div className="flex flex-col md:flex-row">
                                                <div
                                                    className="md:w-48 h-32 md:h-auto relative flex-shrink-0 cursor-pointer"
                                                    onClick={() => setDetailsModal({isOpen: true, event})}
                                                >
                                                    <ImageWithFallback
                                                        src={event.image}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                        {event.isLive && isEventLiveNow(event) && (
                                                            <Badge variant="destructive" className="animate-pulse text-xs">
                                                                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                                                                LIVE
                                                            </Badge>
                                                        )}
                                                        {event.endDate && event.endDate !== event.date && (
                                                            <Badge variant="secondary" className="text-xs bg-blue-500 text-white">
                                                                <CalendarIcon className="w-3 h-3 mr-1" />
                                                                Многодневное
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1 p-4">
                                                    <div className="flex flex-col h-full">
                                                        <div
                                                            className="flex-1 cursor-pointer"
                                                            onClick={() => setDetailsModal({isOpen: true, event})}
                                                        >
                                                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                                                {event.title}
                                                            </h3>
                                                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                                {event.description}
                                                            </p>

                                                            <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{event.startTime} - {event.endTime}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="w-4 h-4" />
                                                                    <span>{event.location}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="w-4 h-4" />
                                                                    <span>{event.registeredCount} / {event.maxCapacity} участников</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                                                            {event.youtubeVideoId && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onWatchStream(event);
                                                                    }}
                                                                    className="w-full sm:w-auto text-gray-900 hover:text-gray-900"
                                                                >
                                                                    <Play className="w-4 h-4 mr-2" />
                                                                    {event.isLive && isEventLiveNow(event) ? "Смотреть" : "Запись"}
                                                                </Button>
                                                            )}

                                                            <Button
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onRegister(event.id);
                                                                }}
                                                                disabled={!isLoggedIn || registeredEvents.includes(event.id) || event.registeredCount >= event.maxCapacity}
                                                                variant={registeredEvents.includes(event.id) ? "secondary" : "default"}
                                                                className="w-full sm:w-auto"
                                                            >
                                                                {!isLoggedIn ? "Войти"
                                                                    : registeredEvents.includes(event.id) ? "Зарегистрированы"
                                                                        : event.registeredCount >= event.maxCapacity ? "Мест нет"
                                                                            : event.price === 0 ? "Бесплатно"
                                                                                : `${event.price.toLocaleString()} ₽`}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Модальное окно с подробностями события */}
            <Dialog open={detailsModal.isOpen} onOpenChange={(open) => !open && setDetailsModal({isOpen: false, event: null})}>
                <DialogContent className="sm:max-w-2xl">
                    {detailsModal.event && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 pr-6 text-white">
                                    {detailsModal.event.title}
                                    {detailsModal.event.isLive && isEventLiveNow(detailsModal.event) && (
                                        <Badge variant="destructive" className="animate-pulse">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
                                            LIVE
                                        </Badge>
                                    )}
                                </DialogTitle>
                                <DialogDescription className="text-gray-300">
                                    Подробная информация о мероприятии
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Изображение события */}
                                <div className="aspect-video w-full rounded-lg overflow-hidden">
                                    <ImageWithFallback
                                        src={detailsModal.event.image}
                                        alt={detailsModal.event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Описание */}
                                <div>
                                    <h3 className="text-white mb-2">Описание</h3>
                                    <p className="text-gray-300">{detailsModal.event.description}</p>
                                </div>

                                {/* Спикеры */}
                                {detailsModal.event.speakers && detailsModal.event.speakers.length > 0 && (
                                    <div>
                                        <h3 className="text-white mb-3">Спикеры</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {detailsModal.event.speakers.map((speaker) => (
                                                <div key={speaker.id} className="flex sm:flex-col flex-row sm:items-center items-start gap-2 sm:text-center text-left">
                                                    <Avatar className="w-full sm:w-16 h-auto sm:h-16 aspect-square">
                                                        <AvatarImage src={speaker.avatar} alt={speaker.name} />
                                                        <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-white text-sm">{speaker.name}</p>
                                                        <p className="text-gray-400 text-xs">{speaker.title}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Детальная информация */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-300">
                                                {formatDateRange(detailsModal.event)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-300">{detailsModal.event.startTime} - {detailsModal.event.endTime}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-300">{detailsModal.event.location}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-300">
                                                {detailsModal.event.registeredCount} / {detailsModal.event.maxCapacity} участников
                                            </span>
                                        </div>

                                        <div className="text-sm">
                                            <span className="text-gray-400">Стоимость: </span>
                                            <span className="text-white">
                                                {detailsModal.event.price === 0 ? 'Бесплатно' : `${detailsModal.event.price.toLocaleString()} ₽`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Кнопки действий */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    {detailsModal.event.youtubeVideoId && (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                onWatchStream(detailsModal.event!);
                                                setDetailsModal({isOpen: false, event: null});
                                            }}
                                            className="flex-1 text-white hover:text-white border-2 border-white/30 bg-white/10 hover:bg-white/20"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            {detailsModal.event.isLive && isEventLiveNow(detailsModal.event) ? "Смотреть трансляцию" : "Смотреть запись"}
                                        </Button>
                                    )}

                                    {/* Показываем кнопку только если пользователь не зарегистрирован на мероприятие */}
                                    {!registeredEvents.includes(detailsModal.event.id) && (
                                        <Button
                                            onClick={() => {
                                                if (!isLoggedIn) {
                                                    setIsRegistrationFormOpen(true);
                                                    setDetailsModal({isOpen: false, event: null});
                                                } else {
                                                    onRegister(detailsModal.event!.id);
                                                    setDetailsModal({isOpen: false, event: null});
                                                }
                                            }}
                                            disabled={isLoggedIn && detailsModal.event.registeredCount >= detailsModal.event.maxCapacity}
                                            className="flex-1 border-2 border-primary/50"
                                        >
                                            {!isLoggedIn ? "Зарегистрироваться"
                                                : detailsModal.event.registeredCount >= detailsModal.event.maxCapacity ? "Мест нет"
                                                    : detailsModal.event.price === 0 ? "Зарегистрироваться бесплатно"
                                                        : `Зарегистрироваться за ${detailsModal.event.price.toLocaleString()} ₽`}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Форма регистрации пользователя */}
            <UserRegistrationForm
                isOpen={isRegistrationFormOpen}
                onClose={() => setIsRegistrationFormOpen(false)}
            />
        </div>
    );
}
