import Image from "next/image";
import NavBar from "./components/NavBar";
import BoxWatch from "./components/BoxWatch";
import CameraBox from "./components/CameraBox";

export default function Home() {
  return (
    <div className="w-screen h-screen aspect-[1920/1080] flex flex-row bg-[#1d1f32] overflow-hidden">
      <NavBar></NavBar>
      <div className="w-[24.219vw] h-full flex flex-col items-center border-r border-white">
        <div className="w-[21.219vw]">
          <h1 className="text-[1.563vw] text-white my-[2vw] font-bold">Watching</h1>
        </div>
        <BoxWatch>1. Ruang Depan</BoxWatch>
        <BoxWatch>2. Ruang Tamu</BoxWatch>
        <BoxWatch>3. Ruang Keluarga</BoxWatch>
      </div>
      <div className="w-[57.5vw] h-full flex justify-center my-[1vw]">
        <CameraBox></CameraBox>
      </div>
    </div>
  );
}
