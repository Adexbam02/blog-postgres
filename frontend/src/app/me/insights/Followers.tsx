import { geistMono, radioCanadaBig } from "@/fonts/fonts";

function Followers() {
  return (
    <div className="bg-white rounded-sm p-2 flex flex-col justify-between h-[150px]">
      <span className="flex flex-col items-start justify-between h-full">
        <h3
          className={`${radioCanadaBig.className} text-[18px] md:text-[20px]`}
        >
          Followers
        </h3>

        <div className="flex justify-between items-start w-full">
          <h1
            className={`${geistMono.className} text-[36px] md:text-[40px] font-medium leaing-0`}
          >
            {/* {user?.follower} */}
          </h1>
          <span className="flex flex-col items-start">
            <small
              className={`${geistMono.className} text-[14px] md:text-[16px] text-green-500`}
            >
              12.45&#9650;
            </small>
            <small
              className={`${geistMono.className} text-[14px] md:text-[16px] text-red-500/10`}
            >
              00.00&#9660;
            </small>
          </span>
        </div>
      </span>
    </div>
  );
}

export default Followers;
