import React, { useState, useEffect } from 'react';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: any) => void;
}

const initialGameState = {
  title: '',
  genre: '',
  platform: '',
  releaseDate: '',
  developer: '',
  price: 0,
  multiplayer: false,
  metascore: 0,
};

const AddGameModal: React.FC<AddGameModalProps> = ({ isOpen, onClose, onAddGame }) => {
  const [game, setGame] = useState(initialGameState);

  useEffect(() => {
    if (!isOpen) {
      setGame(initialGameState);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    const isChecked = e.target.checked;
    setGame(prevGame => ({
      ...prevGame,
      [name]: isCheckbox ? isChecked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGame({
        ...game,
        price: parseFloat(game.price.toString()),
        metascore: parseInt(game.metascore.toString()),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">Add New Game</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={game.title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={game.genre}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="platform"
            placeholder="Platform"
            value={game.platform}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="date"
            name="releaseDate"
            value={game.releaseDate}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="developer"
            placeholder="Developer"
            value={game.developer}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={game.price}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="number"
            name="metascore"
            placeholder="Metascore"
            value={game.metascore}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="multiplayer"
              checked={game.multiplayer}
              onChange={handleChange}
              className="h-5 w-5 bg-gray-700 rounded text-purple-500 focus:ring-purple-500 border-gray-600"
            />
            <label htmlFor="multiplayer" className="ml-2 text-white">Multiplayer</label>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Game</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGameModal;
