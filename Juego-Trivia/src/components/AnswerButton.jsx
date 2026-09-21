function AnswerButton({
  option,
  onClick,
  disabled,
  selected,
  correct,
  incorrect
}) {
  let className = "answer-button";

  if (selected) {
    className += " selected";
  }

  if (correct) {
    className += " correct";
  }

  if (incorrect) {
    className += " incorrect";
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => onClick(option)}
      disabled={disabled}
    >
      {option}
    </button>
  );
}

export default AnswerButton;