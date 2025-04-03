import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Play, Settings, X, MessageSquare } from 'lucide-react';
import { Button } from './button';
import { LoadingIndicator } from './loading-indicator';
import { Card } from './card';
import { Drawer } from './drawer';

export default function PS5Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">PS5 Mode</h1>
      {/* Add your PS5 interface components here */}
    </div>
  );
}

interface Game {
  id: number;
  title: string;
  cover: string;
  description: string;
}

export function PS5Home() {
  const [selectedGame, setSelectedGame] = useState(0);
  const [showFriends, setShowFriends] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDiscord, setShowDiscord] = useState(false);

  const games = React.useMemo(() => [
    { id: 1, title: "Game 1", cover: "/game1.jpg", description: "Experience the adventure" },
    { id: 2, title: "Game 2", cover: "/game2.jpg", description: "Join the battle" },
    { id: 3, title: "Game 3", cover: "/game3.jpg", description: "Explore new worlds" }
  ], []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'ArrowLeft') {
        setSelectedGame(prev => (prev > 0 ? prev - 1 : games.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedGame(prev => (prev < games.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl mb-8 font-light">PlayStation Network</h1>
          <Button 
            onClick={() => setIsLoggedIn(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full transform hover:scale-105 transition-all"
          >
            Sign In with PSN
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white p-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-8"
      >
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10 rounded-full px-6"
          onClick={() => setShowFriends(true)}
        >
          <Users className="w-6 h-6 mr-2" />
          Friends
        </Button>

        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10 rounded-full"
          onClick={() => setShowDiscord(true)}
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </motion.div>

      <div className="relative h-[70vh] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {games.map((game, index) => (
            index === selectedGame && (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: 100, rotateY: 45 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -100, rotateY: -45 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute"
              >
                <Card className="w-[500px] h-[300px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden transform perspective-1000">
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 p-6">
                      <h2 className="text-3xl font-bold mb-2">{game.title}</h2>
                      <p className="text-gray-300">{game.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      <Drawer open={showFriends} onOpenChange={setShowFriends}>
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="bg-black/90 backdrop-blur-lg p-6 rounded-t-3xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Friends</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowFriends(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-gray-700 rounded-full" />
                <div>
                  <p className="font-medium">Friend {i + 1}</p>
                  <p className="text-sm text-gray-400">Online</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Drawer>

      <Drawer open={showDiscord} onOpenChange={setShowDiscord}>
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          className="bg-[#5865F2] p-6 rounded-t-3xl"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Connect with Discord</h2>
            <p className="mb-6">Chat with friends while you play</p>
            <Button 
              className="bg-white text-[#5865F2] hover:bg-gray-100"
              onClick={() => setShowDiscord(false)}
            >
              Login with Discord
            </Button>
          </div>
        </motion.div>
      </Drawer>
    </div>
  );
}