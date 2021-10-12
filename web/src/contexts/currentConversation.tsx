import * as React from 'react';

const CurrentConversationContext = React.createContext<
  | {
      conversationId: string | undefined;
      setConversationId: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined
>({ conversationId: undefined, setConversationId: () => undefined });

export const useCurrentConversationContext = () =>
  React.useContext(CurrentConversationContext);

export const CurrentConversationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [conversationId, setConversationId] = React.useState<string>();
  return (
    <CurrentConversationContext.Provider
      value={{ conversationId, setConversationId }}
    >
      {children}
    </CurrentConversationContext.Provider>
  );
};
