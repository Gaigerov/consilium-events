import {useState, useEffect} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "./ui/dialog";
import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {Users, Clock, Eye, Globe, AlertCircle, Lock} from "lucide-react";
import {toast} from "sonner";

interface ViewerStats {
    totalViews: number;
    currentViewers: number;
    countries: {country: string; viewers: number; flag: string}[];
    peakViewers: number;
    averageWatchTime: string;
}

export interface YouTubeModalEvent {
    id: string;
    title: string;
    youtubeVideoId?: string;
    isLive: boolean;
}

interface YouTubeModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: YouTubeModalEvent | null;
    isLoggedIn: boolean;
    onLogin: () => void;
}

export default function YouTubeModal({isOpen, onClose, event, isLoggedIn, onLogin}: YouTubeModalProps) {
    const [stats, setStats] = useState<ViewerStats | null>(null);
    const [watchStartTime, setWatchStartTime] = useState<Date | null>(null);

    // Мок-данные статистики
    const mockStats: ViewerStats = {
        totalViews: 15847,
        currentViewers: 342,
        peakViewers: 1205,
        averageWatchTime: "24 мин",
        countries: [
            {country: "Россия", viewers: 203, flag: "🇷🇺"},
            {country: "Беларусь", viewers: 45, flag: "🇧🇾"},
            {country: "Казахстан", viewers: 38, flag: "🇰🇿"},
            {country: "Украина", viewers: 32, flag: "🇺🇦"},
            {country: "Другие", viewers: 24, flag: "🌍"}
        ]
    };

    useEffect(() => {
        if (isOpen && event) {
            // Начинаем отслеживание просмотра
            setWatchStartTime(new Date());
            setStats(mockStats);

            // Симуляция обновления статистики для live
            if (event.isLive) {
                const interval = setInterval(() => {
                    setStats(prev => prev ? {
                        ...prev,
                        currentViewers: prev.currentViewers + Math.floor(Math.random() * 10) - 5,
                        totalViews: prev.totalViews + Math.floor(Math.random() * 3)
                    } : null);
                }, 5000);

                return () => clearInterval(interval);
            }
        }

        return () => {
            // Завершаем отслеживание просмотра
            if (watchStartTime) {
                const watchDuration = Date.now() - watchStartTime.getTime();
                console.log(`Время просмотра: ${Math.floor(watchDuration / 1000)} секунд`);
            }
        };
    }, [isOpen, event]);

    if (!event) return null;

    // Проверка доступа к LIVE трансляции
    if (event.isLive && !isLoggedIn) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-[95vw] sm:max-w-md bg-white rounded-xl">
                    <DialogHeader className="pr-8">
                        <DialogTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-destructive" />
                            Доступ ограничен
                        </DialogTitle>
                        <DialogDescription>
                            Для просмотра прямых трансляций необходимо войти в аккаунт
                        </DialogDescription>
                    </DialogHeader>

                    <div className="text-center space-y-4 py-6">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-destructive" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium">Требуется авторизация</h3>
                            <p className="text-muted-foreground text-sm">
                                Прямые трансляции доступны только зарегистрированным пользователям.
                                Войдите в свой аккаунт, чтобы смотреть трансляцию.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={onLogin} className="flex-1">
                                Войти в аккаунт
                            </Button>
                            <Button onClick={onClose} variant="outline" className="flex-1">
                                Закрыть
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const embedUrl = `https://www.youtube.com/embed/${event.youtubeVideoId}${event.isLive ? '?autoplay=1' : ''}`;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-6xl w-full bg-white rounded-xl my-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                {/* Header вынесен наверх, за пределы grid */}
                <DialogHeader className="mb-4 pr-8">
                    <DialogTitle className="flex items-center gap-2 flex-wrap">
                        {event.title}
                        {event.isLive && (
                            <Badge variant="destructive" className="animate-pulse">
                                <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                                LIVE
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {event.isLive ? "Прямая трансляция мероприятия с интерактивной статистикой" : "Запись мероприятия"}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Video Player */}
                    <div className="lg:col-span-3">

                        <div className="aspect-video w-full mb-4">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full rounded-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={event.title}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {event.isLive ? "Трансляция идет в прямом эфире" : "Запись мероприятия"}
                                </span>
                                <span className="sm:hidden">
                                    {event.isLive ? "Прямой эфир" : "Запись"}
                                </span>
                            </div>

                            <Button onClick={onClose} variant="outline" size="sm">
                                Закрыть
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Sidebar */}
                    {stats && (
                        <div className="lg:col-span-1 space-y-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Eye className="w-5 h-5" />
                                        Статистика
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">
                                                {stats.totalViews.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Всего просмотров
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-destructive">
                                                {stats.currentViewers}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Сейчас смотрят
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Пик зрителей:</span>
                                            <span className="font-medium">{stats.peakViewers.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Ср. время:</span>
                                            <span className="font-medium">{stats.averageWatchTime}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Globe className="w-5 h-5" />
                                        География
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {stats.countries.map((country, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{country.flag}</span>
                                                    <span className="text-sm">{country.country}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 bg-muted rounded-full h-2">
                                                        <div
                                                            className="bg-primary h-2 rounded-full"
                                                            style={{
                                                                width: `${(country.viewers / stats.currentViewers) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground w-8 text-right">
                                                        {country.viewers}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {event.isLive && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="text-center space-y-2">
                                            <div className="w-3 h-3 bg-destructive rounded-full mx-auto animate-pulse"></div>
                                            <p className="text-sm text-muted-foreground">
                                                Статистика обновляется в реальном времени
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
