import { useNavigate } from "react-router-dom";
import { priceFormatter } from "../../../utils/priceFormatter";

export function CabinPreview({ cabin }) {
  const navigate = useNavigate();
  return (
    <article
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/cabin/${cabin.id}`)}
      className="grid grid-cols-6 items-center justify-items-center rounded-md bg-gray-200 p-2 text-sm transition-all hover:scale-105 hover:bg-gray-300 dark:bg-gray-800 hover:dark:bg-gray-700"
    >
      <img
        className="h-8 w-16 object-cover"
        src={`${cabin.image_url}?v=${new Date().getTime()}`}
        alt={cabin.name}
      />

      <p className="col-span-2">{cabin.name}</p>
      <p>{cabin.max_capacity}</p>
      <p className="tracking-wider">{priceFormatter(cabin.price)}</p>
      <p className="tracking-wider">{priceFormatter(cabin.discount || 0)}</p>
    </article>
  );
}
