import Link from "next/link";

const Datacard = ({
  title,
  data,
  showCta = false,
  cta,
  url = "/dashboard",
}) => {
  return (
    <div className="max-w-md w-full bg-white shadow-xl mb-5 px-4 py-4 rounded-lg">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-sm text-blue-600 mb-2"> {title}</h2>
        <p className="text-3xl font-bold text-blue-600 mb-2"> {data}</p>
        {showCta && (
          <div className="card-actions justify-end w-full">
            <Link
              className="bg-purple-600 border-0 text-white shadow px-4 py-2 rounded font-semibold"
              href={url}
            >
              {cta}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Datacard;
