import { useEconomy } from '../context/EconomyContext';

const Profile = () => {
    const { balance } = useEconomy();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Профиль</h1>

            <div className="bg-tg-secondary-bg p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-3xl">
                        👸
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Лиза</h2>
                        <p className="text-tg-hint text-sm">Королева английского</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-tg-secondary-bg p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold">{balance}</p>
                    <p className="text-tg-hint text-sm">LingoCoins 🪙</p>
                </div>
                <div className="bg-tg-secondary-bg p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold">5</p>
                    <p className="text-tg-hint text-sm">Дней подряд 🔥</p>
                </div>
            </div>

            <div className="bg-tg-secondary-bg p-4 rounded-xl">
                <h3 className="font-bold mb-3">Достижения</h3>
                <div className="flex gap-3 flex-wrap">
                    <span className="text-3xl" title="Первая победа">🏆</span>
                    <span className="text-3xl" title="5 дней подряд">🔥</span>
                    <span className="text-3xl" title="100 слов">📚</span>
                    <span className="text-3xl opacity-30" title="Заблокировано">🔒</span>
                    <span className="text-3xl opacity-30" title="Заблокировано">🔒</span>
                </div>
            </div>

            <div className="bg-tg-secondary-bg p-4 rounded-xl">
                <h3 className="font-bold mb-3">Статистика</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-tg-hint">Слов изучено</span>
                        <span className="font-medium">42</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-tg-hint">Точность ответов</span>
                        <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-tg-hint">Боссов повержено</span>
                        <span className="font-medium">3</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
