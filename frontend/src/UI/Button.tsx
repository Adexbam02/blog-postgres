import { geistMono } from "@/fonts/fonts";

interface ButtonProps {
  content: string;
}

function Button({ content }: ButtonProps) {
  return (
    <div
      className={`${geistMono.className} flex items-center justify-center bg-black text-white p-4 cursor-pointer font-medium`}
    >
      <p>.</p>
      <p className="text-[14px]">{content}</p>
    </div>
  );
}

export default Button;
