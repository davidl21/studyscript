import { useState, useEffect } from 'react';

const HeroSection = () => {
    const [currentWord, setCurrentWord] = useState('faster');
    const [wordsInRotation, setWordsInRotation] = useState(['faster', 'smarter', 'easier']);
    const [currentEmoji, setCurrentEmoji] = useState('⚡');
    const [emojisInRotation, setEmojisInRotation] = useState(['⚡', '🧠', '💪'])

    useEffect(() => {
        const interval = setInterval(() => {
            const currentIndex = wordsInRotation.indexOf(currentWord);
            const nextIndex = (currentIndex + 1) % wordsInRotation.length;
            setCurrentWord(wordsInRotation[nextIndex]);

            const currentEmojiIndex = wordsInRotation.indexOf(currentEmoji);
            const nextEmojiIndex = (currentEmojiIndex + 1) % emojisInRotation.length;
            setCurrentEmoji(emojisInRotation[nextEmojiIndex])
        }, 2000);

        return () => clearInterval(interval);
    }, [currentWord, wordsInRotation, currentEmoji, emojisInRotation]);

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center font-thin">
        Are you ready to learn
        
        <span className="block mt-3 bg-gradient-to-r from-purple-300 to-purple-800 text-transparent bg-clip-text font-medium">
          {currentWord}
        </span>
        <span className="block mt-3">
          {currentEmoji}
        </span>
      </h1>
      <p className="mt-10 text-center text-neutral-500 max-w-4xl font-light">
        Unlock your personal 24/7 tutor to help you power through your online video lectures. Ask questions, have conversations, and understand any material better than before.
      </p>
      <div className="flex justify-center my-10">
        <a href="#" className="py-3 px-4 mx-3 border rounded-md hover:bg-purple-800 hover:text-white transition-colors duration-300">
            Try StudyScript
        </a>
      </div>
    </div>
  )
}

export default HeroSection
