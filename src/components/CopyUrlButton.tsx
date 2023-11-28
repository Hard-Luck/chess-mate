function CopyUrlButton() {
  const url = window.location.href;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  return (
    <div>
      <button
        className="bg-orange-500 text-center rounded-lg m-2 p-2 "
        onClick={handleCopy}>
        Copy Game Invite URL
      </button>
    </div>
  );
}

export default CopyUrlButton;
