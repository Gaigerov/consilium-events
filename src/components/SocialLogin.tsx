import {Button} from "./ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "./ui/dialog";
import {Github, Chrome} from "lucide-react";

interface SocialLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (provider: string, userData: any) => void;
}

export default function SocialLogin({isOpen, onClose, onLogin}: SocialLoginProps) {
    const handleGoogleLogin = () => {
        // Симуляция входа через Google (администратор)
        const mockUserData = {
            id: "google_admin",
            name: "Администратор",
            email: "gaigerov@gmail.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        };
        onLogin("google", mockUserData);
        onClose();
    };

    const handleGithubLogin = () => {
        // Симуляция входа через GitHub
        const mockUserData = {
            id: "github_456",
            name: "Maria Smith",
            email: "maria@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        };
        onLogin("github", mockUserData);
        onClose();
    };

    const handleYandexLogin = () => {
        // Симуляция входа через Яндекс
        const mockUserData = {
            id: "yandex_789",
            name: "Алексей Смирнов",
            email: "aleksey@yandex.ru",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        };
        onLogin("yandex", mockUserData);
        onClose();
    };

    const handleVkLogin = () => {
        // Симуляция входа через VK
        const mockUserData = {
            id: "vk_101",
            name: "Анна Кузнецова",
            email: "anna@vk.com",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        };
        onLogin("vk", mockUserData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md max-w-[95vw] bg-white rounded-xl">
                <DialogHeader>
                    <DialogTitle>Войдите в аккаунт</DialogTitle>
                    <DialogDescription>
                        Выберите удобный способ входа для регистрации на мероприятия
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-4">
                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full justify-start h-12"
                    >
                        <Chrome className="w-5 h-5 mr-3" />
                        <span>Продолжить с Google</span>
                    </Button>

                    <Button
                        onClick={handleGithubLogin}
                        variant="outline"
                        className="w-full justify-start h-12"
                    >
                        <Github className="w-5 h-5 mr-3" />
                        <span>Продолжить с GitHub</span>
                    </Button>

                    <Button
                        onClick={handleYandexLogin}
                        variant="outline"
                        className="w-full justify-start h-12"
                    >
                        <div className="w-5 h-5 mr-3 rounded bg-red-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">Я</span>
                        </div>
                        <span>Продолжить с Яндекс</span>
                    </Button>

                    <Button
                        onClick={handleVkLogin}
                        variant="outline"
                        className="w-full justify-start h-12"
                    >
                        <div className="w-5 h-5 mr-3 rounded bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">VK</span>
                        </div>
                        <span>Продолжить с ВКонтакте</span>
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center px-2">
                    Входя в систему, вы соглашаетесь с нашими условиями использования
                </p>
            </DialogContent>
        </Dialog>
    );
}
