import React from "react";
import { useRouter } from "next/router";
interface AppItem {
  label: string;
  icon: string;
  path: string;
}

const Home = () => {
  const { push } = useRouter();

  const apps: AppItem[] = [
    {
      label: "Chat Socket",
      icon: "https://via.placeholder.com/50",
      path: "/chat",
    },
    {
      label: "Todo (All State)",
      icon: "https://via.placeholder.com/50",
      path: "/todo",
    },
    {
      label: "More coming soon...",
      icon: "https://via.placeholder.com/50",
      path: "/#",
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 p-4">
        {apps.map((app, key) => (
          <div
            onClick={() => push(`${app.path}/?title=${app.label}`)}
            key={key}
            className="flex cursor-pointer opacity-75 flex-col items-center justify-center p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-150"
          >
            <img className="w-16 h-16 rounded" src={app.icon} alt={app.label} />
            <p className="mt-2 text-xs font-semibold">{app.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
