import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "./ui/dialog";
import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {AlertCircle, Lock} from "lucide-react";
import RegistrationForm from "./RegistrationForm";

interface YouTubeModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        id?: string;
        title: string;
        youtubeVideoId?: string;
        videoPlatform?: "YouTube" | "Rutube" | "VK";
        isLive: boolean;
        viewerCount?: number;
        date?: string;
        endDate?: string;
        startTime?: string;
        endTime?: string;
    } | null;
    isLoggedIn: boolean;
    onLogin: () => void;
}

export default function YouTubeModal({isOpen, onClose, event, isLoggedIn, onLogin}: YouTubeModalProps) {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

    if (!event) return null;

    // Функция проверки, началось ли мероприятие
    // const isEventStarted = () => {
    //     if (!event.date || !event.startTime) return false;

    //     const now = new Date();
    //     const [year, month, day] = event.date.split('-').map(Number);
    //     const [hours, minutes] = event.startTime.split(':').map(Number);
    //     const eventStart = new Date(year, month - 1, day, hours, minutes);

    //     return now >= eventStart;
    // };

    // Функция проверки, закончилось ли мероприятие
    // const isEventEnded = () => {
    //     if (!event.endTime) return false;

    //     const now = new Date();
    //     // Используем endDate если есть, иначе date
    //     const eventDateStr = event.endDate || event.date || "";
    //     if (!eventDateStr) return false;

    //     const [year, month, day] = eventDateStr.split('-').map(Number);
    //     const [hours, minutes] = event.endTime.split(':').map(Number);
    //     const eventEnd = new Date(year, month - 1, day, hours, minutes);

    //     return now > eventEnd;
    // };

    // const eventHasStarted = isEventStarted();
    // const eventHasEnded = isEventEnded();

    // Проверка доступа к LIVE трансляции
    if (event.isLive && !isLoggedIn) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pr-8">
                        <DialogTitle className="flex items-center gap-2 text-white">
                            <Lock className="w-5 h-5 text-red-400" />
                            Доступ ограничен
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Для просмотра прямых трансляций необходимо войти в аккаунт
                        </DialogDescription>
                    </DialogHeader>

                    <div className="text-center space-y-4 py-6">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-400/50">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-white">Требуется авторизация</h3>
                            <p className="text-gray-300 text-sm">
                                Прямые трансляции доступны только зарегистрированным пользователям.
                                Войдите в свой аккаунт, чтобы смотреть трансляцию.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button onClick={onLogin} className="flex-1 border-2 border-primary/50">
                                Войти в аккаунт
                            </Button>
                            <Button onClick={onClose} variant="outline" className="flex-1 text-white hover:text-white border-2 border-white/30 bg-white/10 hover:bg-white/20">
                                Закрыть
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Функция для получения URL встраивания в зависимости от платформы
    const getEmbedUrl = () => {
        const platform = event.videoPlatform || "YouTube";
        const videoId = event.youtubeVideoId;

        switch (platform) {
            case "YouTube":
                return `https://www.youtube.com/embed/${videoId}${event.isLive ? '?autoplay=1' : ''}`;
            case "Rutube":
                return `https://rutube.ru/play/embed/${videoId}`;
            case "VK":
                // VK формат: https://vk.com/video_ext.php?oid=OWNER_ID&id=VIDEO_ID
                return `https://vk.com/video_ext.php?${videoId}`;
            default:
                return `https://www.youtube.com/embed/${videoId}${event.isLive ? '?autoplay=1' : ''}`;
        }
    };

    const embedUrl = getEmbedUrl();

    // const handleRegisterClick = () => {
    //     setIsRegistrationOpen(true);
    // };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[85vh]">
                    <DialogHeader className="mb-4 pr-8">
                        <DialogTitle className="flex items-center gap-2 flex-wrap text-white pl-5 pt-5">
                            {event.title}
                            {event.isLive && (
                                <Badge variant="destructive" className="animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                                    LIVE
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-gray-300 pl-5">
                            {event.isLive ? "Прямая трансляция мероприятия" : "Запись мероприятия"} • {event.videoPlatform || "YouTube"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Video Player */}
                        <div className="aspect-video w-full">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full rounded-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={event.title}
                            />
                        </div>


                    </div>
                </DialogContent>
            </Dialog>

            {/* Registration Form Modal */}
            {event && (
                <RegistrationForm
                    isOpen={isRegistrationOpen}
                    onClose={() => setIsRegistrationOpen(false)}
                    eventTitle={event.title}
                    eventId={event.id || "unknown"}
                />
            )}
        </>
    );
}
