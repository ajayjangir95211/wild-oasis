import { HiOutlineExclamationCircle, HiOutlineHome } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { PrimaryBtn } from "../components/UI";
import { Logo } from "../components/Logo";

export const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex size-full overflow-auto">
      <div className="m-auto flex flex-col items-center gap-4">
        <Logo />
        <div className="flex items-center gap-2 text-xl text-red-500">
          <HiOutlineExclamationCircle className="size-8 stroke-2" />
          <span>Page Not Found !</span>
        </div>
        <PrimaryBtn onClick={() => navigate("/")}>
          <HiOutlineHome className="size-8" />
          <span>Home</span>
        </PrimaryBtn>
      </div>
    </div>
  );
};
