import { useQuery } from "@tanstack/react-query";

export const useCards = () => {
  const {
    data: cards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cards"],
  });

  return { cards, isLoading, error };
};
