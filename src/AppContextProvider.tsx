import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AppContextType {
    exampleState: string;
    setExampleState: React.Dispatch<React.SetStateAction<string>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [exampleState, setExampleState] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('allGames');

    return (
        <AppContext.Provider value={{ exampleState, setExampleState, search, setSearch, page, setPage, pageSize, setPageSize, isModalOpen, setIsModalOpen, activeTab, setActiveTab }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
