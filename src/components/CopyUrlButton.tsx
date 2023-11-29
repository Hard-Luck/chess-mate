import { Button, buttonVariants } from "./ui/button";

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
      <Button
        className={buttonVariants({ variant: "secondary" })}
        onClick={handleCopy}>
        Copy Game Invite URL
      </Button>
    </div>
  );
}

export default CopyUrlButton;
