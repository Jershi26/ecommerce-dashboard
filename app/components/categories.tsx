"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Category = {
  name: string;
  img: string;
};

const categories: Category[] = [
  { name: "Electronics", img: "/images/electronics.jpg" },
  { name: "Appliances", img: "/images/appliances.jpg" },
  { name: "Beauty", img: "/images/beauty.jpg" },
  { name: "Fashion", img: "/images/fashion.jpg" },
  { name: "Toys", img: "/images/toys.jpg" },
  { name: "Stationery", img: "/images/stationery.jpg" },
  { name: "Kitchen", img: "/images/kitchen.jpg" },
  { name: "Groceries", img: "/images/groceries.jpg" },
  { name: "Books", img: "/images/books.jpg" },
];

export default function Categories() {
  const router = useRouter();

  return (
    <div className="overflow-x-auto scrollbar-hide mb-8">
      <div className="flex gap-10">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() =>
              router.push(`/categories/${cat.name.toLowerCase()}`)
            }
            className="flex-shrink-0 cursor-pointer flex flex-col items-center"
          >
            {/* Circle Card */}
            <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-md hover:shadow-xl transition mb-2">
              <Image
                src={cat.img}
                alt={cat.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
