import React, { useState, useEffect, useMemo } from "react";

export type ImageProps = Pick<
  JSX.IntrinsicElements["img"],
  "src" | "width" | "height" |'alt'
> & {
  disableCache?: boolean;
  imageLoadedCallback?: (params?: Record<any, any>) => void;
  loadingElement?: React.ReactNode;
  blurredProps?: JSX.IntrinsicElements["div"];
  imgProps?: JSX.IntrinsicElements["img"];
  blurSrc?: string;
};

const BLUR_IMG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAA70lEQVR4AQXBTUvCcADA4Z/7z9xcmbEpdSg6CBYGRUcr6WJvUESfqHN07Jt47hBdBV/AFg2FYTGd2DZzmJiz54ndnpUX51cldvcvSWoqufwGcVlgmlX01CpLmsbD4xMiZ2zeS8MQNRgQX1Gweg6/owGvLxUyxjq2+4VtO8haPIGKxKfdxfpzmUgKruMSxX4QiqDfs2i1A+RwMmM+hsr4nbSvcnNaZHnqE8yTNDpvROGU7FYSueX3MUcuqbUExYsd9jICY66yyOrUm22aHY/vmYec304jRIRuaJROjmg8V/G8IXflawoHhxx/1KjVu/wDycJbrJ7yuz0AAAAASUVORK5CYII=";

function ImageComp({
  disableCache = false,
  src,
  width,
  height,
  imageLoadedCallback,
  loadingElement,
  blurredProps,
  imgProps,
  blurSrc = BLUR_IMG,
}: ImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = useMemo(
    () => (disableCache ? `${src}?timestamp=${Date.now()}` : src),
    [src, disableCache]
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageLoadedCallback?.();
      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl, imageLoadedCallback]);

  const imgClassName = imageLoaded
    ? "opacity-100"
    : "opacity-0 transition-opacity duration-300 ease-in-out";

  const renderImg = (
    <img
      {...{
        src: imageUrl,
        loading: "lazy",
        width,
        height,
        ...imgProps,
        className: `${imgClassName} ${imgProps?.className ?? ""}`,
      }}
    />
  );

  if (loadingElement) {
    console.log("custom loading element");
    return <>{imageLoaded ? renderImg : loadingElement}</>;
  }

  const blurredBackgroundStyle = {
    backgroundImage: `url(${blurSrc})`,
  };

  const blurredClassName = `blur-md min-h-[100px] rounded bg-cover bg-no-repeat 
  ${blurredProps?.className ?? ""} `;

  return (
    <div
      {...blurredProps}
      className={imageLoaded ? "" : blurredClassName}
      style={imageLoaded ? {} : blurredBackgroundStyle}
    >
      {renderImg}
    </div>
  );
}

export default ImageComp;
