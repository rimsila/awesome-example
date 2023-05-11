import { useState } from "react";
import { message } from "antd";
import { useCreation, useLocalStorageState, useMemoizedFn } from "ahooks";

type ITodo = {
  id?: string | number;
  title: string;
};
type ITodoList = ITodo[];

export const useTodo = () => {
  const [todo, setTodo] = useLocalStorageState<ITodoList>("todo-state", {
    defaultValue: [],
  });
  const [todoTemp, setTodoTemp] = useState("");
  const [todoEditIndex, setTodoEditIndex] = useState(undefined);
  const isEditMode = useCreation(
    () => typeof todoEditIndex === "number",
    [todoEditIndex]
  );
  const isTodoEmpty = useCreation(() => todo.length === 0, [todo]);

  const resetTodo = useMemoizedFn(() => {
    setTodoTemp("");
    setTodoEditIndex(undefined);
  });

  const removalAll = useMemoizedFn(() => {
    resetTodo();
    setTodo([]);
    message.success("Remove all tasks successfully");
  });

  const updateTodoItem = useMemoizedFn(
    (evt: React.ChangeEvent<{ value: string }>) => {
      setTodoTemp(evt.target.value);
    }
  );

  const addTodo = () => {
    setTodo((prev) => [...prev, { id: prev.length + 1, title: todoTemp }]);
    message.success("Added new task successfully");
    resetTodo();
  };

  const editTodo = () => {
    setTodo((prev) => {
      prev[todoEditIndex].title = todoTemp;
      return prev;
    });
    message.success("Updated task successfully");
    resetTodo();
  };

  // add todo item
  const addOrEditTodo = useMemoizedFn(() => {
    const ifExistItem = todo.some(
      (item) => item.title.toLowerCase() === todoTemp.toLowerCase()
    );
    const checkValidItem = todoTemp && !ifExistItem;
    // add mode
    if (checkValidItem && !todoEditIndex) {
      addTodo();
    }
    // edit mode
    else if (checkValidItem && isEditMode) {
      editTodo();
    }
    // invalid mode
    else {
      message.config({ maxCount: 1 });
      message.error(ifExistItem ? "Task already exists" : "Task is required");
    }
  });

  // handle delete
  const deleteTodo = useMemoizedFn((id: number) => {
    setTodo((prevTodo) => prevTodo.filter((item) => item.id !== id));
    message.success("Deleted task successfully");
    resetTodo();
  });

  const beforeEditTodo = useMemoizedFn((id: number) => {
    const todoInd = todo.findIndex((todoItem) => todoItem.id === id);
    setTodoEditIndex(todoInd);
    setTodoTemp(todo[todoInd].title);
  });

  return {
    todoTemp,
    updateTodoItem,
    addOrEditTodo,
    isEditMode,
    isTodoEmpty,
    removalAll,
    beforeEditTodo,
    todo,
    deleteTodo,
    todoEditIndex,
  };
};
