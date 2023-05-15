import { Button, Input, List, Popconfirm, Space, Typography } from "antd";
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
    resetTodo
  } = useTodo();
  return (
    <div className="min-h-[93vh] bg-gray-100 p-6">
      {isEditMode && (
        <Space align="center">
          <Typography.Title className="!mb-0" level={4}>Edit: {todoTemp}</Typography.Title>
          <Button size="small" onClick={resetTodo}>Clear</Button>
        </Space>
      )}
      <div className="flex gap-x-2 mt-3">
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
        <Popconfirm title="Are you sure to remove all?" onConfirm={removalAll}>
          <Button danger type="primary" disabled={isTodoEmpty}>
            Remove all tasks
          </Button>
        </Popconfirm>
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
              <Popconfirm
              key='delete'
                title="Are you sure to remove?"
                onConfirm={deleteTodo.bind(null, item.id)}
              >
                <Button type="link" >
                  Delete
                </Button>
              </Popconfirm>,
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
