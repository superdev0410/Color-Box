import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const saveHistory = async (index: number) => {
  await axios.post("/api/history", { index });
};

export const usePostHistory = () => {
  return useMutation({
    mutationKey: ["usePostHistory"],
    mutationFn: saveHistory,
  });
};
