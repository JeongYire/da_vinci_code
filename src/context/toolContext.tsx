import { createContext } from "react";

const ToolContext = createContext<{
    startGame : Function,

}>({
    startGame : () => {},

});

export default ToolContext;