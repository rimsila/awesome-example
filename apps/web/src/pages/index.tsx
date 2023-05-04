import React, { useEffect } from "react";
import { useRouter } from "next/router";
interface AppItem {
  label: string;
  icon: string;
  path: string;
}

const Home = (props) => {
  const { push } = useRouter();

  const apps: AppItem[] = [
    {
      label: "Chat Socket",
      icon: "https://via.placeholder.com/50",
      path: "/chat?title=Chat Socket",
    },
    {
      label: "Todo List (Soon)",
      icon: "https://via.placeholder.com/50",
      path: "/404",
    },
    {
      label: "Redux (Soon)",
      icon: "https://via.placeholder.com/50",
      path: "/404",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 p-4">
        {apps.map((app, key) => (
          <div
            onClick={() => push(app.path)}
            key={key}
            className="flex cursor-pointer opacity-75 flex-col items-center justify-center p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-150"
          >
            <img className="w-16 h-16 rounded" src={app.icon} alt={app.label} />
            <p className="mt-2 text-sm font-semibold">{app.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
