import {  Button, Input, List } from "antd";
import useTodo from "./useTodo";
import { enterEtvWrapper } from "../../utils/dom";

export default function Todo() {
  const {
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
  } = useTodo();
  return (
    <div className="min-h-[93vh] bg-gray-100 p-6">
      <div className="flex gap-x-2">
        <Input
          showCount
          allowClear
          required
          value={todoTemp}
          placeholder="Enter Task"
          onChange={updateTodoItem}
          onKeyDown={enterEtvWrapper(addOrEditTodo)}
        />
        <Button type="primary" disabled={!todoTemp} onClick={addOrEditTodo}>
          {isEditMode ? "Edit" : "Add"}
        </Button>
        <Button
          danger
          type="primary"
          disabled={isTodoEmpty}
          onClick={removalAll}
        >
          Remove all tasks
        </Button>
      </div>

      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={todo}
        renderItem={(item, key) => (
          <List.Item
            actions={[
              <a key="edit" onClick={beforeEditTodo.bind(null, item.id)}>
                Edit {`${todoEditIndex === key ? "(Selected)" : ""}`}
              </a>,
              <Button type="link" onClick={deleteTodo.bind(null, item.id)} key="more">
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={<a href="https://ant.design">{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
            <div>content</div>
          </List.Item>
        )}
      />
    </div>
  );
}
