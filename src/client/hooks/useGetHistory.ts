import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getHistory = async (): Promise<number[]> => {
  const res = await axios.get("/api/history");
  return res.data;
};

export const useGetHistory = () => {
  return useQuery({
    queryKey: ["useGetHistory"],
    queryFn: getHistory,
  });
};
