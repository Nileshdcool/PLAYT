import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context state
interface AppContextType {
    // Add your state types here
    search: string;
    setSearch: (value: string) => void;
    page: number;
    setPage: (value: number) => void;
    pageSize: number;
    setPageSize: (value: number) => void;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    activeTab: string;
    setActiveTab: (value: string) => void;
    exampleState: string;
    setExampleState: (value: string) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Define your states here
    const [exampleState, setExampleState] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('');

    return (
        <AppContext.Provider value={{ exampleState, setExampleState, search, setSearch, page, setPage, pageSize, setPageSize, isModalOpen, setIsModalOpen, activeTab, setActiveTab }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
