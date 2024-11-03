import Image from "next/image";
import NavBar from "../components/NavBar";
import BoxWatch from "../components/BoxWatch";
import CameraBox from "../components/CameraBox";

export default function Home() {
  return (
    <div className="w-screen h-screen aspect-[1920/1080] flex flex-row bg-[#1d1f32] overflow-hidden">
      <NavBar />
      <div className="w-72 h-full flex flex-col items-center border-r border-white">
        <div className="w-64">
          <h1 className="text-lg text-white my-8 font-bold">Watching</h1>
        </div>
        <BoxWatch>Camera 1</BoxWatch>
        {/* <BoxWatch>2. Camera 2</BoxWatch>
        <BoxWatch>3. Camera 3</BoxWatch> */}
      </div>
      <div className="w-[55%] h-full flex justify-left my-4">
        <CameraBox />
      </div>
    </div>
  );
}
