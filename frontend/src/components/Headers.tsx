import Image from "next/image";
import { EnergyConsup } from "../../public/data";
import { geistMono, radioCanadaBig, sourceSerifPro } from "@/fonts/fonts";
import Button from "@/UI/Button";
import { DesktopHero, EnergyConsupDesktop } from "../../public/imgs/imgs";
import NavbarCopy from "./NavbarCopy";

function Headers() {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="relative">
        {/* Gradient hero section */}
        <section className="h-screen bg-linear-to-b from-[#A8D3FF] to-[#FFF4DF] md:px-[30px] md:py-8 flex flex-col items-center gap-5 text-center">
          <NavbarCopy />

          <div className="flex flex-col items-cente items-start text-center text-[36px] md:text-[64px] lg:text-[80px] leading-[100%]">
            <h1
              className={`${sourceSerifPro.className} tracking-[-4%] text-black`}
            >
              {/* Sustainability writing, */}
              Write. Edit. Read.
            </h1>
            <h1
              className={`${radioCanadaBig.className} tracking-[-2%] md:tracking-[-3%] lg:tracking-[-5%] text-black`}
            >
              {/* built for Everyone */}
              Collaborate. Publish.
            </h1>
          </div>

          <p
            className={`${sourceSerifPro.className} text-[18px] md:text-[20px] tracking-[-3%] md:tracking-[-4%] text-black`}
          >
            Track impact, reduce emissions, and accelerate progress—with clarity
            and confidence.
          </p>

          <div className="flex items-center justify-center gap-11 mt-10">
            <Button content="Start writing" />
            <Button content="Explore the platform" />
          </div>
        </section>

        {/* Image overlapping gradient → white */}
        <div className="relative z-10 -mt-40 flex justify-center">
          <Image src={DesktopHero} alt="" className="select-none" />
        </div>

        {/* White content section (grows naturally) */}
        {/* <section className="bg-white px-6 md:px-[50px] pt-20 pb-20 flex flex-col items-center">
          <h1 className={`${radioCanadaBig.className} header-four mb-10`}>
            Everything you need to measure, model, and act on sustainability
          </h1>

          <div className="grid grid-cols-2">
            <div className="relative">
              <Image
                src={EnergyConsupDesktop}
                alt=""
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="pl-10 h-[502px] overflow-hidden">
              <div className="flex flex-col items-start">
                {EnergyConsup.map((item) => (
                  <div
                    className="flex items-start flex-col w-full py-6 gap-[6px] border-t border-gray-300"
                    key={item.id}
                  >
                    <span className="w-full flex items-center justify-between">
                      <p
                        className={`${radioCanadaBig.className} paragraph-one`}
                      >
                        {item.title}
                      </p>
                      <small
                        className={`${geistMono.className} text-[14px] leading-[100%] text-[#6C6C6C]`}
                      >
                        00{item.id}
                      </small>
                    </span>
                    <p className={`${sourceSerifPro.className} paragraph-two`}>
                      {item.content}
                    </p>
                  </div>
                ))}

                <Button content="Explore features" />
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}

export default Headers;
