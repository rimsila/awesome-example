export const enterEtvWrapper =
  (fn: () => void) => (evt: React.KeyboardEvent<HTMLInputElement>) => {
    const isEnterPressed = evt.key === "Enter";
//     console.log("isEnterPressed", isEnterPressed);
    isEnterPressed && fn?.();
  };
