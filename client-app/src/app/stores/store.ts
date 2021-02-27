import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
  activityStore: ActivityStore
}

export const store: Store = {
  activityStore: new ActivityStore()
}

// Add the stores to our react context.
export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
