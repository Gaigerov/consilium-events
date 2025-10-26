import {useState} from "react";
import {Button} from "./ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "./ui/dialog";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {LogIn, AlertCircle} from "lucide-react";
import {toast} from "sonner";

interface SimpleLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (userData: any) => void;
}

export default function SimpleLogin({isOpen, onClose, onLogin}: SimpleLoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Проверка учетных данных
        if (username === "user" && password === "user2025") {
            const mockUserData = {
                id: "user_1",
                name: "Пользователь",
                email: "user@example.com",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            };
            onLogin(mockUserData);
            onClose();
            setUsername("");
            setPassword("");
            toast.success("Успешный вход в систему!");
        } else if (username === "admin" && password === "root") {
            const adminUserData = {
                id: "admin_1",
                name: "Администратор",
                email: "gaigerov@gmail.com",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            };
            onLogin(adminUserData);
            onClose();
            setUsername("");
            setPassword("");
            toast.success("Успешный вход в систему как Администратор!");
        } else {
            setError("Неверный логин или пароль");
            toast.error("Неверный логин или пароль");
        }
    };

    const handleClose = () => {
        setUsername("");
        setPassword("");
        setError("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="mx-4">
                <div className="p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-white">
                            <LogIn className="w-5 h-5" />
                            Вход в систему
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Введите логин и пароль для доступа к платформе
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-white">Пользователь</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Введите логин"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400 focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white">Пароль</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="text-white bg-white/10 border-2 border-white/30 placeholder:text-gray-400 focus:border-primary"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/20 text-white rounded-lg text-sm border border-red-400/50">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 border-2 border-primary/50">
                                <LogIn className="w-4 h-4 mr-2" />
                                Войти
                            </Button>
                            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 text-white hover:text-white border-2 border-white/30 bg-white/10 hover:bg-white/20">
                                Отмена
                            </Button>
                        </div>
                    </form>

                    <div className="space-y-2 mt-4">
                        <p className="text-sm text-gray-300 text-center">
                            Войдите для доступа к прямым трансляциям и регистрации на мероприятия
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
