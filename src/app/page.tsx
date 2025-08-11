"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { useEffect, useState } from "react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

type TodoFormProps = {
  todo: Schema["Todo"]["type"];
  handleUpdate: (string: string) => void;
  handleDelete: () => void;
};

const TodoForm = ({ todo, handleUpdate, handleDelete }: TodoFormProps) => {
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    setInput(todo.content || "");
  }, [todo.content]);

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      <div className="flex gap-2">
        <button
          onClick={() => handleUpdate(input)}
          className="border-[1px] border-gray-500 px-3 py-1 rounded hover:bg-gray-100"
        >
          更新
        </button>
        <button
          onClick={handleDelete}
          className="border-[1px] border-gray-500 px-3 py-1 rounded hover:bg-gray-100"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  const [input, setInput] = useState<string>("");

  const handleGetTodos = async () => {
    const { data: todos } = await client.models.Todo.list();
    setTodos(todos);
  };

  const handleCreate = async () => {
    await client.models.Todo.create({
      content: input,
    });
    setInput("");
    await handleGetTodos();
  };

  const handleDelete = async (id: string) => {
    await client.models.Todo.delete({
      id,
    });
    handleGetTodos();
  };

  const handleUpdate = async (id: string, content: string) => {
    await client.models.Todo.update({
      id,
      content,
    });
  };

  useEffect(() => {
    (async () => {
      await handleGetTodos();
    })();
  }, []);

  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">ToDo リスト</h1>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="新しいToDoを入力してください"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button
              onClick={handleCreate}
              className="border-[1px] border-gray-500 px-4 py-2 rounded hover:bg-gray-100"
            >
              追加
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">ToDo 一覧</h2>
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ToDoがありません</p>
          ) : (
            todos.map((todo) => {
              return (
                <div key={todo.id} className="border border-gray-200 rounded p-4">
                  <TodoForm
                    todo={todo}
                    handleUpdate={(content) => handleUpdate(todo.id, content)}
                    handleDelete={() => handleDelete(todo.id)}
                  />
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
