import React, { createContext, useState, useContext, ReactNode } from 'react';

type ServerResponse = any;

type ResponseContextType = {
    response: ServerResponse | null;
    setResponse: (response: ServerResponse) => void;
};

const ResponseContext = createContext<ResponseContextType | undefined>(undefined);
export function ResponseProvider({ children }: { children: ReactNode }) {
    const [response, setResponse] = useState<ServerResponse | null>(null);
  
    return (
      <ResponseContext.Provider value={{ response, setResponse }}>
        {children}
      </ResponseContext.Provider>
    );
  }

export function useResponseContext() {
    const context = useContext(ResponseContext);
    if (context === undefined) {
        throw new Error('useResponseContext must be used within a ResponseProvider');
    }
    return context;
}


