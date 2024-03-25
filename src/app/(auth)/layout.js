import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="w-full min-h-screen h-full flex flex-col items-center justify-center bg-blue-900">
      <Image
        src="/PrestaLogoWhite.svg"
        width={100}
        height={100}
        alt="Main Presta Freedom Logo - White"
        className="mb-5"
      />
      {children}
    </div>
  );
}
