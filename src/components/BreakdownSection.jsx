import { features } from "../constants";

const BreakdownSection = () => {
  return (
    <section className="relative mt-40 min-h-[400px]">
      <div className="text-center">
        <span className="text-neutral-700 h-6 text-sm px-2 py-1 text-xl font-bold">
          How it Works
        </span>
        <h2 className="mt-10 text-3xl sm:text-5xl lg:text-6xl font-thin">
          Chat with your
          <span className="bg-gradient-to-r from-purple-500 to-purple-800 text-transparent bg-clip-text font-light">
            {" "}
            lectures
          </span>
        </h2>
      </div>
      <div className="flex flex-wrap mt-10 lg:mt-20">
        {features.map((feature, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
            <div className="flex">
              <div className="flex mx-6 h-10 w-10 p-2 text-purple-500 justify-center items-center">
                {feature.icon}
              </div>
              <div>
                <h5 className="mt-1 mb-6 text-xl">{feature.text}</h5>
                <p className="text-md p-2 mb-20 text-neutral-500">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BreakdownSection
