import React from "react";

type HighlightTextProps = {
  highlight: string;
  text: string;
  highlightStyle?: string;
  wrapper?: React.ElementType;
  caseSensitive?: boolean;
  customDelimiter?: (highlight: string) => RegExp;
};

const HighlightText: React.FC<HighlightTextProps> = ({
  highlight,
  text,
  highlightStyle = "bg-yellow-300 dark:bg-yellow-600",
  wrapper: Wrapper = React.Fragment,
  caseSensitive = false,
  customDelimiter,
}) => {
  if (!highlight.trim()) return <>{text}</>;

  const regex = customDelimiter
    ? customDelimiter(highlight)
    : new RegExp(`(${highlight})`, caseSensitive ? "g" : "gi");

  const parts = text.split(regex);

  return (
    <Wrapper>
      {parts.map((part, index) =>
        caseSensitive ? (
          part === highlight
        ) : part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className={highlightStyle}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </Wrapper>
  );
};

export default HighlightText;
