import {Dialog, DialogContent} from "./ui/dialog";
import {Button} from "./ui/button";
import {LogIn} from "lucide-react";

export interface VideoModalEvent {
    id: string;
    title: string;
    youtubeVideoId?: string;
    rutubeVideoId?: string;
    videoPlatform?: "youtube" | "rutube";
    isLive: boolean;
}

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: VideoModalEvent | null;
    isLoggedIn: boolean;
    onLogin: () => void;
}

export default function VideoModal({
    isOpen,
    onClose,
    event,
    isLoggedIn,
    onLogin
}: VideoModalProps) {
    if (!event) return null;

    const getVideoSrc = () => {
        if (event.videoPlatform === 'rutube' && event.rutubeVideoId) {
            return `https://rutube.ru/play/embed/${event.rutubeVideoId}`;
        }
        if (event.videoPlatform === 'youtube' && event.youtubeVideoId) {
            return `https://www.youtube.com/embed/${event.youtubeVideoId}?autoplay=1`;
        }
        return null;
    };

    const videoSrc = getVideoSrc();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-white rounded-xl">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold pr-8">{event.title}</h2>

                    {!isLoggedIn ? (
                        <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="text-center space-y-4">
                                <p className="text-lg text-muted-foreground">
                                    Для просмотра видео необходимо войти в аккаунт
                                </p>
                                <Button onClick={onLogin} className="cursor-pointer">
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Войти
                                </Button>
                            </div>
                        </div>
                    ) : videoSrc ? (
                        <div className="aspect-video">
                            <iframe
                                src={videoSrc}
                                className="w-full h-full rounded-lg"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                title={event.title}
                            />
                        </div>
                    ) : (
                        <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                            <p className="text-muted-foreground">Видео недоступно</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
