import useSysStore from "../store/sys";

const useKeyWords = (key: string) => {
  const sysStore = useSysStore();

  if (sysStore.platform === "macos") {
    key = key
      .replace("alt", "option")
      .replace("ctrl", "control")
      .replace("win", "command")
      .replace("shift", "shift")
  }

  return key;
};

export default useKeyWords;
