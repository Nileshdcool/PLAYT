// Define the shape of the context state
export interface AppContextType {
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

