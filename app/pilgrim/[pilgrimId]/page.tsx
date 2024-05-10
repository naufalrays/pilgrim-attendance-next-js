"use client";
import { jamaahService } from "@/app/(default)/user/jamaah/api/api";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    pilgrimId: string;
  };
};

interface Pilgrim {
  id?: number;
  portion_number: string;
  name: string;
  gender: string;
  birth_date: Date;
  phone_number: string;
  group: string;
  cloter: string;
  passport_number: string;
}

const PilgrimPreview = async (props: Props) => {
  const { data } = useSession();
  const [token, setToken] = useState("");

  const [pilgrim, setPilgrimData] = useState<Pilgrim>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (data && data.accessToken) {
          // Fetch trip data
          const jamaah: Pilgrim = await jamaahService.fetchJamaahById(
            props.params.pilgrimId,
            data?.accessToken
          );
          setToken(data?.accessToken);
          setPilgrimData(jamaah);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data?.accessToken]); // Empty dependency array to run effect only once after initial render

  return (
    <div>
      <div className="absolute inset-0">
        <img
          src="/assets/images/auth/bg-gradient.png"
          alt="image"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
        <img
          src="/assets/images/auth/coming-soon-object1.png"
          alt="image"
          className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
        />
        <img
          src="/assets/images/auth/coming-soon-object2.png"
          alt="image"
          className="absolute left-24 top-0 h-40 md:left-[30%]"
        />
        <img
          src="/assets/images/auth/coming-soon-object3.png"
          alt="image"
          className="absolute right-0 top-0 h-[300px]"
        />
        <img
          src="/assets/images/auth/polygon-object.svg"
          alt="image"
          className="absolute bottom-0 end-[28%]"
        />
        <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
          <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-20 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px]">
            <div className="mx-auto my-3 w-full max-w-[440px]">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                  Pilgrim Information
                </h1>
                {pilgrim ? (
                  <div className="mt-8">
                    <p className="text-base font-bold leading-normal text-white-dark mb-2">
                      Name: {pilgrim.name}
                    </p>
                    <p className="text-base font-bold leading-normal text-white-dark mb-2">
                      Portion Number: {pilgrim.portion_number}
                    </p>
                    <p className="text-base font-bold leading-normal text-white-dark mb-2">
                      Gender: {pilgrim.gender == "M" ? "Male" : "Female"}
                    </p>
                    <p className="text-base font-bold leading-normal text-white-dark mb-2">
                      Birth Date:{" "}
                      {new Date(pilgrim.birth_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-base font-bold leading-normal text-white-dark mb-2">
                      Phone Number: {pilgrim.phone_number}
                    </p>
                    <p className="text-base font-bold leading-normal text-white-dark mb-2">
                      Group: {pilgrim.group}
                    </p>
                    <p className="text-base font-bold leading-normal text-white-dark mb-2">
                      Cloter: {pilgrim.cloter}
                    </p>
                    <p className="text-base font-bold leading-normal text-white-dark mb-2">
                      Passport Number: {pilgrim.passport_number}
                    </p>
                  </div>
                ) : (
                  <p className="text-base font-bold leading-normal text-white-dark mb-2">
                    No Pilgrim
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilgrimPreview;
