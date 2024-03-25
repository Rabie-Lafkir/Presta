import Link from "next/link";

const Datacard = ({
  title,
  data,
  showCta = false,
  cta,
  url = "/dashboard",
}) => {
  return (
    // <div className="max-w-md w-full bg-white shadow-xl mb-5 px-4 py-4 rounded-lg">
    //   <div className="flex flex-col items-center text-center">
    //     <h2 className="text-sm text-blue-600 mb-2"> {title}</h2>
    //     <p className="text-3xl font-bold text-blue-600 mb-2"> {data}</p>
    //     {showCta && (
    //       <div className="card-actions justify-end w-full">
    //         <Link
    //           className="bg-purple-600 border-0 text-white shadow px-4 py-2 rounded font-semibold"
    //           href={url}
    //         >
    //           {cta}
    //         </Link>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div className="shadow-md flex flex-col bg-white  mb-5 px-4 py-4 h-[9.1rem] w-full">
      <div className="text-blue-600 text-4xl font-bold self-start">{data}</div>
      <div className="h-[1px] w-full bg-blue-200 text-center my-3"></div>
      <p className="text-xs text-slate-400 mb-2 uppercase"> {title}</p>

      {showCta && (
        <div className="card-actions w-full">
          <Link
            className="text-blue-600 text-base font-semibold"
            href={url}
          >
            {cta} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};

export default Datacard;
