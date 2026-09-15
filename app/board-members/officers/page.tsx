import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Officers",
  description: "Meet the officers leading India Club at Georgia Tech.",
  alternates: { canonical: "/board-members/officers" },
};

type Officer = {
  name: string;
  position: string;
  thumbnail: string;
  email: string;
  objectPosition?: string;
};

type Branch = {
  name: string;
  officers: Officer[];
};

const boardBranches: Branch[] = [
  {
    name: "Presidents",
    officers: [
      { name: "Anaya Desai", position: "President", thumbnail: "/images/current_exec/anaya.jpg", email: "adesai344@gatech.edu" },
      { name: "Shreya Chakraborty", position: "President", thumbnail: "/images/current_exec/shreya.jpeg", email: "schakraborty96@gatech.edu" },
    ],
  },
  {
    name: "Operations",
    officers: [
      { name: "Nehal Harapanahalli", position: "VP Operations", thumbnail: "/images/current_exec/nehal.JPG", email: "nharapan3@gatech.edu" },
      { name: "Sidhaant Kadam", position: "VP Operations", thumbnail: "/images/current_exec/sid.jpg", email: "skadam43@gatech.edu" },
    ],
  },
  {
    name: "Finance",
    officers: [
      { name: "Aditya Gupta", position: "VP Finance", thumbnail: "/images/current_exec/aditya.jpg", email: "agupta3240@gatech.edu" },
      { name: "Param Desai", position: "VP Finance", thumbnail: "/images/current_exec/param.jpg", email: "pdesai301@gatech.edu" },
    ],
  },
  {
    name: "Logistics",
    officers: [
      { name: "Aditi Rajvanshi", position: "VP Logistics", thumbnail: "/images/current_exec/aditi.jpeg", email: "arajvanshi9@gatech.edu" },
      { name: "Vaikunth Ananthanarayanan", position: "VP Logistics", thumbnail: "/images/current_exec/vaikunth.jpeg", email: "vanantha9@gatech.edu" },
    ],
  },
  {
    name: "IT",
    officers: [
      { name: "Aadi Dash", position: "VP IT", thumbnail: "/images/current_exec/aadi.jpg", email: "aadidash@gatech.edu" },
      { name: "Anuj Naik", position: "VP IT", thumbnail: "/images/current_exec/anuj.jpg", email: "anaik88@gatech.edu" },
      { name: "Aryan Patel", position: "VP IT", thumbnail: "/images/current_exec/aryan.jpg", email: "apatel937@gatech.edu" },
    ],
  },
  {
    name: "Marketing",
    officers: [
      { name: "Abhinav Nimmagadda", position: "VP Marketing", thumbnail: "/images/current_exec/abhi.jpeg", email: "animmagadda7@gatech.edu", objectPosition: "object-center" },
      { name: "Tanushri Kemisetti", position: "VP Marketing", thumbnail: "/images/current_exec/tanushri.png", email: "tkemisetti3@gatech.edu" },
    ],
  },
  {
    name: "Media, Arts, & Design",
    officers: [
      { name: "Megha Yeddula", position: "VP MAD", thumbnail: "/images/current_exec/megha.jpg", email: "myeddula3@gatech.edu" },
      { name: "Prisha Solanki", position: "VP MAD", thumbnail: "/images/current_exec/prisha.jpg", email: "psolanki37@gatech.edu" },
    ],
  },
];

export default function Officers() {
  return (
    <main className="px-6 py-10">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-green-800 mb-10">Officers</h1>

        <div className="space-y-12">
          {boardBranches.map((branch) => (
            <section key={branch.name}>
              <h2 className="text-3xl font-bold text-green-800 mb-6">{branch.name}</h2>
              <div className="flex flex-wrap justify-center gap-8">
                {branch.officers.map((officer) => (
                  <a
                    key={`${branch.name}-${officer.name}`}
                    href={`mailto:${officer.email}`}
                    aria-label={`Email ${officer.name}, ${officer.position}`}
                    className="group block rounded-xl overflow-hidden bg-white shadow-md w-full max-w-[280px] hover:shadow-xl transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
                  >
                    <div
                      className={`relative aspect-[3/4] ${
                        officer.thumbnail.includes("IClogo") ? "bg-[#2D2D2D]" : ""
                      }`}
                    >
                      <Image
                        src={
                          officer.thumbnail.includes("IClogo")
                            ? "/images/IClogowhite.png"
                            : officer.thumbnail
                        }
                        alt={`${officer.name} headshot`}
                        fill
                        className={`${
                          officer.thumbnail.includes("IClogo")
                            ? "object-contain p-4"
                            : `object-cover ${officer.objectPosition ?? "object-top"}`
                        } group-hover:scale-[1.02] transition-transform duration-300`}
                      />
                    </div>
                    <div className="p-4 bg-white group-hover:bg-gradient-to-r group-hover:from-green-700 group-hover:to-orange-500 transition-all duration-300">
                      <h3 className="text-xl font-semibold text-green-800 group-hover:text-white transition-colors duration-300">{officer.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 group-hover:text-white transition-colors duration-300">{officer.position}</p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
