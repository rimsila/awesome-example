import React, { useState, useEffect, useMemo } from "react";

export type ImageProps = Pick<
  JSX.IntrinsicElements["img"],
  "src" | "width" | "height"
> & {
  disableCache?: boolean;
  imageLoadedCallback?: (params?: Record<any, any>) => void;
  loadingElement?: React.ReactNode;
  blurredProps?: JSX.IntrinsicElements["div"];
  imgProps?: JSX.IntrinsicElements["img"];
  /**

@see https://blurha.sh/
*/
  blurImg?: string;
};

function ImageComp({
  disableCache = false,
  src,
  width,
  height,
  imageLoadedCallback,
  loadingElement,
  blurredProps,
  imgProps,
  blurImg = "./blurry.svg",
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
    backgroundImage: `url(${blurImg})`,
  };

  const blurredClassName = `${
    blurredProps?.className ?? ""
  } blur-md min-h-[200px] rounded bg-cover bg-no-repeat`;

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
