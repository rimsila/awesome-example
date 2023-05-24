
import dynamic from "next/dynamic";
const ImageCop = dynamic(() => import("./image"), { ssr: false });

export default function Components() {
  const imgUrl =
    "https://images.unsplash.com/photo-1614849427248-287c4e88ef58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&q=80";
  return (
    <div className="min-h-[93vh] bg-gray-100 p-6">
      <div className="flex flex-col gap-y-4">
        <div>
          <h3>Components Image</h3>
          <ImageCop src={imgUrl} width="100%" />
        </div>
        <div>
          <h3>Normal Image</h3>
          <img src={imgUrl} width="100%" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
